import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border p-8 w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        
        {error && <div className="border border-red-500 text-red-500 p-2 mb-4">{error}</div>}
        
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 bg-gray-100 text-black placeholder-gray-500" 
            placeholder="Email" 
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 bg-gray-100 text-black placeholder-gray-500" 
            placeholder="Password" 
            required
          />
          <button type="submit" className="border p-2 font-bold hover:bg-gray-100">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/register" className="underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
