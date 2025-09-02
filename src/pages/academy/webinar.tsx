import React from 'react';
import moment from 'moment';
import { Layout } from 'components';
import WebinarContainer from 'containers/Academy/Webinar';
import { getWebinars } from 'api/webinarApis';
import { Webinar } from 'interfaces';

const Page = ({ webinars }: { webinars: Webinar[] }) => (
  <Layout title="Traderhub | Lịch Sự Kiện">
    <WebinarContainer webinars={webinars} />
  </Layout>
);

Page.getInitialProps = async () => {
  const currenDateStr = moment().format('YYYY-MM-DD');
  const webinars = await getWebinars(0, 9, currenDateStr);
  return { webinars };
};

export default Page;
