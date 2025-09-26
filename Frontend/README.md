# BURP - Blockchain Unified Rebalancing Platform

A classy, light-blue themed decentralized AI-powered crypto investment platform built with React, TypeScript, and TailwindCSS.

## 🚀 Features

- **Landing Page**: Hero section with light-blue gradient and platform overview
- **Wallet Connection**: Mock MetaMask-style wallet connection flow
- **Dashboard**: Investment clusters with AI-managed thematic baskets
- **Chat Interface**: AI advisor for personalized investment recommendations
- **Treasure Animation**: 6-section opening animation revealing cluster composition
- **Coin Details**: Individual token analysis with market data and tech integrations

## 🛠 Technology Stack

- **Frontend**: React 18 (JavaScript + JSX)
- **Styling**: TailwindCSS with custom design system
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui components
- **State Management**: React Context API
- **Mock API**: Client-side dummy data simulation

## 🎨 Design System

- **Primary Colors**: Light blue theme (#eaf6ff, #cfeeff)
- **Typography**: System font stack (system-ui, Segoe UI, Roboto, etc.)
- **Animations**: Subtle fade, slide, and scale animations
- **Layout**: 12px border radius, generous whitespace, responsive grid

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Chat.tsx         # AI advisor chat interface
│   ├── ClusterCard.tsx  # Investment cluster cards
│   ├── Navbar.tsx       # Navigation component
│   ├── TreasureReveal.tsx # Animation for revealing coins
│   └── WalletConnect.tsx # Wallet connection UI
├── pages/               # Main application pages
│   ├── Landing.tsx      # Hero landing page
│   ├── Login.tsx        # Wallet connection page
│   ├── Dashboard.tsx    # Main investment dashboard
│   ├── Cluster.tsx      # Cluster detail with chat
│   └── CoinDetail.tsx   # Individual coin information
├── mock/                # Mock API simulation
│   └── api.ts          # Dummy data and endpoints
└── components/ui/       # shadcn/ui components
```

## 🔧 Backend Integration

This frontend is ready for backend integration. Replace the mock API with real endpoints:

### Recommended Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Deployment**: Vercel/Netlify + MongoDB Atlas

### Integration Points
1. Replace `src/mock/api.ts` with real API calls
2. Update authentication context in `App.tsx`
3. Add environment variables for API endpoints
4. Implement real wallet connection (Web3, ethers.js)

## 🌐 Key Integrations

- **Self Protocol**: Privacy-preserving KYC
- **1inch Network**: Best execution routing
- **Pyth Network**: Real-time price feeds
- **PYUSD**: Stable settlement currency

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Features Ready for Enhancement

1. **Real Wallet Integration**: Web3 provider connection
2. **Live Price Data**: Real-time crypto price feeds
3. **Investment Transactions**: Actual DeFi protocol integration
4. **User Portfolios**: Persistent user data and analytics
5. **Advanced Charts**: Interactive price and performance charts

## 🚀 Deployment

This project is optimized for modern deployment platforms:

- **Vercel**: Zero-config deployment with automatic optimizations
- **Netlify**: Edge functions and form handling
- **Traditional Hosting**: Static file serving

## 📄 License

Built with ❤️ for the decentralized finance ecosystem.