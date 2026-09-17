/** Project-Based Learning catalog helpers (static mirror of content collection). */
export type ProjectLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ProjectCatalogEntry {
  id: string;
  slug: string;
  track: string;
  level: ProjectLevel;
  title: string;
  estimatedHours: number;
  previousProjectId?: string | null;
  nextProjectId?: string | null;
}

export const levelOrder: Record<ProjectLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export const projectCatalog: ProjectCatalogEntry[] = [
  {
    "id": "PROJECT-FOUNDATIONS-DEV-TOOLBOX-CLI",
    "slug": "foundations-dev-toolbox-cli",
    "track": "foundations",
    "level": "beginner",
    "title": "Developer Toolbox CLI",
    "estimatedHours": 18,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-FOUNDATIONS-TCP-CHAT-FILE-TRANSFER"
  },
  {
    "id": "PROJECT-FOUNDATIONS-TCP-CHAT-FILE-TRANSFER",
    "slug": "foundations-tcp-chat-file-transfer",
    "track": "foundations",
    "level": "intermediate",
    "title": "TCP Chat + File Transfer",
    "estimatedHours": 28,
    "previousProjectId": "PROJECT-FOUNDATIONS-DEV-TOOLBOX-CLI",
    "nextProjectId": "PROJECT-FOUNDATIONS-MINI-UNIX-SHELL"
  },
  {
    "id": "PROJECT-FOUNDATIONS-MINI-UNIX-SHELL",
    "slug": "foundations-mini-unix-shell",
    "track": "foundations",
    "level": "advanced",
    "title": "Mini Unix Shell + Process Monitor",
    "estimatedHours": 40,
    "previousProjectId": "PROJECT-FOUNDATIONS-TCP-CHAT-FILE-TRANSFER",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-FLUTTER-EXPENSE-TRACKER",
    "slug": "flutter-expense-tracker",
    "track": "mobile-flutter",
    "level": "beginner",
    "title": "Personal Expense Tracker",
    "estimatedHours": 22,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-FLUTTER-OFFLINE-FIELD-TASKS"
  },
  {
    "id": "PROJECT-FLUTTER-OFFLINE-FIELD-TASKS",
    "slug": "flutter-offline-field-task-manager",
    "track": "mobile-flutter",
    "level": "intermediate",
    "title": "Offline-First Field Task Manager",
    "estimatedHours": 36,
    "previousProjectId": "PROJECT-FLUTTER-EXPENSE-TRACKER",
    "nextProjectId": "PROJECT-FLUTTER-FIELD-SERVICE-IOT"
  },
  {
    "id": "PROJECT-FLUTTER-FIELD-SERVICE-IOT",
    "slug": "flutter-field-service-iot-operations",
    "track": "mobile-flutter",
    "level": "advanced",
    "title": "Field Service + IoT Operations App",
    "estimatedHours": 48,
    "previousProjectId": "PROJECT-FLUTTER-OFFLINE-FIELD-TASKS",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-FRONTEND-ACCESSIBLE-PRODUCT-EXPLORER",
    "slug": "frontend-accessible-product-explorer",
    "track": "frontend",
    "level": "beginner",
    "title": "Accessible Product Explorer",
    "estimatedHours": 24,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-FRONTEND-SAAS-OPS-DASHBOARD"
  },
  {
    "id": "PROJECT-FRONTEND-SAAS-OPS-DASHBOARD",
    "slug": "frontend-saas-operations-dashboard",
    "track": "frontend",
    "level": "intermediate",
    "title": "SaaS Operations Dashboard",
    "estimatedHours": 34,
    "previousProjectId": "PROJECT-FRONTEND-ACCESSIBLE-PRODUCT-EXPLORER",
    "nextProjectId": "PROJECT-FRONTEND-COLLABORATIVE-ISSUE-BOARD"
  },
  {
    "id": "PROJECT-FRONTEND-COLLABORATIVE-ISSUE-BOARD",
    "slug": "frontend-collaborative-issue-board",
    "track": "frontend",
    "level": "advanced",
    "title": "Real-Time Collaborative Issue Board",
    "estimatedHours": 45,
    "previousProjectId": "PROJECT-FRONTEND-SAAS-OPS-DASHBOARD",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-BACKEND-INVENTORY-REST-API",
    "slug": "backend-inventory-rest-api",
    "track": "backend",
    "level": "beginner",
    "title": "Inventory REST API",
    "estimatedHours": 26,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-BACKEND-MULTI-TENANT-PM-API"
  },
  {
    "id": "PROJECT-BACKEND-MULTI-TENANT-PM-API",
    "slug": "backend-multi-tenant-pm-api",
    "track": "backend",
    "level": "intermediate",
    "title": "Multi-Tenant Project Management API",
    "estimatedHours": 38,
    "previousProjectId": "PROJECT-BACKEND-INVENTORY-REST-API",
    "nextProjectId": "PROJECT-BACKEND-ORDER-PAYMENT-PLATFORM"
  },
  {
    "id": "PROJECT-BACKEND-ORDER-PAYMENT-PLATFORM",
    "slug": "backend-order-payment-platform",
    "track": "backend",
    "level": "advanced",
    "title": "Reliable Order + Payment Platform",
    "estimatedHours": 50,
    "previousProjectId": "PROJECT-BACKEND-MULTI-TENANT-PM-API",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-FULLSTACK-JOB-APPLICATION-TRACKER",
    "slug": "fullstack-job-application-tracker",
    "track": "fullstack",
    "level": "beginner",
    "title": "Job Application Tracker",
    "estimatedHours": 30,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-FULLSTACK-HELPDESK-SAAS"
  },
  {
    "id": "PROJECT-FULLSTACK-HELPDESK-SAAS",
    "slug": "fullstack-helpdesk-saas",
    "track": "fullstack",
    "level": "intermediate",
    "title": "Helpdesk SaaS",
    "estimatedHours": 40,
    "previousProjectId": "PROJECT-FULLSTACK-JOB-APPLICATION-TRACKER",
    "nextProjectId": "PROJECT-FULLSTACK-SUBSCRIPTION-SAAS"
  },
  {
    "id": "PROJECT-FULLSTACK-SUBSCRIPTION-SAAS",
    "slug": "fullstack-multi-tenant-subscription-saas",
    "track": "fullstack",
    "level": "advanced",
    "title": "Multi-Tenant Subscription SaaS",
    "estimatedHours": 55,
    "previousProjectId": "PROJECT-FULLSTACK-HELPDESK-SAAS",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-DEVOPS-CONTAINERIZED-CICD-VM",
    "slug": "devops-containerized-cicd-linux-vm",
    "track": "devops",
    "level": "beginner",
    "title": "Containerized App + CI/CD to Linux VM",
    "estimatedHours": 28,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-DEVOPS-TERRAFORM-AWS"
  },
  {
    "id": "PROJECT-DEVOPS-TERRAFORM-AWS",
    "slug": "devops-terraform-aws-environment",
    "track": "devops",
    "level": "intermediate",
    "title": "Terraform AWS Environment",
    "estimatedHours": 36,
    "previousProjectId": "PROJECT-DEVOPS-CONTAINERIZED-CICD-VM",
    "nextProjectId": "PROJECT-DEVOPS-K8S-GITOPS-SRE"
  },
  {
    "id": "PROJECT-DEVOPS-K8S-GITOPS-SRE",
    "slug": "devops-k8s-gitops-sre",
    "track": "devops",
    "level": "advanced",
    "title": "Kubernetes Platform + GitOps + SRE",
    "estimatedHours": 50,
    "previousProjectId": "PROJECT-DEVOPS-TERRAFORM-AWS",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-DATABASE-INVENTORY-PURCHASING",
    "slug": "database-inventory-purchasing",
    "track": "database",
    "level": "beginner",
    "title": "Inventory/Purchasing Relational Database",
    "estimatedHours": 22,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-DATABASE-ECOMMERCE-PERF-LAB"
  },
  {
    "id": "PROJECT-DATABASE-ECOMMERCE-PERF-LAB",
    "slug": "database-ecommerce-postgres-perf-lab",
    "track": "database",
    "level": "intermediate",
    "title": "E-Commerce PostgreSQL Performance Lab",
    "estimatedHours": 32,
    "previousProjectId": "PROJECT-DATABASE-INVENTORY-PURCHASING",
    "nextProjectId": "PROJECT-DATABASE-EVENT-AUDIT-PLATFORM"
  },
  {
    "id": "PROJECT-DATABASE-EVENT-AUDIT-PLATFORM",
    "slug": "database-high-volume-event-audit",
    "track": "database",
    "level": "advanced",
    "title": "High-Volume Event/Audit Platform",
    "estimatedHours": 42,
    "previousProjectId": "PROJECT-DATABASE-ECOMMERCE-PERF-LAB",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-QA-ECOMMERCE-QUALITY-PACK",
    "slug": "qa-ecommerce-quality-pack",
    "track": "qa",
    "level": "beginner",
    "title": "E-Commerce Quality Pack",
    "estimatedHours": 20,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-QA-PLAYWRIGHT-E2E-FRAMEWORK"
  },
  {
    "id": "PROJECT-QA-PLAYWRIGHT-E2E-FRAMEWORK",
    "slug": "qa-playwright-e2e-framework",
    "track": "qa",
    "level": "intermediate",
    "title": "Playwright E2E Automation Framework",
    "estimatedHours": 34,
    "previousProjectId": "PROJECT-QA-ECOMMERCE-QUALITY-PACK",
    "nextProjectId": "PROJECT-QA-UNIFIED-QE-PIPELINE"
  },
  {
    "id": "PROJECT-QA-UNIFIED-QE-PIPELINE",
    "slug": "qa-unified-quality-engineering-pipeline",
    "track": "qa",
    "level": "advanced",
    "title": "Unified Quality Engineering Pipeline",
    "estimatedHours": 42,
    "previousProjectId": "PROJECT-QA-PLAYWRIGHT-E2E-FRAMEWORK",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-UIUX-LOCAL-SERVICE-REDESIGN",
    "slug": "uiux-local-service-redesign",
    "track": "uiux",
    "level": "beginner",
    "title": "UX Audit + Local Service Redesign",
    "estimatedHours": 24,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-UIUX-CHECKOUT-DESIGN-SYSTEM"
  },
  {
    "id": "PROJECT-UIUX-CHECKOUT-DESIGN-SYSTEM",
    "slug": "uiux-ecommerce-checkout-design-system",
    "track": "uiux",
    "level": "intermediate",
    "title": "E-Commerce Checkout + Design System",
    "estimatedHours": 34,
    "previousProjectId": "PROJECT-UIUX-LOCAL-SERVICE-REDESIGN",
    "nextProjectId": "PROJECT-UIUX-B2B-OPERATIONS-PLATFORM"
  },
  {
    "id": "PROJECT-UIUX-B2B-OPERATIONS-PLATFORM",
    "slug": "uiux-b2b-operations-platform",
    "track": "uiux",
    "level": "advanced",
    "title": "B2B Operations Platform",
    "estimatedHours": 45,
    "previousProjectId": "PROJECT-UIUX-CHECKOUT-DESIGN-SYSTEM",
    "nextProjectId": null
  },
  {
    "id": "PROJECT-PM-SIX-WEEK-MVP",
    "slug": "pm-six-week-software-mvp",
    "track": "project-management",
    "level": "beginner",
    "title": "Plan a 6-Week Software MVP",
    "estimatedHours": 18,
    "previousProjectId": null,
    "nextProjectId": "PROJECT-PM-CROSS-FUNCTIONAL-RELEASE"
  },
  {
    "id": "PROJECT-PM-CROSS-FUNCTIONAL-RELEASE",
    "slug": "pm-cross-functional-web-mobile-release",
    "track": "project-management",
    "level": "intermediate",
    "title": "Cross-Functional Web/Mobile Release",
    "estimatedHours": 28,
    "previousProjectId": "PROJECT-PM-SIX-WEEK-MVP",
    "nextProjectId": "PROJECT-PM-SAAS-MIGRATION-RECOVERY"
  },
  {
    "id": "PROJECT-PM-SAAS-MIGRATION-RECOVERY",
    "slug": "pm-saas-migration-recovery-program",
    "track": "project-management",
    "level": "advanced",
    "title": "Troubled SaaS Migration Recovery Program",
    "estimatedHours": 36,
    "previousProjectId": "PROJECT-PM-CROSS-FUNCTIONAL-RELEASE",
    "nextProjectId": null
  },
  {
    "id": "PBL-AI-B-001",
    "slug": "ai-prompt-lab-evaluation-notebook",
    "track": "ai-framework",
    "level": "beginner",
    "title": "Prompt Lab + Evaluation Notebook",
    "estimatedHours": 14,
    "previousProjectId": null,
    "nextProjectId": "PBL-AI-B-002"
  },
  {
    "id": "PBL-AI-B-002",
    "slug": "ai-coding-workflow-lab-cursor",
    "track": "ai-framework",
    "level": "beginner",
    "title": "AI Coding Workflow Lab with Cursor",
    "estimatedHours": 12,
    "previousProjectId": "PBL-AI-B-001",
    "nextProjectId": "PBL-AI-B-003"
  },
  {
    "id": "PBL-AI-B-003",
    "slug": "ai-structured-document-extractor",
    "track": "ai-framework",
    "level": "beginner",
    "title": "Structured Document Extractor",
    "estimatedHours": 16,
    "previousProjectId": "PBL-AI-B-002",
    "nextProjectId": "PBL-AI-I-001"
  },
  {
    "id": "PBL-AI-I-001",
    "slug": "ai-citation-rag-knowledge-assistant",
    "track": "ai-framework",
    "level": "intermediate",
    "title": "Citation-Based RAG Knowledge Assistant",
    "estimatedHours": 28,
    "previousProjectId": "PBL-AI-B-003",
    "nextProjectId": "PBL-AI-I-002"
  },
  {
    "id": "PBL-AI-I-002",
    "slug": "ai-tool-calling-operations-assistant",
    "track": "ai-framework",
    "level": "intermediate",
    "title": "Tool-Calling Operations Assistant",
    "estimatedHours": 30,
    "previousProjectId": "PBL-AI-I-001",
    "nextProjectId": "PBL-AI-I-003"
  },
  {
    "id": "PBL-AI-I-003",
    "slug": "ai-multimodal-document-intelligence",
    "track": "ai-framework",
    "level": "intermediate",
    "title": "Multimodal Document Intelligence Pipeline",
    "estimatedHours": 32,
    "previousProjectId": "PBL-AI-I-002",
    "nextProjectId": "PBL-AI-A-001"
  },
  {
    "id": "PBL-AI-A-001",
    "slug": "ai-stateful-agent-langgraph-mcp",
    "track": "ai-framework",
    "level": "advanced",
    "title": "Stateful Agent with LangGraph + MCP",
    "estimatedHours": 40,
    "previousProjectId": "PBL-AI-I-003",
    "nextProjectId": "PBL-AI-A-002"
  },
  {
    "id": "PBL-AI-A-002",
    "slug": "ai-open-model-inference-eval-platform",
    "track": "ai-framework",
    "level": "advanced",
    "title": "Open-Model Inference & Evaluation Platform",
    "estimatedHours": 42,
    "previousProjectId": "PBL-AI-A-001",
    "nextProjectId": "PBL-AI-A-003"
  },
  {
    "id": "PBL-AI-A-003",
    "slug": "ai-multi-tenant-copilot-saas",
    "track": "ai-framework",
    "level": "advanced",
    "title": "Multi-Tenant AI Copilot SaaS",
    "estimatedHours": 48,
    "previousProjectId": "PBL-AI-A-002",
    "nextProjectId": null
  }
];

export function getProjectsByTrack(track: string): ProjectCatalogEntry[] {
  return projectCatalog
    .filter((p) => p.track === track)
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level] || a.title.localeCompare(b.title));
}

export function getProjectBySlug(slug: string): ProjectCatalogEntry | undefined {
  return projectCatalog.find((p) => p.slug === slug);
}

export function getProjectById(id: string): ProjectCatalogEntry | undefined {
  return projectCatalog.find((p) => p.id === id);
}
