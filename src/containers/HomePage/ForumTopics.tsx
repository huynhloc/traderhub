import React from 'react';
import { TBox } from 'components';
import TopicItem from '../Forum/TopicItem';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

const ForumTopics = () => {
  const categories = useSelector((state) => state.forum.data);
  return (
    <Grid item xs={12} md={12}>
      <TBox>
        {categories.map((category) =>
          category.forumTopics?.map((topic) => (
            <TopicItem key={topic.id} mt={1} mb={0} topic={topic} />
          ))
        )}
      </TBox>
    </Grid>
  );
};

export default ForumTopics;
