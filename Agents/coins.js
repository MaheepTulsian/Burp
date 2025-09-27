const coins = [
  {
    "coin": "BTC",
    "category": "Layer-1",
    "tags": ["store-of-value", "digital-gold", "payment"],
    "current_market_price": "$118,500",
    "market_cap": "$2.35T",
    "volatility": "Medium (45-65% annually)",
    "analysis": {
      "technical_summary": "BTC sets the overall market tone, moving in predictable halving-driven cycles. Liquidity and open interest around CME futures often guide short-term moves.",
      "fundamentals": "First decentralized cryptocurrency with a hard cap of 21M coins. Its security and adoption as digital gold make it the most recognized crypto asset globally.",
      "sentiment": "Strong long-term bullishness, especially around institutional adoption and ETF inflows. Short-term sentiment shifts with macro conditions and regulatory news.",
      "risk_level": "Medium: High volatility persists, but existential risk is low due to entrenched network effect."
    }
  },
  {
    "coin": "ETH",
    "category": "Layer-1",
    "tags": ["smart-contracts", "defi", "staking"],
    "current_market_price": "$4,300",
    "market_cap": "$517B",
    "volatility": "Medium-High (55-75% annually)",
    "analysis": {
      "technical_summary": "ETH price patterns track BTC but with higher beta. Options markets and staking yield play key roles in price discovery.",
      "fundamentals": "Ethereum powers most DeFi, NFTs, and stablecoin ecosystems. Proof-of-stake enables yield generation and lower energy costs.",
      "sentiment": "Generally positive when network activity is high. Criticism arises during periods of high gas fees and scaling delays.",
      "risk_level": "Medium: Strong fundamentals but faces competition from faster L1s and regulatory pressure."
    }
  },
  {
    "coin": "SOL",
    "category": "Layer-1",
    "tags": ["high-throughput", "dapps", "ecosystem-growth"],
    "current_market_price": "$193",
    "market_cap": "$104B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "SOL trades in strong cycles of hype and pullbacks. Network outages have historically hurt price action, though technical recovery has improved.",
      "fundamentals": "High-performance L1 blockchain with fast settlement and growing developer adoption. Backed by strong VC support and NFT/gaming traction.",
      "sentiment": "Bullish in NFT/gaming communities. Sometimes polarizing due to centralization concerns.",
      "risk_level": "Medium–High: Rapid growth but still recovering from prior reliability and FTX ecosystem associations."
    }
  },
  {
    "coin": "AVAX",
    "category": "Layer-1",
    "tags": ["defi", "subnets", "scalability"],
    "current_market_price": "$78",
    "market_cap": "$32B",
    "volatility": "High (75-95% annually)",
    "analysis": {
      "technical_summary": "AVAX shows cyclical liquidity inflows during L1 rotations. Price responds strongly to subnet adoption news.",
      "fundamentals": "Avalanche is known for its subnet architecture allowing custom chains. Strong ecosystem push in DeFi and enterprise integrations.",
      "sentiment": "Positive when subnets adoption grows, mixed when activity concentrates on Ethereum alternatives instead.",
      "risk_level": "Medium: Competitive market but strong tech differentiation."
    }
  },
  {
    "coin": "ADA",
    "category": "Layer-1",
    "tags": ["research-driven", "smart-contracts", "staking"],
    "current_market_price": "$1.57",
    "market_cap": "$56B",
    "volatility": "High (65-85% annually)",
    "analysis": {
      "technical_summary": "ADA often trends sideways for long periods with sharp speculative pumps. Liquidity can dry up outside bull cycles.",
      "fundamentals": "Cardano emphasizes peer-reviewed development. Smart contract adoption has been slower than competitors.",
      "sentiment": "Strong retail community support, but broader ecosystem views are mixed due to delays in rollout.",
      "risk_level": "Medium: Low adoption risk offset by strong community and staking participation."
    }
  },
  {
    "coin": "DOT",
    "category": "Layer-1",
    "tags": ["parachains", "interoperability", "staking"],
    "current_market_price": "$18.50",
    "market_cap": "$26B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "DOT trades within range-bound channels influenced by parachain auction cycles. Liquidity spikes during ecosystem announcements.",
      "fundamentals": "Polkadot enables interoperability through parachains. Strong technical team but slower adoption vs. competitors.",
      "sentiment": "Positive when new parachains launch or ecosystem expands. Neutral otherwise.",
      "risk_level": "Medium: Clear tech but adoption lag creates uncertainty."
    }
  },
  {
    "coin": "NEAR",
    "category": "Layer-1",
    "tags": ["scalability", "user-friendly", "sharding"],
    "current_market_price": "$12.30",
    "market_cap": "$14B",
    "volatility": "High (80-100% annually)",
    "analysis": {
      "technical_summary": "NEAR shows upward momentum during scaling narrative cycles. Price volatility remains tied to ecosystem adoption news.",
      "fundamentals": "Sharded smart contract platform focusing on user-friendly onboarding. Strong dev experience and ecosystem funding.",
      "sentiment": "Positive in developer circles. Less retail hype compared to Solana or Ethereum.",
      "risk_level": "Medium: Tech is promising, but ecosystem competition is intense."
    }
  },
  {
    "coin": "ATOM",
    "category": "Layer-1",
    "tags": ["cosmos", "interoperability", "staking"],
    "current_market_price": "$15.80",
    "market_cap": "$6.2B",
    "volatility": "High (75-95% annually)",
    "analysis": {
      "technical_summary": "ATOM trades within ecosystem-driven narratives. Prone to volatility during governance changes.",
      "fundamentals": "Cosmos Hub facilitates interoperability via IBC. Its role in Cosmos ecosystem governance is key.",
      "sentiment": "Mixed: Some see ATOM as undervalued relative to Cosmos adoption; others question token utility.",
      "risk_level": "Medium: Ecosystem is strong, but token's value accrual is debated."
    }
  },
  {
    "coin": "ICP",
    "category": "Layer-1",
    "tags": ["web3", "decentralized-cloud", "infrastructure"],
    "current_market_price": "$28.70",
    "market_cap": "$13.4B",
    "volatility": "Very High (90-120% annually)",
    "analysis": {
      "technical_summary": "ICP shows sharp volatility. Often rallies around announcements of Web3 service launches.",
      "fundamentals": "Internet Computer aims to replace centralized cloud providers with decentralized infrastructure.",
      "sentiment": "Polarizing: enthusiastic supporters vs. skeptics on centralization and execution.",
      "risk_level": "High: Ambitious scope but adoption risk is high."
    }
  },
  {
    "coin": "APT",
    "category": "Layer-1",
    "tags": ["move-language", "scalability", "ecosystem-growth"],
    "current_market_price": "$18.90",
    "market_cap": "$8.7B",
    "volatility": "Very High (85-110% annually)",
    "analysis": {
      "technical_summary": "APT trades with high volatility, often boosted by ecosystem launches. Liquidity still shallow compared to top L1s.",
      "fundamentals": "Aptos is a Move-language based L1 with focus on scalability and developer adoption.",
      "sentiment": "Positive during ecosystem growth, but some skepticism due to heavy VC allocation.",
      "risk_level": "Medium–High: Strong funding but still early stage."
    }
  },
  {
    "coin": "MATIC",
    "category": "Layer-2 / Scaling",
    "tags": ["layer-2", "scaling", "pos", "dapps"],
    "current_market_price": "$1.85",
    "market_cap": "$18.5B",
    "volatility": "High (65-85% annually)",
    "analysis": {
      "technical_summary": "MATIC typically shows steady uptrends during cycles where Ethereum activity and NFT/DeFi usage migrate to L2s. Breakouts are often volume-confirmed; pullbacks tend to find support near prior consolidation zones and moving-average clusters.",
      "fundamentals": "Polygon is a mature scaling solution with a broad suite of products (PoS chain, zk and optimistic tooling). Strong developer adoption and many dApps rely on its lower fees, which supports sustained utility and fee-driven revenue.",
      "sentiment": "Market sentiment is constructive when L2 adoption narratives are strong. Investors view MATIC as a pragmatic play on Ethereum scaling; sentiment weakens if competing L2s capture developer mindshare.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "ARB",
    "category": "Layer-2 / Optimistic Rollup",
    "tags": ["optimistic-rollup", "scaling", "governance", "ethereum"],
    "current_market_price": "$2.15",
    "market_cap": "$8.6B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "ARB shows event-driven volatility—price moves often correlate with mainnet upgrades, TVL inflows, and governance decisions. Technical setups improve with sustained on-chain volume and increased active addresses.",
      "fundamentals": "Arbitrum is a leading optimistic rollup for Ethereum with strong ecosystem traction. Its value is tied to user migration from L1, developer onboarding, and the success of incentive programs that sustain liquidity.",
      "sentiment": "Generally positive among DeFi users and builders focused on lower gas costs; sentiment may cool if bridging friction or security questions arise.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "OP",
    "category": "Layer-2 / Optimism",
    "tags": ["optimistic-rollup", "ethereum", "governance", "infra"],
    "current_market_price": "$3.80",
    "market_cap": "$3.8B",
    "volatility": "High (75-95% annually)",
    "analysis": {
      "technical_summary": "OP tends to follow adoption signals—on-chain transactions, active addresses, and protocol fee capture. Technical momentum often accelerates around governance proposals and subsidy adjustments.",
      "fundamentals": "Optimism focuses on a modular, governance-driven approach and has strong integration with the Ethereum ecosystem. The protocol's success depends on continued dApp migrations and sustainable fee economics.",
      "sentiment": "Constructive within developer and DeFi circles. Market confidence increases with clear roadmap execution and developer incentives.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "ZK",
    "category": "Layer-2 / ZK Rollups (narrative)",
    "tags": ["zk-rollup", "privacy", "scaling", "research"],
    "current_market_price": "$0.85",
    "market_cap": "$3.2B",
    "volatility": "Very High (90-120% annually)",
    "analysis": {
      "technical_summary": "As an umbrella narrative, ZK tokens (projects within this space) are highly event-driven. Price action is typically choppy until reliable production-level zk proofs reduce costs and latency—then technicals can show sustained strength.",
      "fundamentals": "ZK rollups promise strong scaling and privacy benefits; fundamentals hinge on proof efficiency, tooling for developers, and cost-per-transaction improvements that enable mass adoption.",
      "sentiment": "Positive among technologists and builders; retail sentiment may lag until mainstream dApps showcase measurable user benefits.",
      "risk_level": "High"
    }
  },
  {
    "coin": "STX",
    "category": "Layer-1 / Bitcoin-anchored Apps",
    "tags": ["bitcoin-anchored", "smart-contracts", "stacking", "ecosystem"],
    "current_market_price": "$1.44",
    "market_cap": "$2.1B",
    "volatility": "Very High (95-125% annually)",
    "analysis": {
      "technical_summary": "STX price moves are often correlated with Bitcoin cycles and discrete ecosystem milestones (app launches, stacking epochs). Technical patterns can be range-bound but spike during narrative-driven windows.",
      "fundamentals": "Stacks enables smart contracts settled on Bitcoin, offering a differentiated value proposition. Fundamental strength depends on developer adoption and the growth of apps that leverage Bitcoin settlement.",
      "sentiment": "Niche bullishness among builders wanting Bitcoin-native smart contracts; broader market interest is conditional on tangible dApp traction.",
      "risk_level": "High"
    }
  },
  {
    "coin": "UNI",
    "category": "DeFi / DEX Governance",
    "tags": ["dex", "governance", "liquidity", "amm"],
    "current_market_price": "$14.20",
    "market_cap": "$14.2B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "UNI's technical profile frequently mirrors DEX volumes and liquidity trends. Price breakouts are typically associated with governance changes, fee model adjustments, or shifts in market share among DEXs.",
      "fundamentals": "Uniswap remains a leading automated market maker with deep liquidity and protocol-level revenue potential. UNI's long-term value is tied to trading volume, governance utility, and competition from other DEX designs.",
      "sentiment": "Generally positive within DeFi-centric investors; sentiment hinges on Uniswap's ability to retain market share and innovate (e.g., concentrated liquidity improvements).",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "AAVE",
    "category": "DeFi / Lending",
    "tags": ["lending", "borrowing", "governance", "markets"],
    "current_market_price": "$185",
    "market_cap": "$2.8B",
    "volatility": "High (75-95% annually)",
    "analysis": {
      "technical_summary": "AAVE's price often reacts to TVL trends, utilization rates, and protocol parameter changes. Technical strength is best confirmed with rising borrowing demand and liquidity provision.",
      "fundamentals": "Aave is a core lending protocol offering diverse markets and composability with other DeFi primitives. Fundamentals are anchored by fee generation, market share, and the health of collateral assets.",
      "sentiment": "Constructive in expanding DeFi cycles; sentiment turns cautious when macro risk leads to deleveraging or liquidity squeezes.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "CRV",
    "category": "DeFi / Stable AMM",
    "tags": ["stable-swap", "liquidity-incentives", "governance", "ve-tokenomics"],
    "current_market_price": "$0.95",
    "market_cap": "$950M",
    "volatility": "High (80-100% annually)",
    "analysis": {
      "technical_summary": "CRV is sensitive to emission schedules, gauge changes, and veCRV locking behavior. Technical rallies often accompany incentive resets or treasury deployments supporting rewards.",
      "fundamentals": "Curve is central to stablecoin liquidity and yields in DeFi; its governance model and fee capture dynamics are key to long-term value accrual for CRV holders.",
      "sentiment": "Mixed—positive when incentives align and stable-swap volumes rise; skeptical when treasury or emission mechanics face governance contention.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "MKR",
    "category": "DeFi / Stablecoin Governance",
    "tags": ["governance", "stablecoin", "risk-management", "makerdao"],
    "current_market_price": "$2,150",
    "market_cap": "$2.0B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "MKR tends to exhibit measured technical moves tied to stress events in collateral markets, changes in debt ceilings, or DAI peg stress. Traders monitor volatility spikes during systemic events.",
      "fundamentals": "MKR is the governance token for MakerDAO, which underpins DAI. Its fundamentals are deeply linked to the health of DAI, collateral quality, and the protocol's risk management decisions.",
      "sentiment": "Cautiously bullish for those valuing decentralized stablecoins; sentiment can sour quickly during collateral crises or controversial governance moves.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "LDO",
    "category": "Liquid Staking / DeFi",
    "tags": ["liquid-staking", "eth-staking", "rewards", "protocol-fees"],
    "current_market_price": "$3.80",
    "market_cap": "$3.8B",
    "volatility": "High (65-85% annually)",
    "analysis": {
      "technical_summary": "LDO's chart often follows staking demand and ETH yield dynamics; technical momentum increases when liquid staking adoption grows and staking yields remain attractive.",
      "fundamentals": "Lido provides liquid staking for Ethereum and other chains, capturing fees from staking services. Strong market position in liquid staking offers durable demand for the token tied to protocol revenue models.",
      "sentiment": "Generally positive among yield-seeking and DeFi users; regulatory clarity on staking and custody could materially affect sentiment.",
      "risk_level": "Medium"
    }
  },
  {
    "coin": "USDT",
    "category": "Stablecoin",
    "tags": ["stablecoin", "tether", "payment", "reserve-backed"],
    "current_market_price": "$1.0001",
    "market_cap": "$170B",
    "volatility": "Very Low (1-3% annually)",
    "analysis": {
      "technical_summary": "USDT trades at or near $1. Deviations occur during high volatility or liquidity crises but usually revert quickly due to arbitrage.",
      "fundamentals": "Tether is the largest stablecoin, backed by reserves including cash, treasuries, and other assets. It is critical for global crypto liquidity and settlement.",
      "sentiment": "Mixed: traders value USDT's ubiquity, but skeptics focus on reserve transparency concerns.",
      "risk_level": "Low–Medium: Systemically important in crypto but faces regulatory and transparency risks."
    }
  },
  {
    "coin": "USDC",
    "category": "Stablecoin",
    "tags": ["stablecoin", "circle", "regulated", "payment"],
    "current_market_price": "$0.9998",
    "market_cap": "$73.8B",
    "volatility": "Very Low (1-2% annually)",
    "analysis": {
      "technical_summary": "USDC usually maintains its peg tightly with high liquidity. Peg stress may occur during banking disruptions or counterparty risk events.",
      "fundamentals": "Issued by Circle, USDC is widely used in DeFi and exchanges, with reserves in regulated U.S. institutions. It is seen as the most transparent and compliant stablecoin.",
      "sentiment": "Positive among institutions seeking regulatory clarity, though concerns rise when banking partners face stress.",
      "risk_level": "Low: Transparent backing but vulnerable to banking system dependencies."
    }
  },
  {
    "coin": "DAI",
    "category": "Stablecoin / DeFi",
    "tags": ["stablecoin", "decentralized", "makerdao", "crypto-backed"],
    "current_market_price": "$0.9998",
    "market_cap": "$5.36B",
    "volatility": "Very Low (2-4% annually)",
    "analysis": {
      "technical_summary": "DAI maintains a soft peg to the USD, with stability influenced by collateral quality and market volatility. Depegs are rare but occur during severe liquidity shocks.",
      "fundamentals": "DAI is decentralized and backed by crypto collateral via MakerDAO. Its stability relies on governance, collateral diversification, and risk management policies.",
      "sentiment": "Highly respected in DeFi circles; sentiment weakens if collateral reliance on USDC or centralized assets grows.",
      "risk_level": "Medium: Decentralized structure is strong, but collateral composition introduces risks."
    }
  },
  {
    "coin": "TUSD",
    "category": "Stablecoin",
    "tags": ["stablecoin", "regulated", "reserve-backed"],
    "current_market_price": "$1.0002",
    "market_cap": "$500M",
    "volatility": "Low (2-5% annually)",
    "analysis": {
      "technical_summary": "TUSD generally maintains its $1 peg, though liquidity is thinner than USDT or USDC. Peg deviations are more likely in stressed markets.",
      "fundamentals": "TrueUSD is one of the earliest fully reserved stablecoins with third-party attestations. Market share remains smaller than competitors.",
      "sentiment": "Neutral to mildly positive in niche markets; less trusted than USDC or USDT by institutional players.",
      "risk_level": "Medium: Attestations provide transparency, but liquidity depth is limited."
    }
  },
  {
    "coin": "FRAX",
    "category": "Stablecoin / Algorithmic-Hybrid",
    "tags": ["stablecoin", "hybrid", "algorithmic", "decentralized"],
    "current_market_price": "$0.9996",
    "market_cap": "$650M",
    "volatility": "Low-Medium (3-8% annually)",
    "analysis": {
      "technical_summary": "FRAX trades close to $1 but is influenced by collateral ratios and governance mechanisms. Peg stability depends on arbitrage efficiency.",
      "fundamentals": "FRAX is a partially collateralized, algorithmic stablecoin with dynamic collateral ratios. It has grown through integrations in DeFi.",
      "sentiment": "Positive among DeFi innovators, but algorithmic elements create skepticism post-Terra collapse.",
      "risk_level": "Medium–High: Innovative design but riskier than fully backed stablecoins."
    }
  },
  {
    "coin": "FIL",
    "category": "Infrastructure / Storage",
    "tags": ["file-storage", "decentralized", "web3", "infrastructure"],
    "current_market_price": "$12.50",
    "market_cap": "$7.5B",
    "volatility": "High (80-100% annually)",
    "analysis": {
      "technical_summary": "FIL shows cyclical pumps tied to storage deals and ecosystem funding news. Technical resistance forms near prior hype cycle peaks.",
      "fundamentals": "Filecoin provides decentralized file storage and retrieval. Its utility grows with Web3 adoption and institutional partnerships.",
      "sentiment": "Constructive in the Web3 narrative, though critics point to slow real-world adoption.",
      "risk_level": "Medium: Long-term relevance depends on decentralized storage demand."
    }
  },
  {
    "coin": "AR",
    "category": "Infrastructure / Storage",
    "tags": ["permanent-storage", "web3", "data-archiving", "ecosystem"],
    "current_market_price": "$45.80",
    "market_cap": "$3.0B",
    "volatility": "Very High (90-120% annually)",
    "analysis": {
      "technical_summary": "AR trades in strong narrative-driven surges, particularly around NFT and permanent data storage hype cycles.",
      "fundamentals": "Arweave offers permanent data storage with a pay-once model. It is key for NFT permanence and decentralized record-keeping.",
      "sentiment": "Positive when NFTs and Web3 archival demand rise. Neutral in broader market conditions.",
      "risk_level": "Medium: Strong niche use case but adoption remains narrow."
    }
  },
  {
    "coin": "GRT",
    "category": "Middleware / Data Indexing",
    "tags": ["data-indexing", "web3", "infrastructure", "defi"],
    "current_market_price": "$0.85",
    "market_cap": "$8.1B",
    "volatility": "High (75-95% annually)",
    "analysis": {
      "technical_summary": "GRT often tracks developer adoption trends. Price consolidations are common with slow breakouts tied to new integrations.",
      "fundamentals": "The Graph indexes blockchain data for dApps. It is essential infrastructure for querying and analytics across Web3 ecosystems.",
      "sentiment": "Generally positive in developer circles, but retail excitement is muted compared to L1 tokens.",
      "risk_level": "Medium: Infrastructure-critical but not retail-driven."
    }
  },
  {
    "coin": "RUNE",
    "category": "Cross-Chain / DeFi",
    "tags": ["cross-chain", "liquidity", "thorchain", "defi"],
    "current_market_price": "$8.90",
    "market_cap": "$2.9B",
    "volatility": "Very High (90-120% annually)",
    "analysis": {
      "technical_summary": "RUNE's technical trends follow liquidity migration across chains. Strong breakouts occur during ecosystem growth phases.",
      "fundamentals": "Thorchain enables cross-chain swaps without wrapped assets. RUNE is essential for liquidity pools and network security.",
      "sentiment": "Positive when cross-chain demand is high. Sentiment dips during exploits or downtime.",
      "risk_level": "Medium–High: Innovative but exposed to technical complexity and exploit risk."
    }
  },
  {
    "coin": "LINK",
    "category": "Middleware / Oracles",
    "tags": ["oracles", "data-feeds", "defi", "infrastructure"],
    "current_market_price": "$26.80",
    "market_cap": "$16.1B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "LINK trades in cycles with DeFi adoption, often outperforming during new oracle service launches and partnerships.",
      "fundamentals": "Chainlink is the leading decentralized oracle provider, critical for connecting smart contracts with off-chain data.",
      "sentiment": "Widely respected as a critical middleware layer; community sentiment is consistently strong.",
      "risk_level": "Medium: Essential service but competition and scaling could pressure adoption."
    }
  },
  {
    "coin": "DOGE",
    "category": "Memecoin",
    "tags": ["memecoin", "payment", "dog-themed", "community"],
    "current_market_price": "$0.203",
    "market_cap": "$30.2B",
    "volatility": "Very High (85-110% annually)",
    "analysis": {
      "technical_summary": "DOGE trades in strong speculative waves, often triggered by social media or celebrity endorsements. Technically, it tends to form long consolidation ranges followed by explosive breakouts.",
      "fundamentals": "Originally a joke coin, DOGE has grown into a widely recognized digital asset with limited technical differentiation but strong community and payment use cases.",
      "sentiment": "Highly sentiment-driven. Positive during retail hype cycles and Elon Musk references; fades quickly in risk-off environments.",
      "risk_level": "High: Strong community but lacks fundamental adoption drivers."
    }
  },
  {
    "coin": "SHIB",
    "category": "Memecoin",
    "tags": ["memecoin", "deflationary", "ecosystem", "dog-themed"],
    "current_market_price": "$0.000031",
    "market_cap": "$18.2B",
    "volatility": "Very High (95-125% annually)",
    "analysis": {
      "technical_summary": "SHIB follows a pump-and-consolidate pattern, with liquidity spikes during ecosystem launches or burns. It often mirrors DOGE's sentiment trends.",
      "fundamentals": "Shiba Inu started as a meme but has expanded into DeFi, NFTs, and a growing ecosystem (Shibarium L2). Tokenomics include a deflationary burn mechanism.",
      "sentiment": "Positive when the ecosystem narrative grows. Criticized as overly speculative by skeptics.",
      "risk_level": "High: Ecosystem expansion helps fundamentals, but still largely sentiment-driven."
    }
  },
  {
    "coin": "FLOKI",
    "category": "Memecoin",
    "tags": ["memecoin", "dog-themed", "community", "marketing-driven"],
    "current_market_price": "$0.00042",
    "market_cap": "$4.0B",
    "volatility": "Very High (100-130% annually)",
    "analysis": {
      "technical_summary": "FLOKI tends to rally during aggressive marketing pushes. Price action is highly volatile with rapid drawdowns after spikes.",
      "fundamentals": "Community-driven token with heavy focus on branding and viral marketing. Ecosystem expansion efforts exist but remain secondary to meme power.",
      "sentiment": "Positive among meme traders; neutral-to-skeptical in broader crypto circles.",
      "risk_level": "High: Relies heavily on retail hype and marketing cycles."
    }
  },
  {
    "coin": "PEPE",
    "category": "Memecoin",
    "tags": ["memecoin", "pepe", "viral", "community"],
    "current_market_price": "$0.0000195",
    "market_cap": "$8.2B",
    "volatility": "Extreme (120-150% annually)",
    "analysis": {
      "technical_summary": "PEPE exhibits extreme volatility, with parabolic rallies followed by deep retracements. Liquidity depth improves during bull cycles but remains thin overall.",
      "fundamentals": "A viral meme token themed around the internet's Pepe character. No significant technical fundamentals, driven almost entirely by cultural resonance.",
      "sentiment": "Extremely hype-driven; community is passionate but external investors view it as speculative.",
      "risk_level": "High: Meme culture sustains value, but fundamentals are weak."
    }
  },
  {
    "coin": "WIF",
    "category": "Memecoin",
    "tags": ["memecoin", "dog-themed", "solana", "viral"],
    "current_market_price": "$3.45",
    "market_cap": "$3.4B",
    "volatility": "Extreme (110-140% annually)",
    "analysis": {
      "technical_summary": "WIF follows Solana ecosystem liquidity flows. Chart shows sharp rallies during Solana narratives, with high beta compared to other meme coins.",
      "fundamentals": "Solana-native meme token with strong traction in 2024–25. Its fundamentals rely on Solana's ecosystem momentum and meme virality.",
      "sentiment": "Very positive in Solana communities; rising retail attention due to cultural resonance.",
      "risk_level": "High: Meme-driven and ecosystem-dependent."
    }
  },
  {
    "coin": "FRIEND",
    "category": "Social Token",
    "tags": ["socialfi", "friendtech", "community", "influencer"],
    "current_market_price": "$1.85",
    "market_cap": "$185M",
    "volatility": "Extreme (130-160% annually)",
    "analysis": {
      "technical_summary": "FRIEND trades in bursts of liquidity tied to Friend.tech usage cycles. Illiquid outside hype waves; price action is sentiment-dominant.",
      "fundamentals": "Friend.tech's governance/community token, centered on tokenizing social connections and influencer access. Still early-stage in utility.",
      "sentiment": "Excited within SocialFi believers; broader market cautious due to uncertain sustainability.",
      "risk_level": "High: Niche but innovative social experiment with adoption uncertainty."
    }
  },
  {
    "coin": "ANIME",
    "category": "Culture / Meme",
    "tags": ["memecoin", "anime-themed", "culture", "community"],
    "current_market_price": "$0.12",
    "market_cap": "$120M",
    "volatility": "Extreme (140-170% annually)",
    "analysis": {
      "technical_summary": "ANIME tends to spike around community campaigns and online cultural references. Technical moves are erratic and speculative.",
      "fundamentals": "Token tied to anime culture and memes. Primarily speculative with no strong protocol-level fundamentals.",
      "sentiment": "Positive among niche communities aligned with anime fandom. Broader market sees it as speculative.",
      "risk_level": "High: Strong cultural resonance but limited fundamental backing."
    }
  },
  {
    "coin": "BRETT",
    "category": "Culture / Meme",
    "tags": ["memecoin", "culture", "viral", "community"],
    "current_market_price": "$0.185",
    "market_cap": "$1.85B",
    "volatility": "Extreme (120-150% annually)",
    "analysis": {
      "technical_summary": "BRETT follows pump cycles common to meme assets. Chart behavior is irregular, with liquidity spikes during viral social media attention.",
      "fundamentals": "Community token inspired by internet culture. Utility is minimal; value accrual depends on memes and culture adoption.",
      "sentiment": "Positive among holders and meme traders, neutral in the broader investor base.",
      "risk_level": "High: Purely narrative-driven."
    }
  },
  {
    "coin": "BONK",
    "category": "Memecoin",
    "tags": ["memecoin", "dog-themed", "solana", "community"],
    "current_market_price": "$0.000045",
    "market_cap": "$3.2B",
    "volatility": "Extreme (110-140% annually)",
    "analysis": {
      "technical_summary": "BONK tends to move alongside Solana ecosystem liquidity. Price spikes occur during Solana rallies or exchange listings.",
      "fundamentals": "Solana-based meme token with active community and heavy social media presence. Utility is minimal beyond speculation.",
      "sentiment": "Very positive among Solana supporters; speculative elsewhere.",
      "risk_level": "High: Meme-driven with ecosystem dependency."
    }
  },
  {
    "coin": "WOJAK",
    "category": "Culture / Meme",
    "tags": ["memecoin", "wojak", "culture", "community"],
    "current_market_price": "$0.00085",
    "market_cap": "$85M",
    "volatility": "Extreme (150-180% annually)",
    "analysis": {
      "technical_summary": "WOJAK trades in speculative bursts tied to meme popularity. Charts show strong volatility with low liquidity at times.",
      "fundamentals": "Based on the Wojak meme, it has cultural but not technological or financial fundamentals. Driven purely by meme cycles.",
      "sentiment": "Enthusiastic among internet culture participants, largely ignored by institutional traders.",
      "risk_level": "High: Dependent on meme relevance."
    }
  },
  {
    "coin": "XMR",
    "category": "Privacy",
    "tags": ["privacy", "fungibility", "mining", "censorship-resistant"],
    "current_market_price": "$185",
    "market_cap": "$3.4B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "XMR generally trades in cycles, with long consolidations and sudden surges during privacy debates or regulatory crackdowns.",
      "fundamentals": "Monero is the leading privacy-focused cryptocurrency, offering strong anonymity via ring signatures and stealth addresses. Widely used for privacy-preserving transactions.",
      "sentiment": "Positive among privacy advocates; negative among regulators and centralized exchanges due to compliance concerns.",
      "risk_level": "Medium–High: Strong niche demand, but heavy regulatory risk."
    }
  },
  {
    "coin": "ZEC",
    "category": "Privacy",
    "tags": ["privacy", "zk-snarks", "censorship-resistant"],
    "current_market_price": "$58",
    "market_cap": "$890M",
    "volatility": "High (80-100% annually)",
    "analysis": {
      "technical_summary": "ZEC tends to underperform broader markets but rallies when privacy narratives regain attention.",
      "fundamentals": "Zcash pioneered zk-SNARK privacy technology, offering optional shielded transactions. Adoption is lower compared to Monero but technologically advanced.",
      "sentiment": "Mixed: admired for innovation, but adoption remains limited.",
      "risk_level": "Medium–High: Technology strong, adoption weak."
    }
  },
  {
    "coin": "DASH",
    "category": "Payments / Privacy Hybrid",
    "tags": ["payments", "privacy", "masternodes", "digital cash"],
    "current_market_price": "$42",
    "market_cap": "$480M",
    "volatility": "High (75-95% annually)",
    "analysis": {
      "technical_summary": "DASH shows cyclical trading patterns, with spikes in regions where crypto payments gain traction.",
      "fundamentals": "Dash markets itself as 'digital cash,' with masternodes and optional privacy features. It has payment adoption in certain geographies.",
      "sentiment": "Positive among merchants in LATAM/Africa; neutral elsewhere.",
      "risk_level": "Medium: Adoption-focused but declining visibility."
    }
  },
  {
    "coin": "OKB",
    "category": "Exchange Token",
    "tags": ["exchange-token", "utility", "trading-fee-discount"],
    "current_market_price": "$68",
    "market_cap": "$4.1B",
    "volatility": "Medium-High (55-75% annually)",
    "analysis": {
      "technical_summary": "OKB often moves in sync with OKX exchange volumes and ecosystem growth. Price shows resilience compared to other exchange tokens.",
      "fundamentals": "Utility token for the OKX exchange ecosystem, offering trading fee discounts, staking, and ecosystem participation.",
      "sentiment": "Positive within OKX's user base; neutral elsewhere.",
      "risk_level": "Medium: Exchange dependency risk."
    }
  },
  {
    "coin": "HT",
    "category": "Exchange Token",
    "tags": ["exchange-token", "utility", "ecosystem"],
    "current_market_price": "$8.50",
    "market_cap": "$850M",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "HT follows Huobi's business cycles. Volatility increases during exchange rebranding or regulatory news.",
      "fundamentals": "Huobi Token powers Huobi exchange ecosystem with fee discounts, staking, and participation rights. Exchange rebranding impacts adoption.",
      "sentiment": "Mixed: loyal community, but skepticism due to regulatory concerns.",
      "risk_level": "Medium–High: Exchange risk concentrated."
    }
  },
  {
    "coin": "KCS",
    "category": "Exchange Token",
    "tags": ["exchange-token", "revenue-sharing", "staking"],
    "current_market_price": "$18.50",
    "market_cap": "$1.9B",
    "volatility": "High (65-85% annually)",
    "analysis": {
      "technical_summary": "KCS trades with KuCoin activity levels. Price tends to surge during bull runs due to profit-sharing tokenomics.",
      "fundamentals": "KuCoin Shares distribute exchange profits back to holders, making it a quasi-equity-style token.",
      "sentiment": "Positive among KuCoin users; cautious among institutional investors.",
      "risk_level": "Medium: Innovative tokenomics but tied to exchange health."
    }
  },
  {
    "coin": "BGB",
    "category": "Exchange Token",
    "tags": ["exchange-token", "utility", "ecosystem"],
    "current_market_price": "$3.20",
    "market_cap": "$4.5B",
    "volatility": "Medium-High (60-80% annually)",
    "analysis": {
      "technical_summary": "BGB follows Bitget's growth trajectory. Technical moves are smoother compared to smaller exchange tokens.",
      "fundamentals": "Bitget Token provides trading benefits, staking, and participation in Bitget's ecosystem. Growing steadily as the exchange expands.",
      "sentiment": "Positive within Bitget's user base; neutral in broader markets.",
      "risk_level": "Medium: Dependent on Bitget's long-term success."
    }
  },
  {
    "coin": "CRO",
    "category": "Exchange Token",
    "tags": ["exchange-token", "payments", "crypto-com"],
    "current_market_price": "$0.42",
    "market_cap": "$11.0B",
    "volatility": "High (70-90% annually)",
    "analysis": {
      "technical_summary": "CRO trades with Crypto.com's adoption cycles. Saw large rallies during marketing campaigns, followed by corrections.",
      "fundamentals": "Crypto.com's utility token powers its app, card, and ecosystem. One of the more mainstream exchange tokens with payment integration.",
      "sentiment": "Positive among retail users; neutral among advanced investors.",
      "risk_level": "Medium: Strong branding, but business model still maturing."
    }
  },
  {
    "coin": "GT",
    "category": "Exchange Token",
    "tags": ["exchange-token", "utility", "gate-io"],
    "current_market_price": "$14.80",
    "market_cap": "$1.4B",
    "volatility": "High (65-85% annually)",
    "analysis": {
      "technical_summary": "GT moves in line with Gate.io's trading activity. Volatility is moderate compared to meme coins but exchange-driven.",
      "fundamentals": "GateToken provides utility in the Gate.io ecosystem, offering discounts and participation rights.",
      "sentiment": "Generally positive within Gate.io community, lesser known outside it.",
      "risk_level": "Medium: Moderate adoption but exchange-tied risks."
    }
  }
];

export default coins;