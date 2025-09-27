// Dashboard page showing investment clusters and portfolio overview
// Features responsive grid of cluster cards with create-your-own option

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';
import ClusterCard from '../components/ClusterCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load clusters on component mount
  useEffect(() => {
    const loadClusters = async () => {
      try {
        setLoading(true);
        const clustersData = await mockApi.getClusters();
        setClusters(clustersData);
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
    navigate(`/cluster/${clusterId}`);
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

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-foreground">$12,847.32</p>
            <p className="text-green-600 text-sm mt-1">+8.2% (24h)</p>
          </div>
          
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Active Clusters</h3>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-cta text-sm mt-1">2 outperforming market</p>
          </div>
          
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Average APY</h3>
            <p className="text-3xl font-bold text-foreground">15.1%</p>
            <p className="text-green-600 text-sm mt-1">Above market average</p>
          </div>
        </motion.div>

        {/* Clusters Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Existing Clusters */}
          {clusters.map((cluster) => (
            <motion.div key={cluster.id} variants={itemVariants}>
              <ClusterCard 
                cluster={cluster}
                onClick={() => handleClusterClick(cluster.id)}
              />
            </motion.div>
          ))}

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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl font-medium transition-colors duration-300">
              View All Transactions
            </button>
            <button className="px-6 py-3 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl font-medium transition-colors duration-300">
              Portfolio Analytics
            </button>
            <button className="px-6 py-3 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl font-medium transition-colors duration-300">
              Rebalancing History
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
