import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { FlowProvider } from './contexts/FlowContext';
import { UIProvider } from './contexts/UIContext';

// Pages
import Dashboard from './pages/Dashboard';
import FlowBuilder from './pages/FlowBuilder';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UIProvider>
          <FlowProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/flows/new" 
                    element={
                      <PrivateRoute>
                        <FlowBuilder />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/flows/:id" 
                    element={
                      <PrivateRoute>
                        <FlowBuilder />
                      </PrivateRoute>
                    } 
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </FlowProvider>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
