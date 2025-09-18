import React from 'react';

type Props = {
  content: string;
};

const MyComp = (props: Props) => {
  const { content } = props;
  return <div>{content}</div>;
};

export default MyComp;
