import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { Button } from '../ui/button';
import { Settings } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const credentials = useAdminStore((state) => state.credentials);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials) {
      setError('Admin account not set up');
      return;
    }

    if (username !== credentials.username || password !== credentials.password) {
      setError('Invalid credentials');
      return;
    }

    const token = btoa(JSON.stringify({
      id: '1',
      type: 'admin',
      name: 'Admin'
    }));
    
    login(token, null);
    navigate('/admin_d01z');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#D3D3DF] flex items-center justify-center gap-2">
            <Settings className="w-8 h-8 text-[#C33AFF]" />
            Admin Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-[#C33AFF] text-white hover:bg-[#C33AFF]/90"
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};