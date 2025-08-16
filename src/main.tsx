import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AlertProvider } from './components/AlertContext.tsx';
import { store } from './store/store.ts';
import { Provider } from 'react-redux'
 

defineCustomElements(window);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
      <Provider store={store}> 
        <AlertProvider> 
          <App />
        </AlertProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
