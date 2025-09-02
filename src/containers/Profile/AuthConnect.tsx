import React from 'react';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import FacebookIcon from 'assets/icons/facebook-icon.svg';
import GoogleIcon from 'assets/icons/google-icon.svg';
import { CircularProgress } from 'components';

export type Provider = 'facebook' | 'google';

type Props = {
  provider: Provider;
  canNotDisconnect?: boolean;
  disabled?: boolean;
  isConnected?: boolean;
  isProcessing?: boolean;
  connect: () => void;
  disconnect: () => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    label: ({ color }: { color: string }) => ({
      color: `${color} !important`,
    }),
  })
);

const PROVIDER_MAP = {
  facebook: {
    text: 'Đã liên kết Facebook',
    textConnect: 'Liên kết Facebook',
    icon: FacebookIcon,
    color: '#5C79FF',
  },
  google: {
    text: 'Đã liên kết Google',
    textConnect: 'Liên kết Google',
    icon: GoogleIcon,
    color: '#FE4D4D',
  },
};

const AuthConnect: React.FC<Props> = ({
  provider,
  canNotDisconnect,
  disabled,
  isConnected,
  isProcessing,
  connect,
  disconnect,
}) => {
  const providerObj = PROVIDER_MAP[provider];
  const Icon = providerObj.icon;
  const classes = useStyles({ color: providerObj.color });
  return (
    <Button
      onClick={!isConnected ? connect : disconnect}
      disabled={disabled || canNotDisconnect}
      classes={{
        label: classes.label,
      }}
      style={{
        opacity: canNotDisconnect ? 0.5 : 1,
      }}
      size="large"
      variant="text"
      startIcon={
        isProcessing ? (
          <CircularProgress
            style={{ color: providerObj.color, marginRight: 0 }}
          />
        ) : (
          <Icon />
        )
      }
    >
      {isConnected ? providerObj.text : providerObj.textConnect}
    </Button>
  );
};

export default AuthConnect;
