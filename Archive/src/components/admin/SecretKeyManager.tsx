import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Button } from '../ui/button';
import { Key } from 'lucide-react';
import { SecretKey } from '../../types';

export const SecretKeyManager: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [plan, setPlan] = useState<'basic' | 'better' | 'best'>('basic');
  const [expiryDate, setExpiryDate] = useState('');
  const addSecretKey = useAdminStore((state) => state.addSecretKey);
  const removeSecretKey = useAdminStore((state) => state.removeSecretKey);
  const secretKeys = useAdminStore((state) => state.secretKeys);

  const generateSecretKey = () => {
    if (!projectName || !expiryDate) {
      alert('Please fill in all fields');
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newKey: SecretKey = {
      key,
      projectName,
      plan,
      expiresAt: new Date(expiryDate).toISOString()
    };

    addSecretKey(newKey);
    setProjectName('');
    setExpiryDate('');
  };

  const handleDelete = (key: string) => {
    if (window.confirm('Are you sure you want to revoke this key?')) {
      removeSecretKey(key);
    }
  };

  return (
    <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#D3D3DF] mb-6">Generate New Secret Key</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF] placeholder-[#D3D3DF]/40"
          />
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'basic' | 'better' | 'best')}
            className="px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
          >
            <option value="basic">Basic Plan</option>
            <option value="better">Better Plan</option>
            <option value="best">Best Plan</option>
          </select>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
          />
          <Button
            onClick={generateSecretKey}
            className="flex items-center gap-2 bg-[#C33AFF] text-white hover:bg-[#C33AFF]/90"
          >
            <Key className="w-4 h-4" />
            Generate Key
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-[#D3D3DF] flex items-center gap-2">
          <Key className="w-6 h-6" />
          Active Secret Keys
        </h2>
        
        <div className="space-y-4">
          {secretKeys.map((secretKey) => (
            <div
              key={secretKey.key}
              className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-6 flex items-center justify-between"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#D3D3DF]">
                  {secretKey.projectName}
                </h3>
                <div className="space-y-1">
                  <code className="block bg-[#1B1B21] px-2 py-1 rounded text-sm font-mono text-[#D3D3DF]">
                    {secretKey.key}
                  </code>
                  <p className="text-sm text-[#D3D3DF]/60">
                    Plan: {secretKey.plan.charAt(0).toUpperCase() + secretKey.plan.slice(1)}
                  </p>
                  <p className="text-sm text-[#D3D3DF]/60">
                    Expires: {new Date(secretKey.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleDelete(secretKey.key)}
                variant="destructive"
                className="min-w-[100px]"
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};