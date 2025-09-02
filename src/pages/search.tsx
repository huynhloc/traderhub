import React from 'react';
import { NextPageContext } from 'next';
import { values } from 'lodash';
import { Layout } from 'components';
import SearchContainer from 'containers/Search';
import SearchRedux from 'redux/search';
import { APP_VERTICAL } from 'constants/app';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const SearchPage = () => (
  <Layout title="Traderhub | Search">
    <SearchContainer />
  </Layout>
);

SearchPage.getInitialProps = async ({ store, query, res }: NextPageContext) => {
  const { q, vertical } = query;
  const page = parseInt(query?.page as string) || 1;
  if (
    q &&
    (!vertical || values(APP_VERTICAL).indexOf(vertical as string) >= 0)
  ) {
    if (vertical) {
      redirectNotFoundPageIfInValidPage(
        `/search?q=${q}&vertical=${vertical}`,
        query?.page as string,
        res
      );
    }
    store.dispatch(
      SearchRedux.actions.search({
        q: q as string,
        vertical: vertical as string,
        page,
        res,
      })
    );
  }
};

export default SearchPage;
