import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(1),
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  })
);

type Props = AlertProps & {
  className?: string;
  message?: string;
  onClose: () => void;
};

const CollapseAlert: React.FC<Props> = ({
  message,
  onClose,
  className,
  ...props
}) => {
  const classes = useStyles();
  const rootClasses = !className
    ? classes.root
    : `${classes.root} ${className}`;
  return (
    <div className={rootClasses}>
      <Collapse in={!!message}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          {...props}
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  );
};

export default CollapseAlert;
