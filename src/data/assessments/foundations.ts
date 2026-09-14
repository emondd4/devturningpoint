import type { AssessmentBank } from './types';

export const foundationsAssessment: AssessmentBank = {
  id: 'foundations-assessment',
  trackId: 'foundations',
  title: 'Foundations knowledge check',
  titleBn: 'মৌলিক জ্ঞান যাচাই',
  description:
    'Mixed confidence, conceptual, and practical checks across computing, programming, Git, and networking basics.',
  questions: [
    {
      id: 'foundations-conf-binary',
      type: 'self-confidence',
      prompt: 'How confident are you explaining binary and converting between binary and decimal?',
      promptBn: 'বাইনারি ব্যাখ্যা এবং বাইনারি–ডেসিমাল রূপান্তরে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['FOUNDATIONS-BINARY'],
      weight: 1,
    },
    {
      id: 'foundations-conf-git',
      type: 'self-confidence',
      prompt: 'How confident are you using Git for everyday commits, branches, and merges?',
      promptBn: 'দৈনন্দিন commit, branch ও merge-এ Git ব্যবহারে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['FOUNDATIONS-GIT'],
      weight: 1.2,
    },
    {
      id: 'foundations-mcq-http-method',
      type: 'multiple-choice',
      prompt: 'Which HTTP method is conventionally used to create a new resource via a REST-style API?',
      promptBn: 'REST-স্টাইল API-তে নতুন রিসোর্স তৈরি করতে সাধারণত কোন HTTP method ব্যবহার হয়?',
      skillIds: ['FOUNDATIONS-HTTP', 'FOUNDATIONS-API-CONCEPTS'],
      options: [
        { id: 'a', label: 'GET', labelBn: 'GET' },
        { id: 'b', label: 'POST', labelBn: 'POST' },
        { id: 'c', label: 'HEAD', labelBn: 'HEAD' },
        { id: 'd', label: 'OPTIONS', labelBn: 'OPTIONS' },
      ],
      correctAnswer: 'b',
      weight: 1.5,
    },
    {
      id: 'foundations-mcq-complexity',
      type: 'multiple-choice',
      prompt: 'What is the typical average-case time complexity of binary search on a sorted array?',
      promptBn: 'সorted অ্যারেতে binary search-এর গড় সময় জটিলতা সাধারণত কী?',
      skillIds: ['FOUNDATIONS-ALGORITHMS', 'FOUNDATIONS-COMPLEXITY'],
      options: [
        { id: 'a', label: 'O(1)', labelBn: 'O(1)' },
        { id: 'b', label: 'O(log n)', labelBn: 'O(log n)' },
        { id: 'c', label: 'O(n)', labelBn: 'O(n)' },
        { id: 'd', label: 'O(n log n)', labelBn: 'O(n log n)' },
      ],
      correctAnswer: 'b',
      weight: 1.5,
    },
    {
      id: 'foundations-conceptual-process',
      type: 'conceptual',
      prompt: 'A process and a thread primarily differ in that:',
      promptBn: 'প্রসেস ও থ্রেডের মূল পার্থক্য হলো:',
      skillIds: ['FOUNDATIONS-PROCESSES'],
      options: [
        {
          id: 'a',
          label: 'Threads never share memory with other threads in the same process',
          labelBn: 'একই প্রসেসের থ্রেডগুলো কখনো মেমোরি শেয়ার করে না',
        },
        {
          id: 'b',
          label: 'Threads within a process typically share the same address space',
          labelBn: 'একই প্রসেসের থ্রেডগুলো সাধারণত একই অ্যাড্রেস স্পেস শেয়ার করে',
        },
        {
          id: 'c',
          label: 'A process cannot contain more than one thread',
          labelBn: 'একটি প্রসেসে একের বেশি থ্রেড থাকতে পারে না',
        },
        {
          id: 'd',
          label: 'Threads are scheduled by DNS, not the OS',
          labelBn: 'থ্রেড OS নয়, DNS দ্বারা শিডিউল হয়',
        },
      ],
      correctAnswer: 'b',
      weight: 1.4,
    },
    {
      id: 'foundations-scenario-tls',
      type: 'scenario',
      prompt:
        'Users report that a site works on http://localhost but browsers warn on https://staging.example.com. Which foundation topic is most directly involved?',
      promptBn:
        'http://localhost-এ সাইট চলে, কিন্তু https://staging.example.com-এ ব্রাউজার সতর্ক করে। কোন মৌলিক বিষয় সবচেয়ে সরাসরি জড়িত?',
      skillIds: ['FOUNDATIONS-HTTPS-TLS', 'FOUNDATIONS-SECURITY-BASICS'],
      options: [
        { id: 'a', label: 'Git merge conflicts', labelBn: 'Git merge conflict' },
        { id: 'b', label: 'TLS certificates and trust chain', labelBn: 'TLS সার্টিফিকেট ও ট্রাস্ট চেইন' },
        { id: 'c', label: 'Array sorting algorithms', labelBn: 'অ্যারে সর্টিং অ্যালগরিদম' },
        { id: 'd', label: 'CSS box model', labelBn: 'CSS বক্স মডেল' },
      ],
      correctAnswer: 'b',
      weight: 1.6,
    },
    {
      id: 'foundations-code-reading-loop',
      type: 'code-reading',
      prompt:
        'Given: `let n = 0; while (n < 3) { n = n + 1; }` — what is the final value of `n`?',
      promptBn:
        '`let n = 0; while (n < 3) { n = n + 1; }` — `n`-এর চূড়ান্ত মান কী?',
      skillIds: ['FOUNDATIONS-CONTROL-FLOW', 'FOUNDATIONS-VARIABLES'],
      options: [
        { id: 'a', label: '0', labelBn: '0' },
        { id: 'b', label: '2', labelBn: '2' },
        { id: 'c', label: '3', labelBn: '3' },
        { id: 'd', label: '4', labelBn: '4' },
      ],
      correctAnswer: 'c',
      weight: 1.3,
    },
    {
      id: 'foundations-mcq-dns',
      type: 'multiple-choice',
      prompt: 'What is the primary job of DNS in everyday web browsing?',
      promptBn: 'দৈনন্দিন ওয়েব ব্রাউজিংয়ে DNS-এর প্রধান কাজ কী?',
      skillIds: ['FOUNDATIONS-DNS', 'FOUNDATIONS-TCP-IP'],
      options: [
        { id: 'a', label: 'Compress images before download', labelBn: 'ডাউনলোডের আগে ছবি কম্প্রেস করা' },
        { id: 'b', label: 'Resolve hostnames to IP addresses', labelBn: 'হোস্টনেমকে IP অ্যাড্রেসে রেজলভ করা' },
        { id: 'c', label: 'Compile TypeScript to JavaScript', labelBn: 'TypeScript থেকে JavaScript কম্পাইল করা' },
        { id: 'd', label: 'Store relational database rows', labelBn: 'রিলেশনাল ডেটাবেস রো সংরক্ষণ করা' },
      ],
      correctAnswer: 'b',
      weight: 1.2,
    },
  ],
};

export default foundationsAssessment;
