"use client";

const jobs = [
  {
    title: "Security Analyst",
    desc: "Safeguard our platform by identifying vulnerabilities, conducting regular smart contract audits, and collaborating with engineers to implement robust security measures. You will play a critical role in protecting user assets and maintaining the integrity of our infrastructure.\n\nWe seek someone with deep blockchain security expertise, a proactive approach to risk management, and the ability to educate the team on emerging threats and best practices.",
  },
  {
    title: "Backend Developer",
    desc: "Design and build scalable backend systems to support high-performance trading and liquidity management. You will architect APIs, optimize database queries, and ensure the reliability and speed of our core services.\n\nIdeal candidates have experience with Node.js, TypeScript, and cloud infrastructure, and thrive in a fast-paced, collaborative environment where robust solutions are essential.",
  },
  {
    title: "Frontend Engineer",
    desc: "Create beautiful, intuitive user interfaces that make liquidity provisioning seamless for our users. You will work closely with designers and backend engineers to deliver responsive, accessible experiences across devices.\n\nWe value expertise in React, Next.js, and modern CSS frameworks, as well as a passion for user-centric design and attention to detail.",
  },
  {
    title: "DevOps Engineer",
    desc: "Automate deployments and optimize our cloud infrastructure for reliability and scalability. You will manage CI/CD pipelines, monitor system health, and respond to incidents to ensure smooth operations.\n\nExperience with cloud providers (AWS, GCP, or Azure), containerization, and infrastructure as code is highly valued. Your work will empower our team to ship quickly and maintain high uptime.",
  },
  {
    title: "Product Manager",
    desc: "Drive the product vision and coordinate development across teams. You will gather user feedback, define requirements, and prioritize features to deliver maximum value to our community.\n\nStrong communication skills, a data-driven mindset, and experience in fintech or blockchain products are highly valued. You will be the bridge between users, engineers, and stakeholders.",
  },
  {
    title: "Solana Smart Contract Engineer",
    desc: "Develop and audit Solana programs that power our liquidity pools. You will write secure, efficient code and collaborate with auditors to ensure best practices are followed.\n\nWe seek candidates with experience in Rust, Solana development, and smart contract security. Your work will be critical to the success and safety of our platform.",
  },
  {
    title: "Data Analyst",
    desc: "Leverage data to uncover insights that drive product and business decisions. You will analyze user behavior, platform performance, and market trends to help our team make informed choices.\n\nIdeal candidates are skilled in SQL, data visualization, and statistical analysis, and can communicate findings clearly to both technical and non-technical stakeholders.",
  },
  {
    title: "Financial Auditor",
    desc: "Oversee and audit the financial operations of our platform, ensuring accuracy, compliance, and transparency in all transactions and reporting. You will review financial statements, monitor fund flows, and assess risk to safeguard the integrity of our financial systems.\n\nIdeal candidates have experience in financial auditing, a strong understanding of crypto asset management, and a commitment to upholding the highest standards of accountability and trust.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          We are hiring!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
          Join Deep Protocol and help build the future of open liquidity on
          Solana.
        </p>
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {job.desc}
                </p>
              </div>
              <a
                href={`mailto:carreer@deep-protocol.fun?subject=Application for ${encodeURIComponent(
                  job.title
                )}`}
                target="_blank"
                rel="noopener"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-center w-[150px]"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
