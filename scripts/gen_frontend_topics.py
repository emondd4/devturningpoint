#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _topic_lib import fm, write_all

items: list[tuple[str, str]] = []

items.append((
    "frontend/html-fundamentals.mdx",
    fm(
        id="FRONTEND-HTML",
        title="HTML fundamentals",
        title_bn="HTML ফান্ডামেন্টালস",
        description="Why HTML exists as a document structure language, how elements and attributes work, and how browsers interpret markup.",
        description_bn="HTML কেন ডকুমেন্ট স্ট্রাকচার ভাষা, element ও attribute, ব্রাউজার কীভাবে markup বোঝে।",
        track="frontend",
        category="html",
        difficulty="beginner",
        minutes=35,
        prerequisites=[],
        recommended_before=[],
        unlocks=["FRONTEND-HTML-SEMANTICS", "FRONTEND-HTML-FORMS", "FRONTEND-CSS"],
        related=["FRONTEND-A11Y", "FOUNDATIONS-HTTP"],
        careers=["frontend-engineer", "fullstack-engineer"],
        tags=["html", "web"],
        sources=["W3C-HTML", "src-mdn-web"],
    )
    + """## What is it?

**HTML** (HyperText Markup Language) describes the structure and meaning of web documents using elements nested in a tree.

## Why does it exist?

The web needed a shared way to publish linked documents. HTML separates content structure from presentation (CSS) and behavior (JavaScript), enabling accessibility tools and search engines to understand pages.

## Mental model

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Turning Point</title>
  </head>
  <body>
    <main>
      <h1>Learn in public, carefully</h1>
      <p>HTML gives your content a skeleton.</p>
    </main>
  </body>
</html>
```

Elements have an opening tag, optional attributes, content, and a closing tag (except void elements like `img`).

## Common mistakes

1. Using `div` for everything instead of meaningful elements.
2. Forgetting `alt` text on informative images.
3. Nesting interactive elements invalidly (for example, links inside links).

## Interview angles

**Junior:** What is the DOM relative to HTML?  
**Mid:** Why does semantic structure help accessibility and SEO?  
**Senior:** Progressive enhancement and HTML as the resilient baseline.

## Mini exercise

Mark up an article with title, author byline, and two sections—without using only `div`s.

## Sources

- HTML Living Standard (`W3C-HTML`); MDN/web notes (`src-mdn-web`).
""",
))

items.append((
    "frontend/css-box-model.mdx",
    fm(
        id="FRONTEND-CSS-BOX-MODEL",
        title="CSS box model",
        title_bn="CSS বক্স মডেল",
        description="How content, padding, border, and margin form boxes, and why box-sizing changes layout math.",
        description_bn="Content, padding, border ও margin কীভাবে বক্স গঠন করে, box-sizing কেন গুরুত্বপূর্ণ।",
        track="frontend",
        category="css",
        difficulty="beginner",
        minutes=30,
        prerequisites=["FRONTEND-CSS"],
        recommended_before=["FRONTEND-HTML"],
        unlocks=["FRONTEND-CSS-LAYOUT", "FRONTEND-CSS-RESPONSIVE"],
        related=["FRONTEND-CSS", "FRONTEND-CSS-LAYOUT"],
        careers=["frontend-engineer", "ui-ux-designer"],
        tags=["css", "box-model", "layout"],
        sources=["MDN-CSS-BOX", "MDN-CSS-CASCADE"],
    )
    + """## What is it?

Every element generates boxes. The **CSS box model** defines how **content**, **padding**, **border**, and **margin** contribute to size and spacing.

## Why does it exist?

Layout needs a predictable geometry model. Without shared box rules, browsers could not consistently position text, buttons, and grids.

## Mental model

```css
.card {
  box-sizing: border-box; /* width includes padding + border */
  width: 320px;
  padding: 1rem;
  border: 1px solid #ccc;
  margin: 1rem auto;
}
```

With `content-box` (historical default), `width` applies to content only—padding/border add outside that width. Most modern teams prefer `border-box` globally.

## Common mistakes

1. Fighting unexpected overflow caused by forgetting borders/padding in width math.
2. Using margin for component-internal spacing where padding is clearer.
3. Collapsing vertical margins surprising beginners in flow layout.

## Interview angles

**Junior:** Name the four box layers.  
**Mid:** Explain `border-box` vs `content-box`.  
**Senior:** How do box model choices interact with flex/grid min-size defaults?

## Mini exercise

Given `width: 200px; padding: 20px; border: 5px solid;` under `border-box`, what is the content width?

## Sources

- MDN box model and cascade (`MDN-CSS-BOX`, `MDN-CSS-CASCADE`).
""",
))

