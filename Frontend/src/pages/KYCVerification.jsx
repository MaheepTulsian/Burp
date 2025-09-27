/**
 * KYC Age Verification Page
 *
 * Features:
 * - Self Protocol zero-knowledge proof integration
 * - Privacy-first age verification (18+)
 * - Step-by-step verification process
 * - Mobile app integration guide
 * - Real-time verification status
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  IdentificationIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  EyeSlashIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const KYCVerification = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    attestationId: '',
    proof: [],
    pubSignals: []
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, failed
  const [error, setError] = useState('');
  const [userKYCStatus, setUserKYCStatus] = useState(null);

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

      const response = await fetch('http://localhost:5001/api/kyc/status/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setUserKYCStatus(data.data);

        // If already verified, show success state
        if (data.data.verified) {
          setVerificationStatus('success');
          setCurrentStep(4);
        }
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Verify Your Age",
      description: "Prove you're 18+ using Self's privacy-first technology",
      icon: IdentificationIcon
    },
    {
      id: 2,
      title: "Download Self App",
      description: "Get the Self mobile app to scan your government ID",
      icon: DevicePhoneMobileIcon
    },
    {
      id: 3,
      title: "Generate Proof",
      description: "Create a zero-knowledge proof of your age",
      icon: ShieldCheckIcon
    },
    {
      id: 4,
      title: "Complete Verification",
      description: "Submit your proof and gain access to investments",
      icon: CheckCircleIcon
    }
  ];

  const handleMockVerification = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const token = localStorage.getItem('burp_auth_token');
      const response = await fetch('http://localhost:5001/api/kyc/mock/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setVerificationStatus('success');
        setCurrentStep(4);

        // Update user KYC status
        await checkKYCStatus();

        // Show success for a moment, then redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setVerificationStatus('failed');
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationStatus('failed');
      setError('Network error during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const VerificationStep = ({ step }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <step.icon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>
      </div>

      {step.id === 1 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Why We Need Age Verification</h3>
            <p className="text-blue-800 text-sm">
              To comply with financial regulations, we need to verify that you're 18 or older before you can access investment features.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <EyeSlashIcon className="w-8 h-8 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium">Private</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <LockClosedIcon className="w-8 h-8 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium">Secure</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <GlobeAltIcon className="w-8 h-8 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium">Global</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Start Verification
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {step.id === 2 && (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Download Self App</h3>
            <p className="text-green-800 text-sm mb-3">
              The Self mobile app will scan your government ID and create a privacy-preserving proof of your age.
            </p>

            <div className="flex gap-3">
              <a
                href="https://apps.apple.com/app/self-id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-black text-white py-2 px-3 rounded text-center text-sm font-medium"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.selfid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-center text-sm font-medium"
              >
                Google Play
              </a>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-1">What You'll Need:</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Government-issued photo ID</li>
              <li>• Good lighting for scanning</li>
              <li>• 2-3 minutes to complete</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              I've Downloaded the App
            </button>
          </div>
        </div>
      )}

      {step.id === 3 && (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">Generate Your Proof</h3>
            <ol className="text-purple-800 text-sm space-y-2">
              <li>1. Open the Self app on your phone</li>
              <li>2. Tap "Verify Age" and scan your ID</li>
              <li>3. Complete the biometric verification</li>
              <li>4. The app will generate a zero-knowledge proof</li>
              <li>5. Return here to submit your proof</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">🔒 Your Privacy is Protected</h4>
            <p className="text-blue-800 text-sm">
              Self's technology only proves you're 18+ without revealing your exact age, birthdate, or other personal information.
            </p>
          </div>

          {/* Mock verification for testing */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-1">🧪 Testing Mode</h4>
            <p className="text-orange-800 text-sm mb-3">
              For demo purposes, you can use mock verification instead of the Self app.
            </p>
            <button
              onClick={handleMockVerification}
              disabled={isVerifying}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Use Mock Verification'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              I've Created My Proof
            </button>
          </div>
        </div>
      )}

      {step.id === 4 && (
        <div className="space-y-4">
          {verificationStatus === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <CheckCircleIcon className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">Verification Complete!</h3>
              <p className="text-green-700 mb-4">
                You're now verified and can access all investment features.
              </p>

              {userKYCStatus?.verifiedAt && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-green-800 text-sm">
                    Verified on: {new Date(userKYCStatus.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continue to Dashboard
              </button>
            </motion.div>
          )}

          {verificationStatus === 'failed' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <ExclamationTriangleIcon className="w-20 h-20 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-900 mb-2">Verification Failed</h3>
              <p className="text-red-700 mb-4">{error}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setVerificationStatus('pending');
                    setCurrentStep(3);
                    setError('');
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </motion.div>
          )}

          {verificationStatus === 'pending' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Submit Your Verification Proof</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attestation ID
                  </label>
                  <input
                    type="text"
                    value={verificationData.attestationId}
                    onChange={(e) => setVerificationData(prev => ({
                      ...prev,
                      attestationId: e.target.value
                    }))}
                    placeholder="Enter attestation ID from Self app"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zero-Knowledge Proof
                  </label>
                  <textarea
                    value={verificationData.proof.join(',')}
                    onChange={(e) => setVerificationData(prev => ({
                      ...prev,
                      proof: e.target.value.split(',').filter(p => p.trim())
                    }))}
                    placeholder="Paste your ZKP proof data from Self app"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Public Signals
                  </label>
                  <textarea
                    value={verificationData.pubSignals.join(',')}
                    onChange={(e) => setVerificationData(prev => ({
                      ...prev,
                      pubSignals: e.target.value.split(',').filter(s => s.trim())
                    }))}
                    placeholder="Paste public signals from Self app"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleMockVerification}
                  disabled={isVerifying || !verificationData.attestationId}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Submit Verification'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  const ProgressBar = () => (
    <div className="max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= step.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 h-2 ${
              index === 0 ? 'rounded-l' : ''
            } ${
              index === steps.length - 1 ? 'rounded-r' : ''
            } ${
              currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Verification</h1>
          <p className="text-gray-600">
            Secure, private verification using Self's zero-knowledge technology
          </p>
        </motion.div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <VerificationStep key={currentStep} step={steps.find(s => s.id === currentStep)} />
        </AnimatePresence>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
            <LockClosedIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">
              Your personal information is never stored on the blockchain.
              Self's zero-knowledge technology only proves you're 18+ while keeping all other details private.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KYCVerification;