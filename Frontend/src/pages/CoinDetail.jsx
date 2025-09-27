// Cluster detail page showing basket composition, performance, and investment options
// Features real-time data from MongoDB and integration with 1inch for investments

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import * as Web3Icons from "@web3icons/react";
import ScrollToTop from "../components/ScrollToTop";

const API_BASE_URL = "https://burp.contactsushil.me";

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
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch cluster: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          console.log(result.data);
          setClusterData(result.data);
        } else {
          throw new Error(result.message || "Failed to load cluster data");
        }
      } catch (error) {
        console.error("Failed to load cluster data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadClusterData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cluster data...</p>
          <ScrollToTop/>
        </div>
      </div>
    );
  }

  if (error || !clusterData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error ? "Error Loading Cluster" : "Cluster Not Found"}
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium 
                       hover:shadow-lg transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getTokenIcon = (symbol) => {
    const iconName = `Token${symbol.toUpperCase()}`;
    const IconComponent = Web3Icons[iconName];

    if (IconComponent) {
      return <IconComponent className="w-10 h-10 rounded" variant="background" />;
    }

    // Fallback to symbol text if icon not found
    return (
      <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary/50 rounded-lg flex items-center justify-center text-white text-sm font-bold">
        {symbol}
      </div>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "conservative":
        return "text-green-600";
      case "moderate":
        return "text-yellow-600";
      case "aggressive":
        return "text-red-600";
      default:
        return "text-gray-600";
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
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-primary-foreground">
                {clusterData.name?.charAt(0)?.toUpperCase() || "C"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {clusterData.name}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <span
                  className={`text-sm font-medium ${getRiskColor(
                    clusterData.riskLevel
                  )}`}
                >
                  {clusterData.riskLevel?.toUpperCase()} RISK
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {clusterData.tokens?.length || 0} Tokens
                </span>
                {clusterData.aiGenerated && (
                  <>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-blue-600 font-medium">
                      AI Generated
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/cluster-management")}
            className="flex items-center px-4 py-2 rounded-xl text-muted-foreground 
                       hover:bg-muted hover:text-foreground transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Clusters
          </button>
        </motion.div>

        {/* Cluster Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="card-gradient rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-lg text-foreground leading-relaxed">
              {clusterData.description ||
                "This cluster provides diversified exposure to selected cryptocurrency tokens with strategic allocation weights."}
            </p>
          </div>

          <div className="card-gradient rounded-2xl p-6 text-center shadow-sm">
            {/* Purchase UI */}
            <div className="space-y-3">
              <input
                type="number"
                min="1"
                step="1"
                value={clusterData._purchaseAmount || ""}
                onChange={(e) =>
                  setClusterData((prev) => ({
                    ...prev,
                    _purchaseAmount: e.target.value,
                  }))
                }
                placeholder="Amount (PYUSD)"
                className="w-full px-4 py-3 rounded-2xl border border-muted bg-background 
                           focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none 
                           transition-all duration-300"
                disabled={clusterData._isPurchasing}
              />
              <button
                onClick={async () => {
                  const amount = Number(clusterData._purchaseAmount);
                  if (!amount || amount <= 0) {
                    alert("Please enter a valid PYUSD amount greater than 0");
                    return;
                  }
                  const confirmed = window.confirm(
                    `Confirm purchase of ${amount} PYUSD for cluster "${clusterData.name}"?`
                  );
                  if (!confirmed) return;
                  try {
                    setClusterData((prev) => ({ ...prev, _isPurchasing: true }));
                    const token = localStorage.getItem("burp_auth_token");
                    const resp = await fetch(
                      `${API_BASE_URL}/api/baskets/${id}/purchase`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({ pyusdAmount: amount }),
                      }
                    );
                    const payload = await resp.json().catch(() => null);
                    if (!resp.ok) {
                      const msg =
                        (payload && payload.message) ||
                        `Purchase failed: ${resp.status}`;
                      throw new Error(msg);
                    }
                    if (payload && payload.success) {
                      setClusterData((prev) => ({
                        ...prev,
                        popularity: {
                          ...(prev.popularity || {}),
                          investments: (prev.popularity?.investments || 0) + 1,
                        },
                        totalValue:
                          typeof prev.totalValue === "number"
                            ? prev.totalValue + amount
                            : prev.totalValue,
                        _purchaseAmount: "",
                      }));
                      alert(
                        "Purchase queued successfully. Check transactions for status."
                      );
                    } else {
                      throw new Error(
                        (payload && payload.message) || "Purchase failed"
                      );
                    }
                  } catch (err) {
                    console.error("Purchase error:", err);
                    alert(err.message || "Purchase failed");
                  } finally {
                    setClusterData((prev) => ({
                      ...prev,
                      _isPurchasing: false,
                    }));
                  }
                }}
                className="w-full px-4 py-3 rounded-2xl bg-primary text-primary-foreground 
                           font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {clusterData._isPurchasing ? "Processing..." : "Buy with PYUSD"}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full px-4 py-3 rounded-2xl bg-muted text-foreground font-medium 
                           hover:bg-muted/80 transition-colors duration-300"
              >
                Cancel
              </button>
              <p className="text-xs text-muted-foreground">
                Currently we support PYUSD for purchase.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Token Allocation */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="bg-gradient-to-r from-gray-10 to-gray-20 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 mb-8 shadow-lg"
>
  <h2 className="text-3xl font-bold text-white mb-8">Token Allocation</h2>
  <div className="grid md:grid-cols-2 gap-6">
    {clusterData.tokens?.map((token, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary/80 to-primary/50 rounded-2xl flex items-center justify-center shadow-inner">
            {getTokenIcon(token.symbol)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{token.symbol}</h3>
            <p className="text-sm text-muted-foreground">
              {token.name || token.symbol}
            </p>
            {token.rationale && (
              <p className="text-xs text-muted-foreground mt-1">
                {token.rationale}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{token.weight}%</p>
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
            className="card-gradient rounded-2xl p-8 mb-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["daily", "weekly", "monthly", "yearly"].map((period) => (
                <div
                  key={period}
                  className="text-center p-4 bg-muted rounded-xl shadow-sm"
                >
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                    {period}
                  </h4>
                  <p
                    className={`text-lg font-bold ${
                      (clusterData.performance.returns?.[period] || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(
                      clusterData.performance.returns?.[period] || 0
                    ).toFixed(2)}
                    %
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="bg-gradient-to-br from-white/90 to-yellow-50 dark:from-gray-900 dark:to-yellow-900 rounded-3xl p-8 mb-8 shadow-xl"
>
  <h2 className="text-3xl font-bold text-yellow-800 dark:text-yellow-400 mb-6">
    About {clusterData.name}
  </h2>
  <p className="text-yellow-900 dark:text-yellow-200 leading-relaxed text-lg">
    {clusterData.description ||
      "This cluster provides diversified exposure to selected cryptocurrency tokens with strategic allocation weights designed to optimize risk-adjusted returns."}
  </p>

  {clusterData.aiMetadata && (
    <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700 shadow-sm">
      <h3 className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">
        AI Generation Details
      </h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-yellow-800 dark:text-yellow-300">Model:</span>
          <span className="ml-2 text-white font-medium">{clusterData.aiMetadata.model || "Burp-v1"}</span>
        </div>
        <div>
          <span className="text-yellow-800 dark:text-yellow-300">Confidence:</span>
          <span className="ml-2 text-white font-medium">
            {((clusterData.aiMetadata.confidence || 0) * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="text-yellow-800 dark:text-yellow-300">Market Conditions:</span>
          <span className="ml-2 text-white font-medium capitalize">
            {clusterData.aiMetadata.marketConditions || "neutral"}
          </span>
        </div>
      </div>
      {clusterData.aiMetadata.generatedAt && (
        <p className="text-xs text-yellow-900 dark:text-yellow-300 mt-3">
          Generated on {formatDate(clusterData.aiMetadata.generatedAt)}
        </p>
      )}
    </div>
  )}
</motion.div>


        
      </div>
    </div>
  );
};

export default ClusterDetail;
