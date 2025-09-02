import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { ForumItemSkeleton } from 'components';
import { Comment } from 'interfaces';
import { getTaggedCommentsApi } from 'api/forumApis';
import CommentItem from './CommentItem';

const TaggedActivities: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const loadComments = async (start: number) => {
    try {
      setIsLoading(true);
      const data = await getTaggedCommentsApi(start);
      const response = (data as unknown) as Comment[];
      setHasMore(response.length === 10);
      if (start === 0) {
        setComments(response);
      } else {
        setComments([...comments, ...response]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments(0);
  }, []);

  const loadMoreAnswers = useCallback(() => {
    loadComments(comments.length);
  }, [comments]);

  return (
    <React.Fragment>
      {isLoading && !comments?.length && <ForumItemSkeleton showAvatar />}
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={loadMoreAnswers}
        hasMore={hasMore && !isLoading}
        loader={<ForumItemSkeleton key={0} showAvatar />}
      >
        {comments ? (
          comments
            .filter((comment) => !!comment)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
        ) : (
          <div />
        )}
      </InfiniteScroll>
    </React.Fragment>
  );
};

export default TaggedActivities;
