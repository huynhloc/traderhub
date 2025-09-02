import React from 'react';
import Image from 'next/image';
import { Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type StyleProps = {
  isMobile: boolean;
};

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    boxAdvertisement: {
      marginBottom: theme.spacing(1.5),
      marginTop: theme.spacing(2.5),
    },
  })
);

type Props = {
  href: string;
  imageUrl: string;
  isMobile: boolean;
  altImage: string;
};
const BannerAdvertisement: React.FC<Props> = ({
  href,
  imageUrl,
  isMobile,
  altImage,
}) => {
  const classes = useStyles({ isMobile });
  return (
    <Box className={classes.boxAdvertisement}>
      <a
        href={href}
        target="_blank"
        rel="nofollow external noopener noreferrer"
      >
        <Image
          quality={100}
          layout="responsive"
          width={549}
          height={isMobile ? 250 : 50}
          src={imageUrl}
          alt={altImage}
        />
      </a>
    </Box>
  );
};

export default BannerAdvertisement;
