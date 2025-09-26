# BURP - Blockchain Unified Rebalancing Platform

A classy, modern React application for decentralized AI-powered crypto investment with light-blue theming and smooth animations.

## 📋 Overview

BURP is a decentralized AI-powered crypto investment platform featuring:
- **AI-managed thematic baskets** for optimized portfolio allocation
- **PYUSD settlement** for seamless transactions  
- **Privacy-preserving KYC** via Self Protocol
- **Best-execution trading** via 1inch Protocol
- **Real-time price feeds** via Pyth Network

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Chat.jsx         # Chat interface for cluster analysis
│   ├── ClusterCard.jsx  # Cluster display cards
│   ├── Footer.jsx       # Footer component
│   ├── Modal.jsx        # Modal overlay component
│   ├── Navbar.jsx       # Navigation bar
│   ├── TokenBadge.jsx   # Token display badges
│   ├── TreasureReveal.jsx # 6-7s treasure animation
│   └── WalletConnect.jsx # Wallet connection interface
├── mock/
│   └── api.js           # Mock API endpoints (replace with real backend)
├── pages/               # Page components
│   ├── Cluster.jsx      # Cluster detail & chat page
│   ├── CoinDetail.jsx   # Individual coin information
│   ├── Dashboard.jsx    # Main dashboard with cluster grid
│   ├── Landing.jsx      # Public landing page
│   └── Login.jsx        # Wallet connection page
├── App.jsx              # Main app component with routing
├── index.css            # Design system & Tailwind styles
└── main.jsx             # Application entry point
```

## 🎨 Design System

The app uses a sophisticated light-blue design system:

- **Primary Colors**: Light blue gradients (#eaf6ff to #cfeeff)
- **CTA Colors**: Darker blue for interactive elements
- **Typography**: System font stack (system-ui, -apple-system, Segoe UI, Roboto)
- **Spacing**: Generous whitespace with 12px border radius
- **Animations**: Smooth transitions with framer-motion

## 🔧 Key Features

### 🏠 Landing Page
- Hero section with light-blue gradient background
- Platform overview with feature highlights
- Smooth micro-animations and call-to-action

### 🔐 Wallet Connection
- Simulated MetaMask/WalletConnect integration
- Multiple wallet options with connection flow
- Success states with automatic dashboard redirect

### 📊 Dashboard  
- Responsive grid of investment cluster cards
- Portfolio overview with key metrics
- "Create your own cluster" option (expandable)

### 💬 Cluster Analysis
- AI chat interface with realistic conversation flow
- Progressive message display with typing indicators  
- Yes/No decision prompts leading to treasure reveal

### 🎁 Treasure Animation
- **6-7 second smooth treasure box opening animation**
- Six sections opening in sequence with particle effects
- Smooth reveal of cluster tokens and allocations
- Investment confirmation flow

### 🪙 Coin Details
- Historical performance data
- Technology integration information (Pyth/1inch)
- Market data and analytics

## 🔗 Backend Integration

The app uses `src/mock/api.js` for development. To integrate with a real backend:

### Recommended Tech Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB 
- **Authentication**: JWT tokens
- **Deployment**: Vercel/Netlify (frontend) + Railway/Render (backend)

### Integration Points
Replace mock API calls in:
- `mockApi.connectWallet()` - Real wallet integration
- `mockApi.getClusters()` - Cluster data from database
- `mockApi.getClusterChat()` - AI chat responses
- `mockApi.investInCluster()` - Blockchain transactions

### Environment Variables
Add these to your deployment:
```
REACT_APP_API_URL=your-backend-api-url
REACT_APP_WALLET_CONNECT_ID=your-walletconnect-project-id
```

## 🛠️ Technologies Used

- **React 18** - UI framework
- **Framer Motion** - Smooth animations & transitions
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **JavaScript/JSX** - No TypeScript for simplicity

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first design approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Accessible ARIA attributes

## 🚢 Deployment Options

### Netlify/Vercel (Recommended)
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔒 Security Considerations

- All wallet interactions are client-side only
- No private keys stored or transmitted
- Mock API responses - implement proper validation in production
- Add rate limiting and authentication for real APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'` 
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the decentralized future**