# Fix related - can't have MDN-CSS-BOX as related topic. Fix in content above... I'll fix via search after or rewrite that related line.
# Actually I put MDN-CSS-BOX in related - need to fix when writing. Let me fix the tuple - I'll patch after generation.

items.append((
    "frontend/css-flexbox-grid.mdx",
    fm(
        id="FRONTEND-CSS-LAYOUT",
        title="Flexbox and Grid layout",
        title_bn="Flexbox ও Grid লেআউট",
        description="When to use Flexbox vs Grid, how alignment works, and how to build responsive UI structure without hacks.",
        description_bn="কখন Flexbox বনাম Grid, alignment কীভাবে কাজ করে, হ্যাক ছাড়া responsive স্ট্রাকচার।",
        track="frontend",
        category="css",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["FRONTEND-CSS-BOX-MODEL"],
        recommended_before=["FRONTEND-CSS"],
        unlocks=["FRONTEND-CSS-RESPONSIVE", "FRONTEND-REACT"],
        related=["FRONTEND-CSS-RESPONSIVE", "UIUX-VISUAL-FUNDAMENTALS"],
        careers=["frontend-engineer", "ui-ux-designer"],
        tags=["css", "flexbox", "grid"],
        sources=["MDN-FLEXBOX", "MDN-GRID"],
    )
    + """## What is it?

**Flexbox** lays out items in one dimension (row or column) with powerful alignment. **CSS Grid** lays out items in two dimensions (rows and columns).

## Why does it exist?

Floats and table hacks were fragile. Flex and Grid give intentional distribution of space for modern interfaces.

## Mental model

```css
.toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
}
```

Rule of thumb: Flex for components/nav bars; Grid for page-level regions—or mix them.

## Common mistakes

1. Using Flex for a 2D magazine layout that Grid expresses more clearly.
2. Forgetting `min-width: 0` / `min-height: 0` on flex/grid children that need to shrink.
3. Absolute positioning everything instead of learning alignment properties.

## Interview angles

**Junior:** One use case each for Flex and Grid.  
**Mid:** Explain `flex-grow`, `flex-shrink`, and `flex-basis`.  
**Senior:** Subgrid, container queries, and migration from legacy float layouts.

## Mini exercise

Build a header with logo left and actions right using Flexbox; then a two-column dashboard shell with Grid.

## Sources

- MDN Flexbox and Grid (`MDN-FLEXBOX`, `MDN-GRID`).
""",
))

items.append((
    "frontend/javascript-fundamentals.mdx",
    fm(
        id="FRONTEND-JAVASCRIPT",
        title="JavaScript fundamentals",
        title_bn="JavaScript ফান্ডামেন্টালস",
        description="Core JavaScript values, functions, and program structure that underpin browser and Node applications.",
        description_bn="মান, ফাংশন ও প্রোগ্রাম স্ট্রাকচার—ব্রাউজার ও Node অ্যাপের ভিত্তি।",
        track="frontend",
        category="javascript",
        difficulty="beginner",
        minutes=45,
        prerequisites=["FRONTEND-HTML"],
        recommended_before=["FRONTEND-CSS"],
        unlocks=["FRONTEND-JS-OBJECTS", "FRONTEND-JS-DOM", "FRONTEND-JS-ASYNC"],
        related=["FRONTEND-TYPESCRIPT", "FRONTEND-JS-ASYNC"],
        careers=["frontend-engineer", "fullstack-engineer"],
        tags=["javascript", "ecmascript"],
        sources=["TC39-ECMASCRIPT", "src-mdn-web"],
    )
    + """## What is it?

**JavaScript** is the programming language of the web platform (and many server runtimes). It manipulates values, responds to events, and orchestrates UI updates.

## Why does it exist?

Static documents needed behavior: validate forms, fetch data, build interactive UIs. JavaScript became the standard language engines ship in browsers.

## Mental model

```js
function greet(name) {
  return `Hello, ${name}`;
}

const users = ['Ada', 'Grace'];
const messages = users.map(greet);
console.log(messages);
```

Focus first on: types/values, equality, functions, arrays/objects, modules, and the event loop (next topics deepen each).

## Common mistakes

1. Confusing `==` and `===`.
2. Mutating shared objects accidentally.
3. Learning a framework before being able to read plain JS.

## Interview angles

**Junior:** Difference between `let`, `const`, and `var`?  
**Mid:** Explain closures with a practical example.  
**Senior:** Discuss language evolution via TC39 and how engines optimize hot paths.

## Mini exercise

Write a function that groups an array of numbers into even/odd arrays without mutating the input.

## Sources

- ECMAScript specification (`TC39-ECMASCRIPT`); MDN (`src-mdn-web`).
""",
))

