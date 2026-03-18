import { DepartmentModule } from '@/lib/types/department';

export const DEPARTMENT_MODULES: Record<string, DepartmentModule> = {
  Executive: {
    name: 'Executive Leadership / CEO',
    responsibilities: [
      'Define organizational vision, mission, and strategic goals',
      'Oversee performance across all departments',
      'Develop long-term strategies and monitor execution',
      'Board, investor, and stakeholder management',
      'Decision-making on high-impact initiatives and capital allocation',
      'Corporate governance oversight',
      'Risk management at the organizational level',
      'Crisis management and rapid response leadership',
      'Organizational culture and values shaping',
      'Succession planning and executive talent oversight',
      'Executive team mentorship and performance evaluation',
      'Policy approval and enforcement',
      'Major partnership negotiation and alliance building',
      'Resource prioritization across departments',
      'Performance tracking and KPI dashboards'
    ],
    functions: [
      'Ensure organizational alignment with strategic vision',
      'Make data-driven recommendations for resource allocation and risk',
      'Act as the ultimate decision-making authority',
      'Monitor cross-department execution and remove obstacles'
    ]
  },
  Strategy: {
    name: 'Strategy / Chief Strategy Officer',
    responsibilities: [
      'Market, industry, and competitive analysis',
      'Strategic planning and roadmap development',
      'Opportunity and threat identification',
      'Business modeling and scenario planning',
      'Initiative prioritization and ranking',
      'Cross-department alignment of strategic objectives',
      'Partnership and alliance identification',
      'M&A or investment opportunity evaluation',
      'KPI and metric development for organizational goals',
      'Innovation and future trends scouting',
      'Risk assessment and contingency planning',
      'Continuous strategy optimization based on outcomes'
    ],
    functions: [
      'Translate organizational vision into actionable initiatives',
      'Identify high-leverage projects for resource allocation',
      'Provide insights and foresight to guide leadership decisions',
      'Monitor execution of strategic plans and adjust as needed'
    ]
  },
  Product: {
    name: 'Product Development / CPO',
    responsibilities: [
      'Product vision and roadmap creation',
      'Feature prioritization and planning',
      'Market research and user need analysis',
      'Prototype, design, and development oversight',
      'User experience (UX) and interface (UI) design',
      'QA, testing, and validation of products',
      'Product lifecycle management',
      'Cross-functional coordination with marketing, sales, and operations',
      'Regulatory compliance for product releases',
      'Iteration based on feedback and performance metrics',
      'Vendor and partner product integration',
      'Technical documentation and product specifications',
      'Launch planning and execution'
    ],
    functions: [
      'Ensure product-market fit and value delivery',
      'Optimize feature development and iteration cycles',
      'Reduce time-to-market and development risk',
      'Monitor adoption and product performance metrics'
    ]
  },
  Operations: {
    name: 'Program Delivery / COO',
    responsibilities: [
      'Workflow design and optimization',
      'Task prioritization and sequencing',
      'Cross-department coordination',
      'Resource allocation and capacity planning',
      'Bottleneck identification and mitigation',
      'Process standardization and SOP enforcement',
      'Operational risk assessment',
      'Continuous improvement initiatives',
      'Inventory / supply chain oversight',
      'Project execution monitoring and reporting',
      'Operational KPIs tracking and dashboarding',
      'Feedback loops for lessons learned and post-mortems',
      'Scheduling and calendar management',
      'Event coordination and logistics',
      'Vendor and third-party coordination',
      'Support for program / service delivery'
    ],
    functions: [
      'Convert strategic initiatives into actionable workflows',
      'Track dependencies and flag blocked or high-leverage tasks',
      'Provide recommendations for efficiency and process improvement',
      'Predict operational risks based on capacity and task load'
    ]
  },
  Finance: {
    name: 'Finance / CFO',
    responsibilities: [
      'Budget planning, allocation, and approval',
      'Cash flow management and forecasting',
      'Revenue tracking and reporting',
      'Expense tracking and reconciliation',
      'Procurement oversight and vendor payments',
      'Financial risk assessment and mitigation',
      'ROI / impact analysis for projects and programs',
      'Grant, fundraising, or funding allocation oversight',
      'Accounting compliance (GAAP, IFRS, tax filings)',
      'Audit coordination and preparation',
      'KPI reporting for financial health',
      'Investment tracking and recommendation',
      'Tax planning and reporting',
      'Payroll oversight',
      'Asset tracking and depreciation reporting',
      'Financial modeling for strategic decisions'
    ],
    functions: [
      'Ensure financial sustainability and compliance',
      'Provide insights on cost vs. benefit for strategic initiatives',
      'Flag high-risk financial decisions or funding gaps',
      'Support leadership with data-driven decision-making'
    ]
  },
  HR: {
    name: 'Human Capital / CHRO',
    responsibilities: [
      'Workforce planning and role definition',
      'Recruitment, hiring, and onboarding',
      'Performance evaluation and management',
      'Skill gap analysis and professional development',
      'Training, certifications, and continuing education',
      'Employee engagement and retention strategy',
      'Benefits and payroll oversight',
      'HR compliance (labor laws, OSHA, DEI, privacy)',
      'Conflict resolution and workplace issue management',
      'Policy creation and enforcement (Code of Conduct, Whistleblower, Ethics)',
      'Succession planning and talent pipeline management',
      'Recognition and reward systems',
      'Culture building and team norms institutionalization',
      'Staff feedback collection and pulse surveys',
      'Offboarding processes'
    ],
    functions: [
      'Ensure workforce alignment with strategy',
      'Maximize talent utilization and productivity',
      'Reduce HR-related operational risk',
      'Maintain compliance and organizational ethics'
    ]
  },
  Marketing: {
    name: 'Marketing & Creative / CMO',
    responsibilities: [
      'Brand identity creation and maintenance',
      'Marketing strategy and campaign planning',
      'Content creation (social media, newsletters, website, print)',
      'Audience segmentation and targeting',
      'Lead generation and conversion tracking',
      'Media planning and ad management',
      'Community engagement and PR',
      'Event promotion and sponsorship alignment',
      'Marketing analytics and KPI tracking',
      'Messaging consistency across channels',
      'Trend analysis and competitive benchmarking',
      'Creative asset management and approvals',
      'Feedback loop integration for campaign performance',
      'Cross-department coordination for campaigns'
    ],
    functions: [
      'Align marketing output with organizational vision and mission',
      'Optimize communication for engagement, conversion, and visibility',
      'Prioritize high-impact campaigns and initiatives',
      'Track ROI and effectiveness of creative efforts'
    ]
  },
  Legal: {
    name: 'Legal & Compliance',
    responsibilities: [
      'Regulatory compliance monitoring (local, state, federal)',
      'Contract review and approval',
      'Policy and SOP compliance audits',
      'Risk assessment and mitigation',
      'Corporate governance support',
      'Insurance management (liability, D&O, event coverage)',
      'Intellectual property oversight',
      'Ethics oversight and code enforcement',
      'Reporting obligations (tax, labor, grants, fundraising compliance)',
      'Legal documentation management (MOUs, waivers, NDAs, licenses)',
      'Dispute and litigation support',
      'Privacy, cybersecurity, and data protection compliance'
    ],
    functions: [
      'Prevent legal and compliance issues before they arise',
      'Ensure organizational adherence to laws and regulations',
      'Provide risk-based recommendations to leadership',
      'Maintain transparent audit trails for governance'
    ]
  },
  PM: {
    name: 'Project Management / Execution',
    responsibilities: [
      'Task scheduling, prioritization, and tracking',
      'Resource allocation per project',
      'Cross-functional coordination',
      'Milestone and deliverable management',
      'Status reporting and KPI tracking',
      'Risk and dependency management',
      'Timeline and budget monitoring',
      'Documentation of lessons learned and debriefs',
      'Integration with SOPs and operational standards',
      'Task automation and workflow optimization',
      'Communication facilitation between teams',
      'Escalation of blocked or high-risk tasks'
    ],
    functions: [
      'Ensure projects deliver on time, budget, and scope',
      'Provide actionable oversight for all tasks and dependencies',
      'Forecast risks and potential delays',
      'Centralize operational visibility for leadership'
    ]
  },
  IT: {
    name: 'IT / Systems Support',
    responsibilities: [
      'Infrastructure setup and maintenance',
      'Data integrity and security management',
      'Automation of workflows and notifications',
      'Dashboard and analytics configuration',
      'System troubleshooting and user support',
      'Integration of third-party tools and platforms',
      'Standardization of templates, SOPs, and document repositories',
      'System training and documentation for staff',
      'Version control and audit readiness',
      'Scalability planning for systems and infrastructure'
    ],
    functions: [
      'Ensure smooth, reliable digital operations',
      'Minimize downtime and operational friction',
      'Support data-driven insights for all departments',
      'Enable automation to reduce manual operational load'
    ]
  },
  CX: {
    name: 'Customer Experience / CX',
    responsibilities: [
      'Customer journey mapping and touchpoint analysis',
      'Customer support and service oversight',
      'Feedback collection (surveys, reviews, NPS)',
      'Customer retention strategy and loyalty programs',
      'Complaint resolution and escalation processes',
      'Experience metrics tracking and KPI dashboards',
      'Cross-department coordination for service improvements',
      'Training and quality assurance for customer-facing teams',
      'Voice of customer insights integration into product/service design'
    ],
    functions: [
      'Maximize customer satisfaction and retention',
      'Provide actionable insights from customer feedback',
      'Identify friction points and propose operational solutions'
    ]
  },
  Sales: {
    name: 'Sales & Development',
    responsibilities: [
      'Lead generation and prospect qualification',
      'Sales pipeline management and forecasting',
      'Client relationship management',
      'Proposal development and contract negotiation',
      'Cross-sell and upsell strategy execution',
      'Revenue target tracking and KPI reporting',
      'Collaboration with marketing and product teams',
      'CRM system management',
      'Sales team coaching and performance reviews'
    ],
    functions: [
      'Drive revenue growth and market expansion',
      'Optimize conversion rates and sales efficiency',
      'Ensure alignment between customer needs and product/service offerings'
    ]
  },
  Data: {
    name: 'Data & Analytics',
    responsibilities: [
      'Data collection, integration, and cleaning',
      'Database and warehouse management',
      'Metrics and KPI definition and tracking',
      'Business intelligence and reporting',
      'Predictive, descriptive, and prescriptive analytics',
      'Data visualization and dashboards for leadership',
      'Process optimization recommendations based on analytics',
      'Data governance, compliance, and security'
    ],
    functions: [
      'Transform raw data into actionable insights',
      'Support decision-making across all departments',
      'Monitor organizational performance and trends'
    ]
  },
  Ops: {
    name: 'Operations / COO (Broader)',
    responsibilities: [
      'Facility and logistics management',
      'Resource allocation and capacity planning',
      'Operational workflows and SOP creation',
      'Risk identification and mitigation',
      'Continuous improvement initiatives',
      'Vendor, supplier, and partner management',
      'Process standardization and efficiency tracking',
      'Event and program delivery support',
      'Cross-department coordination and escalation',
      'Operational KPIs tracking and reporting'
    ],
    functions: [
      'Ensure smooth, efficient organizational operations',
      'Identify bottlenecks and propose improvements',
      'Forecast operational risks and resource constraints'
    ]
  }
};
