import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TomoContextProvider } from '@tomo-inc/tomo-web-sdk';
import '@tomo-inc/tomo-web-sdk/style.css';

// Add global styles for static musical notes
const style = document.createElement('style');
style.textContent = `
  .music-note {
    opacity: 0.2;
    font-size: 36px;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <TomoContextProvider
    clientId="UK3t1GAWruVbbEqFsNahhdMmMBzE0K75Z3pn1kpNONLROSjTvRMTSu5pK7452brIxhUnM624ugcQUI5n0t4eaCSq"
    chainTypes={['evm']}
    evmDefaultChainId={1}
    theme="light"
    sdkMode="dev"
  >
    <App />
  </TomoContextProvider>
);