items.append((
    "frontend/javascript-async.mdx",
    fm(
        id="FRONTEND-JS-ASYNC",
        title="Async JavaScript",
        title_bn="Async JavaScript",
        description="How the event loop schedules work, and how Promises and async/await model asynchronous results.",
        description_bn="Event loop কীভাবে কাজ সময়সূচি করে, Promise ও async/await কীভাবে async ফলাফল মডেল করে।",
        track="frontend",
        category="javascript",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["FRONTEND-JAVASCRIPT"],
        recommended_before=["FRONTEND-JS-OBJECTS"],
        unlocks=["FRONTEND-JS-MODULES", "FRONTEND-REACT"],
        related=["FRONTEND-JS-MODULES", "BACKEND-NODE"],
        careers=["frontend-engineer", "fullstack-engineer"],
        tags=["javascript", "promises", "event-loop"],
        sources=["MDN-JS-EVENT-LOOP", "TC39-ECMASCRIPT"],
    )
    + """## What is it?

**Async JavaScript** lets programs start slow work (network, timers) without freezing the main thread, then continue when results arrive—via callbacks, Promises, and `async`/`await`.

## Why does it exist?

Browsers are event-driven. A stuck main thread means an unresponsive page. The event loop interleaves tasks so UI stays interactive.

## Mental model

```js
async function loadProfile(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

loadProfile('42')
  .then((user) => console.log(user.name))
  .catch((error) => console.error(error));
```

Microtasks (Promise reactions) generally run before the next rendering opportunity after the current call stack clears—details matter for subtle ordering bugs.

## Common mistakes

1. Forgetting `await` and logging a Promise object.
2. Race conditions when older responses overwrite newer UI state.
3. Swallowing errors with empty `catch` blocks.

## Interview angles

**Junior:** What problem do Promises solve vs nested callbacks?  
**Mid:** Explain the event loop at a high level.  
**Senior:** Microtasks vs macrotasks; cancellation with `AbortController`.

## Mini exercise

Fetch two URLs concurrently with `Promise.all` and describe failure behavior if one rejects.

## Sources

- MDN event loop (`MDN-JS-EVENT-LOOP`); ECMAScript (`TC39-ECMASCRIPT`).
""",
))

