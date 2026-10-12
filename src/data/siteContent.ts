export const sectionOrder = [
  'home',
  'about',
  'tools',
  'experience',
  'projects',
  'contact',
] as const

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location: string
  summary: string
  shortImpact: string
  highlights: string[]
  technologies: string[]
  tenures?: ExperienceItem[]
  current?: boolean
}

export interface Project {
  name: string
  kicker: string
  year: string
  description: string
  image: string
  imageAlt: string
  imageWidth?: number
  imageHeight?: number
  stack: string[]
  links: Array<{ label: string; href: string }>
}

export const portfolioContent = {
  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'tools', label: 'Tools' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Work' },
    { id: 'contact', label: 'Contact' },
  ] as const,
  hero: {
    kicker: 'Full-stack engineer',
    intro: 'Hello, I’m Justin Yang.',
    summary: 'I’m a full-stack engineer, mostly on the backend. I like building apps and seeing people use them.',
    badges: ['Amazon', 'Tesla', 'Capital One', 'Riot Games', 'React Native'],
  },
  experience: [
  {
    "company": "Amazon",
    "role": "Software Engineer",
    "period": "Jun 2025 - Present",
    "location": "New York City, NY",
    "current": true,
    "summary": "Building distributed systems, agentic analysis, and compliance infrastructure for the Amazon Associates ecosystem.",
    "shortImpact": "Automated fraud detection for Creators Affiliate program",
    "highlights": [
      "Built a distributed crawler on ECS Fargate processing 20K URLs a day, covering 1.15M+ Associate sites per quarter and addressing a $3.4M enforcement gap.",
      "Launched an agentic analysis pipeline across 300+ publisher sites, cutting manual review from 30 minutes to under 5 minutes per publisher.",
      "Designed agentic search that extracts relevant content at 60 URLs per site per minute.",
      "Re-architected enforcement notifications for up to 400K accounts across 30+ locales and 15 languages, with automated deadlines and self-remediation guidance.",
      "Improved reliability with JDK 21, cross-region E2E tests, and CloudWatch logging across five services; CI/CD automation saved five developer-weeks per year.",
      "Mentored a summer intern through scoping, design, and code review to ship an AI-powered creator compliance assistant."
    ],
    "technologies": [
      "Java",
      "Python",
      "TypeScript",
      "AWS",
      "ECS Fargate",
      "CloudWatch",
      "CI/CD"
    ]
  },
  {
    "company": "Tesla",
    "role": "Software Engineer Intern",
    "period": "Aug 2024 - Dec 2024",
    "location": "Fremont, CA",
    "summary": "Building a faster, clearer mobile experience for Tesla employees around the world.",
    "shortImpact": "Inside Tesla employee app used by 120,000",
    "highlights": [
      "Core contributor to the React Native redesign of Inside Tesla, used by 120,000+ employees.",
      "Built an employee recognition system handling 7K events per hour and a task management interface for employee logistics.",
      "Reduced image sizes by 95% with Cloudinary CDN, improving content load times."
    ],
    "technologies": [
      "React Native",
      "TypeScript",
      "Cloudinary"
    ]
  },
  {
    "company": "Capital One",
    "role": "Software Engineer Intern",
    "period": "Jun 2024 - Aug 2024 · Jun 2023 - Aug 2023",
    "location": "Plano, TX | Chicago, IL",
    "summary": "Two summers building decisioning tools and event-driven payment infrastructure.",
    "shortImpact": "33% faster E2E tests",
    "highlights": [
      "Built a full-stack debugging platform that cut E2E testing from 60 to 40 minutes, saving an estimated $67,000 per month.",
      "Integrated and enriched data from 17 internal APIs to surface downstream decisioning state.",
      "Built a React Query interface to visualize key fields and metadata across downstream services."
    ],
    "technologies": [
      "Go",
      "React",
      "TypeScript",
      "React Query"
    ],
    "tenures": [
      {
        "company": "Capital One",
        "role": "Software Engineer Intern",
        "period": "Jun 2024 - Aug 2024",
        "location": "Chicago, IL",
        "summary": "Full-stack debugging for credit card application decisioning.",
        "shortImpact": "Full-stack tool for credit card decisioning E2E tests",
        "highlights": [
          "Built a full-stack debugging platform that cut E2E testing from 60 to 40 minutes, saving an estimated $67,000 per month.",
          "Integrated and enriched data from 17 internal APIs to surface downstream decisioning state.",
          "Built a React Query interface to visualize key fields and metadata across downstream services."
        ],
        "technologies": [
          "Go",
          "React",
          "TypeScript",
          "React Query"
        ]
      },
      {
        "company": "Capital One",
        "role": "Software Engineer Intern",
        "period": "Jun 2023 - Aug 2023",
        "location": "Plano, TX",
        "summary": "Event-driven payment integrations and production-minded testing.",
        "shortImpact": "External Event Gateway for real-time payment data processing and enrichment",
        "highlights": [
          "Built AWS EventBridge and SQS flows for payment event processing.",
          "Achieved full test coverage for SQS event files with Python unit tests.",
          "Configured deployment paths across development, QA, performance, and production environments."
        ],
        "technologies": [
          "AWS Lambda",
          "EventBridge",
          "SQS",
          "Python",
          "YAML"
        ]
      }
    ]
  },
  {
    "company": "Riot Games",
    "role": "Software Engineer Intern (Co-op)",
    "period": "Jan 2023 - Dec 2023",
    "location": "Ann Arbor, MI",
    "summary": "Security monitoring that makes policy changes, violations, and metrics easier to act on.",
    "shortImpact": "Real-time security monitoring",
    "highlights": [
      "Developed a scalable security monitoring system to detect policy-violating changes across network infrastructure.",
      "Built automated pipelines aggregating security events and metrics from internal databases into engineering dashboards.",
      "Built an interface for managing policy rules and reviewing violation history, with real-time Slack alerts."
    ],
    "technologies": [
      "Go",
      "React",
      "TypeScript",
      "Slack"
    ]
  },
  {
    "company": "Fama Technologies",
    "role": "Software Engineer Intern",
    "period": "Jun 2022 - Aug 2022",
    "location": "Remote",
    "summary": "Internal administration tools built around clear permissions and maintainable workflows.",
    "shortImpact": "RBAC administration platform",
    "highlights": [
      "Built a roles and permissions management system with Next.js and TypeScript.",
      "Integrated Node.js APIs with Auth0 management workflows.",
      "Documented the platform for future maintainers."
    ],
    "technologies": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Auth0"
    ]
  }
] as ExperienceItem[],
  projects: [
    {
      name: 'Rent Bid',
      kicker: 'Real-time web app',
      year: 'Jul 2026',
      description:
        'A real-time app I built to help roommates split rent fairly through live bedroom auctions. Hosts set up the apartment, upload room photos, and invite roommates by code. Timed bidding rounds automatically finalize room assignments and balance the rent.',
      image: '/images/projects/rent-bid.png',
      imageAlt: 'Rent Bid web app with forms to create a bidding room or join by room code',
      imageWidth: 2866,
      imageHeight: 1608,
      stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Zod', 'Vercel', 'Vitest'],
      links: [{ label: 'Website', href: 'https://rent-bid.vercel.app/' }],
    },
    {
      name: 'EZ Routine',
      kicker: 'Mobile product',
      year: '2024',
      description:
        'A workout planning and tracking app inspired by the friction of maintaining routines manually. The product direction is simple on the surface, but built around repeat usage and clean progress management.',
      image: '/images/projects/ez-routine.png',
      imageAlt: 'EZ Routine mobile app preview',
      stack: ['React Native', 'Expo', 'SQLite', 'React Query'],
      links: [{ label: 'GitHub', href: 'https://github.com/yangjus/ez-routine' }],
    },
    {
      name: 'MonopolyGO! Trading',
      kicker: 'Full-stack product',
      year: '2023',
      description:
        'A trading platform that matches MonopolyGO! players more efficiently than the manual systems players usually rely on. The product has seen more than 750 registrations and is still maintained.',
      image: '/images/projects/mgo-trading.png',
      imageAlt: 'MonopolyGO! Trading app screenshot',
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Material UI', 'MongoDB', 'Mongoose', 'AWS Amplify'],
      links: [
        { label: 'Website', href: 'https://www.mgo-trading.com/' },
        { label: 'GitHub', href: 'https://github.com/yangjus/monopoly-go' },
      ],
    },
    {
      name: 'ELEMENT Data Search',
      kicker: 'Research tooling',
      year: '2023',
      description:
        'A volunteer-built search platform for Michigan School of Public Health researchers, helping teams surface metadata from health studies and navigate unstructured documents more efficiently.',
      image: '/images/projects/element-data-search.png',
      imageAlt: 'ELEMENT Data Search platform screenshot',
      stack: ['Vue', 'PrimeVue', 'JavaScript', 'Python', 'SQLite'],
      links: [
        { label: 'Platform', href: 'https://umich-db.github.io/element-data-sharing/#/' },
        { label: 'GitHub', href: 'https://github.com/umich-db/element-data-sharing' },
      ],
    },
    {
      name: 'ZenStock',
      kicker: 'Hackathon winner',
      year: '2023',
      description:
        'A stock recommendation concept built at MHacks 16 that experimented with financial sentiment analysis through Hugging Face models and won third place in the finance track.',
      image: '/images/projects/zenstock.png',
      imageAlt: 'ZenStock project screenshot',
      stack: ['React', 'Python', 'PyTorch', 'Hugging Face', 'Material UI'],
      links: [
        { label: 'Devpost', href: 'https://devpost.com/software/zenstock' },
        { label: 'GitHub', href: 'https://github.com/yangjus/zen-stock' },
      ],
    },
    {
      name: 'Legacy Portfolio',
      kicker: 'Original site',
      year: '2024',
      description:
        'The current GitHub Pages portfolio built with vanilla HTML, CSS, and JavaScript. This new prototype intentionally keeps it live while exploring a much more ambitious visual and architectural direction.',
      image: '/images/projects/personal-website.png',
      imageAlt: 'Original personal website screenshot',
      stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
      links: [
        { label: 'Website', href: 'https://yangjus.github.io/' },
        { label: 'GitHub', href: 'https://github.com/yangjus/yangjus.github.io' },
      ],
    },
  ] as Project[],
  about: {
    overview:
      'I’m a software engineer in New York, currently at Amazon. I like working across the whole product process, from figuring out what to build to shipping it and improving it.',
    interests:
      'Along the way, I help with technical decisions, work with stakeholders to understand what matters, and keep communication clear so the team can move forward together.',
    toolkit: [
  {
    "title": "Languages",
    "items": [
      "Java",
      "Python",
      "TypeScript",
      "JavaScript",
      "Go",
      "C++",
      "SQL",
      "R",
      "HTML / CSS"
    ]
  },
  {
    "title": "Web & mobile",
    "items": [
      "React",
      "React Native",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
      "Material UI",
      "PrimeVue",
      "Expo"
    ]
  },
  {
    "title": "Backend & data",
    "items": [
      "Node.js",
      "Supabase",
      "PostgreSQL",
      "Zod",
      "Flask",
      "MongoDB",
      "MySQL",
      "SQLite",
      "DynamoDB",
      "Mongoose",
      "React Query"
    ]
  },
  {
    "title": "Cloud infrastructure",
    "items": [
      "AWS",
      "ECS Fargate",
      "Lambda",
      "SQS",
      "S3",
      "Step Functions",
      "EventBridge",
      "Vercel"
    ]
  },
  {
    "title": "Delivery & tools",
    "items": [
      "CloudWatch",
      "Docker",
      "CI/CD",
      "E2E testing",
      "Vitest",
      "Git",
      "JDK 21",
      "Figma",
      "Tableau"
    ]
  },
  {
    "title": "AI & integrations",
    "items": [
      "Agentic workflows",
      "Hugging Face",
      "PyTorch",
      "WebSockets",
      "JWT authentication",
      "Auth0",
      "Cloudinary",
      "REST APIs"
    ]
  }
],
  },
  links: {
    github: 'https://github.com/yangjus',
    linkedin: 'https://www.linkedin.com/in/justin-yang-2021/',
    medium: 'https://medium.com/@justiny_2013',
    legacySite: 'https://yangjus.github.io/',
  },
}

export const companyProfiles = [
  { name: 'Amazon', mark: 'amazon', href: 'https://www.amazon.com/' },
  { name: 'Tesla', mark: 'tesla', href: 'https://www.tesla.com/' },
  { name: 'Capital One', mark: 'capital', href: 'https://www.capitalone.com/' },
  { name: 'Riot Games', mark: 'riot', href: 'https://www.riotgames.com/' },
  { name: 'Fama Technologies', mark: 'fama', href: 'https://fama.io/' },
] as const;
