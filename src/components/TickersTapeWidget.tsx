import React, { useEffect, useRef } from 'react';
const TickersTapeWidget = () => {
  const ref = useRef<any>();
  // load ticker tape script
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: 'FOREXCOM:SPXUSD',
          title: 'S&P 500',
        },
        {
          proName: 'FOREXCOM:NSXUSD',
          title: 'Nasdaq 100',
        },
        {
          proName: 'FX_IDC:EURUSD',
          title: 'EUR/USD',
        },
        {
          proName: 'BITSTAMP:BTCUSD',
          title: 'BTC/USD',
        },
        {
          proName: 'BITSTAMP:ETHUSD',
          title: 'ETH/USD',
        },
      ],
      showSymbolLogo: true,
      colorTheme: 'light',
      // isTransparent: true,
      displayMode: 'regular',
      locale: 'vi_VN',
    });
    ref.current.appendChild(script);
  }, []);
  return (
    <div
      className="tradingview-widget-container"
      style={{ width: '100%', height: '100%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ width: '100%', height: '100%' }}
        ref={ref}
      />
    </div>
  );
};
export default TickersTapeWidget;
