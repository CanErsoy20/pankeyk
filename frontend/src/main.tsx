import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode removed to prevent double-firing in dev mode for clearer demo
  <App />
)