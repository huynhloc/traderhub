import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  useMediaQuery,
  FormControl,
  FormHelperText,
  CircularProgress,
  Fab,
} from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CKEditor5 from 'components/CKEditor5';
import 'react-markdown-editor-lite/lib/index.css';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {
  ForumCategory,
  ForumTopic,
  ForumQuestion,
  ServerError,
  ForumHashtag,
} from 'interfaces';
import { CollapseAlert } from 'components';
import ForumRedux from 'redux/forum';
import { ROUTES } from 'constants/routes';
import { getServerErrorMessage } from 'utils';
import {
  createForumQuestion,
  createForumQuestionSuccess,
} from 'utils/tracking';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      zIndex: '1000 !important',
    },
    root: {
      backgroundColor: theme.palette.common.white,
    },
    editor: {
      fontSize: `${theme.typography.fontSize} !important`,
      fontFamily: theme.typography.fontFamily,
    },
    editorPreview: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      '& *': {
        maxWidth: '100%',
      },
      '& ul': {
        whiteSpace: 'normal',
        padding: 0,
        listStylePosition: 'inside',
      },
    },
    circularProgress: {
      color: theme.palette.common.white,
      marginRight: theme.spacing(1),
    },
    fabBtn: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
    },
  })
);
type HandleOpenFn = () => void;

type Props = {
  forumQuestion?: ForumQuestion;
  forumCategory?: ForumCategory;
  forumTopic?: ForumTopic;
  renderActionButton?: (handleOpen: HandleOpenFn) => React.ReactNode;
};

type FormInputs = {
  title: string;
  category: ForumCategory | null;
  topic: ForumTopic | null;
  hashtags: ForumHashtag[] | null;
  content: string;
};

