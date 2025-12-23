import { LiFiWidget, WidgetConfig } from '@lifi/widget';

const widgetConfig: WidgetConfig = {
  integrator: 'afriRamp',
  fee: 0.002,
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
};

export default function SwapTokens() {
  return (
    <div className="flex flex-col items-center">
      <LiFiWidget integrator="afriRamp" config={widgetConfig} />
    </div>
  );
}