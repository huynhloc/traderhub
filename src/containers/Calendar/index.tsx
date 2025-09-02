import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTheme, Theme } from '@material-ui/core/styles';
import { navigateToCalendar } from 'utils/tracking';

const EconomicCalendarWidget = ({
  theme,
}: {
  theme?: 'light' | 'dark' | undefined;
}) => {
  const muiTheme = useTheme<Theme>();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('xs'));
  const ref = useRef<HTMLDivElement>(null);
  // load ticker tape script
  useEffect(() => {
    const height = window.innerHeight - (isMobile ? 96 : 110);
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme || 'light',
      isTransparent: false,
      width: '100%',
      height,
      locale: 'vi_VN',
      importanceFilter: '-1,0,1',
    });
    ref.current?.appendChild(script);
  }, []);
  useEffect(() => {
    navigateToCalendar();
  }, []);
  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={ref} />
    </div>
  );
};
export default EconomicCalendarWidget;
