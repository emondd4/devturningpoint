import type { AssessmentBank } from './types';

export const frontendAssessment: AssessmentBank = {
  id: 'frontend-assessment',
  trackId: 'frontend',
  title: 'Frontend knowledge check',
  titleBn: 'ফ্রন্টএন্ড জ্ঞান যাচাই',
  description:
    'Assess HTML/CSS/JS/TS/React readiness before recommending a personalized frontend roadmap.',
  questions: [
    {
      id: 'frontend-conf-react',
      type: 'self-confidence',
      prompt: 'How confident are you building interactive UIs with React hooks?',
      promptBn: 'React hooks দিয়ে ইন্টারঅ্যাকটিভ UI বানাতে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['FRONTEND-REACT', 'FRONTEND-REACT-HOOKS'],
      weight: 1.2,
    },
    {
      id: 'frontend-conf-css',
      type: 'self-confidence',
      prompt: 'How confident are you with Flexbox and CSS Grid for page layout?',
      promptBn: 'পেজ লেআউটে Flexbox ও CSS Grid ব্যবহারে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['FRONTEND-CSS-LAYOUT'],
      weight: 1,
    },
    {
      id: 'frontend-mcq-semantic',
      type: 'multiple-choice',
      prompt: 'Which element is the most appropriate landmark for primary page navigation?',
      promptBn: 'প্রাইমারি পেজ নেভিগেশনের জন্য কোন element সবচেয়ে উপযুক্ত landmark?',
      skillIds: ['FRONTEND-HTML-SEMANTICS', 'FRONTEND-A11Y'],
      options: [
        { id: 'a', label: '<div class="nav">', labelBn: '<div class="nav">' },
        { id: 'b', label: '<nav>', labelBn: '<nav>' },
        { id: 'c', label: '<span>', labelBn: '<span>' },
        { id: 'd', label: '<blink>', labelBn: '<blink>' },
      ],
      correctAnswer: 'b',
      weight: 1.4,
    },
    {
      id: 'frontend-mcq-specificity',
      type: 'multiple-choice',
      prompt: 'In CSS, which selector is generally more specific?',
      promptBn: 'CSS-এ সাধারণত কোন selector বেশি specific?',
      skillIds: ['FRONTEND-CSS'],
      options: [
        { id: 'a', label: 'Element selector: button', labelBn: 'Element selector: button' },
        { id: 'b', label: 'Class selector: .primary', labelBn: 'Class selector: .primary' },
        { id: 'c', label: 'ID selector: #submit', labelBn: 'ID selector: #submit' },
        { id: 'd', label: 'Universal selector: *', labelBn: 'Universal selector: *' },
      ],
      correctAnswer: 'c',
      weight: 1.3,
    },
    {
      id: 'frontend-conceptual-closure',
      type: 'conceptual',
      prompt: 'A JavaScript closure is best described as:',
      promptBn: 'JavaScript closure-কে সবচেয়ে ভালোভাবে বর্ণনা করা যায়:',
      skillIds: ['FRONTEND-JAVASCRIPT', 'FRONTEND-JS-OBJECTS'],
      options: [
        {
          id: 'a',
          label: 'A function that remembers variables from its lexical scope',
          labelBn: 'এমন ফাংশন যা তার lexical scope-এর ভেরিয়েবল মনে রাখে',
        },
        {
          id: 'b',
          label: 'A CSS rule that closes a media query',
          labelBn: 'মিডিয়া কোয়েরি বন্ধ করে এমন CSS রুল',
        },
        {
          id: 'c',
          label: 'A React component that cannot accept props',
          labelBn: 'props নিতে পারে না এমন React component',
        },
        {
          id: 'd',
          label: 'A TCP connection teardown packet',
          labelBn: 'TCP কানেকশন teardown প্যাকেট',
        },
      ],
      correctAnswer: 'a',
      weight: 1.5,
    },
    {
      id: 'frontend-scenario-hydration',
      type: 'scenario',
      prompt:
        'A Next.js page renders on the server then becomes interactive in the browser. Which skill area is most relevant when debugging a mismatch between server and client markup?',
      promptBn:
        'Next.js পেজ সার্ভারে রেন্ডার হয়, তারপর ব্রাউজারে ইন্টারঅ্যাকটিভ হয়। সার্ভার ও ক্লায়েন্ট markup mismatch ডিবাগ করতে কোন skill সবচেয়ে প্রাসঙ্গিক?',
      skillIds: ['FRONTEND-NEXTJS', 'FRONTEND-NEXTJS-ROUTING'],
      options: [
        { id: 'a', label: 'Docker multi-stage builds', labelBn: 'Docker multi-stage build' },
        { id: 'b', label: 'SSR/client rendering boundaries', labelBn: 'SSR/ক্লায়েন্ট রেন্ডারিং সীমানা' },
        { id: 'c', label: 'PostgreSQL isolation levels', labelBn: 'PostgreSQL isolation level' },
        { id: 'd', label: 'Scrum sprint velocity', labelBn: 'Scrum sprint velocity' },
      ],
      correctAnswer: 'b',
      weight: 1.6,
    },
    {
      id: 'frontend-code-reading-hook',
      type: 'code-reading',
      prompt:
        'In React, `useState(0)` returns a pair. What does the second element of that pair represent?',
      promptBn:
        'React-এ `useState(0)` একটি জোড়া ফেরত দেয়। জোড়ার দ্বিতীয় উপাদান কী নির্দেশ করে?',
      skillIds: ['FRONTEND-REACT-HOOKS', 'FRONTEND-REACT'],
      options: [
        { id: 'a', label: 'The previous prop value', labelBn: 'আগের prop মান' },
        { id: 'b', label: 'A function to update the state', labelBn: 'স্টেট আপডেট করার ফাংশন' },
        { id: 'c', label: 'The component CSS class', labelBn: 'কম্পোনেন্টের CSS class' },
        { id: 'd', label: 'The React root DOM node', labelBn: 'React root DOM নোড' },
      ],
      correctAnswer: 'b',
      weight: 1.5,
    },
    {
      id: 'frontend-mcq-ts',
      type: 'multiple-choice',
      prompt: 'What does TypeScript primarily add on top of JavaScript?',
      promptBn: 'JavaScript-এর ওপরে TypeScript মূলত কী যোগ করে?',
      skillIds: ['FRONTEND-TYPESCRIPT'],
      options: [
        { id: 'a', label: 'A new browser rendering engine', labelBn: 'নতুন ব্রাউজার রেন্ডারিং ইঞ্জিন' },
        { id: 'b', label: 'Optional static types and tooling', labelBn: 'ঐচ্ছিক স্ট্যাটিক টাইপ ও টুলিং' },
        { id: 'c', label: 'Mandatory GPU shaders', labelBn: 'বাধ্যতামূলক GPU shader' },
        { id: 'd', label: 'A replacement for HTTP', labelBn: 'HTTP-এর বিকল্প' },
      ],
      correctAnswer: 'b',
      weight: 1.2,
    },
  ],
};

export default frontendAssessment;
