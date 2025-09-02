import React from 'react';
import { capitalize } from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Avatar } from '@material-ui/core';
import { User } from 'interfaces';
import { formatNumber, getMemberLabel } from 'utils';
import { TBox } from 'components';
import GodlikeTraderIcon from 'assets/icons/godlike-trader-icon.svg';
import ProfessionalTraderIcon from 'assets/icons/professional-trader-icon.svg';
import ExperiencedTraderIcon from 'assets/icons/experienced-trader-icon.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 46,
      height: 46,
    },
    fallbackIcon: {
      color: theme.palette.common.white,
    },
  })
);

const MEMBER_LABEL_ICONS = {
  master: GodlikeTraderIcon,
  professional: ProfessionalTraderIcon,
  experienced: ExperiencedTraderIcon,
  beginner: '',
};

const ActiveMemberItem: React.FC<{ user: User }> = React.memo(({ user }) => {
  const classes = useStyles();
  const label = getMemberLabel(user.point);
  const Icon = MEMBER_LABEL_ICONS[label];
  const labelIcon = Icon ? <Icon width="100%" /> : capitalize(label);
  return (
    <TBox mb={1} p={1} width={1} display="flex">
      <Box
        width={45}
        height={45}
        mr={1}
        borderRadius="50%"
        bgcolor="background.default"
      >
        <Avatar
          classes={{
            root: classes.avatar,
            fallback: classes.fallbackIcon,
          }}
          src={user.avatar?.url}
          alt={user.fullName}
        />
      </Box>
      <Box flex={1}>
        <Box width={1} color="primary.dark">
          {labelIcon}
        </Box>
        <Box
          width={1}
          fontWeight="fontWeightBold"
          color="text.secondary"
          fontSize="body2.fontSize"
          py={0.5}
        >
          {user.fullName}
        </Box>
        <Box
          width={1}
          fontWeight="fontWeightBold"
          color="text.disabled"
          fontSize="body.fontSize"
        >
          {`+${formatNumber(user.point)}`}
        </Box>
      </Box>
    </TBox>
  );
});

export default ActiveMemberItem;
