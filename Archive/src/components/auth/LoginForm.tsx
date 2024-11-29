import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { Button } from '../ui/button';
import { Key } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';

export const LoginForm: React.FC = () => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const secretKeys = useAdminStore((state) => state.secretKeys);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const hashedKey = CryptoJS.SHA256(secretKey).toString();
    const validKey = secretKeys.find(k => CryptoJS.SHA256(k.key).toString() === hashedKey);

    if (!validKey) {
      setError('Wrong Secret Key');
      return;
    }

    // Check if key has expired
    if (new Date(validKey.expiresAt) < new Date()) {
      setError('This Secret Key has expired');
      return;
    }

    const token = btoa(JSON.stringify({
      id: CryptoJS.SHA256(Date.now().toString()).toString().substring(0, 8),
      type: 'user',
      name: 'User',
      plan: validKey.plan,
      projectName: validKey.projectName
    }));

    login(token, secretKey);
    toast.success('Login successful!');
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#D3D3DF] flex items-center justify-center gap-2">
            <Key className="w-8 h-8 text-[#C33AFF]" />
            User Access
          </h2>
          <p className="mt-2 text-center text-sm text-[#D3D3DF]/60">
            Enter your secret key to access the dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="secretKey" className="sr-only">Secret Key</label>
            <input
              id="secretKey"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
              placeholder="Enter your secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-[#C33AFF] text-[#D3D3DF] bg-[#1B1B21] hover:bg-[#C33AFF] hover:text-white transition-all duration-200 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C33AFF]"
            >
              Access Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};