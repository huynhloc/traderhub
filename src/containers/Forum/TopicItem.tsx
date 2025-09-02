import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Box, Typography, Divider } from '@material-ui/core';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { BoxProps } from '@material-ui/core/Box';
import { ForumTopic } from 'interfaces';
import { formatNumber } from 'utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      width: '100%',
    },
    title: {
      fontWeight: 600,
      marginBottom: theme.spacing(0.5),
      flex: 1,
    },
    divider: {
      marginTop: '4px',
    },
    numPostIcon: {
      width: '18px',
      height: '18px',
      marginRight: '2px',
    },
  })
);

const TopicItem: React.FC<BoxProps & { topic: ForumTopic }> = React.memo(
  ({ topic, ...props }) => {
    const theme = useTheme<Theme>();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const isSM = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    const latestQuestion = topic.forumQuestions?.length
      ? topic.forumQuestions[0]
      : null;
    return (
      <Box
        display="flex"
        position="relative"
        p={isMobile ? 1 : 1.5}
        mb={1}
        borderRadius={16}
        bgcolor="rgba(76, 161, 175, 0.05)"
        {...props}
      >
        <Link href={`/forum/topic/${topic.slug}`}>
          <a className={classes.link}>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={12} md={6}>
                <Box flex="1" display="flex">
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    classes={{ root: classes.title }}
                    className={isSM ? 'truncate truncate--2' : 'truncate'}
                  >
                    {topic.name}
                  </Typography>
                  {isSM && (
                    <Box
                      display="flex"
                      color="text.primary"
                      alignItems="center"
                      fontSize="caption.fontSize"
                      fontWeight="fontWeightMedium"
                    >
                      <DescriptionRoundedIcon className={classes.numPostIcon} />
                      {formatNumber(topic.totalQuestion)}
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  className={isSM ? 'truncate truncate--2' : 'truncate'}
                  color="textPrimary"
                >
                  {topic.description}
                </Typography>
              </Grid>
              {isSM && (
                <Grid item sm={12} md={2}>
                  <Divider className={classes.divider} />
                </Grid>
              )}
              {!isSM && (
                <Grid item sm={12} md={2}>
                  <Box width={1} display="flex">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        style={{
                          marginBottom: '12px',
                        }}
                        classes={{ root: classes.title }}
                      >
                        {formatNumber(topic.totalQuestion)}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        BÀI VIẾT
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      ml={1}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        style={{
                          marginBottom: '12px',
                        }}
                        classes={{ root: classes.title }}
                      >
                        {formatNumber(topic.totalAnswer + topic.totalComment)}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        BÌNH LUẬN
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {!!latestQuestion && (
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    classes={{ root: classes.title }}
                    className="truncate"
                  >
                    {latestQuestion?.title}
                  </Typography>
                  <Box
                    fontWeight="fontWeightMedium"
                    color="text.secondary"
                    fontSize="caption.fontSize"
                  >
                    {`${latestQuestion?.author.fullName} `}
                    <Typography variant="caption" component="span">
                      {moment(latestQuestion?.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </a>
        </Link>
      </Box>
    );
  }
);

export default TopicItem;
