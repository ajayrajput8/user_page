import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import Home from './components/Landing';

createRoot(document.getElementById('root')!).render(
  <div>
        <App/>
  </div>
 
);
 {/*<StrictMode>
    <App/>
  </StrictMode>*/}