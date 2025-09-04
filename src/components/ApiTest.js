import React, { useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test health endpoint
      const healthResponse = await axios.get('/api/health');
      setTestResult(`✅ Health check: ${healthResponse.data.message}`);
      
      // Test registration endpoint
      const testEmail = `test${Date.now()}@example.com`;
      const registerResponse = await axios.post('/api/auth/register', {
        name: 'Test User',
        email: testEmail,
        password: '123456'
      });
      
      setTestResult(prev => prev + `\n✅ Registration test: ${registerResponse.data.message}`);
      
      // Test login endpoint
      const loginResponse = await axios.post('/api/auth/login', {
        email: testEmail,
        password: '123456'
      });
      
      setTestResult(prev => prev + `\n✅ Login test: ${loginResponse.data.message}`);
      
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult(`❌ Error: ${error.message}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    
    setLoading(false);
  };

  
};

export default ApiTest;
