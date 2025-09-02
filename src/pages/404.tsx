import React from 'react';
import Error from 'next/error';

const Custom404 = () => <Error statusCode={404} title="Page không tồn tại" />;

export default Custom404;
