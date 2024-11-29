import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import authenticator from 'authenticator';
import { Button } from '../ui/button';

interface Props {
  onComplete: (secret: string) => void;
  onCancel: () => void;
}

export const TwoFactorSetup: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Generate a new secret key
    const newSecret = authenticator.generateKey();
    setSecret(newSecret);

    // Generate the QR code URL
    const otpUrl = authenticator.generateTotpUri(
      newSecret,
      'Admin',
      'Luxury Wheel',
      'SHA1',
      6,
      30
    );

    QRCode.toDataURL(otpUrl)
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating QR code:', err));
  }, []);

  const verifyToken = () => {
    try {
      // Verify the token with a ±1 window to account for time drift
      const isValid = authenticator.verifyToken(secret, token);
      
      if (isValid) {
        onComplete(secret);
      } else {
        setError('Invalid token. Please try again.');
      }
    } catch (err) {
      setError('Error validating token. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center mb-4">
            Setup Two-Factor Authentication
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Scan this QR code with your authenticator app (e.g., Google Authenticator)
          </p>
        </div>

        <div className="space-y-6">
          {qrCodeUrl && (
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <img src={qrCodeUrl} alt="2FA QR Code" className="border p-2 rounded" />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code from your authenticator app
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Back
              </Button>
              <Button
                onClick={verifyToken}
                disabled={token.length !== 6}
              >
                Verify & Enable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};