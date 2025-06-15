import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './authContext.jsx'
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom'

// Use basename only for GitHub Pages deployment
const basename = import.meta.env.PROD && window.location.hostname.includes('github.io') ? '/Vandal' : '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router basename={basename}>
      <ProjectRoutes />
    </Router>
  </AuthProvider>
);
