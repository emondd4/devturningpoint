#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _topic_lib import fm, write_all

items: list[tuple[str, str]] = []

items.append((
    "mobile-flutter/dart-basics.mdx",
    fm(
        id="MOBILE-DART-BASICS",
        title="Dart language basics",
        title_bn="Dart ভাষার বেসিকস",
        description="Why Flutter uses Dart, how types and null safety work, and the core syntax you need before widgets.",
        description_bn="Flutter কেন Dart ব্যবহার করে, type ও null safety, widget-এর আগে প্রয়োজনীয় সিনট্যাক্স।",
        track="mobile-flutter",
        category="dart",
        difficulty="beginner",
        minutes=40,
        prerequisites=[],
        recommended_before=["FOUNDATIONS-DATA-TYPES"],
        unlocks=["MOBILE-DART-OOP", "MOBILE-DART-ASYNC"],
        related=["MOBILE-FLUTTER-WIDGETS"],
        careers=["flutter-developer"],
        tags=["dart", "flutter", "null-safety"],
        sources=["DART-LANGUAGE", "src-flutter-docs"],
        versions={"dart": "3.x"},
    )
    + """## What is it?

**Dart** is the programming language Flutter apps are written in. It is object-oriented, optionally soundly null-safe, and compiles to native code (and JavaScript for web targets).

## Why does it exist?

Flutter needed a language that could be productive for UI, compile ahead-of-time for performance, and support a reactive widget model. Dart was designed for that product surface.

## Mental model

- Everything interesting is an object; even functions are objects.
- **Null safety** forces you to confront “this might be absent” at compile time.
- Prefer `final` for values that do not reassign; use `var` sparingly when the type is obvious.

```dart
void main() {
  final String name = 'Turning Point';
  String? maybeCity;
  print(name.toUpperCase());
  print(maybeCity?.length); // null-aware access
}
```

## Core building blocks

- Variables and type inference
- Functions and named/optional parameters
- Collections: `List`, `Map`, `Set`
- Control flow: `if`, `for`, `switch`

## Common mistakes

1. Fighting null safety with `!` everywhere instead of modeling absence.
2. Mutating lists/maps shared across widgets without noticing rebuild assumptions.
3. Skipping Dart basics and jumping straight into complex state packages.

## Interview angles

**Junior:** What does `String?` mean?  
**Mid:** Explain sound null safety and promotion.  
**Senior:** Discuss AOT vs JIT tradeoffs for Flutter debug vs release.

## Mini exercise

Write a function that accepts a nullable email and returns a lowercased email or `'missing'`.

## Sources

- Dart language tours (`DART-LANGUAGE`); Flutter docs overview (`src-flutter-docs`).
""",
))

items.append((
    "mobile-flutter/dart-async.mdx",
    fm(
        id="MOBILE-DART-ASYNC",
        title="Dart async: Future and Stream",
        title_bn="Dart async: Future ও Stream",
        description="How Dart models asynchronous work with Futures and Streams, and how async/await keeps UI code readable.",
        description_bn="Future ও Stream দিয়ে async কাজ, এবং async/await কীভাবে UI কোড পঠনযোগ্য রাখে।",
        track="mobile-flutter",
        category="dart",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["MOBILE-DART-BASICS"],
        recommended_before=["MOBILE-DART-OOP"],
        unlocks=["MOBILE-FLUTTER-NETWORKING", "MOBILE-FLUTTER-WIDGETS"],
        related=["MOBILE-FLUTTER-STATE", "FRONTEND-JS-ASYNC"],
        careers=["flutter-developer"],
        tags=["dart", "async", "future", "stream"],
        sources=["DART-ASYNC", "DART-STREAMS"],
        versions={"dart": "3.x"},
    )
    + """## What is it?

A **Future** represents a single asynchronous result. A **Stream** represents a sequence of asynchronous events. `async`/`await` is syntactic sugar for working with Futures without nested callbacks.

## Why does it exist?

Mobile apps constantly wait: network, disk, animations, user input. Blocking the UI isolate freezes frames. Async primitives let you start work, yield control, and resume when results arrive.

## Mental model

```dart
Future<String> fetchTitle() async {
  await Future<void>.delayed(const Duration(milliseconds: 200));
  return 'Dashboard';
}

Stream<int> ticks(int n) async* {
  for (var i = 0; i < n; i++) {
    await Future<void>.delayed(const Duration(seconds: 1));
    yield i;
  }
}
```

- `await` pauses the surrounding async function until the Future completes.
- Streams need subscription/cancellation discipline—especially in widgets.

## Real-world usage

HTTP clients return Futures. Firestore-like listeners and WebSocket feeds feel like Streams. `StreamBuilder` and modern state solutions wrap these for UI.

## Common mistakes

1. Forgetting `await` and treating a Future as the value.
2. Not cancelling stream subscriptions when a widget disposes.
3. Catching errors too late—unhandled async errors become mysterious crashes.

## Interview angles

**Junior:** Future vs Stream?  
**Mid:** How do you cancel in-flight work when the user leaves a screen?  
**Senior:** Discuss isolates vs async for CPU-heavy work on Flutter.

## Mini exercise

Write an async function that tries a Future and returns a fallback string on error.

## Sources

- Dart async and streams documentation (`DART-ASYNC`, `DART-STREAMS`).
""",
))

