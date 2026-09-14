import type { AssessmentBank } from './types';

export const backendAssessment: AssessmentBank = {
  id: 'backend-assessment',
  trackId: 'backend',
  title: 'Backend knowledge check',
  titleBn: 'ব্যাকএন্ড জ্ঞান যাচাই',
  description:
    'Checks Node.js, REST, NestJS, PostgreSQL, auth, and production API fundamentals.',
  questions: [
    {
      id: 'backend-conf-nestjs',
      type: 'self-confidence',
      prompt: 'How confident are you structuring APIs with NestJS modules, controllers, and providers?',
      promptBn: 'NestJS modules, controllers ও providers দিয়ে API গঠনে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['BACKEND-NESTJS', 'BACKEND-NESTJS-DI'],
      weight: 1.2,
    },
    {
      id: 'backend-conf-sql',
      type: 'self-confidence',
      prompt: 'How confident are you writing SQL joins and modeling relational tables?',
      promptBn: 'SQL join লেখা এবং রিলেশনাল টেবিল মডেলিংয়ে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['BACKEND-POSTGRES', 'DATABASE-SQL'],
      weight: 1,
    },
    {
      id: 'backend-mcq-rest-status',
      type: 'multiple-choice',
      prompt: 'Which status code best indicates a successful resource creation?',
      promptBn: 'রিসোর্স সফলভাবে তৈরি হলে কোন status code সবচেয়ে উপযুক্ত?',
      skillIds: ['BACKEND-REST', 'BACKEND-HTTP-SERVER'],
      options: [
        { id: 'a', label: '200 OK (always)', labelBn: '200 OK (সবসময়)' },
        { id: 'b', label: '201 Created', labelBn: '201 Created' },
        { id: 'c', label: '204 No Content for every create', labelBn: 'প্রতি create-এ 204' },
        { id: 'd', label: '301 Moved Permanently', labelBn: '301 Moved Permanently' },
      ],
      correctAnswer: 'b',
      weight: 1.4,
    },
    {
      id: 'backend-mcq-jwt',
      type: 'multiple-choice',
      prompt: 'In a typical JWT access-token flow, where should long-lived refresh secrets NOT be stored?',
      promptBn: 'সাধারণ JWT access-token ফ্লোতে দীর্ঘমেয়াদি refresh secret কোথায় রাখা উচিত নয়?',
      skillIds: ['BACKEND-JWT', 'BACKEND-AUTH', 'BACKEND-SECURITY'],
      options: [
        { id: 'a', label: 'In a secure HTTP-only cookie (when designed carefully)', labelBn: 'সুরক্ষিত HTTP-only cookie-তে (সতর্ক ডিজাইনে)' },
        { id: 'b', label: 'In plaintext inside public frontend JavaScript source', labelBn: 'পাবলিক ফ্রন্টএন্ড JavaScript সোর্সে plaintext-এ' },
        { id: 'c', label: 'In a server-side secret store / env config', labelBn: 'সার্ভার-সাইড secret store / env-এ' },
        { id: 'd', label: 'In a hashed form in a database of refresh tokens', labelBn: 'ডেটাবেসে হ্যাশ করা refresh token হিসেবে' },
      ],
      correctAnswer: 'b',
      weight: 1.6,
    },
    {
      id: 'backend-conceptual-di',
      type: 'conceptual',
      prompt: 'Dependency injection in NestJS primarily helps you:',
      promptBn: 'NestJS-এ dependency injection মূলত সাহায্য করে:',
      skillIds: ['BACKEND-NESTJS-DI', 'BACKEND-NESTJS'],
      options: [
        {
          id: 'a',
          label: 'Replace SQL with CSS',
          labelBn: 'SQL-কে CSS দিয়ে প্রতিস্থাপন করতে',
        },
        {
          id: 'b',
          label: 'Decouple classes from concrete collaborators for testability',
          labelBn: 'টেস্টযোগ্যতার জন্য ক্লাসকে concrete collaborator থেকে আলাদা করতে',
        },
        {
          id: 'c',
          label: 'Force every handler to be synchronous',
          labelBn: 'প্রতিটি handler-কে synchronous করতে বাধ্য করতে',
        },
        {
          id: 'd',
          label: 'Disable HTTP status codes',
          labelBn: 'HTTP status code বন্ধ করতে',
        },
      ],
      correctAnswer: 'b',
      weight: 1.5,
    },
    {
      id: 'backend-scenario-nplusone',
      type: 'scenario',
      prompt:
        'An endpoint that lists orders suddenly becomes slow after adding per-order customer lookups in a loop. What is the most likely class of problem?',
      promptBn:
        'অর্ডার তালিকার endpoint-এ লুপে প্রতি অর্ডারের customer lookup যোগ করার পর ধীর হয়ে যায়। সবচেয়ে সম্ভাব্য সমস্যার ধরন কী?',
      skillIds: ['BACKEND-ORM', 'BACKEND-POSTGRES'],
      options: [
        { id: 'a', label: 'N+1 query pattern', labelBn: 'N+1 query প্যাটার্ন' },
        { id: 'b', label: 'Missing favicon.ico', labelBn: 'favicon.ico অনুপস্থিত' },
        { id: 'c', label: 'Incorrect TLS cipher on CDN only', labelBn: 'শুধু CDN-এ ভুল TLS cipher' },
        { id: 'd', label: 'Kanban WIP limit too low', labelBn: 'Kanban WIP limit খুব কম' },
      ],
      correctAnswer: 'a',
      weight: 1.5,
    },
    {
      id: 'backend-code-reading-async',
      type: 'code-reading',
      prompt:
        'In Node.js, `await fetch(url)` inside an `async` function waits for the Promise to settle. What happens if you omit `await` and ignore the Promise?',
      promptBn:
        'Node.js-এ `async` ফাংশনের ভিতরে `await fetch(url)` Promise settle হওয়া পর্যন্ত অপেক্ষা করে। `await` বাদ দিলে ও Promise ignore করলে কী হয়?',
      skillIds: ['BACKEND-NODE', 'FRONTEND-JS-ASYNC'],
      options: [
        {
          id: 'a',
          label: 'The request still starts, but you may miss errors/results',
          labelBn: 'রিকোয়েস্ট শুরু হতে পারে, কিন্তু error/result মিস হতে পারে',
        },
        {
          id: 'b',
          label: 'Node.js permanently deletes the URL',
          labelBn: 'Node.js স্থায়ীভাবে URL মুছে ফেলে',
        },
        {
          id: 'c',
          label: 'PostgreSQL automatically rolls back every transaction',
          labelBn: 'PostgreSQL স্বয়ংক্রিয়ভাবে সব transaction রোলব্যাক করে',
        },
        {
          id: 'd',
          label: 'TypeScript refuses to emit any JavaScript forever',
          labelBn: 'TypeScript চিরকাল JavaScript emit করতে অস্বীকার করে',
        },
      ],
      correctAnswer: 'a',
      weight: 1.4,
    },
    {
      id: 'backend-mcq-redis',
      type: 'multiple-choice',
      prompt: 'Redis is most commonly introduced in backend systems as a:',
      promptBn: 'ব্যাকএন্ড সিস্টেমে Redis সাধারণত কোন ভূমিকায় আসে?',
      skillIds: ['BACKEND-REDIS'],
      options: [
        { id: 'a', label: 'In-memory cache / fast ephemeral store', labelBn: 'ইন-মেমোরি ক্যাশ / দ্রুত ephemeral store' },
        { id: 'b', label: 'CSS preprocessor', labelBn: 'CSS preprocessor' },
        { id: 'c', label: 'Mobile UI widget tree', labelBn: 'মোবাইল UI widget tree' },
        { id: 'd', label: 'Git hosting provider', labelBn: 'Git হোস্টিং প্রোভাইডার' },
      ],
      correctAnswer: 'a',
      weight: 1.2,
    },
  ],
};

export default backendAssessment;
