/**
 * QR-Based KYC Age Verification Page
 *
 * Features:
 * - QR code generation and display
 * - Real-time verification status polling
 * - Self app integration with clear instructions
 * - 18+ age verification focus
 * - Streamlined user experience
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  QrCodeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeSlashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import SimpleQRCode from '../components/SimpleQRCode';

const QRKYCVerification = () => {
  const navigate = useNavigate();
  const [qrSession, setQrSession] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, generating, pending, scanning, verifying, verified, failed, expired
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const pollingIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Check if user is already verified on load
  useEffect(() => {
    checkExistingKYCStatus();
    return () => {
      // Cleanup intervals
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const checkExistingKYCStatus = async () => {
    try {
      const token = localStorage.getItem('burp_auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://burp.contactsushil.me/api/kyc/status/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data.verified) {
        setVerificationStatus('verified');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error checking existing KYC status:', error);
    }
  };

  const generateQRCode = async () => {
    try {
      setVerificationStatus('generating');
      setError('');

      const token = localStorage.getItem('burp_auth_token');
      const response = await fetch('https://burp.contactsushil.me/api/kyc/generate-qr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setQrSession(data.data);
        setVerificationStatus('pending');
        setTimeRemaining(15 * 60); // 15 minutes

        // Start status polling
        startStatusPolling(data.data.sessionId);

        // Start countdown timer
        startCountdownTimer();
      } else {
        setError(data.error || 'Failed to generate QR code');
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Network error. Please try again.');
      setVerificationStatus('failed');
    }
  };

  const startStatusPolling = (sessionId) => {
    // Clear existing polling
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem('burp_auth_token');
        const response = await fetch(`https://burp.contactsushil.me/api/kyc/qr-status/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          const status = data.data.status;
          setVerificationStatus(status);

          // Update time remaining
          if (data.data.timeRemaining) {
            setTimeRemaining(Math.max(0, Math.floor(data.data.timeRemaining / 1000)));
          }

          // Stop polling if verification is complete
          if (status === 'verified' || status === 'failed' || status === 'expired') {
            clearInterval(pollingIntervalRef.current);
            clearInterval(timerIntervalRef.current);

            if (status === 'verified') {
              setTimeout(() => navigate('/dashboard'), 3000);
            }
          }
        }
      } catch (error) {
        console.error('Error polling verification status:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const startCountdownTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          setVerificationStatus('expired');
          clearInterval(pollingIntervalRef.current);
          clearInterval(timerIntervalRef.current);
        }
        return newTime;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'generating':
      case 'pending':
        return QrCodeIcon;
      case 'scanning':
      case 'verifying':
        return ClockIcon;
      case 'verified':
        return CheckCircleIcon;
      case 'failed':
      case 'expired':
        return ExclamationTriangleIcon;
      default:
        return QrCodeIcon;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'green';
      case 'failed':
      case 'expired':
        return 'red';
      case 'scanning':
      case 'verifying':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'idle':
        return 'Ready to verify your age';
      case 'generating':
        return 'Generating QR code...';
      case 'pending':
        return 'Scan the QR code with Self app';
      case 'scanning':
        return 'QR code scanned! Complete verification in Self app';
      case 'verifying':
        return 'Verifying your identity and age...';
      case 'verified':
        return 'Age verification successful! Redirecting to dashboard...';
      case 'failed':
        return 'Verification failed. Please try again.';
      case 'expired':
        return 'QR code expired. Generate a new one.';
      default:
        return 'Unknown status';
    }
  };

  const QRDisplay = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      {/* QR Code - fixed container so layout doesn't shift when the timer updates */}
      <div className="mb-6">
        <div className="w-[320px] h-[320px] mx-auto relative">
          {qrSession?.qrData ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <SimpleQRCode
                data={qrSession.qrData}
                size={320}
                className="mx-auto"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-center">
                <ArrowPathIcon className="w-12 h-12 text-gray-400 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600">Generating QR Code...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timer - animate only the timer so the QR stays still */}
      {timeRemaining > 0 && (
        <motion.div
          key={timeRemaining}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex items-center gap-2 text-sm text-gray-600 mb-4 justify-center"
        >
          <ClockIcon className="w-4 h-4" />
          <span className="font-mono">Expires in: {formatTime(timeRemaining)}</span>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="max-w-md text-center">
        <h3 className="font-semibold text-gray-900 mb-2">How to verify:</h3>
        <ol className="text-sm text-gray-600 space-y-1 text-left">
          <li>1. Download the Self mobile app</li>
          <li>2. Open the app and tap "Scan QR"</li>
          <li>3. Point your camera at the QR code above</li>
          <li>4. Follow the in-app instructions to verify you're 18+</li>
        </ol>
      </div>

      {/* Download Links */}
      <div className="flex gap-3 mt-4">
        <a
          href="https://apps.apple.com/app/self-id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <DevicePhoneMobileIcon className="w-4 h-4" />
          App Store
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.selfid"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <DevicePhoneMobileIcon className="w-4 h-4" />
          Google Play
        </a>
      </div>
    </motion.div>
  );

  const StatusDisplay = () => {
    const StatusIcon = getStatusIcon();
    const color = getStatusColor();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <StatusIcon
          className={`w-20 h-20 mx-auto mb-4 ${
            color === 'green' ? 'text-green-600' :
            color === 'red' ? 'text-red-600' :
            color === 'blue' ? 'text-blue-600' :
            'text-gray-400'
          } ${verificationStatus === 'verifying' ? 'animate-spin' : ''}`}
        />

        <h3
          className={`text-xl font-semibold mb-2 ${
            color === 'green' ? 'text-green-900' :
            color === 'red' ? 'text-red-900' :
            color === 'blue' ? 'text-blue-900' :
            'text-gray-900'
          }`}
        >
          {getStatusMessage()}
        </h3>

        {verificationStatus === 'verified' && (
          <p className="text-green-700 mb-4">
            You can now access all investment features!
          </p>
        )}

        {(verificationStatus === 'failed' || verificationStatus === 'expired') && (
          <div className="space-y-4">
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              onClick={generateQRCode}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Generate New QR Code
            </button>
          </div>
        )}

        {verificationStatus === 'scanning' && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              Complete the verification process in your Self mobile app.
              This page will automatically update when verification is complete.
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Age Verification Required
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To comply with investment regulations, we need to verify that you're 18 or older.
            This verification uses Self's privacy-preserving technology - your personal information stays private.
          </p>
        </motion.div>

        {/* Privacy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <EyeSlashIcon className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">Your Privacy is Protected</h3>
              <p className="text-purple-800 text-sm">
                Self's zero-knowledge technology only proves you're 18+ without revealing your exact age,
                birthdate, or any other personal information. Nothing is stored on the blockchain except
                the verification status.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            {verificationStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <ShieldCheckIcon className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Verify Your Age
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Click the button below to generate a QR code that you can scan with the Self mobile app
                  to prove you're 18 or older.
                </p>
                <button
                  onClick={generateQRCode}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Start Age Verification
                </button>
              </motion.div>
            )}

            {(verificationStatus === 'generating' || verificationStatus === 'pending') && (
              <motion.div
                key="qr-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <QRDisplay />
              </motion.div>
            )}

            {(verificationStatus === 'scanning' ||
              verificationStatus === 'verifying' ||
              verificationStatus === 'verified' ||
              verificationStatus === 'failed' ||
              verificationStatus === 'expired') && (
              <motion.div
                key="status-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatusDisplay />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you're having trouble with the verification process, make sure you have:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 max-w-md mx-auto">
              <li>• The Self mobile app installed on your phone</li>
              <li>• A valid government-issued photo ID</li>
              <li>• Good lighting for scanning your ID</li>
              <li>• A stable internet connection</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRKYCVerification;