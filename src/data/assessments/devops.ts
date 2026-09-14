import type { AssessmentBank } from './types';

export const devopsAssessment: AssessmentBank = {
  id: 'devops-assessment',
  trackId: 'devops',
  title: 'DevOps knowledge check',
  titleBn: 'DevOps জ্ঞান যাচাই',
  description:
    'Prerequisite-aware checks for Linux, networking, Docker, CI/CD, cloud, and Kubernetes basics.',
  questions: [
    {
      id: 'devops-conf-linux',
      type: 'self-confidence',
      prompt: 'How confident are you navigating a Linux shell: files, permissions, processes, and logs?',
      promptBn: 'Linux শেলে ফাইল, পারমিশন, প্রসেস ও লগ নিয়ে কাজ করতে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['DEVOPS-LINUX', 'DEVOPS-BASH'],
      weight: 1.2,
    },
    {
      id: 'devops-conf-k8s',
      type: 'self-confidence',
      prompt: 'How confident are you explaining Pods, Deployments, and Services in Kubernetes?',
      promptBn: 'Kubernetes-এ Pod, Deployment ও Service ব্যাখ্যায় আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['DEVOPS-KUBERNETES'],
      weight: 1,
    },
    {
      id: 'devops-mcq-docker',
      type: 'multiple-choice',
      prompt: 'What does a Docker image primarily package?',
      promptBn: 'Docker image মূলত কী প্যাকেজ করে?',
      skillIds: ['DEVOPS-DOCKER'],
      options: [
        {
          id: 'a',
          label: 'Application code plus filesystem layers and metadata to run a container',
          labelBn: 'অ্যাপ কোডসহ filesystem layer ও কন্টেইনার চালানোর মেটাডেটা',
        },
        {
          id: 'b',
          label: 'Only a React component tree',
          labelBn: 'শুধু একটি React component tree',
        },
        {
          id: 'c',
          label: 'A physical rack server',
          labelBn: 'একটি ফিজিক্যাল র্যাক সার্ভার',
        },
        {
          id: 'd',
          label: 'A Figma design library',
          labelBn: 'একটি Figma ডিজাইন লাইব্রেরি',
        },
      ],
      correctAnswer: 'a',
      weight: 1.5,
    },
    {
      id: 'devops-mcq-compose',
      type: 'multiple-choice',
      prompt: 'Docker Compose is most useful when you need to:',
      promptBn: 'Docker Compose সবচেয়ে উপযোগী যখন আপনার দরকার:',
      skillIds: ['DEVOPS-DOCKER-COMPOSE', 'DEVOPS-DOCKER'],
      options: [
        {
          id: 'a',
          label: 'Define and run multi-container local stacks declaratively',
          labelBn: 'মাল্টি-কন্টেইনার লোকাল স্ট্যাক ঘোষণামূলকভাবে চালানো',
        },
        {
          id: 'b',
          label: 'Replace HTTPS with plain FTP everywhere',
          labelBn: 'সব জায়গায় HTTPS-এর বদলে plain FTP',
        },
        {
          id: 'c',
          label: 'Compile Dart to WebAssembly only',
          labelBn: 'শুধু Dart-কে WebAssembly-এ কম্পাইল করা',
        },
        {
          id: 'd',
          label: 'Draw wireframes',
          labelBn: 'ওয়ারফ্রেম আঁকা',
        },
      ],
      correctAnswer: 'a',
      weight: 1.3,
    },
    {
      id: 'devops-conceptual-cicd',
      type: 'conceptual',
      prompt: 'A CI pipeline’s main purpose is to:',
      promptBn: 'CI পাইপলাইনের মূল উদ্দেশ্য:',
      skillIds: ['DEVOPS-CICD'],
      options: [
        {
          id: 'a',
          label: 'Automatically build/test changes to catch regressions early',
          labelBn: 'রিগ্রেশন আগে ধরতে পরিবর্তন স্বয়ংক্রিয়ভাবে build/test করা',
        },
        {
          id: 'b',
          label: 'Manually copy files with USB sticks as policy',
          labelBn: 'নীতি হিসেবে USB দিয়ে ম্যানুয়ালি ফাইল কপি করা',
        },
        {
          id: 'c',
          label: 'Disable all automated tests',
          labelBn: 'সব অটোমেটেড টেস্ট বন্ধ করা',
        },
        {
          id: 'd',
          label: 'Store production passwords in chat',
          labelBn: 'প্রোডাকশন পাসওয়ার্ড চ্যাটে রাখা',
        },
      ],
      correctAnswer: 'a',
      weight: 1.4,
    },
    {
      id: 'devops-scenario-proxy',
      type: 'scenario',
      prompt:
        'Traffic reaches your app only through port 443 on a public host, while containers listen on internal ports. Which component commonly terminates TLS and forwards requests?',
      promptBn:
        'পাবলিক হোস্টে শুধু পোর্ট 443 দিয়ে ট্রাফিক আসে, কন্টেইনার অভ্যন্তরীণ পোর্টে শোনে। TLS terminate করে রিকোয়েস্ট ফরওয়ার্ড করে সাধারণত কোন কম্পোনেন্ট?',
      skillIds: ['DEVOPS-NGINX', 'DEVOPS-NETWORKING', 'FOUNDATIONS-HTTPS-TLS'],
      options: [
        { id: 'a', label: 'A reverse proxy such as Nginx', labelBn: 'Nginx-এর মতো রিভার্স প্রক্সি' },
        { id: 'b', label: 'A CSS Grid container', labelBn: 'একটি CSS Grid কন্টেইনার' },
        { id: 'c', label: 'A Flutter StreamBuilder', labelBn: 'একটি Flutter StreamBuilder' },
        { id: 'd', label: 'A Scrum retrospective', labelBn: 'একটি Scrum retrospective' },
      ],
      correctAnswer: 'a',
      weight: 1.6,
    },
    {
      id: 'devops-code-reading-dockerfile',
      type: 'code-reading',
      prompt:
        'A Dockerfile ends with `CMD ["node", "server.js"]`. What does CMD define here?',
      promptBn:
        'Dockerfile-এর শেষে `CMD ["node", "server.js"]` থাকলে CMD এখানে কী নির্ধারণ করে?',
      skillIds: ['DEVOPS-DOCKER'],
      options: [
        {
          id: 'a',
          label: 'The default process to run when the container starts',
          labelBn: 'কন্টেইনার স্টার্ট হলে চলবে এমন ডিফল্ট প্রসেস',
        },
        {
          id: 'b',
          label: 'The only allowed Git branch name',
          labelBn: 'একমাত্র অনুমোদিত Git ব্রাঞ্চ নাম',
        },
        {
          id: 'c',
          label: 'The PostgreSQL isolation level',
          labelBn: 'PostgreSQL isolation level',
        },
        {
          id: 'd',
          label: 'The Figma component variant',
          labelBn: 'Figma component variant',
        },
      ],
      correctAnswer: 'a',
      weight: 1.4,
    },
    {
      id: 'devops-mcq-aws',
      type: 'multiple-choice',
      prompt: 'In AWS, which service is primarily object storage?',
      promptBn: 'AWS-এ কোন সার্ভিস মূলত object storage?',
      skillIds: ['DEVOPS-AWS', 'DEVOPS-CLOUD-FUNDAMENTALS'],
      options: [
        { id: 'a', label: 'Amazon S3', labelBn: 'Amazon S3' },
        { id: 'b', label: 'Amazon SQS as a filesystem mount only', labelBn: 'শুধু filesystem mount হিসেবে Amazon SQS' },
        { id: 'c', label: 'AWS IAM as a block device', labelBn: 'ব্লক ডিভাইস হিসেবে AWS IAM' },
        { id: 'd', label: 'CloudFront as a relational database', labelBn: 'রিলেশনাল ডেটাবেস হিসেবে CloudFront' },
      ],
      correctAnswer: 'a',
      weight: 1.2,
    },
  ],
};

export default devopsAssessment;
