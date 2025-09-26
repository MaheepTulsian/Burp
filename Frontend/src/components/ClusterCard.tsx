import { Card } from "@/components/ui/card";

/**
 * Cluster Card Component
 * Displays cluster information with overlapping token icons and stats
 */
interface Token {
  symbol: string;
  name: string;
  color: string;
  allocation: number;
}

interface Cluster {
  id: string;
  name: string;
  description: string;
  tokens: Token[];
  tvl: string;
  return30d: string;
  riskLevel: string;
}

interface ClusterCardProps {
  cluster: Cluster;
  onClick: () => void;
}

const ClusterCard = ({ cluster, onClick }: ClusterCardProps) => {
  return (
    <Card 
      className="gradient-card p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group hover:scale-105"
      onClick={onClick}
    >
      <div className="text-center">
        {/* Cluster Icon - Multiple overlapping token circles */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-burp-blue rounded-full flex items-center justify-center shadow-medium group-hover:shadow-strong transition-shadow duration-300">
            <div className="grid grid-cols-2 gap-1 p-3">
              {cluster.tokens.slice(0, 4).map((token, index) => (
                <div 
                  key={token.symbol}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold animate-scale-in shadow-sm"
                  style={{ 
                    backgroundColor: token.color,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {token.symbol[0]}
                </div>
              ))}
            </div>
          </div>
          {cluster.tokens.length > 4 && (
            <div className="absolute -bottom-1 -right-1 bg-burp-blue-dark text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              +{cluster.tokens.length - 4}
            </div>
          )}
        </div>
        
        {/* Cluster Info */}
        <h3 className="text-xl font-semibold text-burp-gray mb-3 group-hover:text-burp-blue-dark transition-colors">
          {cluster.name}
        </h3>
        
        <p className="text-sm text-burp-gray-light mb-6 line-clamp-2">
          {cluster.description}
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-burp-gray">{cluster.tvl}</p>
            <p className="text-xs text-burp-gray-light">TVL</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{cluster.return30d}</p>
            <p className="text-xs text-burp-gray-light">30d Return</p>
          </div>
        </div>
        
        {/* Risk Level Badge */}
        <div className="mt-4">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${cluster.riskLevel === 'low' ? 'bg-green-100 text-green-700' : ''}
            ${cluster.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${cluster.riskLevel === 'high' ? 'bg-red-100 text-red-700' : ''}
          `}>
            {cluster.riskLevel.toUpperCase()} RISK
          </span>
        </div>
        
        {/* Asset Count */}
        <div className="mt-4 text-xs text-burp-gray-light">
          {cluster.tokens.length} Assets
        </div>
      </div>
    </Card>
  );
};

export default ClusterCard;