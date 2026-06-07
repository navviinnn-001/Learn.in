// main.jsx — React App Entry Point
// This is the first JavaScript file that runs.
// It mounts the entire React app into the <div id="root"> in index.html.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
