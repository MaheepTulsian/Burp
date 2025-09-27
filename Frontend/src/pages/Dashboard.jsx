// Dashboard page showing investment clusters and portfolio overview
// Features responsive grid of cluster cards with create-your-own option

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// Use real backend API for clusters
import ClusterCard from '../components/ClusterCard';
import KYCStatus from '../components/KYCStatus';

const Dashboard = () => {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);

  // Load clusters on component mount (from backend)
  useEffect(() => {
    const loadClusters = async () => {
      try {
        setLoading(true);

        const apiBase = 'http://localhost:5001';
        const url = `${apiBase}/api/baskets/public/clusters?limit=20`;

        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Failed to fetch clusters: ${resp.status} ${text}`);
        }

        const payload = await resp.json();
        const buckets = Array.isArray(payload?.data) ? payload.data : [];

        // Map backend basket shape -> ClusterCard expected shape
        const mapped = buckets.map(b => ({
          id: b.id || b._id,
          name: b.name || b.basketName || 'Unnamed Cluster',
          description: b.description || b.portfolio_summary || '',
          tokens: b.tokens || [],
          stats: {
            risk: (b.riskLevel || b.stats?.risk || 'moderate'),
            totalValue: typeof b.totalValue === 'number' ? `$${b.totalValue.toLocaleString()}` : (b.totalValue || '$0'),
            apy: b.performance?.yearly ? `${b.performance.yearly}%` : (b.aiMetadata?.expected_apy ? `${b.aiMetadata.expected_apy}%` : 'N/A'),
            tokens: Array.isArray(b.tokens) ? b.tokens.length : (b.stats?.tokens || 0)
          }
        }));

        setClusters(mapped);
      } catch (error) {
        console.error('Failed to load clusters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClusters();
  }, []);

  // Handle cluster selection
  const handleClusterClick = (clusterId) => {
    // Check KYC status before allowing investment access
    if (!kycStatus?.verified) {
      // Redirect to KYC verification if not verified
      navigate('/kyc/verify');
      return;
    }

    // Navigate to the detailed cluster view route (note: path uses 'clustor' to match App.jsx)
    navigate(`/clustor/${clusterId}`);
  };

  // Handle KYC status change
  const handleKYCStatusChange = (status) => {
    setKycStatus(status);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your investment clusters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Investment Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Explore AI-curated cryptocurrency clusters or create your own custom portfolio
          </p>
        </motion.div>

        {/* KYC Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <KYCStatus onStatusChange={handleKYCStatusChange} />
        </motion.div>

        {/* Clusters Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Existing Clusters */}
          {clusters.length === 0 ? (
            <motion.div className="col-span-full" variants={itemVariants}>
              <div className="cluster-card rounded-2xl p-8 h-full min-h-[300px] flex flex-col items-center justify-center text-center border border-dashed border-muted">
                <h3 className="text-xl font-semibold text-foreground mb-2">No public clusters found</h3>
                <p className="text-muted-foreground mb-4">Create a new cluster or try again later — our AI curates portfolios regularly.</p>
                <button onClick={() => navigate('/cluster/create')} className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Create Cluster</button>
              </div>
            </motion.div>
          ) : (
            clusters.map((cluster) => (
              <motion.div key={cluster.id} variants={itemVariants}>
                <ClusterCard 
                  cluster={cluster}
                  onClick={() => handleClusterClick(cluster.id)}
                />
              </motion.div>
            ))
          )}

          {/* Create Your Own Cluster Card */}
          
          <motion.div variants={itemVariants} onClick={() => navigate('/cluster/create')}>
            <div 
              onClick={() => navigate('/cluster/create')}
              className="cluster-card rounded-2xl p-8 h-full min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-primary hover:border-cta transition-all duration-300"
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">Create Your Own Cluster</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Build a custom investment cluster with your preferred tokens and allocation strategy
              </p>
              
              <div className="inline-flex items-center text-cta font-medium">
                <span>Get Started</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        
      </div>
    </div>
  );
};

export default Dashboard;
