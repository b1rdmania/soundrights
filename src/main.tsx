
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add global animation styles 
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
    50% { transform: translateY(-15px) rotate(5deg); opacity: 0.9; }
    100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
