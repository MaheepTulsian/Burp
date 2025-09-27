/**
 * KYC Status Component
 *
 * A reusable component that shows the user's KYC verification status
 * and provides quick access to verification if needed.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const KYCStatus = ({ onStatusChange, showFullCard = true }) => {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('burp_auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:5001/api/kyc/status/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setKycStatus(data.data);
        if (onStatusChange) {
          onStatusChange(data.data);
        }
      } else {
        setError(data.error || 'Failed to get KYC status');
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!kycStatus) return 'gray';
    return kycStatus.verified ? 'green' : 'yellow';
  };

  const getStatusIcon = () => {
    if (loading) return ClockIcon;
    if (!kycStatus) return ExclamationTriangleIcon;
    return kycStatus.verified ? CheckCircleIcon : ExclamationTriangleIcon;
  };

  const getStatusText = () => {
    if (loading) return 'Checking verification status...';
    if (error) return 'Unable to check status';
    if (!kycStatus) return 'Verification required';
    return kycStatus.verified ? 'Age verified' : 'Age verification required';
  };

  const getStatusDescription = () => {
    if (loading || error || !kycStatus) return '';

    if (kycStatus.verified) {
      const verifiedDate = new Date(kycStatus.verifiedAt).toLocaleDateString();
      return `Verified on ${verifiedDate}`;
    }

    return 'Complete age verification to access investment features';
  };

  const handleVerifyClick = () => {
    navigate('/kyc/verify');
  };

  if (!showFullCard) {
    // Compact status indicator
    const StatusIcon = getStatusIcon();
    const color = getStatusColor();

    return (
      <div className="flex items-center gap-2">
        <StatusIcon
          className={`w-5 h-5 ${
            color === 'green' ? 'text-green-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-gray-400'
          }`}
        />
        <span
          className={`text-sm font-medium ${
            color === 'green' ? 'text-green-700' :
            color === 'yellow' ? 'text-yellow-700' :
            'text-gray-600'
          }`}
        >
          {getStatusText()}
        </span>
        {!kycStatus?.verified && !loading && (
          <button
            onClick={handleVerifyClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
          >
            Verify Now
          </button>
        )}
      </div>
    );
  }

  // Full card view
  const StatusIcon = getStatusIcon();
  const color = getStatusColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border-2 p-4 ${
        color === 'green' ? 'border-green-200 bg-green-50' :
        color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
        'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon
          className={`w-6 h-6 mt-0.5 ${
            color === 'green' ? 'text-green-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-gray-400'
          }`}
        />

        <div className="flex-1">
          <h3
            className={`font-semibold ${
              color === 'green' ? 'text-green-900' :
              color === 'yellow' ? 'text-yellow-900' :
              'text-gray-900'
            }`}
          >
            {getStatusText()}
          </h3>

          {getStatusDescription() && (
            <p
              className={`text-sm mt-1 ${
                color === 'green' ? 'text-green-700' :
                color === 'yellow' ? 'text-yellow-700' :
                'text-gray-600'
              }`}
            >
              {getStatusDescription()}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}

          {/* Action buttons */}
          <div className="mt-3 flex gap-2">
            {!kycStatus?.verified && !loading && !error && (
              <button
                onClick={handleVerifyClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                Start Verification
              </button>
            )}

            {kycStatus?.verified && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Access Investments
              </button>
            )}

            <button
              onClick={checkKYCStatus}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      {!kycStatus?.verified && !loading && !error && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>
              Your privacy is protected with Self's zero-knowledge proof technology
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default KYCStatus;