items.append((
    "frontend/typescript-fundamentals.mdx",
    fm(
        id="FRONTEND-TYPESCRIPT",
        title="TypeScript fundamentals",
        title_bn="TypeScript ফান্ডামেন্টালস",
        description="Why TypeScript adds static types to JavaScript, how to model props and APIs, and how types prevent whole classes of bugs.",
        description_bn="TypeScript কেন স্ট্যাটিক টাইপ যোগ করে, props/API মডেলিং, এবং টাইপ কীভাবে বাগ কমায়।",
        track="frontend",
        category="typescript",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["FRONTEND-JAVASCRIPT"],
        recommended_before=["FRONTEND-JS-ASYNC"],
        unlocks=["FRONTEND-TS-ADVANCED", "FRONTEND-REACT"],
        related=["FRONTEND-REACT", "BACKEND-NESTJS"],
        careers=["frontend-engineer", "fullstack-engineer"],
        tags=["typescript", "types"],
        sources=["TS-HANDBOOK", "TC39-ECMASCRIPT"],
        versions={"typescript": "5.x"},
    )
    + """## What is it?

**TypeScript** is JavaScript with a static type system erased at compile time. It documents intent and catches mismatches before runtime.

## Why does it exist?

Large JS codebases suffered from “undefined is not a function” surprises. Types make contracts between modules explicit—especially valuable in React props and API boundaries.

## Mental model

```ts
type User = {
  id: string;
  name: string;
  email?: string;
};

function displayName(user: User): string {
  return user.name.trim();
}
```

Start with `strict` mode. Prefer refining types over using `any`.

## Common mistakes

1. Spamming `as any` to silence errors.
2. Duplicating runtime validation and type definitions that drift apart.
3. Over-engineering complex generics before learning everyday unions/intersections.

## Interview angles

**Junior:** What does TypeScript compile to?  
**Mid:** Explain structural typing with an example.  
**Senior:** Discuss type-driven API clients and validation libraries that keep types honest.

## Mini exercise

Type a function that accepts `success | error` result objects and narrows safely with a discriminant field.

## Sources

- TypeScript Handbook (`TS-HANDBOOK`); JS language baseline (`TC39-ECMASCRIPT`).
""",
))

items.append((
    "frontend/react-hooks.mdx",
    fm(
        id="FRONTEND-REACT-HOOKS",
        title="React Hooks",
        title_bn="React Hooks",
        description="How Hooks let function components hold state and synchronize with external systems without classes.",
        description_bn="Hook কীভাবে function component-এ state ও বাইরের সিস্টেম সিঙ্ক করে—class ছাড়াই।",
        track="frontend",
        category="react",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["FRONTEND-REACT"],
        recommended_before=["FRONTEND-TYPESCRIPT"],
        unlocks=["FRONTEND-REACT-STATE", "FRONTEND-REACT-TESTING"],
        related=["FRONTEND-REACT-STATE", "FRONTEND-JS-ASYNC"],
        careers=["frontend-engineer", "fullstack-engineer"],
        tags=["react", "hooks"],
        sources=["REACT-HOOKS", "REACT-DOCS"],
        versions={"react": "19.x (verify against current React docs)"},
    )
    + """## What is it?

**Hooks** are functions like `useState` and `useEffect` that let you use React features from function components.

## Why does it exist?

Class components mixed lifecycle complexity with reuse difficulties. Hooks make state and side effects composable through ordinary functions.

## Mental model

```tsx
import { useEffect, useState } from 'react';

export function WindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <p>Width: {width}px</p>;
}
```

Rules of Hooks: only call at the top level of React functions, and only from React functions or custom Hooks—so order stays stable across renders.

## Common mistakes

1. Missing effect dependencies or lying about them.
2. Using effects to compute values that should be derived during render.
3. Creating infinite update loops by setting state unconditionally in effects.

## Interview angles

**Junior:** What problem does `useState` solve?  
**Mid:** Explain effect cleanup.  
**Senior:** Custom Hooks design, concurrent rendering pitfalls, and data-fetching libraries vs hand-rolled effects.

## Mini exercise

Write a `useLocalStorageState` Hook sketch that initializes from storage and writes back on change.

## Sources

- React Hooks docs (`REACT-HOOKS`, `REACT-DOCS`).
""",
))

