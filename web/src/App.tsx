import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tenants from './components/Tenants';
import Contracts from './components/Contracts';
import Addresses from './components/Addresses';
import References from './components/References';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/references" element={<References />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
