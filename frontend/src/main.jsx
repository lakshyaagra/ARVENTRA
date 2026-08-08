import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux' 
import {store} from './app/store.js'
import AuthInitializer from './features/auth/AuthInitializer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <App />  
      </AuthInitializer>
    </Provider>
  </StrictMode>,
)
