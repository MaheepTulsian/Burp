/**
 * KYC Routes - Age Verification API Endpoints
 *
 * Handles:
 * - Age verification via Self Protocol ZKP
 * - KYC status checking and management
 * - Investment eligibility verification
 * - Admin functions for KYC management
 */

const express = require('express');
const router = express.Router();
const KYCService = require('../services/KYCService');
const { authenticateToken } = require('../middleware/auth');

// Initialize services
const kycService = new KYCService();

// ============ PUBLIC ENDPOINTS ============

/**
 * @route GET /api/kyc/status
 * @desc Get KYC service status and configuration
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = kycService.getServiceStatus();

    res.json({
      success: true,
      data: {
        service: 'Age Verification KYC',
        version: '1.0.0',
        status: 'operational',
        blockchain: {
          network: status.chainId === 44787 ? 'Celo Alfajores Testnet' : 'Unknown',
          contractAddress: status.contractAddress,
          chainId: status.chainId
        },
        features: status.features,
        integration: {
          selfProtocol: 'configured',
          zkpVerification: 'enabled',
          privacyPreserving: true
        }
      }
    });
  } catch (error) {
    console.error('Error getting KYC status:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to get service status'
    });
  }
});

/**
 * @route GET /api/kyc/requirements
 * @desc Get KYC verification requirements and process info
 * @access Public
 */
router.get('/requirements', (req, res) => {
  res.json({
    success: true,
    data: {
      minimumAge: 18,
      requiredDocuments: [
        'Government-issued photo ID',
        'Passport',
        'Driver\'s license',
        'National identity card'
      ],
      verificationProcess: [
        'Connect your wallet to the platform',
        'Submit age verification request with attestation',
        'Provide zero-knowledge proof of age via Self Protocol',
        'Smart contract validates proof on-chain',
        'Verification status updated automatically'
      ],
      privacyFeatures: [
        'No personal data stored onchain',
        'Zero-knowledge proof technology',
        'Only age verification (18+) is proven',
        'Document details remain private'
      ],
      estimatedTime: '2-5 minutes',
      supportedCountries: 'Global (with government-issued ID)'
    }
  });
});

// ============ PROTECTED ENDPOINTS ============

/**
 * @route POST /api/kyc/verify
 * @desc Submit age verification proof from Self Protocol
 * @access Private (requires authentication)
 */
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { attestationId, proof, pubSignals } = req.body;
    const userAddress = req.user.walletAddress;

    // Validate required fields
    if (!attestationId || !proof || !pubSignals) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: attestationId, proof, pubSignals'
      });
    }

    console.log(`🔍 Processing KYC verification for user: ${userAddress}`);

    // Perform age verification
    const verificationResult = await kycService.verifyUserAge(
      userAddress,
      attestationId,
      proof,
      pubSignals
    );

    if (verificationResult.success) {
      res.json({
        success: true,
        message: 'Age verification successful',
        data: verificationResult.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: verificationResult.error
      });
    }

  } catch (error) {
    console.error('Error in KYC verification:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during verification'
    });
  }
});

/**
 * @route GET /api/kyc/status/me
 * @desc Get current user's KYC verification status
 * @access Private (requires authentication)
 */
router.get('/status/me', authenticateToken, async (req, res) => {
  try {
    const userAddress = req.user.walletAddress;

    const status = await kycService.getVerificationStatus(userAddress);

    res.json({
      success: true,
      data: {
        walletAddress: userAddress,
        verified: status.verified,
        verifiedAt: status.timestamp,
        attestationId: status.attestationId,
        kycStatus: status.verified ? 'verified' : 'unverified'
      }
    });

  } catch (error) {
    console.error('Error getting user KYC status:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to get KYC status'
    });
  }
});

/**
 * @route GET /api/kyc/eligibility/investment
 * @desc Check if user is eligible for investment features
 * @access Private (requires authentication)
 */
router.get('/eligibility/investment', authenticateToken, async (req, res) => {
  try {
    const userAddress = req.user.walletAddress;

    const eligibility = await kycService.checkInvestmentEligibility(userAddress);

    res.json({
      success: true,
      data: eligibility
    });

  } catch (error) {
    console.error('Error checking investment eligibility:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to check eligibility'
    });
  }
});

/**
 * @route POST /api/kyc/mock/generate
 * @desc Generate mock KYC data for testing purposes
 * @access Private (requires authentication) - Testing only
 */
router.post('/mock/generate', authenticateToken, async (req, res) => {
  try {
    // Only allow in development/testing environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Mock data generation not allowed in production'
      });
    }

    const userAddress = req.user.walletAddress;
    const mockData = kycService.generateMockKYCData(userAddress);

    res.json({
      success: true,
      message: 'Mock KYC data generated for testing',
      data: mockData,
      note: 'This is test data only - use for development/demo purposes'
    });

  } catch (error) {
    console.error('Error generating mock KYC data:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to generate mock data'
    });
  }
});

/**
 * @route POST /api/kyc/mock/verify
 * @desc Automatically verify user for testing purposes
 * @access Private (requires authentication) - Testing only
 */
