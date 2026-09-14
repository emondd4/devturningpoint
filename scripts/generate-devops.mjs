import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  devops: 'CAREER-DEVOPS-ENGINEER',
  be: 'CAREER-BACKEND-ENGINEER',
  se: 'CAREER-SOFTWARE-ENGINEER',
};

export function generateDevops() {
  const topics = [
    {
      slug: 'linux-fundamentals',
      meta: {
        id: 'DEVOPS-LINUX-FUNDAMENTALS',
        title: 'Linux Fundamentals for Engineers',
        titleBn: 'ইঞ্জিনিয়ারদের জন্য Linux মৌলিক',
        description:
          'Shell, files, permissions, processes, and logs—the daily OS literacy for servers.',
        descriptionBn:
          'শেল, ফাইল, পারমিশন, প্রসেস ও লগ—সার্ভারের দৈনন্দিন OS সাক্ষরতা।',
        difficulty: 'beginner',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-OS-PROCESSES-MEMORY'],
        unlocks: ['DEVOPS-DOCKER-FUNDAMENTALS', 'DEVOPS-NETWORKING-FOR-DEVOPS'],
        related: ['FOUNDATIONS-GIT-FUNDAMENTALS'],
        careers: [C.devops, C.be, C.se],
        tags: ['linux', 'shell', 'devops'],
        sources: ['LINUX-MAN-PAGES'],
      },
      body: `
## Why Linux fluency is non-negotiable

Cloud VMs, containers, and CI runners are Linux. GUI-only workflows stall the moment SSH is the only door.

## Mental model

<Callout type="mental-model">
  Everything is a file-ish interface: processes, logs, devices. The shell composes small tools with pipes. Permissions gate who can read/write/execute.
</Callout>

\`\`\`bash
pwd
ls -la
cd /var/log
man ps
chmod u+x script.sh
\`\`\`

Learn redirection (\`>\`, \`>>\`, \`2>\`) and pipes (\`|\`). Read \`journalctl\`/\`syslog\` depending on distro.

${commonFooter({
  mistakes: [
    { title: 'Running everything as root', detail: 'Use sudo intentionally.' },
    { title: 'chmod 777 “to make it work”', detail: 'Creates security holes.' },
    { title: 'Ignoring exit codes in scripts', detail: 'Failures become silent.' },
  ],
  interview:
    'How do you find which process listens on port 8080 and inspect its open files?',
  practice: [
    'Write a bash script with \`set -euo pipefail\`.',
    'Practice navigating the FHS (/etc, /var, /home).',
    'Use \`ps\` and \`kill\` safely on a test process.',
  ],
  sourceIds: ['LINUX-MAN-PAGES'],
})}
`,
    },
    {
      slug: 'networking-for-devops',
      meta: {
        id: 'DEVOPS-NETWORKING-FOR-DEVOPS',
        title: 'Networking for DevOps',
        titleBn: 'DevOps-এর জন্য নেটওয়ার্কিং',
        description:
          'DNS, load balancers, firewalls, TLS termination—connectivity debugging for cloud apps.',
        descriptionBn:
          'DNS, লোড ব্যালেন্সার, ফায়ারওয়াল, TLS টার্মিনেশন—ক্লাউড অ্যাপের কানেক্টিভিটি ডিবাগ।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-NETWORKING-TCP-IP-HTTP', 'DEVOPS-LINUX-FUNDAMENTALS'],
        unlocks: ['DEVOPS-NGINX-REVERSE-PROXY', 'DEVOPS-DOCKER-NETWORKING'],
        related: ['DEVOPS-AWS-CLOUD-FUNDAMENTALS'],
        careers: [C.devops, C.be],
        tags: ['networking', 'dns', 'tls', 'devops'],
        sources: ['RFC-9110-HTTP', 'DOCKER-NETWORKING'],
      },
      body: `
## Why “it’s a network issue” needs precision

Timeout vs refused vs TLS error vs DNS NXDOMAIN are different failures with different fixes.

## Mental model

<Callout type="mental-model">
  Client resolves DNS → TCP connect → TLS handshake → HTTP. Middleboxes (SG/NACL/firewall/LB) can allow or deny each hop.
</Callout>

\`\`\`bash
dig example.com
curl -vI https://example.com
\`\`\`

Map security groups to least ports; prefer private subnets for data stores.

${commonFooter({
  mistakes: [
    { title: 'Opening 0.0.0.0/0 on DB ports', detail: 'Internet-wide attack surface.' },
    { title: 'Not checking DNS TTLs during cutover', detail: 'Clients linger on old IPs.' },
    { title: 'Ignoring health checks', detail: 'LBs route to dead nodes.' },
  ],
  interview:
    'A service is reachable from the bastion but not the ALB—what do you check first?',
  practice: [
    'Trace a request path on paper for a VPC web app.',
    'Use curl -v to read TLS/HTTP details.',
    'Sketch SG rules for web + db tiers.',
  ],
  sourceIds: ['RFC-9110-HTTP', 'DOCKER-NETWORKING'],
})}
`,
    },
    {
      slug: 'docker-fundamentals',
      meta: {
        id: 'DEVOPS-DOCKER-FUNDAMENTALS',
        title: 'Docker Fundamentals',
        titleBn: 'Docker এর মৌলিক বিষয়',
        description:
          'Images, containers, layers, and volumes—packaging software with reproducible runtimes.',
        descriptionBn:
          'ইমেজ, কন্টেইনার, লেয়ার ও ভলিউম—পুনরুৎপাদনযোগ্য রানটাইমে সফটওয়্যার প্যাকেজিং।',
        difficulty: 'beginner',
        estimatedMinutes: 40,
        prerequisites: ['DEVOPS-LINUX-FUNDAMENTALS'],
        unlocks: ['DEVOPS-DOCKER-NETWORKING', 'BACKEND-DOCKER-DEPLOY'],
        related: ['DEVOPS-GITHUB-ACTIONS-CI'],
        careers: [C.devops, C.be, C.se],
        tags: ['docker', 'containers'],
        sources: ['DOCKER-GET-STARTED'],
      },
      body: `
## Why images beat snowflake servers

An image captures filesystem + metadata. A container is a running instance. Rebuild > SSH mutate.

## Mental model

<Callout type="mental-model">
  Dockerfile instructions create immutable layers. Containers add a thin writable layer. Volumes persist data outside the container lifecycle.
</Callout>

\`\`\`bash
docker build -t topics-api:dev .
docker run --rm -p 3000:3000 topics-api:dev
docker ps
\`\`\`

Prefer official base images, pin versions, and multi-stage builds for smaller artifacts.

${commonFooter({
  mistakes: [
    { title: 'Mutable containers as source of truth', detail: 'Rebuild from Dockerfile.' },
    { title: 'Huge images with build tools in final stage', detail: 'Use multi-stage.' },
    { title: 'Storing DB data only in container layer', detail: 'Use volumes.' },
  ],
  interview:
    'Explain image vs container and why layered builds cache efficiently.',
  practice: [
    'Write a Dockerfile for a static site or API.',
    'Inspect layers conceptually.',
    'Mount a volume for data.',
  ],
  sourceIds: ['DOCKER-GET-STARTED'],
})}
`,
    },
    {
      slug: 'docker-networking',
      meta: {
        id: 'DEVOPS-DOCKER-NETWORKING',
        title: 'Docker Networking',
        titleBn: 'Docker নেটওয়ার্কিং',
        description:
          'Bridge networks, DNS between containers, publishing ports, and Compose service names.',
        descriptionBn:
          'ব্রিজ নেটওয়ার্ক, কন্টেইনারদের DNS, পোর্ট পাবলিশ, এবং Compose সার্ভিস নাম।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['DEVOPS-DOCKER-FUNDAMENTALS', 'DEVOPS-NETWORKING-FOR-DEVOPS'],
        unlocks: ['DEVOPS-KUBERNETES-FUNDAMENTALS', 'DEVOPS-GITHUB-ACTIONS-CI'],
        related: ['DOCKER-BRIDGE', 'BACKEND-DOCKER-DEPLOY'],
        careers: [C.devops, C.be],
        tags: ['docker', 'networking', 'compose'],
        sources: ['DOCKER-NETWORKING', 'DOCKER-BRIDGE'],
      },
      body: `
## Why containers need networks

Isolation is useless if services cannot discover each other safely. Docker’s bridge networks provide per-network DNS using service/container names.

## Mental model

<Callout type="mental-model">
  User-defined bridge: containers talk via private IPs/DNS names. Published ports map container ports to the host for external access.
</Callout>

\`\`\`yaml
# compose sketch
services:
  api:
    build: .
    ports: ['3000:3000']
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
\`\`\`

API connects to \`db:5432\` on the Compose network—not localhost from inside the api container.

${commonFooter({
  mistakes: [
    { title: 'Using localhost for sibling containers', detail: 'Use service DNS names.' },
    { title: 'Publishing every port publicly', detail: 'Only expose what must be external.' },
    { title: 'Assuming host network is default everywhere', detail: 'Behavior differs by OS/engine.' },
  ],
  interview:
    'How do two Compose services discover each other, and when do you publish ports?',
  practice: [
    'Run API + Postgres on a user-defined bridge.',
    'Inspect \`docker network ls\`.',
    'Break and fix a localhost misconfig.',
  ],
  sourceIds: ['DOCKER-NETWORKING', 'DOCKER-BRIDGE'],
})}
`,
    },
    {
      slug: 'github-actions-ci',
      meta: {
        id: 'DEVOPS-GITHUB-ACTIONS-CI',
        title: 'GitHub Actions CI',
        titleBn: 'GitHub Actions CI',
        description:
          'Workflows, jobs, caches, and service containers—automating checks on every PR.',
        descriptionBn:
          'ওয়ার্কফ্লো, জব, ক্যাশ ও সার্ভিস কন্টেইনার—প্রতিটি PR-এ স্বয়ংক্রিয় চেক।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-GIT-FUNDAMENTALS', 'DEVOPS-DOCKER-FUNDAMENTALS'],
        unlocks: ['FULLSTACK-DEPLOYMENT-PIPELINE', 'BACKEND-DOCKER-DEPLOY'],
        related: ['GHA-SERVICE-CONTAINERS'],
        careers: [C.devops, C.se, C.be],
        tags: ['ci', 'github-actions', 'automation'],
        sources: ['GHA-WORKFLOWS', 'GHA-SERVICE-CONTAINERS'],
      },
      body: `
## Why CI is a product requirement

If tests only run locally, broken main is inevitable. CI makes quality checks a merge gate.

## Mental model

<Callout type="mental-model">
  Workflow YAML declares events → jobs (runners) → steps. Jobs can use service containers on a bridge network for databases during tests.
</Callout>

\`\`\`yaml
name: ci
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i --frozen-lockfile
      - run: pnpm test
\`\`\`

Pin actions by major version thoughtfully; treat secrets as secrets.

${commonFooter({
  mistakes: [
    { title: 'Secrets in logs', detail: 'Mask and avoid echo.' },
    { title: 'No dependency caching strategy', detail: 'Slow feedback loops.' },
    { title: 'Deploying from fork PRs with secrets', detail: 'Understand trust boundaries.' },
  ],
  interview:
    'Design a PR workflow that runs typecheck, unit tests, and build for an Astro/Node monorepo.',
  practice: [
    'Add a workflow to this repo’s pattern.',
    'Use a Postgres service container for integration tests.',
    'Fail the job on lint errors.',
  ],
  sourceIds: ['GHA-WORKFLOWS', 'GHA-SERVICE-CONTAINERS'],
})}
`,
    },
    {
      slug: 'nginx-reverse-proxy',
      meta: {
        id: 'DEVOPS-NGINX-REVERSE-PROXY',
        title: 'NGINX Reverse Proxy',
        titleBn: 'NGINX রিভার্স প্রক্সি',
        description:
          'Terminate TLS, route paths, and add headers in front of app servers.',
        descriptionBn:
          'অ্যাপ সার্ভারের সামনে TLS টার্মিনেট, পাথ রাউট, এবং হেডার যোগ করা।',
        difficulty: 'intermediate',
        estimatedMinutes: 36,
        prerequisites: ['DEVOPS-NETWORKING-FOR-DEVOPS'],
        unlocks: ['DEVOPS-AWS-CLOUD-FUNDAMENTALS'],
        related: ['BACKEND-SECURITY-BASICS'],
        careers: [C.devops, C.be],
        tags: ['nginx', 'proxy', 'tls'],
        sources: ['NGINX-DOCS'],
      },
      body: `
## Why reverse proxies exist

Apps speak HTTP on internal ports. Proxies handle TLS, compression, static files, and routing without rewriting app code.

## Mental model

<Callout type="mental-model">
  Client → NGINX (public) → upstream (Node/Nest). NGINX can rewrite paths, set headers, and buffer responses.
</Callout>

\`\`\`nginx
server {
  listen 80;
  server_name example.com;
  location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
\`\`\`

Apps must trust forwarded proto/host carefully to generate correct URLs and cookies.

${commonFooter({
  mistakes: [
    { title: 'Forgetting X-Forwarded-Proto', detail: 'Broken HTTPS redirects/cookies.' },
    { title: 'Proxying without timeouts', detail: 'Hung upstreams pile up.' },
    { title: 'Exposing upstream ports publicly', detail: 'Bypass the proxy controls.' },
  ],
  interview:
    'How do you configure TLS termination and pass client IP information to NestJS?',
  practice: [
    'Front a local app with NGINX.',
    'Add a simple rate limit or static location.',
    'Verify forwarded headers in the app.',
  ],
  sourceIds: ['NGINX-DOCS'],
})}
`,
    },
    {
      slug: 'aws-cloud-fundamentals',
      meta: {
        id: 'DEVOPS-AWS-CLOUD-FUNDAMENTALS',
        title: 'AWS Cloud Fundamentals',
        titleBn: 'AWS ক্লাউড মৌলিক',
        description:
          'Regions, IAM, VPC, compute, and storage—shared responsibility in the cloud.',
        descriptionBn:
          'রিজিয়ন, IAM, VPC, কম্পিউট ও স্টোরেজ—ক্লাউডে শেয়ার্ড রেসপন্সিবিলিটি।',
        difficulty: 'intermediate',
        estimatedMinutes: 42,
        prerequisites: ['DEVOPS-NETWORKING-FOR-DEVOPS', 'DEVOPS-LINUX-FUNDAMENTALS'],
        unlocks: ['DEVOPS-TERRAFORM-BASICS', 'DEVOPS-KUBERNETES-FUNDAMENTALS'],
        related: ['DEVOPS-OBSERVABILITY-PROMETHEUS-GRAFANA'],
        careers: [C.devops, C.be],
        tags: ['aws', 'cloud', 'iam'],
        sources: ['AWS-CLOUD-CONCEPTS'],
      },
      body: `
## Why cloud is APIs + blast radius

AWS is not “someone else’s computer” only—it is programmable infrastructure with **IAM** as the real security boundary.

## Mental model

<Callout type="mental-model">
  Account/region → network (VPC) → compute (EC2/ECS/EKS/Lambda) → data (S3/RDS). IAM decides who can call which APIs.
</Callout>

Prefer least privilege roles over long-lived access keys on laptops. Understand shared responsibility: AWS secures the cloud; you secure *in* the cloud (config, data, access).

${commonFooter({
  mistakes: [
    { title: 'Root account for daily work', detail: 'Use IAM users/roles + MFA.' },
    { title: 'Public S3 buckets by accident', detail: 'Block public access defaults.' },
    { title: 'One giant VPC with no tiers', detail: 'Segment subnets and SGs.' },
  ],
  interview:
    'Explain shared responsibility and how you would expose a web app securely on AWS at a high level.',
  practice: [
    'Diagram a VPC with public/private subnets.',
    'Create a least-privilege IAM policy sketch.',
    'Compare S3 vs EBS vs RDS purposes.',
  ],
  sourceIds: ['AWS-CLOUD-CONCEPTS'],
})}
`,
    },
    {
      slug: 'terraform-basics',
      meta: {
        id: 'DEVOPS-TERRAFORM-BASICS',
        title: 'Terraform Basics',
        titleBn: 'Terraform বেসিক',
        description:
          'Infrastructure as code: providers, state, plans, and safe apply workflows.',
        descriptionBn:
          'Infrastructure as code: প্রোভাইডার, স্টেট, প্ল্যান ও নিরাপদ apply ওয়ার্কফ্লো।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['DEVOPS-AWS-CLOUD-FUNDAMENTALS'],
        unlocks: ['DEVOPS-KUBERNETES-FUNDAMENTALS'],
        related: ['DEVOPS-GITHUB-ACTIONS-CI'],
        careers: [C.devops],
        tags: ['terraform', 'iac'],
        sources: ['TERRAFORM-DOCS'],
      },
      body: `
## Why IaC beats click-ops

Clicking consoles does not review, diff, or reproduce. Terraform configs are reviewable history—with state as the mapping to real resources.

## Mental model

<Callout type="mental-model">
  Write desired state → \`plan\` shows delta → \`apply\` mutates cloud APIs → remote state stores mapping. State is sensitive.
</Callout>

\`\`\`hcl
resource "aws_s3_bucket" "artifacts" {
  bucket = "dtp-artifacts-example"
}
\`\`\`

Use remote state locking (e.g., S3+DynamoDB patterns) for teams; never commit secrets.

${commonFooter({
  mistakes: [
    { title: 'Local state on laptops for teams', detail: 'Conflicts and loss risk.' },
    { title: 'Apply without reading plan', detail: 'Destroy surprises.' },
    { title: 'Hardcoding secrets in .tf', detail: 'Use secret stores / CI secrets.' },
  ],
  interview:
    'What is Terraform state and why must it be protected?',
  practice: [
    'Write a tiny config and plan it (even locally with a mock/provider you can use).',
    'Organize modules by environment.',
    'Add a CI plan on PR.',
  ],
  sourceIds: ['TERRAFORM-DOCS'],
})}
`,
    },
    {
      slug: 'kubernetes-fundamentals',
      meta: {
        id: 'DEVOPS-KUBERNETES-FUNDAMENTALS',
        title: 'Kubernetes Fundamentals',
        titleBn: 'Kubernetes মৌলিক',
        description:
          'Pods, Deployments, Services, and desired-state reconciliation—before advanced charts.',
        descriptionBn:
          'Pod, Deployment, Service ও desired-state reconciliation—অ্যাডভান্সড চার্টের আগে।',
        difficulty: 'advanced',
        estimatedMinutes: 45,
        prerequisites: ['DEVOPS-DOCKER-NETWORKING', 'DEVOPS-AWS-CLOUD-FUNDAMENTALS'],
        unlocks: ['DEVOPS-OBSERVABILITY-PROMETHEUS-GRAFANA'],
        related: ['DEVOPS-TERRAFORM-BASICS'],
        careers: [C.devops, C.be],
        tags: ['kubernetes', 'orchestration'],
        sources: ['K8S-CONCEPTS'],
      },
      body: `
## Why orchestrators exist

Containers on one host do not self-heal across a fleet. Kubernetes continuously reconciles declared desired state.

## Mental model

<Callout type="mental-model">
  Pod: schedulable unit of containers. Deployment: replica + rollout controller. Service: stable virtual IP/DNS to pods. Ingress/Gateway: HTTP entry.
</Callout>

Learn \`kubectl get/describe/logs\` before Helm complexity. Resource requests/limits prevent noisy neighbors.

${commonFooter({
  mistakes: [
    { title: 'Running latest tags in prod', detail: 'Pin digests/versions.' },
    { title: 'No probes', detail: 'Traffic hits broken pods.' },
    { title: 'Secrets in plain ConfigMaps', detail: 'Use Secrets/KMS patterns carefully.' },
  ],
  interview:
    'Explain how a Deployment rollback works at a high level and what a Service selects.',
  practice: [
    'Run a local cluster (kind/minikube) and deploy NGINX.',
    'Expose it via Service.',
    'Break a probe and watch restarts.',
  ],
  sourceIds: ['K8S-CONCEPTS'],
})}
`,
    },
    {
      slug: 'observability-prometheus-grafana',
      meta: {
        id: 'DEVOPS-OBSERVABILITY-PROMETHEUS-GRAFANA',
        title: 'Observability with Prometheus and Grafana',
        titleBn: 'Prometheus ও Grafana দিয়ে অবজারভেবিলিটি',
        description:
          'Metrics, labels, PromQL basics, and dashboards that answer production questions.',
        descriptionBn:
          'মেট্রিক্স, লেবেল, PromQL বেসিক, এবং প্রোডাকশন প্রশ্নের উত্তর দেয় এমন ড্যাশবোর্ড।',
        difficulty: 'advanced',
        estimatedMinutes: 42,
        prerequisites: ['DEVOPS-KUBERNETES-FUNDAMENTALS', 'BACKEND-HTTP-REST-API-DESIGN'],
        unlocks: [],
        related: ['DEVOPS-GITHUB-ACTIONS-CI'],
        careers: [C.devops, C.be],
        tags: ['observability', 'prometheus', 'grafana'],
        sources: ['PROMETHEUS-DOCS', 'GRAFANA-DOCS'],
      },
      body: `
## Why logs alone are not enough

Logs tell stories; metrics tell trends and trigger alerts. Traces connect requests. Start with golden signals: latency, traffic, errors, saturation.

## Mental model

<Callout type="mental-model">
  Prometheus pulls metrics from targets. Time series are identified by metric name + labels. Grafana visualizes and alerts on queries.
</Callout>

Instrument RED/USE methods thoughtfully; high-cardinality labels (user ids) can explode storage.

${commonFooter({
  mistakes: [
    { title: 'Alerting on raw noisy metrics', detail: 'Alert on symptoms/SLOs.' },
    { title: 'Unbounded label cardinality', detail: 'Breaks Prometheus.' },
    { title: 'Dashboards without runbooks', detail: 'Pages that nobody can act on.' },
  ],
  interview:
    'What four golden signals would you monitor for a NestJS API and why?',
  practice: [
    'Expose a /metrics endpoint conceptually.',
    'Write a simple PromQL rate() query.',
    'Sketch a Grafana dashboard for API latency.',
  ],
  sourceIds: ['PROMETHEUS-DOCS', 'GRAFANA-DOCS'],
})}
`,
    },
  ];

  for (const t of topics) {
    t.meta.related = (t.meta.related || []).filter(
      (id) => !['DOCKER-BRIDGE', 'GHA-SERVICE-CONTAINERS'].includes(id),
    );
  }

  return topics.map((t) => writeTopic('devops', t.slug, t.meta, t.body));
}
