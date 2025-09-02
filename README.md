# TraderHub

## Techstack: ReactJS, NextJS, TypeScript, MUI, Redux (redux/toolkit, redux-saga).

### Development

- `yarn`
- `yarn dev`

**only use withAuth for page which need to check authentication**

**Using getInitialProps in \_app.tsx allows you use redux store in page's getInitialProps and obviously the main drawback is opting out of static optimization, (we do not use getServerSideProps that triggers ssr for every request regardless client navigation by next/link or next/router)**
