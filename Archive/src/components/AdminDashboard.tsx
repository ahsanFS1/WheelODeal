import React from 'react';
import { useConfigStore } from '../store/configStore';
import { Prize } from '../types';
import { Settings, Image, Type, Palette } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { config, setConfig, updatePrize } = useConfigStore();

  const handlePrizeUpdate = (id: string, field: keyof Prize, value: string | number) => {
    updatePrize(id, { [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            General Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Logo URL
                </div>
              </label>
              <input
                type="text"
                value={config.logo}
                onChange={(e) => setConfig({ logo: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Page Title
                </div>
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Subtitle
                </div>
              </label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => setConfig({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Background Color
                </div>
              </label>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => setConfig({ backgroundColor: e.target.value })}
                className="w-full h-10 px-1 py-1 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Prize Settings</h2>
          
          <div className="space-y-4">
            {config.prizes.map((prize) => (
              <div key={prize.id} className="border p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prize Text
                    </label>
                    <input
                      type="text"
                      value={prize.text}
                      onChange={(e) => handlePrizeUpdate(prize.id, 'text', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={prize.color}
                      onChange={(e) => handlePrizeUpdate(prize.id, 'color', e.target.value)}
                      className="w-full h-10 px-1 py-1 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability (0-1)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={prize.probability}
                      onChange={(e) => handlePrizeUpdate(prize.id, 'probability', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Redirect URL
                    </label>
                    <input
                      type="text"
                      value={prize.redirectUrl}
                      onChange={(e) => handlePrizeUpdate(prize.id, 'redirectUrl', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};