import React, { useState } from 'react';
import { useConfigStore } from '../store/configStore';
import { SpinningWheel } from './SpinningWheel';
import { SpinResult } from '../types';
import { Carousel } from './carousel/Carousel';
import { CountdownTimer } from './CountdownTimer';
import confetti from 'canvas-confetti';

export const PublicPage: React.FC = () => {
  const { config } = useConfigStore();
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [bonusCode] = useState('20CHRISTMAS');
  
  // Set expiry time to 24 hours from now
  const [expiryTime] = useState(Date.now() + 24 * 60 * 60 * 1000);

  const handleSpinEnd = (result: SpinResult) => {
    setSpinResult(result);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = () => {
    if (spinResult) {
      window.open(spinResult.prize.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#121218] text-white">
      {/* Header Section */}
      <header className="border-b border-purple-900/20 p-4">
        <div className="max-w-4xl mx-auto">
          <img 
            src={config.logo || '/logo.png'} 
            alt="Logo" 
            className="h-12 object-contain"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-400">
            {config.headerTitle}
          </h1>
          <p className="text-lg text-gray-300">
            {config.subtitle}
          </p>
        </div>
      </section>

      {/* Product Carousel Section */}
      {config.carouselImages && config.carouselImages.length > 0 && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <ProductCarousel images={config.carouselImages} />
          </div>
        </section>
      )}

      {/* Wheel Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <SpinningWheel
              prizes={config.prizes}
              onSpinEnd={handleSpinEnd}
              disabled={!!spinResult}
            />
            
            {/* Bonus Code Display */}
            <div className="mt-6 text-center">
              <div className="inline-block bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-300">Bonus Code:</p>
                <p className="text-xl font-bold text-purple-400">{bonusCode}</p>
                <p className="text-sm text-gray-300 mt-2">Expiring In:</p>
                <CountdownTimer expiryTimestamp={expiryTime} />
              </div>
            </div>
          </div>

          {/* Spin Result */}
          {spinResult && (
            <div className="mt-6 text-center">
              <div className="bg-purple-900/20 rounded-lg p-6 inline-block">
                <h3 className="text-xl font-bold mb-4">
                  Congratulations! You won: {spinResult.prize.text}
                </h3>
                <button
                  onClick={handleClaim}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                >
                  Claim Offer!
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-purple-900/20 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>Terms and offers, conditions, refund and trial policy apply.</p>
        </div>
      </footer>
    </div>
  );
};