const QuestionFormModal: React.FC<Props> = ({
  renderActionButton,
  forumQuestion,
  forumCategory,
  forumTopic,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme<Theme>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const currentUser = useSelector((state) => state.user.currentUser);
  const categories = useSelector((state) => state.forum.allCategories);
  const hashtags = useSelector((state) => state.forum.allHashtags);
  const isProcessing = useSelector((state) => state.forum.isProcessing);
  const serverError = useSelector(
    (state) => state.forum.error as ServerError[]
  );
  const serverErrorMessage = getServerErrorMessage(serverError);
  const isUpdate = Boolean(forumQuestion);
  const [isOpen, setIsOpen] = useState(false);
  const openEmptyModal = () => handleOpen();
  const {
    register,
    handleSubmit,
    errors,
    control,
    watch,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      title: '',
      category: null,
      topic: null,
      content: '',
      hashtags: [],
    },
  });

  let timer = 0;

  useEffect(() => {
    if (isOpen && categories && hashtags) {
      if (forumQuestion) {
        const initCategory = categories.find(
          ({ id }) => forumQuestion.forumTopic.forumCategory.id === id
        );
        const initTopic = initCategory?.forumTopics?.find(
          ({ id }) => forumQuestion.forumTopic.id === id
        );

        const hashtagsId =
          forumQuestion?.forumHashtags?.map(({ id }) => id) || [];
        const initHashtags = hashtags?.filter(
          ({ id }) => hashtagsId?.indexOf(id) >= 0
        );
        console.log(initHashtags);
        timer = setTimeout(() => {
          setValue('title', forumQuestion.title);
          setValue('category', initCategory);
          setValue('topic', initTopic);
          setValue('content', forumQuestion.content);
          setValue('hashtags', initHashtags);
        });
      } else if (forumTopic) {
        const initCategory = categories.find(
          ({ id }) => forumTopic.forumCategory.id === id
        );
        const initTopic = initCategory?.forumTopics?.find(
          ({ id }) => forumTopic.id === id
        );
        timer = setTimeout(() => {
          setValue('category', initCategory);
          setValue('topic', initTopic);
        });
      } else if (forumCategory) {
        const initCategory = categories.find(
          ({ id }) => forumCategory.id === id
        );
        timer = setTimeout(() => {
          setValue('category', initCategory);
        });
      }
    }
  }, [forumQuestion, forumCategory, forumTopic, categories, isOpen, hashtags]);

  const handleClose = () => {
    timer && clearTimeout(timer);
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (!currentUser) {
      router.push(ROUTES.LOGIN);
    } else {
      dispatch(ForumRedux.actions.resetError());
      setIsOpen(true);
      if (!forumQuestion) {
        // case create question
        createForumQuestion(currentUser.email);
      }
    }
  };

  const onSubmit = (data: FormInputs) => {
    const forumData = {
      title: data.title,
      content: data.content,
      forumHashtags: data.hashtags
        ? data.hashtags?.map((hashtag) => hashtag.id)
        : [],
      forumTopic: data.topic?.id as string,
    };
    if (isUpdate) {
      dispatch(
        ForumRedux.actions.updateForumQuestion({
          id: forumQuestion?.id,
          ...forumData,
          callback: (error, updatedQuestion) => {
            if (!error && updatedQuestion) {
              window?.history?.replaceState(
                window?.history?.state,
                '',
                `/forum/thread/${(updatedQuestion as ForumQuestion)?.slug}`
              );
              handleClose();
            }
          },
        })
      );
    } else {
      dispatch(
        ForumRedux.actions.createForumQuestion({
          ...forumData,
          callback: (error, createdQuestion) => {
            if (!error && createdQuestion) {
              createForumQuestionSuccess(currentUser?.email as string);
              router.push(
                `/forum/thread/${(createdQuestion as ForumQuestion).slug}`
              );
            }
          },
        })
      );
    }
  };

  const topics = watch('category')?.forumTopics || [];

  useEffect(() => {
    !categories?.length && dispatch(ForumRedux.actions.getForumCategories());
    !hashtags?.length && dispatch(ForumRedux.actions.getForumHashtags());
  }, []);

  useEffect(() => {
    setValue('topic', null);
  }, [topics]);

  const ActionIcon = isUpdate ? EditIcon : AddIcon;

  return (
    <div>
      {!!renderActionButton && renderActionButton(handleOpen)}
      {!renderActionButton && fullScreen && (
        <Fab
          color="primary"
          aria-label="new post"
          onClick={openEmptyModal}
          className={classes.fabBtn}
        >
          <EditIcon />
        </Fab>
      )}
      {!renderActionButton && !fullScreen && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openEmptyModal}
        >
          Bài mới
        </Button>
      )}
      <Dialog
        disableEnforceFocus
        classes={{ root: classes.dialog }}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        open={isOpen}
        PaperProps={{
          classes: { root: classes.root },
        }}
        onClose={handleClose}
      >
        <DialogTitle>Bài viết mới</DialogTitle>
        <DialogContent>
          <CollapseAlert
            severity="error"
            onClose={() => dispatch(ForumRedux.actions.resetError())}
            message={serverErrorMessage}
          />
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="title"
                  label="Tên bài viết"
                  variant="outlined"
                  margin="none"
                  inputRef={register({
                    required: 'Hãy nhập nội dung',
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  as={
                    <ControlledAutocomplete
                      options={categories || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label="Danh mục"
                          variant="outlined"
                          margin="none"
                          error={!!errors.category}
                          helperText={errors.category?.message}
                        />
                      )}
                    />
                  }
                  rules={{
                    required: 'Hãy nhập nội dung',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="topic"
                  control={control}
                  as={
                    <ControlledAutocomplete
                      options={topics}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          name="topic"
                          label="Chủ đề"
                          variant="outlined"
                          margin="none"
                          error={!!errors.topic}
                          helperText={errors.topic?.message}
                        />
                      )}
                    />
                  }
                  rules={{
                    required: 'Hãy nhập nội dung',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  error={!!errors.content}
                  style={{ width: '100%' }}
                >
                  <Controller
                    as={CKEditor5}
                    name="content"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (!value) {
                          return 'Hãy nhập nội dung';
                        } else if (value.length < 50) {
                          return 'Ít nhất 50 ký tự';
                        }
                        return undefined;
                      },
                    }}
                  />
                  <FormHelperText error={!!errors.content}>
                    {(errors.content as { message: string })?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="hashtags"
                  control={control}
                  as={
                    <ControlledAutocomplete
                      multiple
                      options={hashtags || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          name="hashtags"
                          label="Hash tags"
                          variant="outlined"
                          margin="none"
                          error={!!errors.topic}
                          helperText={errors.topic?.message}
                        />
                      )}
                    />
                  }
                  // rules={{
                  //   required: 'Hãy nhập nội dung',
                  // }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isProcessing}
            startIcon={
              !isProcessing ? (
                <ActionIcon />
              ) : (
                <CircularProgress
                  size={20}
                  classes={{
                    root: classes.circularProgress,
                  }}
                />
              )
            }
            onClick={handleSubmit(onSubmit)}
          >
            {isUpdate ? 'Cập nhật' : 'Tạo bài'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
interface ControlledAutocompleteProps<T> {
  value?: T | T[];
  onChange?: (e: T | T[] | null) => void;
  options: T[];
  multiple?: boolean;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
}

const ControlledAutocomplete: React.FC<
  ControlledAutocompleteProps<ForumCategory | ForumTopic | ForumHashtag>
> = React.forwardRef(
  ({ value, onChange, multiple = false, options, renderInput }, _) => {
    return (
      <Autocomplete
        multiple={multiple}
        fullWidth
        value={value}
        options={options}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getOptionLabel={(option) => option.name}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={(_, newValue) => onChange && onChange(newValue)}
        renderInput={renderInput}
      />
    );
  }
);

export default QuestionFormModal;