router.post('/mock/verify', authenticateToken, async (req, res) => {
  try {
    // Only allow in development/testing environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Mock verification not allowed in production'
      });
    }

    const userAddress = req.user.walletAddress;
    const mockData = kycService.generateMockKYCData(userAddress);

    // Perform mock verification
    const verificationResult = await kycService.verifyUserAge(
      userAddress,
      mockData.attestationId,
      mockData.proof,
      mockData.pubSignals
    );

    if (verificationResult.success) {
      res.json({
        success: true,
        message: 'Mock verification successful',
        data: verificationResult.data,
        note: 'This is a test verification - not a real age proof'
      });
    } else {
      res.status(400).json({
        success: false,
        error: verificationResult.error
      });
    }

  } catch (error) {
    console.error('Error in mock verification:', error);
    res.status(500).json({
      success: false,
      error: 'Mock verification failed'
    });
  }
});

// ============ BATCH OPERATIONS ============

/**
 * @route POST /api/kyc/batch/check
 * @desc Check KYC status for multiple users
 * @access Private (admin only)
 */
router.post('/batch/check', authenticateToken, async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!addresses || !Array.isArray(addresses)) {
      return res.status(400).json({
        success: false,
        error: 'addresses array is required'
      });
    }

    if (addresses.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 addresses per batch request'
      });
    }

    const batchResult = await kycService.batchCheckVerification(addresses);

    res.json({
      success: true,
      data: batchResult.data
    });

  } catch (error) {
    console.error('Error in batch KYC check:', error);
    res.status(500).json({
      success: false,
      error: 'Batch verification check failed'
    });
  }
});

// ============ ADMIN ENDPOINTS ============

/**
 * @route POST /api/kyc/admin/revoke
 * @desc Revoke a user's KYC verification (admin only)
 * @access Private (admin only)
 */
router.post('/admin/revoke', authenticateToken, async (req, res) => {
  try {
    // Note: In a real application, you'd want proper admin role checking
    // For now, we'll use a simple environment variable check
    if (!process.env.ADMIN_WALLET || req.user.walletAddress.toLowerCase() !== process.env.ADMIN_WALLET.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Admin privileges required'
      });
    }

    const { userAddress, reason } = req.body;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: 'userAddress is required'
      });
    }

    const revocationResult = await kycService.revokeVerification(userAddress, reason);

    if (revocationResult.success) {
      res.json({
        success: true,
        message: 'KYC verification revoked successfully',
        data: revocationResult.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: revocationResult.error
      });
    }

  } catch (error) {
    console.error('Error revoking KYC verification:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to revoke verification'
    });
  }
});

/**
 * @route GET /api/kyc/admin/stats
 * @desc Get KYC verification statistics
 * @access Private (admin only)
 */
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    // Admin privilege check
    if (!process.env.ADMIN_WALLET || req.user.walletAddress.toLowerCase() !== process.env.ADMIN_WALLET.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Admin privileges required'
      });
    }

    // Get verification stats from database
    const User = require('../database/models/User');

    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ 'kycStatus.verified': true });
    const recentVerifications = await User.countDocuments({
      'kycStatus.verified': true,
      'kycStatus.verifiedAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0,
        recentVerifications,
        stats: {
          last7Days: recentVerifications,
          conversionRate: `${verifiedUsers}/${totalUsers}`
        }
      }
    });

  } catch (error) {
    console.error('Error getting KYC stats:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to get statistics'
    });
  }
});

// ============ COUNTRY-BASED VERIFICATION ============

/**
 * @route POST /api/kyc/verify/country
 * @desc Submit country-specific age verification
 * @access Private (requires authentication)
 */
router.post('/verify/country', authenticateToken, async (req, res) => {
  try {
    const { countryCode, documentType, attestationId, proof, pubSignals } = req.body;
    const userAddress = req.user.walletAddress;

    // Validate required fields
    if (!countryCode || !documentType || !attestationId || !proof || !pubSignals) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: countryCode, documentType, attestationId, proof, pubSignals'
      });
    }

    console.log(`🔍 Processing country-based KYC verification for user: ${userAddress}, country: ${countryCode}`);

    // Perform country-specific age verification
    const verificationResult = await kycService.verifyUserAgeWithCountry(
      userAddress,
      countryCode,
      documentType,
      attestationId,
      proof,
      pubSignals
    );

    if (verificationResult.success) {
      res.json({
        success: true,
        message: 'Age verification successful',
        data: verificationResult.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: verificationResult.error
      });
    }

  } catch (error) {
    console.error('Error in country-based KYC verification:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during verification'
    });
  }
});

/**
 * @route GET /api/kyc/countries/supported
 * @desc Get list of supported countries for verification
 * @access Public
 */
router.get('/countries/supported', async (req, res) => {
  try {
    const supportedCountries = kycService.getSupportedCountries();

    res.json({
      success: true,
      data: {
        countries: supportedCountries,
        totalSupported: supportedCountries.length,
        documentTypes: {
          'US': ['drivers_license', 'passport', 'state_id'],
          'CA': ['drivers_license', 'passport', 'provincial_id'],
          'GB': ['drivers_license', 'passport', 'national_id'],
          'DE': ['personalausweis', 'passport', 'drivers_license'],
          'FR': ['carte_identite', 'passport', 'drivers_license'],
          'IN': ['aadhaar', 'passport', 'drivers_license', 'voter_id'],
          'JP': ['drivers_license', 'passport', 'residence_card'],
          'AU': ['drivers_license', 'passport', 'proof_of_age'],
          'default': ['passport', 'drivers_license', 'national_id']
        }
      }
    });

  } catch (error) {
    console.error('Error getting supported countries:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to get supported countries'
    });
  }
});

module.exports = router;