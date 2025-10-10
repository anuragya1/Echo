import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'react-lazy-load-image-component/src/effects/blur.css';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);