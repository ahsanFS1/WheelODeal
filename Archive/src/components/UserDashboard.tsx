import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { useConfigStore } from '../store/configStore';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Settings, Eye, LogOut, Save, Calendar } from 'lucide-react';
import { SpinningWheel } from './SpinningWheel';
import { TextInput } from './admin/shared/TextInput';
import { ImageUpload } from './admin/shared/ImageUpload';
import { Carousel } from './carousel/Carousel';
import { Toaster, toast } from 'sonner';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { config, setConfig, updatePrize, saveConfig } = useConfigStore();
  const { user, logout } = useAuthStore();
  const [showPreview, setShowPreview] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  const handleSave = () => {
    saveConfig();
    toast.success('Changes saved successfully!');
  };

  const handleImageUpload = (type: 'logo' | 'background', url: string) => {
    if (type === 'logo') {
      setConfig({ logo: url });
    } else {
      setConfig({ backgroundImage: url });
    }
  };

  const handleBonusCodeUpdate = (prizeId: string, code: string, expiresAt: Date) => {
    updatePrize(prizeId, {
      bonusCode: {
        code,
        expiresAt: expiresAt.toISOString()
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#121218]">
      <Toaster position="top-center" />
      
      <header className="bg-[#1B1B21] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#D3D3DF] flex items-center gap-2">
            <Settings className="w-8 h-8 text-[#C33AFF]" />
            Project Configuration
          </h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#1B1B21] text-[#C33AFF] border border-[#C33AFF] hover:bg-[#C33AFF] hover:text-white transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs.Root defaultValue="general" className="space-y-8">
          <Tabs.List className="flex space-x-4 border-b border-[#C33AFF]/20">
            <Tabs.Trigger
              value="general"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              General Settings
            </Tabs.Trigger>
            <Tabs.Trigger
              value="carousel"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Carousel
            </Tabs.Trigger>
            <Tabs.Trigger
              value="wheel"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Wheel Settings
            </Tabs.Trigger>
            <Tabs.Trigger
              value="preview"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Preview
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="general" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">Page Settings</h2>
                  
                  <div className="space-y-4">
                    <TextInput
                      label="Title"
                      value={config.headerTitle}
                      onChange={(value) => setConfig({ headerTitle: value })}
                    />

                    <TextInput
                      label="Subtitle"
                      value={config.subtitle}
                      onChange={(value) => setConfig({ subtitle: value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageUpload
                        label="Logo"
                        currentImage={config.logo}
                        onUpload={(url) => handleImageUpload('logo', url)}
                        recommendations={{
                          maxSize: "1MB",
                          dimensions: "200x200px",
                          format: "PNG, SVG preferred"
                        }}
                      />

                      <ImageUpload
                        label="Background Image"
                        currentImage={config.backgroundImage}
                        onUpload={(url) => handleImageUpload('background', url)}
                        recommendations={{
                          maxSize: "1MB",
                          dimensions: "1920x1080px",
                          format: "JPG, PNG"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-6 text-[#D3D3DF]">Preview</h2>
                  <div className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{ 
                          backgroundImage: `url(${config.backgroundImage})`,
                          filter: 'blur(2px) brightness(0.7)'
                        }}
                      />
                      <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center">
                        <img
                          src={config.logo}
                          alt="Logo"
                          className="h-20 mb-6 object-contain"
                        />
                        <h1 className="text-4xl font-bold text-white mb-4">
                          {config.headerTitle}
                        </h1>
                        <p className="text-xl text-white/80">
                          {config.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="carousel" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">Carousel Images</h2>
                  
                  <div className="space-y-4">
                    <ImageUpload
                      label="Add Image (Max 6)"
                      currentImage=""
                      onUpload={(url) => {
                        if (config.carouselImages.length >= 6) {
                          toast.error('Maximum 6 images allowed');
                          return;
                        }
                        setConfig({
                          carouselImages: [...config.carouselImages, url]
                        });
                      }}
                      recommendations={{
                        maxSize: "1MB",
                        dimensions: "1200x800px",
                        format: "JPG, PNG"
                      }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {config.carouselImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Carousel ${index + 1}`}
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                          <Button
                            onClick={() => {
                              const newImages = config.carouselImages.filter((_, i) => i !== index);
                              setConfig({ carouselImages: newImages });
                            }}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            <LogOut className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-6 text-[#D3D3DF]">Preview</h2>
                  <div className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                    <Carousel
                      images={config.carouselImages.map((url, index) => ({
                        id: index.toString(),
                        url,
                        alt: `Carousel ${index + 1}`
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="wheel" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">Wheel Settings</h2>
                  
                  <div className="space-y-4">
                    {config.prizes.map((prize) => (
                      <div key={prize.id} className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <TextInput
                            label="Prize Text"
                            value={prize.text}
                            onChange={(value) => updatePrize(prize.id, { text: value })}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                                Color
                              </label>
                              <input
                                type="color"
                                value={prize.color}
                                onChange={(e) => updatePrize(prize.id, { color: e.target.value })}
                                className="w-full h-10 px-1 py-1 bg-[#121218] border border-[#C33AFF]/20 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                                Probability (0-1)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={prize.probability}
                                onChange={(e) => updatePrize(prize.id, { probability: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
                              />
                            </div>
                          </div>

                          <TextInput
                            label="Bonus Code"
                            value={prize.bonusCode?.code || ''}
                            onChange={(value) => handleBonusCodeUpdate(
                              prize.id,
                              value,
                              new Date(prize.bonusCode?.expiresAt || Date.now())
                            )}
                          />

                          <div>
                            <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                              Bonus Code Expiration
                            </label>
                            <div className="flex items-center gap-2">
                              <DatePicker
                                selected={prize.bonusCode?.expiresAt ? new Date(prize.bonusCode.expiresAt) : null}
                                onChange={(date) => date && handleBonusCodeUpdate(
                                  prize.id,
                                  prize.bonusCode?.code || '',
                                  date
                                )}
                                showTimeSelect
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="w-full px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
                              />
                              <Calendar className="w-5 h-5 text-[#C33AFF]" />
                            </div>
                          </div>

                          <TextInput
                            label="Redirect URL"
                            value={prize.redirectUrl}
                            onChange={(value) => updatePrize(prize.id, { redirectUrl: value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#D3D3DF]">Preview</h2>
                    <Button
                      onClick={() => setShowPreview(!showPreview)}
                      variant="outline"
                      className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                  </div>
                  
                  {showPreview && (
                    <div className="relative">
                      <SpinningWheel
                        prizes={config.prizes}
                        onSpinEnd={() => {}}
                        disabled={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="preview" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <iframe
                src="/"
                className="w-full h-[800px] rounded-lg border border-[#C33AFF]/20"
                title="Page Preview"
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};