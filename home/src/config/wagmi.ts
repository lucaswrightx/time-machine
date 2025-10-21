import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const WALLETCONNECT_PROJECT_ID = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = getDefaultConfig({
  appName: 'Time Locked Messages',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [sepolia],
  ssr: false,
});
