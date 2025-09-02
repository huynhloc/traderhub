import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import ActiveMemberItem from './ActiveMemberItem';
import { ForumItemSkeleton } from 'components';

const useStyles = makeStyles(() =>
  createStyles({
    showMoreBtn: {
      borderRadius: 18,
    },
  })
);

const ActiveMembers: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const members = useSelector((state) =>
    state.activeMember.data?.users?.slice(0, 5)
  );

  return (
    <Box pb={2} display="flex" flexDirection="column" alignItems="center">
      <Box mb={1.5} width={1}>
        <Typography variant="h5" color="textSecondary" component="h1">
          Member tích cực nhất
        </Typography>
      </Box>
      {members &&
        members.map((member) => (
          <ActiveMemberItem key={`activeMember_${member.id}`} user={member} />
        ))}
      {!members && <ForumItemSkeleton showAvatar />}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        classes={{
          root: classes.showMoreBtn,
        }}
        onClick={async () => router.push('/active-members')}
      >
        Xem tất cả
      </Button>
    </Box>
  );
};

export default ActiveMembers;
