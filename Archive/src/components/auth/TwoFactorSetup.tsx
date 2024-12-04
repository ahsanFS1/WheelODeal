import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
    const generateRandomSecret = (length: number) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 alphabet
      let result = '';
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array); // Use browser crypto API
      array.forEach((value) => {
        result += characters[value % characters.length];
      });
      return result;
    };

    const newSecret = generateRandomSecret(16);
    setSecret(newSecret);

    const otpUrl = `otpauth://totp/Admin:LuxuryWheel?secret=${newSecret}&issuer=LuxuryWheel`;
    QRCode.toDataURL(otpUrl)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, []);

  const verifyToken = async () => {
    console.log("Verify button clicked"); // Debugging step
    console.log("Secret:", secret);
    console.log("Token:", token);

    if (token.length !== 6 || !/^\d+$/.test(token)) {
      setError("Invalid token format. Tokens must be 6 digits.");
      return;
    }

    try {
      setError('');

      const response = await fetch('http://localhost:5000/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, token }),
      });

      const data = await response.json();
      console.log('Backend Response:', data);

      if (data.success) {
        onComplete(secret);
      } else {
        setError(data.message || 'Invalid token. Please try again.');
      }
    } catch (err) {
      setError('Error validating token. Please try again.');
      console.error('Token verification error:', err);
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
              <Button variant="outline" onClick={onCancel}>
                Back
              </Button>
              <Button onClick={verifyToken} disabled={token.length !== 6}>
                Verify & Enable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
