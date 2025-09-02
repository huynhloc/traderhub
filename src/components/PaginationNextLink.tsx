/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import Link from 'next/link';
import { PaginationItemProps } from '@material-ui/lab';

const PaginationNextLink = ({
  children,
  href,
  rel,
  ...props
}: {
  href: string;
  rel?: string;
} & PaginationItemProps) => (
  <Link href={href}>
    <a {...(rel && { rel })} {...props}>
      {children}
    </a>
  </Link>
);

export default PaginationNextLink;
