import React from 'react';
import { Layout } from 'components';
import CalendarContainer from 'containers/Calendar';

const IndexPage = () => (
  <Layout title="Traderhub | Lịch kinh tế" contentStyles={{ paddingBottom: 0 }}>
    <CalendarContainer />
  </Layout>
);

export default IndexPage;
