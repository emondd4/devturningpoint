import type { AssessmentBank } from './types';

export const flutterAssessment: AssessmentBank = {
  id: 'flutter-assessment',
  trackId: 'mobile-flutter',
  title: 'Flutter knowledge check',
  titleBn: 'Flutter জ্ঞান যাচাই',
  description:
    'Assess Dart and Flutter readiness across widgets, state, async, networking, and testing.',
  questions: [
    {
      id: 'flutter-conf-widgets',
      type: 'self-confidence',
      prompt: 'How confident are you composing Flutter UIs from StatelessWidget and StatefulWidget?',
      promptBn: 'StatelessWidget ও StatefulWidget দিয়ে Flutter UI গঠনে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['MOBILE-FLUTTER-WIDGETS'],
      weight: 1.2,
    },
    {
      id: 'flutter-conf-state',
      type: 'self-confidence',
      prompt: 'How confident are you choosing and applying a Flutter state-management approach?',
      promptBn: 'Flutter state-management পদ্ধতি বেছে নেওয়া ও প্রয়োগে আপনি কতটা আত্মবিশ্বাসী?',
      skillIds: ['MOBILE-FLUTTER-STATE'],
      weight: 1.2,
    },
    {
      id: 'flutter-mcq-dart-future',
      type: 'multiple-choice',
      prompt: 'In Dart, which construct best represents a single asynchronous result?',
      promptBn: 'Dart-এ একটিমাত্র অ্যাসিঙ্ক্রোনাস ফলাফল কোন construct সবচেয়ে ভালো উপস্থাপন করে?',
      skillIds: ['MOBILE-DART-ASYNC', 'MOBILE-DART-BASICS'],
      options: [
        { id: 'a', label: 'Future', labelBn: 'Future' },
        { id: 'b', label: 'Row', labelBn: 'Row' },
        { id: 'c', label: 'EdgeInsets', labelBn: 'EdgeInsets' },
        { id: 'd', label: 'BoxDecoration', labelBn: 'BoxDecoration' },
      ],
      correctAnswer: 'a',
      weight: 1.4,
    },
    {
      id: 'flutter-mcq-constraints',
      type: 'multiple-choice',
      prompt: 'Flutter layout is often summarized as “constraints go down, sizes go up.” This relates most to:',
      promptBn: 'Flutter লেআউট প্রায়ই বলা হয় “constraints নিচে যায়, sizes উপরে যায়।” এটি মূলত সম্পর্কিত:',
      skillIds: ['MOBILE-FLUTTER-LAYOUT'],
      options: [
        { id: 'a', label: 'Parent–child layout negotiation', labelBn: 'প্যারেন্ট–চাইল্ড লেআউট আলোচনা' },
        { id: 'b', label: 'PostgreSQL foreign keys', labelBn: 'PostgreSQL foreign key' },
        { id: 'c', label: 'DNS zone transfers', labelBn: 'DNS zone transfer' },
        { id: 'd', label: 'Scrum story points', labelBn: 'Scrum story point' },
      ],
      correctAnswer: 'a',
      weight: 1.5,
    },
    {
      id: 'flutter-conceptual-buildcontext',
      type: 'conceptual',
      prompt: 'BuildContext in Flutter is primarily used to:',
      promptBn: 'Flutter-এ BuildContext মূলত ব্যবহৃত হয়:',
      skillIds: ['MOBILE-FLUTTER-WIDGETS', 'MOBILE-FLUTTER-NAVIGATION'],
      options: [
        {
          id: 'a',
          label: 'Locate theme, media query, and navigator relative to the widget tree',
          labelBn: 'widget tree-এর সাপেক্ষে theme, media query ও navigator খুঁজে পেতে',
        },
        {
          id: 'b',
          label: 'Compile Dart into JVM bytecode only',
          labelBn: 'শুধু Dart-কে JVM bytecode-এ কম্পাইল করতে',
        },
        {
          id: 'c',
          label: 'Replace Git commits',
          labelBn: 'Git commit প্রতিস্থাপন করতে',
        },
        {
          id: 'd',
          label: 'Configure Kubernetes ingress',
          labelBn: 'Kubernetes ingress কনফিগার করতে',
        },
      ],
      correctAnswer: 'a',
      weight: 1.5,
    },
    {
      id: 'flutter-scenario-setstate',
      type: 'scenario',
      prompt:
        'Tapping a button should update a counter on screen, but the UI never changes even though a variable increments in memory. What is the most likely Flutter mistake for a simple StatefulWidget?',
      promptBn:
        'বাটনে ট্যাপ করলে কাউন্টার বাড়ছে মেমোরিতে, কিন্তু UI বদলাচ্ছে না। সাধারণ StatefulWidget-এ সবচেয়ে সম্ভাব্য ভুল কী?',
      skillIds: ['MOBILE-FLUTTER-STATE', 'MOBILE-FLUTTER-WIDGETS'],
      options: [
        {
          id: 'a',
          label: 'Mutating state without setState (or equivalent notifier)',
          labelBn: 'setState (বা সমতুল্য notifier) ছাড়াই স্টেট পরিবর্তন',
        },
        {
          id: 'b',
          label: 'Forgetting to install Nginx on the phone',
          labelBn: 'ফোনে Nginx ইনস্টল করতে ভুলে যাওয়া',
        },
        {
          id: 'c',
          label: 'Using UTF-8 instead of ASCII in pubspec',
          labelBn: 'pubspec-এ ASCII-এর বদলে UTF-8 ব্যবহার',
        },
        {
          id: 'd',
          label: 'Naming the project in Bengali',
          labelBn: 'প্রজেক্টের নাম বাংলায় রাখা',
        },
      ],
      correctAnswer: 'a',
      weight: 1.6,
    },
    {
      id: 'flutter-code-reading-const',
      type: 'code-reading',
      prompt:
        'Why might Flutter encourage `const` constructors on widgets when values are compile-time known?',
      promptBn:
        'মান compile-time জানা থাকলে Flutter কেন widget-এ `const` constructor উৎসাহিত করে?',
      skillIds: ['MOBILE-FLUTTER-PERFORMANCE', 'MOBILE-FLUTTER-WIDGETS'],
      options: [
        {
          id: 'a',
          label: 'To reuse immutable widget instances and reduce rebuild work',
          labelBn: 'অপরিবর্তনীয় widget ইনস্ট্যান্স পুনব্যবহার ও rebuild কমাতে',
        },
        {
          id: 'b',
          label: 'To force every widget to call the network',
          labelBn: 'প্রতিটি widget-কে নেটওয়ার্ক কল করতে বাধ্য করতে',
        },
        {
          id: 'c',
          label: 'To disable hot reload permanently',
          labelBn: 'hot reload স্থায়ীভাবে বন্ধ করতে',
        },
        {
          id: 'd',
          label: 'To convert Dart into SQL automatically',
          labelBn: 'Dart স্বয়ংক্রিয়ভাবে SQL-এ রূপান্তর করতে',
        },
      ],
      correctAnswer: 'a',
      weight: 1.3,
    },
    {
      id: 'flutter-mcq-testing',
      type: 'multiple-choice',
      prompt: 'Which Flutter test type is best for verifying a widget’s rendered UI behavior?',
      promptBn: 'widget-এর রেন্ডার করা UI আচরণ যাচাইয়ে কোন Flutter টেস্ট টাইপ সবচেয়ে উপযুক্ত?',
      skillIds: ['MOBILE-FLUTTER-TESTING'],
      options: [
        { id: 'a', label: 'Widget tests', labelBn: 'Widget tests' },
        { id: 'b', label: 'DNS zone tests', labelBn: 'DNS zone tests' },
        { id: 'c', label: 'Terraform plan tests only', labelBn: 'শুধু Terraform plan tests' },
        { id: 'd', label: 'Kanban WIP audits', labelBn: 'Kanban WIP audit' },
      ],
      correctAnswer: 'a',
      weight: 1.2,
    },
  ],
};

export default flutterAssessment;
