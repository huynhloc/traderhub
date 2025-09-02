import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { InputBase, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { search } from 'utils/tracking';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      height: '100%',
      backgroundColor: theme.palette.common.white,
      flex: 1,
      display: 'flex',
      alignItems: 'center',
    },
    searchMobile: {
      position: 'relative',
      height: '64px',
      width: '40px',
      backgroundColor: theme.palette.common.white,
      transition: theme.transitions.create('all'),
      display: 'flex',
      alignItems: 'center',
      '& .searchBtn': {
        display: 'none',
      },
      '&:hover': {
        position: 'fixed',
        top: 0,
        left: theme.spacing(0.625),
        right: theme.spacing(0.625),
        height: '64px',
        width: 'auto',
        zIndex: 10,
        '& .searchBtn': {
          display: 'block',
        },
      },
    },
    searchWrapper: {
      position: 'relative',
      width: '100%',
      height: '40px',
      display: 'flex',
      backgroundColor: theme.palette.background.default,
      borderRadius: '20px',
    },
    searchIcon: {
      padding: theme.spacing(0, 1),
      height: '100%',
      width: '40px',
      borderRadius: '50%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      height: '40px',
      flex: 1,
    },
    inputInput: {
      paddingRight: theme.spacing(1),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(1.2)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      color: theme.palette.text.primary,
    },
    searchBtn: {
      borderRadius: 0,
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px',
      transition: theme.transitions.create('width'),
    },
  })
);

const SearchBar = () => {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      search({ q: searchQuery });
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className={isMobile ? classes.searchMobile : classes.search}>
      <form
        noValidate
        className={classes.searchWrapper}
        onSubmit={handleSearch}
      >
        <div className={classes.searchIcon}>
          <SearchIcon color="action" />
        </div>
        <InputBase
          color="primary"
          placeholder="Tìm kiếm chủ đề, bài viết, danh mục"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className="searchBtn"
          classes={{ root: classes.searchBtn }}
          type="submit"
        >
          Tìm
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
