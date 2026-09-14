import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  mobile: 'CAREER-MOBILE-ENGINEER',
  se: 'CAREER-SOFTWARE-ENGINEER',
  fe: 'CAREER-FRONTEND-ENGINEER',
};

export function generateFlutter() {
  const topics = [
    {
      slug: 'dart-fundamentals',
      meta: {
        id: 'FLUTTER-DART-FUNDAMENTALS',
        title: 'Dart Fundamentals',
        titleBn: 'Dart এর মৌলিক বিষয়',
        description:
          'Null safety, types, classes, and collections—the language Flutter apps are written in.',
        descriptionBn:
          'Null safety, টাইপ, ক্লাস ও কালেকশন—যে ভাষায় Flutter অ্যাপ লেখা হয়।',
        difficulty: 'beginner',
        estimatedMinutes: 35,
        prerequisites: ['FOUNDATIONS-PROGRAMMING-VARIABLES'],
        unlocks: ['FLUTTER-DART-ASYNC-FUTURES-STREAMS', 'FLUTTER-WIDGET-TREE'],
        related: ['FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        careers: [C.mobile, C.se],
        tags: ['dart', 'flutter', 'null-safety'],
        sources: ['DART-LANGUAGE'],
      },
      body: `
## Why Dart before widgets

Flutter UI is declarative Dart. Weak language foundations show up as null crashes, awkward APIs, and state bugs—not as “I need another package.”

## Mental model

<Callout type="mental-model">
  Dart is sound null-safe: types track whether \`null\` is allowed. Prefer making illegal states unrepresentable with types and sealed-like modeling.
</Callout>

## Types and null safety

\`\`\`dart
String title = 'Dev Turning Point'; // non-nullable
String? subtitle; // nullable
print(subtitle?.length ?? 0);

final numbers = <int>[1, 2, 3];
final ages = <String, int>{'Nila': 22};
\`\`\`

## Classes and immutability habits

\`\`\`dart
class User {
  const User({required this.id, required this.email});
  final String id;
  final String email;
}

void main() {
  const user = User(id: 'u1', email: 'a@b.com');
  print(user.email);
}
\`\`\`

Prefer \`final\` fields and const constructors for value-like objects used in Flutter widgets.

${commonFooter({
  mistakes: [
    {
      title: 'Sprinkling \`!\` everywhere',
      detail: 'Null assertion hides bugs; fix types or handle null explicitly.',
    },
    {
      title: 'Mutable public fields',
      detail: 'Harder to reason about rebuilds and equality.',
    },
    {
      title: 'Ignoring \`var\` vs explicit types',
      detail: 'Be deliberate at API boundaries.',
    },
  ],
  interview:
    'Explain sound null safety and how you would model a loading/success/error UI state in Dart.',
  practice: [
    'Write a small Dart CLI using lists and maps.',
    'Refactor nullable fields into clearer types.',
    'Read the Dart language tour sections on types and classes.',
  ],
  sourceIds: ['DART-LANGUAGE'],
})}
`,
    },
    {
      slug: 'dart-async-futures-streams',
      meta: {
        id: 'FLUTTER-DART-ASYNC-FUTURES-STREAMS',
        title: 'Dart Async: Futures and Streams',
        titleBn: 'Dart অ্যাসিঙ্ক: Future ও Stream',
        description:
          'Single-shot Futures vs event Streams—async patterns that power Flutter networking and input.',
        descriptionBn:
          'একবারের Future বনাম ইভেন্ট Stream—Flutter নেটওয়ার্কিং ও ইনপুটের অ্যাসিঙ্ক প্যাটার্ন।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['FLUTTER-DART-FUNDAMENTALS'],
        unlocks: ['FLUTTER-NETWORKING-REST', 'FLUTTER-STATE-MANAGEMENT'],
        related: ['FOUNDATIONS-PROGRAMMING-VARIABLES', 'FRONTEND-JAVASCRIPT-ASYNC-EVENT-LOOP'],
        careers: [C.mobile, C.se],
        tags: ['dart', 'async', 'futures', 'streams'],
        sources: ['DART-ASYNC', 'DART-STREAMS'],
      },
      body: `
## Why async is not optional on mobile

Disk, network, and animations must not block the UI isolate. Dart’s \`Future\` and \`Stream\` are the core vocabulary.

## Mental model

<Callout type="mental-model">
  A Future is a single value-or-error that completes later. A Stream is a sequence of events over time (chunks, clicks, Firestore snapshots).
</Callout>

## Futures with async/await

\`\`\`dart
Future<String> fetchTitle() async {
  await Future<void>.delayed(const Duration(milliseconds: 200));
  return 'Topics';
}

Future<void> main() async {
  try {
    final title = await fetchTitle();
    print(title);
  } catch (e) {
    print('failed: $e');
  }
}
\`\`\`

## Streams

\`\`\`dart
Stream<int> countThree() async* {
  for (var i = 1; i <= 3; i++) {
    await Future<void>.delayed(const Duration(milliseconds: 100));
    yield i;
  }
}
\`\`\`

In Flutter, \`FutureBuilder\` / \`StreamBuilder\` bridge async data to widgets—but larger apps often lift state into dedicated state management.

<Callout type="warning">
  Forgetting to cancel stream subscriptions leaks work and can call \`setState\` after dispose.
</Callout>

${commonFooter({
  mistakes: [
    {
      title: 'Using async without awaiting',
      detail: 'Errors become unhandled; ordering becomes wrong.',
    },
    {
      title: 'Heavy work on the UI isolate',
      detail: 'CPU-bound loops jank frames; consider isolates for heavy compute.',
    },
    {
      title: 'Nested then-chains',
      detail: 'Prefer async/await for readability and catch blocks.',
    },
  ],
  interview:
    'Contrast Future vs Stream and describe how you would handle loading and error UI for each.',
  practice: [
    'Write a Future that fails and handle it.',
    'Consume a Stream with await for.',
    'Sketch when to use StreamBuilder vs a state manager.',
  ],
  sourceIds: ['DART-ASYNC', 'DART-STREAMS'],
})}
`,
    },
    {
      slug: 'flutter-widget-tree',
      meta: {
        id: 'FLUTTER-WIDGET-TREE',
        title: 'Flutter Widget Tree',
        titleBn: 'Flutter Widget ট্রি',
        description:
          'Widgets, Elements, and RenderObjects—how Flutter rebuilds UI efficiently.',
        descriptionBn:
          'Widget, Element ও RenderObject—Flutter কীভাবে UI দক্ষভাবে রিবিল্ড করে।',
        difficulty: 'beginner',
        estimatedMinutes: 36,
        prerequisites: ['FLUTTER-DART-FUNDAMENTALS'],
        unlocks: ['FLUTTER-CONSTRAINTS-LAYOUT', 'FLUTTER-STATE-MANAGEMENT'],
        related: ['FLUTTER-PERFORMANCE-DEVTOOLS'],
        careers: [C.mobile],
        tags: ['flutter', 'widgets', 'ui'],
        sources: ['FLUTTER-WIDGETS'],
      },
      body: `
## Why “everything is a widget” is a useful exaggeration

Composition of small widgets is Flutter’s UI model. Understanding the **widget tree** prevents giant \`build\` methods and accidental rebuild storms.

## Mental model

<Callout type="mental-model">
  Widgets are immutable configuration. Elements hold the living instance mounting widgets to the tree. RenderObjects handle layout and paint. Rebuilds swap widget configs; Flutter reuses elements when types/keys match.
</Callout>

## A minimal tree

\`\`\`dart
import 'package:flutter/material.dart';

class HelloPage extends StatelessWidget {
  const HelloPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dev Turning Point')),
      body: const Center(child: Text('Learn Flutter')),
    );
  }
}
\`\`\`

## Stateless vs Stateful

- \`StatelessWidget\`: UI from constructor inputs + inherited context.
- \`StatefulWidget\`: mutable \`State\` object that can \`setState\`.

Prefer lifting state up and keeping leaf widgets dumb.

${commonFooter({
  mistakes: [
    {
      title: 'Huge build methods',
      detail: 'Extract widgets; improves rebuild locality and readability.',
    },
    {
      title: 'Creating new objects that break equality carelessly',
      detail: 'Unstable keys and inline lambdas can hurt performance patterns.',
    },
    {
      title: 'Using BuildContext across async gaps unsafely',
      detail: 'Check \`mounted\` before using context after await.',
    },
  ],
  interview:
    'Explain the relationship between Widget, Element, and RenderObject at a high level.',
  practice: [
    'Build a screen from nested rows/columns.',
    'Convert a StatelessWidget to StatefulWidget with a counter.',
    'Split a large build into smaller widgets.',
  ],
  sourceIds: ['FLUTTER-WIDGETS'],
})}
`,
    },
    {
      slug: 'flutter-constraints-layout',
      meta: {
        id: 'FLUTTER-CONSTRAINTS-LAYOUT',
        title: 'Flutter Constraints and Layout',
        titleBn: 'Flutter Constraints ও লেআউট',
        description:
          'Constraints go down, sizes go up, parent sets position—the rule that unlocks Row/Column debugging.',
        descriptionBn:
          'Constraints নিচে যায়, সাইজ উপরে যায়, প্যারেন্ট পজিশন দেয়—Row/Column ডিবাগের মূল নিয়ম।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FLUTTER-WIDGET-TREE'],
        unlocks: ['FLUTTER-NAVIGATION', 'FLUTTER-PERFORMANCE-DEVTOOLS'],
        related: ['FLUTTER-STATE-MANAGEMENT'],
        careers: [C.mobile],
        tags: ['flutter', 'layout', 'constraints'],
        sources: ['FLUTTER-CONSTRAINTS'],
      },
      body: `
## Why yellow/black stripes appear

Most Flutter layout bugs are constraint bugs: a child wants infinite space, or a parent offered unbounded constraints where a flex child needed bounds.

## Mental model

<Callout type="mental-model">
  Official rule: constraints go down. Sizes go up. Parent sets position. A widget receives BoxConstraints (min/max width & height), picks a size within them, then parents place children.
</Callout>

## Bounded vs unbounded

\`Row\`/\`Column\` with **bounded** primary axis try to expand. With **unbounded** primary axis (inside another flex or scrollable), children cannot use \`Expanded\`/\`Flexible\` the same way—Flutter throws.

\`\`\`dart
// Common fix pattern: let the scrollable take unbounded cross-axis carefully,
// and give Expanded only in bounded flex parents.
Row(
  children: const [
    Expanded(child: Text('Grows')),
    Text('Fixed'),
  ],
);
\`\`\`

## LayoutBuilder

Use \`LayoutBuilder\` when structure must adapt to parent constraints (breakpoints). Do not rely on builder being called when constraints are unchanged—drive UI from explicit state updates.

${commonFooter({
  mistakes: [
    {
      title: 'Expanded inside ListView/unbounded Column',
      detail: 'Classic exception; wrap differently or use shrinkWrap carefully.',
    },
    {
      title: 'Fighting constraints with hardcoded sizes everywhere',
      detail: 'Prefer flexible layouts; hard sizes break across devices.',
    },
    {
      title: 'Ignoring overflow warnings',
      detail: 'Overflow is a layout signal, not a cosmetic issue.',
    },
  ],
  interview:
    'State Flutter’s layout rule in one sentence and diagnose why Expanded fails inside a horizontal ListView.',
  practice: [
    'Reproduce and fix an unbounded Expanded error.',
    'Build a responsive row using LayoutBuilder.',
    'Read Flutter’s “Understanding constraints” examples.',
  ],
  sourceIds: ['FLUTTER-CONSTRAINTS'],
})}
`,
    },
    {
      slug: 'flutter-state-management',
      meta: {
        id: 'FLUTTER-STATE-MANAGEMENT',
        title: 'Flutter State Management',
        titleBn: 'Flutter স্টেট ম্যানেজমেন্ট',
        description:
          'Ephemeral vs app state, lifting state up, and choosing approaches without cargo-culting.',
        descriptionBn:
          'ক্ষণস্থায়ী বনাম অ্যাপ স্টেট, স্টেট উপরে তোলা, এবং প্যাকেজ ফ্যাশন ছাড়া পদ্ধতি বেছে নেওয়া।',
        difficulty: 'intermediate',
        estimatedMinutes: 42,
        prerequisites: ['FLUTTER-WIDGET-TREE', 'FLUTTER-DART-ASYNC-FUTURES-STREAMS'],
        unlocks: ['FLUTTER-NAVIGATION', 'FLUTTER-NETWORKING-REST'],
        related: ['FLUTTER-TESTING', 'FLUTTER-PERFORMANCE-DEVTOOLS'],
        careers: [C.mobile],
        tags: ['flutter', 'state', 'provider', 'architecture'],
        sources: ['FLUTTER-STATE'],
      },
      body: `
## Why state is the hard part

UI is a function of state. Unclear ownership creates prop-drilling, duplicated fetches, and setState-after-dispose crashes.

## Mental model

<Callout type="mental-model">
  Ephemeral state (tab index, animation) can live locally. App state (session, cart, remote cache) needs a shared source of truth above the widgets that read it.
</Callout>

## Start simple

1. \`setState\` for truly local UI.
2. Lift state to a common parent when siblings share it.
3. Introduce \`InheritedWidget\` / \`Provider\` / \`Riverpod\` / \`Bloc\` when the tree depth or testability demands it.

Official guidance emphasizes understanding the problem before picking a library.

\`\`\`dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _n = 0;
  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => setState(() => _n++),
      child: Text('Count $_n'),
    );
  }
}
\`\`\`

${commonFooter({
  mistakes: [
    {
      title: 'Global mutable singletons',
      detail: 'Hard to test and reason about lifetimes.',
    },
    {
      title: 'Fetching in build()',
      detail: 'Triggers repeated network calls; fetch from lifecycle/state layer.',
    },
    {
      title: 'Rebuilding the entire app for tiny changes',
      detail: 'Narrow listeners; split models.',
    },
  ],
  interview:
    'How do you decide between local setState and a state management library? Give a concrete app example.',
  practice: [
    'Lift a counter state to a parent and pass callbacks.',
    'Sketch app state for login + home feed.',
    'Read Flutter’s state management intro and compare options.',
  ],
  sourceIds: ['FLUTTER-STATE'],
})}
`,
    },
    {
      slug: 'flutter-navigation',
      meta: {
        id: 'FLUTTER-NAVIGATION',
        title: 'Flutter Navigation',
        titleBn: 'Flutter ন্যাভিগেশন',
        description:
          'Stacks, routes, and deep links—moving between screens with a clear back stack model.',
        descriptionBn:
          'স্ট্যাক, রুট ও ডিপ লিংক—স্পষ্ট ব্যাক-স্ট্যাক মডেল নিয়ে স্ক্রিনে চলাচল।',
        difficulty: 'intermediate',
        estimatedMinutes: 34,
        prerequisites: ['FLUTTER-WIDGET-TREE', 'FLUTTER-STATE-MANAGEMENT'],
        unlocks: ['FLUTTER-DEPLOYMENT'],
        related: ['FLUTTER-NETWORKING-REST'],
        careers: [C.mobile],
        tags: ['flutter', 'navigation', 'routing'],
        sources: ['FLUTTER-NAV'],
      },
      body: `
## Why navigation is state

The back stack *is* user-visible state. Losing it on rebuild or mishandling deep links creates broken UX.

## Mental model

<Callout type="mental-model">
  Imperative \`Navigator.push\` manipulates a stack of routes. Declarative routers map URL/app state → stack. Pick one primary style per app layer.
</Callout>

## Basic stack navigation

\`\`\`dart
Navigator.of(context).push(
  MaterialPageRoute(builder: (_) => const DetailsPage()),
);

Navigator.of(context).pop(result);
\`\`\`

Pass results back intentionally; don’t rely on globals for “selected item.”

## Deep linking mindset

Even if you start without URLs, design screens so arguments are serializable (ids, not whole objects) to ease \`go_router\` / Router API later.

${commonFooter({
  mistakes: [
    {
      title: 'Passing huge objects as route args',
      detail: 'Prefer ids + repository fetch for freshness and deep links.',
    },
    {
      title: 'Multiple Navigators without clarity',
      detail: 'Nested nav can be correct for tabs—but document which stack pops.',
    },
    {
      title: 'Ignoring system back on Android',
      detail: 'Back must match user expectation for nested scaffolds.',
    },
  ],
  interview:
    'Compare Navigator 1.0 push/pop with a declarative router and when you would migrate.',
  practice: [
    'Build two screens with push/pop and a returned result.',
    'Sketch tab navigation with a nested navigator.',
    'List arguments needed for a deep link to a topic page.',
  ],
  sourceIds: ['FLUTTER-NAV'],
})}
`,
    },
    {
      slug: 'flutter-networking-rest',
      meta: {
        id: 'FLUTTER-NETWORKING-REST',
        title: 'Flutter Networking and REST',
        titleBn: 'Flutter নেটওয়ার্কিং ও REST',
        description:
          'Fetching JSON safely with http/dio patterns, parsing, and error UX.',
        descriptionBn:
          'http/dio প্যাটার্নে নিরাপদে JSON আনা, পার্স করা, এবং এরর UX।',
        difficulty: 'intermediate',
        estimatedMinutes: 36,
        prerequisites: ['FLUTTER-DART-ASYNC-FUTURES-STREAMS', 'FOUNDATIONS-NETWORKING-TCP-IP-HTTP'],
        unlocks: ['FLUTTER-TESTING', 'FLUTTER-PERFORMANCE-DEVTOOLS'],
        related: ['BACKEND-HTTP-REST-API-DESIGN', 'FOUNDATIONS-SECURITY-FUNDAMENTALS'],
        careers: [C.mobile, C.se],
        tags: ['flutter', 'http', 'rest', 'json'],
        sources: ['FLUTTER-NETWORKING'],
      },
      body: `
## Why networking needs a boundary layer

Widgets should not own raw URLs, headers, and JSON maps. A repository/client isolates API churn and simplifies tests.

## Mental model

<Callout type="mental-model">
  Request → HTTP status → decode bytes → validate shape → domain model. Failures are data: timeouts, 401, 500, parse errors.
</Callout>

## Example with \`http\`

\`\`\`dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> fetchTopic(String id) async {
  final uri = Uri.parse('https://api.example.com/topics/\$id');
  final res = await http.get(uri);
  if (res.statusCode != 200) {
    throw Exception('HTTP \${res.statusCode}');
  }
  return jsonDecode(res.body) as Map<String, dynamic>;
}
\`\`\`

Parse into typed models; don’t sprinkle \`Map\` lookups across UI.

${commonFooter({
  mistakes: [
    {
      title: 'Ignoring non-200 responses',
      detail: 'Parsing error HTML as JSON crashes the UI path.',
    },
    {
      title: 'Blocking UI while decoding huge payloads',
      detail: 'Consider compute/isolates for heavy parse.',
    },
    {
      title: 'Hardcoding tokens in the app binary',
      detail: 'Use secure storage and short-lived tokens.',
    },
  ],
  interview:
    'How do you structure networking, retries, and auth header injection in a Flutter app?',
  practice: [
    'Fetch a public JSON API and render a list.',
    'Map status codes to user-facing messages.',
    'Write a fake client for widget tests.',
  ],
  sourceIds: ['FLUTTER-NETWORKING'],
})}
`,
    },
    {
      slug: 'flutter-testing',
      meta: {
        id: 'FLUTTER-TESTING',
        title: 'Flutter Testing',
        titleBn: 'Flutter টেস্টিং',
        description:
          'Unit, widget, and integration tests—confidence without slowing delivery.',
        descriptionBn:
          'ইউনিট, উইজেট ও ইন্টিগ্রেশন টেস্ট—ডেলিভারি না কমিয়ে আত্মবিশ্বাস।',
        difficulty: 'intermediate',
        estimatedMinutes: 35,
        prerequisites: ['FLUTTER-WIDGET-TREE', 'FLUTTER-STATE-MANAGEMENT'],
        unlocks: ['FLUTTER-DEPLOYMENT'],
        related: ['FLUTTER-NETWORKING-REST', 'QA-PLAYWRIGHT-E2E'],
        careers: [C.mobile, C.se],
        tags: ['flutter', 'testing', 'quality'],
        sources: ['FLUTTER-TESTING'],
      },
      body: `
## Why three layers

Different bugs live at different altitudes. Unit tests catch pure logic; widget tests catch UI wiring; integration tests catch navigation and platform seams.

## Mental model

<Callout type="mental-model">
  Test pyramid: many fast unit tests, fewer widget tests, few end-to-end flows for critical paths (login, checkout, publish).
</Callout>

## Widget test sketch

\`\`\`dart
testWidgets('counter increments', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: Counter()));
  await tester.tap(find.text('Count 0'));
  await tester.pump();
  expect(find.text('Count 1'), findsOneWidget);
});
\`\`\`

Keep tests deterministic: fake clocks, fake HTTP, no live network in CI unit/widget jobs.

${commonFooter({
  mistakes: [
    {
      title: 'Only manual QA on device',
      detail: 'Regressions return every sprint.',
    },
    {
      title: 'Brittle finders on exact pixels/text',
      detail: 'Prefer keys for stable element finding.',
    },
    {
      title: 'Testing implementation details',
      detail: 'Assert user-visible behavior.',
    },
  ],
  interview:
    'Describe what belongs in unit vs widget vs integration tests for a Flutter feature.',
  practice: [
    'Add a unit test for a parser.',
    'Add a widget test with a ValueKey.',
    'Run \`flutter test\` in CI mindset.',
  ],
  sourceIds: ['FLUTTER-TESTING'],
})}
`,
    },
    {
      slug: 'flutter-performance-devtools',
      meta: {
        id: 'FLUTTER-PERFORMANCE-DEVTOOLS',
        title: 'Flutter Performance and DevTools',
        titleBn: 'Flutter পারফরম্যান্স ও DevTools',
        description:
          'Jank, rebuilds, and profiling with Flutter DevTools—measure before optimizing.',
        descriptionBn:
          'Jank, রিবিল্ড ও Flutter DevTools দিয়ে প্রোফাইলিং—অপটিমাইজের আগে মাপুন।',
        difficulty: 'advanced',
        estimatedMinutes: 38,
        prerequisites: ['FLUTTER-CONSTRAINTS-LAYOUT', 'FLUTTER-STATE-MANAGEMENT'],
        unlocks: ['FLUTTER-DEPLOYMENT'],
        related: ['FLUTTER-WIDGET-TREE'],
        careers: [C.mobile],
        tags: ['flutter', 'performance', 'devtools'],
        sources: ['FLUTTER-PERF'],
      },
      body: `
## Why 16ms matters

Smooth UI targets ~60fps → about 16ms per frame for build/layout/paint work on the UI isolate. Jank is a frame budget miss.

## Mental model

<Callout type="mental-model">
  First make it correct, then profile. DevTools shows whether you are CPU-bound building widgets, laying out, or painting.
</Callout>

## Practical habits

- Avoid rebuilding giant subtrees; \`const\` widgets help when inputs are const.
- Use \`ListView.builder\` for long lists.
- Move heavy JSON parse / image work off critical path.
- Profile **profile/release-like** modes; debug mode is slower by design.

${commonFooter({
  mistakes: [
    {
      title: 'Optimizing without timelines',
      detail: 'Guessing wastes time; measure with DevTools.',
    },
    {
      title: 'setState at the root for tiny changes',
      detail: 'Narrow the rebuild scope.',
    },
    {
      title: 'Giant opacity/saveLayer effects everywhere',
      detail: 'Some effects are expensive; use deliberately.',
    },
  ],
  interview:
    'A list scrolls jankily—what measurements and code changes do you try first?',
  practice: [
    'Open DevTools Performance view on a sample app.',
    'Replace ListView(children: ...) with builder.',
    'Identify a rebuild hotspot and shrink it.',
  ],
  sourceIds: ['FLUTTER-PERF'],
})}
`,
    },
    {
      slug: 'flutter-deployment',
      meta: {
        id: 'FLUTTER-DEPLOYMENT',
        title: 'Flutter Deployment',
        titleBn: 'Flutter ডিপ্লয়মেন্ট',
        description:
          'Release builds, signing, store checklist, and environment configuration for Android/iOS.',
        descriptionBn:
          'রিলিজ বিল্ড, সাইনিং, স্টোর চেকলিস্ট, এবং Android/iOS এনভায়রনমেন্ট কনফিগ।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FLUTTER-TESTING', 'FLUTTER-NAVIGATION'],
        unlocks: [],
        related: ['FLUTTER-PERFORMANCE-DEVTOOLS', 'DEVOPS-GITHUB-ACTIONS-CI'],
        careers: [C.mobile, C.devops],
        tags: ['flutter', 'deployment', 'release'],
        sources: ['FLUTTER-DEPLOY'],
      },
      body: `
## Why debug ≠ release

Debug builds assert and are not performance-representative. Stores require signed release artifacts with correct package ids and permissions.

## Mental model

<Callout type="mental-model">
  Deployment is a pipeline: version bump → run tests → build release → sign → distribute (Play/App Store/internal) → monitor crashes.
</Callout>

## Android sketch

Follow official docs for keystores and App Bundle (\`appbundle\`) uploads. Never commit keystore passwords.

\`\`\`bash
flutter build appbundle --release
\`\`\`

Use flavors/Dart defines for staging vs production API bases.

${commonFooter({
  mistakes: [
    {
      title: 'Shipping with debug API URLs',
      detail: 'Use flavors or compile-time defines.',
    },
    {
      title: 'Committing signing keys',
      detail: 'Treat as secrets; rotate if leaked.',
    },
    {
      title: 'Skipping crash reporting',
      detail: 'You cannot fix what you cannot see post-release.',
    },
  ],
  interview:
    'Walk through an Android release checklist from versioning to Play Console upload.',
  practice: [
    'Produce a release build locally.',
    'Document env vars for staging/prod.',
    'Sketch a GitHub Actions job that runs tests then builds.',
  ],
  sourceIds: ['FLUTTER-DEPLOY'],
})}
`,
    },
  ];

  return topics.map((t) => writeTopic('mobile-flutter', t.slug, t.meta, t.body));
}