items.append((
    "frontend/nextjs-fundamentals.mdx",
    fm(
        id="FRONTEND-NEXTJS",
        title="Next.js fundamentals",
        title_bn="Next.js ফান্ডামেন্টালস",
        description="What Next.js adds on top of React—routing, rendering modes, and server/client boundaries.",
        description_bn="React-এর উপর Next.js কী যোগ করে—routing, rendering মোড, server/client সীমানা।",
        track="frontend",
        category="nextjs",
        difficulty="advanced",
        minutes=50,
        prerequisites=["FRONTEND-REACT", "FRONTEND-TYPESCRIPT"],
        recommended_before=["FRONTEND-REACT-HOOKS"],
        unlocks=["FRONTEND-NEXTJS-ROUTING", "FULLSTACK-SSR-BOUNDARIES"],
        related=["FULLSTACK-INTEGRATION", "FRONTEND-NEXTJS-ROUTING"],
        careers=["frontend-engineer", "fullstack-engineer"],
        tags=["nextjs", "react", "ssr"],
        sources=["NEXTJS-APP-ROUTER", "REACT-DOCS"],
        versions={"next": "App Router — verify against current Next.js docs"},
    )
    + """## What is it?

**Next.js** is a React framework for production apps: file-system routing, server rendering options, data fetching conventions, and deployment integrations.

## Why does it exist?

Client-only React SPAs struggle with first load performance, SEO, and clear server boundaries. Next.js provides structure for hybrid rendering.

## Mental model

- **Server Components** (default in App Router) run on the server and ship less client JS when possible.
- **Client Components** opt into interactivity with `'use client'`.
- Routes map from the filesystem (`app/dashboard/page.tsx`).

Choose server rendering for data-heavy first paints; push interactivity to the edges of the tree.

## Common mistakes

1. Marking entire trees as client components “just in case.”
2. Fetching secrets in client components.
3. Ignoring caching/revalidation semantics and debugging stale data blindly.

## Interview angles

**Junior:** What does a framework add beyond React?  
**Mid:** SSR vs CSR vs static generation tradeoffs.  
**Senior:** Caching layers, partial prerendering ideas, and auth session boundaries.

## Mini exercise

Decide which parts of a product page (price, add-to-cart button, reviews list) should be server vs client and why.

## Sources

- Next.js App Router docs (`NEXTJS-APP-ROUTER`); React docs (`REACT-DOCS`).
""",
))

items.append((
    "frontend/frontend-accessibility.mdx",
    fm(
        id="FRONTEND-A11Y",
        title="Frontend accessibility",
        title_bn="ফ্রন্টএন্ড অ্যাক্সেসিবিলিটি",
        description="How to build interfaces that work with assistive technologies using semantics, keyboard access, and WCAG-oriented practices.",
        description_bn="সহায়ক প্রযুক্তির সাথে কাজ করে এমন UI—semantics, কীবোর্ড অ্যাক্সেস ও WCAG চর্চা।",
        track="frontend",
        category="accessibility",
        difficulty="intermediate",
        minutes=40,
        prerequisites=["FRONTEND-HTML-SEMANTICS", "FRONTEND-CSS"],
        recommended_before=["FRONTEND-HTML"],
        unlocks=["FRONTEND-PERFORMANCE"],
        related=["UIUX-A11Y", "FRONTEND-HTML-SEMANTICS"],
        careers=["frontend-engineer", "ui-ux-designer"],
        tags=["a11y", "wcag", "accessibility"],
        sources=["W3C-WCAG", "W3C-HTML"],
    )
    + """## What is it?

**Accessibility (a11y)** means people can perceive, operate, and understand your UI—including users of screen readers, keyboards, voice control, and those with temporary impairments.

## Why does it exist?

The web is for everyone. Legal requirements and ethics aside, accessible structure usually improves quality for all users (clear focus, readable contrast, resilient HTML).

## Mental model

1. Prefer native elements (`button`, `a`, `label`) before ARIA.
2. Ensure full keyboard operability and visible focus.
3. Provide text alternatives and sufficient contrast.
4. Don’t rely on color alone to convey meaning.

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" />
```

## Common mistakes

1. Click-only `div` buttons without keyboard support or roles.
2. Removing focus outlines without a replacement.
3. Using ARIA to “fix” broken semantics instead of correcting markup.

## Interview angles

**Junior:** Why use a real `button`?  
**Mid:** Explain WCAG’s perceivable/operable/understandable/robust ideas at a high level.  
**Senior:** Component library accessibility APIs and testing with assistive tech.

## Mini exercise

Audit a modal dialog checklist: focus trap, Escape to close, return focus, labeled title.

## Sources

- WCAG 2.2 (`W3C-WCAG`); HTML semantics (`W3C-HTML`).
""",
))

write_all(items)