items.append((
    "mobile-flutter/flutter-layout-constraints.mdx",
    fm(
        id="MOBILE-FLUTTER-LAYOUT",
        title="Flutter layout and constraints",
        title_bn="Flutter লেআউট ও constraints",
        description="How Flutter’s constraint-passing layout model works, and how to debug overflow and sizing bugs.",
        description_bn="Flutter-এর constraint-passing লেআউট মডেল, overflow ও সাইজিং বাগ ডিবাগ।",
        track="mobile-flutter",
        category="flutter-ui",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["MOBILE-FLUTTER-WIDGETS"],
        recommended_before=[],
        unlocks=["MOBILE-FLUTTER-FORMS", "MOBILE-FLUTTER-NAVIGATION"],
        related=["MOBILE-FLUTTER-PERFORMANCE", "UIUX-VISUAL-FUNDAMENTALS"],
        careers=["flutter-developer"],
        tags=["flutter", "layout", "constraints"],
        sources=["FLUTTER-CONSTRAINTS", "FLUTTER-WIDGETS"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

Flutter layout is **constraint-based**: parents pass constraints down; children choose a size within those constraints; parents then position children. This differs from CSS’s mix of shrink-wrap and flow rules.

## Why does it exist?

Mobile UIs need predictable, high-performance layout across densities and orientations. A single pass model (with clear rules) keeps frame budgets achievable.

## Mental model

1. Constraints go **down**.
2. Sizes go **up**.
3. Parents set **positions**.

```dart
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(maxWidth: 320),
    child: const Text('Readable measure'),
  ),
);
```

`Expanded`/`Flexible` inside `Row`/`Column` exist because unbounded constraints in the cross/main axis are a common source of confusion.

## Common mistakes

1. Putting a `ListView` inside a `Column` without giving the list a bounded height (`Expanded` or sized box).
2. Ignoring yellow/black overflow stripes instead of reading the constraint error.
3. Over-nesting `Containers` with hard-coded sizes that fight parent constraints.

## Interview angles

**Junior:** What gets passed down the tree during layout?  
**Mid:** Why does `Row` + unbounded width children fail?  
**Senior:** Explain relayout boundaries and performance implications of deep layout changes.

## Mini exercise

Explain how you would place a scrollable list below a header inside a column without overflow.

## Sources

- Flutter constraints & widgets docs (`FLUTTER-CONSTRAINTS`, `FLUTTER-WIDGETS`).
""",
))

items.append((
    "mobile-flutter/flutter-navigation.mdx",
    fm(
        id="MOBILE-FLUTTER-NAVIGATION",
        title="Flutter navigation",
        title_bn="Flutter ন্যাভিগেশন",
        description="Why apps need a navigation stack, how routes work in Flutter, and patterns for passing results between screens.",
        description_bn="অ্যাপে navigation stack কেন লাগে, Flutter route, স্ক্রিনের মধ্যে ফলাফল পাঠানোর প্যাটার্ন।",
        track="mobile-flutter",
        category="flutter-ui",
        difficulty="intermediate",
        minutes=40,
        prerequisites=["MOBILE-FLUTTER-WIDGETS"],
        recommended_before=["MOBILE-FLUTTER-LAYOUT"],
        unlocks=["MOBILE-FLUTTER-STATE"],
        related=["MOBILE-FLUTTER-FORMS", "FULLSTACK-AUTH-FLOWS"],
        careers=["flutter-developer"],
        tags=["flutter", "navigation", "routing"],
        sources=["FLUTTER-NAV", "FLUTTER-WIDGETS"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

**Navigation** moves users between screens while preserving a back stack (or graph). In Flutter this is typically expressed with the Navigator API and/or declarative routers.

## Why does it exist?

Multi-screen apps need history (“back should return where I was”), deep links, and clear ownership of which UI is visible. Navigation frameworks encode that stack discipline.

## Mental model

```dart
Navigator.of(context).push(
  MaterialPageRoute<void>(
    builder: (_) => const DetailsPage(id: '42'),
  ),
);
```

- **Imperative** navigation: push/pop from code.
- **Declarative** navigation: app state describes the stack; the router mirrors it.

Pass only the identifiers you need; fetch heavy data on the destination screen when possible.

## Common mistakes

1. Passing entire mutable models through routes and wondering why UI desyncs.
2. Forgetting to `await` a route that returns a result.
3. Mixing multiple navigators without understanding which context owns the stack.

## Interview angles

**Junior:** What does push/pop mean?  
**Mid:** Compare imperative Navigator vs declarative go_router-style approaches.  
**Senior:** Deep linking, web URLs, and restoring navigation state after process death.

## Mini exercise

Design the route arguments for an edit-profile screen that can return “saved” or “cancelled.”

## Sources

- Flutter navigation guides (`FLUTTER-NAV`, `FLUTTER-WIDGETS`).
""",
))

items.append((
    "mobile-flutter/flutter-state-management.mdx",
    fm(
        id="MOBILE-FLUTTER-STATE",
        title="Flutter state management",
        title_bn="Flutter স্টেট ম্যানেজমেন্ট",
        description="How ephemeral vs app state differ, when setState is enough, and how to lift state without chaos.",
        description_bn="Ephemeral vs app state, কখন setState যথেষ্ট, এবং state lift করে বিশৃঙ্খলা এড়ানো।",
        track="mobile-flutter",
        category="flutter-architecture",
        difficulty="intermediate",
        minutes=50,
        prerequisites=["MOBILE-FLUTTER-WIDGETS", "MOBILE-DART-ASYNC"],
        recommended_before=["MOBILE-FLUTTER-LAYOUT"],
        unlocks=["MOBILE-FLUTTER-NETWORKING", "MOBILE-FLUTTER-TESTING"],
        related=["MOBILE-FLUTTER-FORMS", "FRONTEND-REACT-STATE"],
        careers=["flutter-developer"],
        tags=["flutter", "state", "architecture"],
        sources=["FLUTTER-STATE", "FLUTTER-WIDGETS"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

**State** is data that can change and should update the UI. Flutter distinguishes short-lived **ephemeral** UI state (checkbox toggles) from **app state** shared across screens (auth session, cart).

## Why does it exist?

If every widget owned every piece of data, coordination would break. Explicit state ownership lets you rebuild only what must change and keep business rules testable.

## Mental model

1. Identify who owns the source of truth.
2. Pass data down as constructor params / inherited models.
3. Send events up via callbacks or notifiers.
4. Reach for a state library when prop drilling or rebuild scope becomes painful—not before.

```dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => setState(() => _count++),
      child: Text('Count $_count'),
    );
  }
}
```

## Common mistakes

1. Putting network cache exclusively in ephemeral `State` objects that die on navigation.
2. Calling `setState` from disposed widgets after an async gap.
3. Choosing a global state tool before understanding rebuild boundaries.

## Interview angles

**Junior:** What does `setState` do?  
**Mid:** Ephemeral vs app state with examples.  
**Senior:** Compare InheritedWidget, Provider/Riverpod/Bloc-style patterns and testing strategy.

## Mini exercise

For a login form, list which fields are ephemeral and which belong in app/session state.

## Sources

- Flutter state management docs (`FLUTTER-STATE`, `FLUTTER-WIDGETS`).
""",
))

items.append((
    "mobile-flutter/flutter-networking.mdx",
    fm(
        id="MOBILE-FLUTTER-NETWORKING",
        title="Flutter networking",
        title_bn="Flutter নেটওয়ার্কিং",
        description="How Flutter apps fetch HTTP data safely, parse JSON, and handle loading, errors, and cancellation.",
        description_bn="Flutter-এ HTTP ডেটা আনা, JSON পার্স, loading/error ও cancellation হ্যান্ডলিং।",
        track="mobile-flutter",
        category="flutter-data",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["MOBILE-DART-ASYNC", "MOBILE-FLUTTER-STATE"],
        recommended_before=["FOUNDATIONS-HTTP"],
        unlocks=["MOBILE-FLUTTER-STORAGE", "MOBILE-FLUTTER-TESTING"],
        related=["BACKEND-REST", "FULLSTACK-INTEGRATION"],
        careers=["flutter-developer"],
        tags=["flutter", "http", "json"],
        sources=["FLUTTER-NETWORKING", "DART-ASYNC"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

**Networking** in Flutter usually means HTTP clients calling JSON APIs, then mapping payloads into Dart models for the UI.

## Why does it exist?

Most product data lives on servers. Clients must fetch, cache, and reconcile that data without blocking frames or losing error context.

## Mental model

1. Build a request (URL, headers, auth).
2. Await a response Future.
3. Check status codes before parsing.
4. Map JSON to typed models.
5. Surface loading/error/success states in UI.

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> fetchUser(String id) async {
  final response = await http.get(Uri.parse('https://api.example.com/users/$id'));
  if (response.statusCode != 200) {
    throw Exception('HTTP ${response.statusCode}');
  }
  return jsonDecode(response.body) as Map<String, dynamic>;
}
```

## Common mistakes

1. Parsing JSON without validating status codes.
2. Storing tokens insecurely or logging Authorization headers.
3. Ignoring timeouts and offline modes on mobile networks.

## Interview angles

**Junior:** How do you show a loading spinner during a fetch?  
**Mid:** How do you prevent setState after dispose when a request completes late?  
**Senior:** Caching, retries/idempotency, and certificate pinning tradeoffs.

## Mini exercise

Sketch UI states for success, 401, and timeout on a profile screen.

## Sources

- Flutter networking guides (`FLUTTER-NETWORKING`); Dart async (`DART-ASYNC`).
""",
))

items.append((
    "mobile-flutter/flutter-testing.mdx",
    fm(
        id="MOBILE-FLUTTER-TESTING",
        title="Flutter testing",
        title_bn="Flutter টেস্টিং",
        description="Why Flutter splits unit, widget, and integration tests, and how to test UI behavior without brittle internals.",
        description_bn="Unit, widget ও integration টেস্ট কেন আলাদা, UI আচরণ কীভাবে স্থিতিশীলভাবে যাচাই করবেন।",
        track="mobile-flutter",
        category="flutter-quality",
        difficulty="advanced",
        minutes=45,
        prerequisites=["MOBILE-FLUTTER-WIDGETS", "MOBILE-FLUTTER-STATE"],
        recommended_before=["MOBILE-FLUTTER-NETWORKING"],
        unlocks=["MOBILE-FLUTTER-PERFORMANCE"],
        related=["QA-PLAYWRIGHT", "BACKEND-TESTING"],
        careers=["flutter-developer", "qa-engineer"],
        tags=["flutter", "testing"],
        sources=["FLUTTER-TESTING", "FLUTTER-WIDGETS"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

Flutter’s testing pyramid typically includes **unit tests** (pure Dart), **widget tests** (UI in a test environment), and **integration/end-to-end tests** on devices/emulators.

## Why does it exist?

Mobile UI regressions are expensive. Automated tests catch layout/logic mistakes before store releases—and document intended behavior.

## Mental model

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('increments counter', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Counter()));
    await tester.tap(find.text('Count 0'));
    await tester.pump();
    expect(find.text('Count 1'), findsOneWidget);
  });
}
```

Prefer finding widgets by user-visible text/semantics over private keys when possible.

## Common mistakes

1. Only testing implementation details (private method call counts).
2. Flaky tests that depend on real network without fakes.
3. Skipping widget tests and relying solely on slow device E2E.

## Interview angles

**Junior:** Unit vs widget test?  
**Mid:** How do you fake an HTTP client in widget tests?  
**Senior:** Test strategy for golden/screenshot tests and CI device farms.

## Mini exercise

Write a widget test plan for a login button that disables while submitting.

## Sources

- Flutter testing documentation (`FLUTTER-TESTING`, `FLUTTER-WIDGETS`).
""",
))

items.append((
    "mobile-flutter/flutter-performance.mdx",
    fm(
        id="MOBILE-FLUTTER-PERFORMANCE",
        title="Flutter performance",
        title_bn="Flutter পারফরম্যান্স",
        description="How to keep Flutter apps at smooth frame rates by controlling rebuilds, jank sources, and expensive build work.",
        description_bn="Rebuild নিয়ন্ত্রণ, jank-এর উৎস ও ব্যয়বহুল build কাজ এড়িয়ে মসৃণ ফ্রেম রেট রাখা।",
        track="mobile-flutter",
        category="flutter-quality",
        difficulty="advanced",
        minutes=45,
        prerequisites=["MOBILE-FLUTTER-LAYOUT", "MOBILE-FLUTTER-STATE"],
        recommended_before=["MOBILE-FLUTTER-TESTING"],
        unlocks=["MOBILE-FLUTTER-DEPLOYMENT"],
        related=["MOBILE-FLUTTER-PLATFORM", "FRONTEND-PERFORMANCE"],
        careers=["flutter-developer"],
        tags=["flutter", "performance", "jank"],
        sources=["FLUTTER-PERF", "FLUTTER-CONSTRAINTS"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

**Flutter performance** work keeps animation and scrolling within frame budgets (commonly targeting ~16ms per frame at 60Hz, faster on higher refresh displays).

## Why does it exist?

Users feel jank immediately. Performance is a product feature—especially on mid-range Android devices common in many markets including Bangladesh.

## Mental model

- **Build** constructs widgets.
- **Layout** sizes/positions.
- **Paint** records drawing commands.
- Extra work in any phase under load causes dropped frames.

Practical tactics: shrink rebuild scopes, use `const` constructors where possible, avoid heavy work in `build`, and profile with DevTools before guessing.

## Common mistakes

1. Rebuilding an entire page when one leaf text changes.
2. Decoding large images on the UI isolate synchronously.
3. “Optimizing” without timeline evidence.

## Interview angles

**Junior:** What is jank?  
**Mid:** How do const widgets and keys affect rebuilds?  
**Senior:** Discuss isolates for CPU work, shader warm-up, and list virtualization.

## Mini exercise

List three likely causes of scroll jank in a feed with images, and how you’d verify each.

## Sources

- Flutter performance docs (`FLUTTER-PERF`); layout cost context (`FLUTTER-CONSTRAINTS`).
""",
))

items.append((
    "mobile-flutter/flutter-forms.mdx",
    fm(
        id="MOBILE-FLUTTER-FORMS",
        title="Flutter forms and validation",
        title_bn="Flutter ফর্ম ও ভ্যালিডেশন",
        description="How to collect user input with Form widgets, validate early, and keep error messages accessible.",
        description_bn="Form widget দিয়ে ইনপুট সংগ্রহ, আগেভাগে validate, এবং accessible এরর মেসেজ।",
        track="mobile-flutter",
        category="flutter-ui",
        difficulty="intermediate",
        minutes=40,
        prerequisites=["MOBILE-FLUTTER-LAYOUT", "MOBILE-FLUTTER-STATE"],
        recommended_before=[],
        unlocks=["MOBILE-FLUTTER-NETWORKING"],
        related=["BACKEND-VALIDATION", "FRONTEND-HTML-FORMS"],
        careers=["flutter-developer"],
        tags=["flutter", "forms", "validation"],
        sources=["FLUTTER-WIDGETS", "FLUTTER-STATE"],
        versions={"flutter": "Stable channel — verify with current Flutter docs"},
    )
    + """## What is it?

Flutter **forms** group input fields, run validators, and expose a single place to check “can we submit?” before calling APIs.

## Why does it exist?

Unvalidated input creates bad data and confusing UX. Forms encode validation and focus management so users fix issues before the network round trip.

## Mental model

```dart
final formKey = GlobalKey<FormState>();

Form(
  key: formKey,
  child: TextFormField(
    decoration: const InputDecoration(labelText: 'Email'),
    validator: (value) {
      if (value == null || !value.contains('@')) return 'Enter a valid email';
      return null;
    },
  ),
);

// on submit
if (formKey.currentState?.validate() ?? false) {
  // proceed
}
```

Validate on the client for UX; always re-validate on the server for safety.

## Common mistakes

1. Only validating on the client.
2. Blocking paste or password managers with overly aggressive input formatters.
3. Showing technical exception strings to end users.

## Interview angles

**Junior:** What does `FormState.validate` do?  
**Mid:** How do you sync form state with a view model/notifier?  
**Senior:** Accessibility for errors, multi-step forms, and draft persistence.

## Mini exercise

Design validators for phone number input used in BD local apps (presence + length sanity)—without claiming a single national format is universal.

## Sources

- Flutter widgets & state docs (`FLUTTER-WIDGETS`, `FLUTTER-STATE`).
""",
))

write_all(items)
