import React, { useState } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme, useTheme } from '@material-ui/core/styles';
import { TBox } from 'components';
import 'react-toastify/dist/ReactToastify.css';
import PostActivities from './PostActivities';
import AnswerActivities from './AnswerActivities';
import TaggedActivities from './TaggedActivities';

type Option = {
  value: string;
  label: string;
};

const ACTIVITY_TYPE = {
  TAGGED: 'tagged',
  COMMENT: 'comment',
  POST: 'post',
};

const options: Option[] = [
  {
    value: ACTIVITY_TYPE.TAGGED,
    label: 'Nhắc đến bạn',
  },
  { value: ACTIVITY_TYPE.COMMENT, label: 'Bình luận của bạn' },
  { value: ACTIVITY_TYPE.POST, label: 'Bài viết của bạn' },
];

const Activities: React.FC = () => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [activityType, setActivityType] = useState<Option>(options[0]);

  return (
    <React.Fragment>
      <TBox
        mb={isMobile ? 0.5 : 1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant="subtitle1"
          style={{ display: isMobile ? 'none' : 'inline' }}
        >
          Lịch sử hoạt động
        </Typography>
        <Autocomplete
          fullWidth={isMobile}
          disableClearable
          value={activityType}
          onChange={(_, newValue: Option | null) => {
            setActivityType(newValue as Option);
          }}
          getOptionLabel={(option) => option.label}
          options={options}
          style={{ width: isMobile ? '100%' : '250px' }}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField {...params} label="Loại hoạt động" variant="outlined" />
          )}
        />
      </TBox>
      {activityType?.value === ACTIVITY_TYPE.POST && <PostActivities />}
      {activityType?.value === ACTIVITY_TYPE.COMMENT && <AnswerActivities />}
      {activityType?.value === ACTIVITY_TYPE.TAGGED && <TaggedActivities />}
    </React.Fragment>
  );
};

export default Activities;
