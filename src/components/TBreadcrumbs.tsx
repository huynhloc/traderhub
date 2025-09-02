import React from 'react';
import Link from 'next/link';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumbLink: {
      color: theme.palette.text.hint,
    },
  })
);

type Props = {
  links?: { text: string; url: string }[];
  className?: string;
  style?: CSSProperties;
};

const TBreadcrumbs: React.FC<Props> = ({ links, className, style }) => {
  const classes = useStyles();
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      classes={{
        root: className,
      }}
      style={style}
    >
      {links?.map((link) => (
        <Link href={link.url} key={link.text}>
          <a>
            <Typography
              variant="body1"
              classes={{
                root: classes.breadcrumbLink,
              }}
            >
              {link.text}
            </Typography>
          </a>
        </Link>
      ))}
      {/* <Link href="/">
        <a>
          <Typography
            variant="body1"
            classes={{
              root: classes.breadcrumbLink,
            }}
          >
            Diễn đàn
          </Typography>
        </a>
      </Link>
      <Link href="/">
        <a>
          <Typography
            variant="body1"
            classes={{
              root: classes.breadcrumbLink,
            }}
          >
            Phần dành cho Beginner
          </Typography>
        </a>
      </Link>
      <Link href="/">
        <a>
          <Typography
            variant="body1"
            classes={{
              root: classes.breadcrumbLink,
            }}
          >
            Kiến thức căn bản
          </Typography>
        </a>
      </Link> */}
    </Breadcrumbs>
  );
};

export default TBreadcrumbs;
