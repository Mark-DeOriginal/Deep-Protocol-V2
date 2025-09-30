"use client";

import { Briefcase, MapPin, Clock, TrendingUp, Code, Palette, Users, Shield, Rocket, Gem, Star } from 'lucide-react';

const jobs = [
  {
    title: "Solana Smart Contract Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    icon: Shield,
    description: "Build the core infrastructure powering Deep Protocol's liquidity pools and aggregation engine on Solana.",
    responsibilities: [
      "Develop and audit Solana programs for liquidity pool management and yield optimization",
      "Design secure, gas-efficient smart contracts for automated liquidity provisioning",
      "Collaborate with security auditors to ensure best practices and vulnerability-free code",
      "Optimize on-chain operations for maximum capital efficiency and user returns",
      "Implement innovative DeFi mechanisms for impermanent loss mitigation"
    ],
    requirements: [
      "3+ years of Rust programming experience",
      "2+ years building Solana programs or similar blockchain smart contracts",
      "Deep understanding of DeFi primitives (AMMs, liquidity pools, yield farming)",
      "Experience with security audits and formal verification",
      "Strong knowledge of Solana's runtime, accounts model, and program architecture"
    ],
    niceToHave: [
      "Contributions to major DeFi protocols on Solana",
      "Experience with Anchor framework",
      "Background in cryptography or formal methods"
    ]
  },
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    icon: Palette,
    description: "Craft beautiful, intuitive interfaces that make complex DeFi accessible to everyone.",
    responsibilities: [
      "Build and maintain the Deep Protocol aggregator dashboard using React and Next.js",
      "Design responsive, accessible UI components for liquidity pool management",
      "Integrate real-time data from Raydium, Orca, and other Solana DEXs",
      "Implement advanced data visualization for APR trends, risk metrics, and pool analytics",
      "Optimize performance for smooth user experience with large datasets"
    ],
    requirements: [
      "5+ years of frontend development experience",
      "Expert-level proficiency in React, Next.js 15+, and TypeScript",
      "Strong understanding of Web3 wallet integration (Phantom, Solflare)",
      "Experience building financial dashboards or data-heavy applications",
      "Deep knowledge of modern CSS, Tailwind, and responsive design"
    ],
    niceToHave: [
      "Experience with DeFi protocols or crypto exchanges",
      "Knowledge of Solana Web3.js or similar blockchain libraries",
      "Background in data visualization (D3.js, Recharts)"
    ]
  },
  {
    title: "DeFi Product Manager",
    department: "Product",
    location: "Remote / Hybrid",
    type: "Full-time",
    level: "Mid to Senior",
    icon: Users,
    description: "Drive the product vision for the next generation of liquidity provisioning on Solana.",
    responsibilities: [
      "Define and prioritize features for Deep Protocol's aggregator and yield optimization tools",
      "Gather insights from DeFi users, LPs, and market makers to shape product roadmap",
      "Collaborate with engineering, design, and business teams to deliver user-centric features",
      "Analyze on-chain data and user behavior to identify opportunities and pain points",
      "Communicate product updates, releases, and metrics to stakeholders and community"
    ],
    requirements: [
      "3+ years of product management experience, preferably in fintech or blockchain",
      "Deep understanding of DeFi mechanisms, liquidity provisioning, and yield farming",
      "Strong analytical skills and experience with data-driven decision making",
      "Excellent communication and stakeholder management abilities",
      "Proven track record of shipping successful products in fast-paced environments"
    ],
    niceToHave: [
      "Active DeFi user or liquidity provider",
      "Experience with Solana ecosystem protocols",
      "Technical background in software engineering"
    ]
  },
  {
    title: "Backend Engineer (DeFi Infrastructure)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Mid to Senior",
    icon: Code,
    description: "Build scalable backend systems to power real-time liquidity aggregation and yield optimization.",
    responsibilities: [
      "Design and implement APIs for pool aggregation, risk scoring, and yield analytics",
      "Build real-time data pipelines to ingest pool data from multiple Solana DEXs",
      "Develop caching and optimization strategies for sub-second response times",
      "Implement backend services for user portfolio tracking and notifications",
      "Ensure high availability and reliability of critical infrastructure"
    ],
    requirements: [
      "4+ years of backend development experience with Node.js or similar",
      "Strong proficiency in TypeScript, PostgreSQL, and RESTful API design",
      "Experience with real-time data processing and WebSocket implementations",
      "Knowledge of cloud infrastructure (AWS, GCP) and containerization (Docker)",
      "Understanding of blockchain RPC nodes and on-chain data indexing"
    ],
    niceToHave: [
      "Experience building crypto trading or DeFi platforms",
      "Familiarity with Solana RPC methods and on-chain program data",
      "Background in high-frequency or algorithmic trading systems"
    ]
  }
];

const perks = [
  { icon: TrendingUp, title: "Competitive Compensation", description: "Top-tier salary + token allocations" },
  { icon: MapPin, title: "Remote-First", description: "Work from anywhere in the world" },
  { icon: Clock, title: "Flexible Hours", description: "Async collaboration, own your schedule" },
  { icon: Briefcase, title: "Growth Opportunities", description: "Learn cutting-edge DeFi tech" }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Join Deep Protocol
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Help us build the future of liquidity provisioning on Solana.
            We're looking for talented individuals passionate about DeFi and innovation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-purple-500" />
              <span>Backed by leading investors</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center space-x-2">
              <Gem className="w-5 h-5 text-blue-500" />
              <span>Building for millions of users</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-orange-500" />
              <span>Making DeFi accessible</span>
            </span>
          </div>
        </div>

        {/* Perks */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Deep Protocol?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div 
                  key={perk.title}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Open Positions ({jobs.length})
          </h2>
          
          <div className="space-y-6">
            {jobs.map((job) => {
              const Icon = job.icon;
              return (
                <div
                  key={job.title}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  {/* Job Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.department}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.type}</span>
                          </span>
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs font-medium">
                            {job.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`mailto:careers@deep-protocol.fun?subject=Application for ${encodeURIComponent(job.title)}`}
                      target="_blank"
                      rel="noopener"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-center whitespace-nowrap"
                    >
                      Apply Now
                    </a>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                    {job.description}
                  </p>

                  {/* Responsibilities */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      What You'll Do:
                    </h4>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      What We're Looking For:
                    </h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                          <span className="text-gray-600 dark:text-gray-400">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nice to Have */}
                  {job.niceToHave && job.niceToHave.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        Nice to Have:
                      </h4>
                      <ul className="space-y-1">
                        {job.niceToHave.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <span className="text-blue-500 mt-0.5 flex-shrink-0">+</span>
                            <span className="text-blue-700 dark:text-blue-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Don't see the perfect role?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            We're always looking for exceptional talent. Send us your resume and tell us how you can contribute to Deep Protocol.
          </p>
          <a
            href="mailto:careers@deep-protocol.fun?subject=General Application"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Send General Application
          </a>
        </div>

        {/* Culture Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deep Protocol is an equal opportunity employer. We celebrate diversity and are committed to creating 
            an inclusive environment for all employees. We welcome applications from all qualified candidates 
            regardless of race, color, religion, gender, sexual orientation, national origin, age, disability, 
            or veteran status.
          </p>
        </div>
      </div>
    </div>
  );
}