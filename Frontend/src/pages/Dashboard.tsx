import { useNavigate } from "react-router-dom";
import ClusterCard from "../components/ClusterCard";
import { Button } from "@/components/ui/button";
import mockAPI from "../mock/api";

/**
 * Dashboard Page - Main hub showing cluster cards and create cluster option
 * Responsive grid layout with 4-5 cluster boxes + create cluster card
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const clusters = mockAPI.getClusters();

  const handleClusterClick = (clusterId: string) => {
    navigate(`/cluster/${clusterId}`);
  };

  const handleCreateCluster = () => {
    // Navigate to cluster creation (could be expanded later)
    console.log("Create cluster functionality");
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-burp-gray mb-4">
            Your Investment Dashboard
          </h1>
          <p className="text-xl text-burp-gray-light">
            Manage your AI-powered crypto investment clusters
          </p>
        </div>

        {/* Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {clusters.map((cluster, index) => (
            <div
              key={cluster.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ClusterCard
                cluster={cluster}
                onClick={() => handleClusterClick(cluster.id)}
              />
            </div>
          ))}
          
          {/* Create Cluster Card */}
          <div 
            className="animate-scale-in"
            style={{ animationDelay: `${clusters.length * 0.1}s` }}
          >
            <div className="gradient-card p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 h-full flex flex-col items-center justify-center text-center cursor-pointer group border-2 border-dashed border-burp-blue hover:border-burp-blue-dark"
                 onClick={handleCreateCluster}>
              <div className="w-16 h-16 bg-burp-blue rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-burp-gray mb-3">
                Create Your Own Cluster
              </h3>
              <p className="text-burp-gray-light text-sm mb-6">
                Build a custom investment basket tailored to your strategy
              </p>
              <Button 
                variant="outline" 
                className="border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          {[
            { label: "Total Portfolio Value", value: "$12,456.78" },
            { label: "Active Clusters", value: "3" },
            { label: "24h Return", value: "+2.34%" },
            { label: "All-Time Return", value: "+18.92%" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 gradient-card rounded-xl shadow-soft animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-2xl font-bold text-burp-gray mb-1">{stat.value}</p>
              <p className="text-sm text-burp-gray-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;