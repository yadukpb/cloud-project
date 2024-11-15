import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
)