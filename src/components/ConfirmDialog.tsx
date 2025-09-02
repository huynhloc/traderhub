import React, { useState, useImperativeHandle } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from 'components';

export type PayloadData = {
  title?: string;
  content?: string;
  action: () => void;
};

export type Handle = {
  confirm: (data: PayloadData) => void;
  handleClose: () => void;
};

type Props = {
  isProcessing: boolean;
};

const ConfirmDialog = React.forwardRef(({ isProcessing }: Props, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PayloadData | null>(null);

  const confirm = (data: PayloadData) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    confirm,
    handleClose,
  }));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {!!data?.title && (
        <DialogTitle id="alert-dialog-title">{data?.title}</DialogTitle>
      )}
      {!!data?.content && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {data?.content}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Huỷ
        </Button>
        <Button
          onClick={data?.action}
          color="primary"
          disableElevation
          disabled={isProcessing}
          variant="contained"
          autoFocus
        >
          {isProcessing && <CircularProgress />}
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ConfirmDialog;
