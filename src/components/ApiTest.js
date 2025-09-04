import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://library-backend-l70h.onrender.com';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test health endpoint
      const healthResponse = await axios.get(`${API_BASE}/api/health`);
      setTestResult(`✅ Health check: ${healthResponse.data.message}`);
      
      // Test registration endpoint
      const testEmail = `test${Date.now()}@example.com`;
      const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, {
        name: 'Test User',
        email: testEmail,
        password: '123456'
      });
      
      setTestResult(prev => prev + `\n✅ Registration test: ${registerResponse.data.message || 'registered'}`);
      
      // Test login endpoint
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
        email: testEmail,
        password: '123456'
      });
      
      setTestResult(prev => prev + `\n✅ Login test: ${loginResponse.data.message || 'logged in'}`);
      
    } catch (error) {
      console.error('API Test Error:', error);
      const errMsg = error?.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
      setTestResult(`❌ Error: ${error.message}\nResponse: ${errMsg}`);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <button onClick={testBackendConnection} disabled={loading}>
        {loading ? 'Running tests...' : 'Run API Test'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{testResult}</pre>
    </div>
  );
};

export default ApiTest;
