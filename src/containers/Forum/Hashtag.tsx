import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Paper } from '@material-ui/core';
import { useTheme, Theme } from '@material-ui/core/styles';
import { SEOTags, TBreadcrumbs, PaginationNextLink } from 'components';
import { ForumHashtag, ForumQuestion } from 'interfaces';
import { PAGE_SIZE } from 'constants/app';
import QuestionItem from './QuestionItem';

type Props = {
  questions: ForumQuestion[];
  totalQuestion: number;
  hashtag: ForumHashtag;
};

const Hashtag: React.FC<Props> = ({ questions, totalQuestion, hashtag }) => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const page = parseInt(router.query?.page as string) || 1;

  const breadcrumbs = useMemo(
    () =>
      hashtag
        ? [
            { text: 'Diễn đàn', url: '/forum' },
            { text: hashtag?.name, url: `/forum/hashtag/${hashtag?.slug}` },
          ]
        : [],
    [hashtag]
  );

  const pageTitle =
    page === 1
      ? `${hashtag?.seoTitle || hashtag?.name} | TraderHub`
      : `${hashtag?.seoTitle || hashtag?.name} | Page ${page} | TraderHub`;

  return (
    <Paper elevation={0} style={{ paddingBottom: 24 }}>
      {hashtag && (
        <SEOTags
          seoTitle={pageTitle}
          seoDescription={hashtag.seoDescription}
          seoImg={hashtag.seoImg}
        />
      )}
      <TBreadcrumbs
        style={{ marginBottom: theme.spacing(2) }}
        links={breadcrumbs}
      />
      {questions?.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
      <Pagination
        variant="outlined"
        shape="rounded"
        color="primary"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: 16,
        }}
        page={page}
        count={Math.ceil((totalQuestion || 0) / PAGE_SIZE)}
        renderItem={(item) => (
          <PaginationItem
            component={PaginationNextLink}
            rel={item.page === page ? '' : item.page > page ? 'next' : 'prev'}
            href={`/forum/hashtag/${hashtag?.slug}${
              item.page === 1 ? '' : `?page=${item.page}`
            }`}
            {...item}
          />
        )}
      />
    </Paper>
  );
};

export default Hashtag;
