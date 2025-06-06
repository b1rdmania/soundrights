import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
  <App />
);
