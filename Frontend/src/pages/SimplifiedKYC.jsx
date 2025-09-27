/**
 * Simplified Self-Based Age Verification
 *
 * A streamlined approach that focuses on:
 * - Clear 18+ verification messaging
 * - Simple one-click verification for demo/testing
 * - Self protocol integration ready for production
 * - Immediate feedback and results
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SimplifiedKYC = () => {
  const navigate = useNavigate();
  const [verificationStep, setVerificationStep] = useState('start'); // start, verifying, success, error
  const [userKYCStatus, setUserKYCStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check current KYC status on load
  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
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
      if (data.success) {
        setUserKYCStatus(data.data);

        // If already verified, show success
        if (data.data.verified) {
          setVerificationStep('success');
        }
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);
    setError('');
    setVerificationStep('verifying');

    try {
      const token = localStorage.getItem('burp_auth_token');

      // For simplicity, we'll use the mock verification endpoint
      // In production, this would integrate with actual Self protocol
      const response = await fetch('https://burp.contactsushil.me/api/kyc/mock/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setVerificationStep('success');

        // Update local KYC status
        await checkKYCStatus();

        // Auto redirect after showing success
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setVerificationStep('error');
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationStep('error');
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const StartVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-2xl mx-auto"
    >
      <ShieldCheckIcon className="w-20 h-20 text-blue-600 mx-auto mb-6" />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Age Verification Required
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        To access investment features, we need to verify that you're 18 or older.
        This verification uses Self's privacy-preserving technology.
      </p>

      {/* Privacy Guarantee */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <EyeSlashIcon className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
          <div className="text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Complete Privacy Protection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4" />
                <span>Zero personal data stored</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Only proves you're 18+</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeSlashIcon className="w-4 h-4" />
                <span>No identity details revealed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Verification Method</h3>

        {/* Self App Verification */}
        <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Self Mobile App</h4>
                <p className="text-sm text-gray-600">Scan ID with your phone (Production Ready)</p>
              </div>
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Coming Soon</span>
          </div>
        </div>

        {/* Demo Verification */}
        <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Demo Verification</h4>
                <p className="text-sm text-gray-600">Instant verification for testing and demo</p>
              </div>
            </div>
            <button
              onClick={handleVerification}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <ClockIcon className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Age (18+)
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          By proceeding, you confirm that you are 18 years or older and agree to our terms of service.
        </p>
      </div>
    </motion.div>
  );

  const VerifyingState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ClockIcon className="w-10 h-10 text-blue-600 animate-spin" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Verifying Your Age
      </h2>

      <p className="text-gray-600 mb-6">
        Processing your age verification using Self's zero-knowledge proof technology...
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-800">Generating proof that you're 18+</span>
        </div>
      </div>
    </motion.div>
  );

  const SuccessState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-green-900 mb-4">
        Age Verification Complete!
      </h2>

      <p className="text-green-700 mb-6">
        You've been successfully verified as 18+ and can now access all investment features.
      </p>

      {userKYCStatus?.verifiedAt && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            Verified on: {new Date(userKYCStatus.verifiedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <button
        onClick={() => navigate('/dashboard')}
        className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Continue to Dashboard
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Redirecting automatically in 3 seconds...
      </p>
    </motion.div>
  );

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
      </div>

      <h2 className="text-2xl font-bold text-red-900 mb-4">
        Verification Failed
      </h2>

      <p className="text-red-700 mb-6">
        {error || 'There was an issue with the age verification process.'}
      </p>

      <div className="space-y-3">
        <button
          onClick={() => {
            setVerificationStep('start');
            setError('');
          }}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Skip for Now
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {verificationStep === 'start' && (
            <motion.div key="start" exit={{ opacity: 0, y: -20 }}>
              <StartVerification />
            </motion.div>
          )}

          {verificationStep === 'verifying' && (
            <motion.div key="verifying" exit={{ opacity: 0, y: -20 }}>
              <VerifyingState />
            </motion.div>
          )}

          {verificationStep === 'success' && (
            <motion.div key="success" exit={{ opacity: 0, y: -20 }}>
              <SuccessState />
            </motion.div>
          )}

          {verificationStep === 'error' && (
            <motion.div key="error" exit={{ opacity: 0, y: -20 }}>
              <ErrorState />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">How Self Verification Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Scan Your ID</h4>
                <p className="text-gray-600">Use your phone to scan any government-issued photo ID</p>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Generate Proof</h4>
                <p className="text-gray-600">Self creates a zero-knowledge proof of your age</p>
              </div>
              <div className="text-center">
                <LockClosedIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Stay Private</h4>
                <p className="text-gray-600">Only age verification is shared, nothing else</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimplifiedKYC;