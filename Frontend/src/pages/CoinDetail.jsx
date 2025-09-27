// Cluster detail page showing basket composition, performance, and investment options
// Features real-time data from MongoDB and integration with 1inch for investments

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001';

const ClusterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClusterData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/baskets/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cluster: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setClusterData(result.data);
          console.log(clusterData)
        } else {
          throw new Error(result.message || 'Failed to load cluster data');
        }
      } catch (error) {
        console.error('Failed to load cluster data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClusterData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cluster data...</p>
        </div>
      </div>
    );
  }

  if (error || !clusterData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error ? 'Error Loading Cluster' : 'Cluster Not Found'}
          </h1>
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-medium transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const calculateTotalReturn = () => {
    if (!clusterData.performance?.returns) return '0.00';
    const returns = clusterData.performance.returns;
    return ((returns.daily || 0) + (returns.weekly || 0) + (returns.monthly || 0)).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'conservative': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'aggressive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {clusterData.name?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{clusterData.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`text-sm font-medium ${getRiskColor(clusterData.riskLevel)}`}>
                  {clusterData.riskLevel?.toUpperCase()} RISK
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{clusterData.tokens?.length || 0} Tokens</span>
                {clusterData.aiGenerated && (
                  <>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-blue-600 font-medium">AI Generated</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/cluster-management')}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Clusters
          </button>
        </motion.div>

        {/* Cluster Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-foreground">
              ${clusterData.totalValue?.toLocaleString() || '0'}
            </p>
            <p className={`text-sm mt-1 ${calculateTotalReturn().startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
              {calculateTotalReturn()}% Total Return
            </p>
          </div>

          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Investments</h3>
            <p className="text-2xl font-bold text-foreground">{clusterData.popularity?.investments || 0}</p>
            <p className="text-sm mt-1 text-muted-foreground">Active investors</p>
          </div>

          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Views</h3>
            <p className="text-2xl font-bold text-foreground">{clusterData.popularity?.views || 0}</p>
            <p className="text-sm mt-1 text-muted-foreground">Total views</p>
          </div>

          <div className="card-gradient rounded-2xl p-6 text-center">
            <button className="w-full px-4 py-3 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-medium transition-colors duration-300 mb-2">
              Invest in Cluster
            </button>
            <p className="text-xs text-muted-foreground">Via 1inch DEX</p>
          </div>
        </motion.div>

        {/* Token Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Token Allocation</h2>
          <div className="space-y-4">
            {clusterData.tokens?.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{token.symbol}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{token.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{token.name || token.symbol}</p>
                    {token.rationale && (
                      <p className="text-xs text-muted-foreground mt-1">{token.rationale}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{token.weight}%</p>
                  <p className="text-sm text-muted-foreground">Allocation</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        {clusterData.performance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-gradient rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-xl">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Daily</h4>
                <p className={`text-lg font-bold ${(clusterData.performance.returns?.daily || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(clusterData.performance.returns?.daily || 0).toFixed(2)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-xl">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Weekly</h4>
                <p className={`text-lg font-bold ${(clusterData.performance.returns?.weekly || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(clusterData.performance.returns?.weekly || 0).toFixed(2)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-xl">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Monthly</h4>
                <p className={`text-lg font-bold ${(clusterData.performance.returns?.monthly || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(clusterData.performance.returns?.monthly || 0).toFixed(2)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-xl">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Yearly</h4>
                <p className={`text-lg font-bold ${(clusterData.performance.returns?.yearly || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(clusterData.performance.returns?.yearly || 0).toFixed(2)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-gradient rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">About {clusterData.name}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {clusterData.description || 'This cluster provides diversified exposure to selected cryptocurrency tokens with strategic allocation weights designed to optimize risk-adjusted returns.'}
          </p>

          {clusterData.aiMetadata && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">AI Generation Details</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2 font-medium">{clusterData.aiMetadata.model || 'Burp-v1'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-medium">{((clusterData.aiMetadata.confidence || 0) * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Market Conditions:</span>
                  <span className="ml-2 font-medium capitalize">{clusterData.aiMetadata.marketConditions || 'neutral'}</span>
                </div>
              </div>
              {clusterData.aiMetadata.generatedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Generated on {formatDate(clusterData.aiMetadata.generatedAt)}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Cluster Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-gradient rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Cluster Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{clusterData.category || 'Custom'}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                <span className="text-muted-foreground">Risk Level</span>
                <span className={`font-medium capitalize ${getRiskColor(clusterData.riskLevel)}`}>
                  {clusterData.riskLevel || 'Moderate'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(clusterData.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium capitalize">{clusterData.visibility || 'Private'}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${clusterData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {clusterData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                <span className="text-muted-foreground">Popularity Score</span>
                <span className="font-medium">{clusterData.popularity?.score || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClusterDetail;