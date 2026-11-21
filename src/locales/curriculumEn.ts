import { Announcement, Badge, ExerciseRule, Lesson, Module, Project } from '../types';
import { AppLanguage, formatAnnouncementCategory, formatCategoryLabel, formatDifficultyLabel } from '../utils/i18n';
import type { GlossaryItem } from '../utils/lessonReadability';
import { LESSON_DETAILS_EN } from './lessonDetailsEn';

export interface LocalizedModuleFields {
  title: string;
  description: string;
  categoryLabel: string;
  badgeName: string;
  topics: string[];
  projectBrief?: string;
}

export interface LocalizedLessonMeta {
  title: string;
  summary: string;
}

export interface LocalizedProjectFields {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  requirements: string[];
  stages: {
    stage: number;
    title: string;
    description: string;
    tasks: string[];
  }[];
  acceptanceTests: string[];
  deployInstructions: string[];
}

export const MODULES_EN: Record<number, LocalizedModuleFields> = {
  1: {
    title: 'HTML Foundations — Building Your First Pages from Scratch',
    description:
      'The easiest start into web development! Step by step, without confusing jargon and with ready hints, learn to add headings, text, lists, images, links, and forms.',
    categoryLabel: 'Foundations',
    badgeName: 'HTML Foundations Master',
    topics: [
      'First tags: headings (h1-h6), text paragraphs (p), and strong emphasis (strong)',
      'Text formatting: italics (em), highlighting (mark), quotes (blockquote), code (code, pre), and dividers (br, hr)',
      'Shopping and step lists (ul, ol, li, dl) and clickable links (a href)',
      'Advanced links: target="_blank", anchor jumps (#section), mailto:, tel:, and relative paths',
      'Images (img), figure captions (figure, figcaption), and lazy loading (loading="lazy")',
      'Data tables (table, thead, tbody, tfoot, tr, th, td, colspan)',
      'Grouping elements in boxes (div, span), class and id attributes, and custom data-* attributes',
      'Full HTML5 skeleton: DOCTYPE, head (settings, meta, title), and body (visible content)',
      'Semantic page layout: header, nav, main, section, article, aside, and footer',
      'Forms Part 1: text inputs (input), labels (label), and buttons (button)',
      'Forms Part 2: dropdowns (select), textarea, checkbox, radio, fieldset, and HTML5 validation',
      'Multimedia on the page: video player (video), audio player (audio), and vector graphics (SVG)',
      'Native interactive components: FAQ accordion (details, summary), modal dialog (dialog), and iframe',
      'Digital accessibility (WCAG / aria-label) and Google search visibility (SEO Basics)',
    ],
    projectBrief:
      'Module Capstone: Your first online business card with a headline, photo, skills list, and contact form.',
  },
  2: {
    title: 'CSS — Modern Styling & Layouts',
    description:
      'Selectors, specificity, the Box Model, flexible Flexbox, two-dimensional CSS Grid, Mobile-First approach, animations, and CSS variables.',
    categoryLabel: 'Frontend',
    badgeName: 'Flexbox & Grid Layout Master',
    topics: [
      'The Cascade, inheritance, and selector specificity calculation',
      'Box Model under the hood: content, padding, border, margin, and box-sizing: border-box',
      'Selectors, pseudo-classes (:hover, :focus, :nth-child), colors (HEX, RGB, HSL), and units (rem, px, vh, vw)',
      'Web typography (Google Fonts, line-height, clamp) plus backgrounds and gradients',
      'Element positioning (relative, absolute, fixed, sticky) and z-index stacking contexts',
      'Flexbox: main and cross axes, align-items, justify-content, flex-wrap, and gap',
      'CSS Grid: grid-template-columns, fr units, repeat, minmax, auto-fit, and grid-template-areas',
      'Responsiveness and Media Queries: designing with a Mobile-First strategy',
      'Modern CSS: custom properties, pseudo-classes (:is, :where, :has), and @keyframes animations',
    ],
    projectBrief: 'Module Project: A fully responsive SaaS product landing page with animations and dark mode.',
  },
  3: {
    title: 'JavaScript — Logic & Interactivity',
    description:
      'Variables (const, let), primitive and reference types, arrow functions, DOM manipulation, event handling, async programming (Promises, async/await), and Fetch API.',
    categoryLabel: 'Frontend',
    badgeName: 'JavaScript Wizard',
    topics: [
      'Data types, lexical scope, hoisting, and comparison operators',
      'Conditionals (if/else, switch), Truthy/Falsy values, and Nullish Coalescing (??)',
      'Loops (for, while, for...of) and core array operations (push, pop, includes, slice)',
      'Functions from scratch: declarations, default params, return, Arrow Functions, and Scope',
      'Objects, destructuring, Spread/Rest (...) operator, LocalStorage persistence, and JSON',
      'Higher-order functions, closures, and array methods (map, filter, reduce, find)',
      'Document Object Model (DOM): querySelector, creating and modifying nodes',
      'Event architecture: Event Bubbling, Event Capturing, and Event Delegation',
      'Async programming: Event Loop, Call Stack, Microtasks, Promises, and async/await',
      'Fetching network data: Fetch API, headers, JSON parsing, and graceful try/catch error handling',
    ],
    projectBrief: 'Module Project: TaskFlow task manager app with filtering, LocalStorage persistence, and animations.',
  },
  4: {
    title: 'How the Internet Works, Code Editor & Terminal (Tools)',
    description:
      'Now that you can build pages in HTML, CSS, and JavaScript, learn how browsers talk to servers (HTTP/DNS), work in VS Code, use the Terminal, and inspect with DevTools (F12).',
    categoryLabel: 'Foundations',
    badgeName: 'Terminal Pioneer',
    topics: [
      'How the internet works: browser (Client), server, and HTTP status codes (200, 404)',
      'How computers execute code: algorithms and variables in memory',
      'Environment setup: VS Code, keyboard shortcuts, and Prettier',
      'Terminal from scratch: creating folders and navigating files',
      'Browser DevTools (F12) and .env configuration files',
    ],
    projectBrief: 'Configuring a secure developer environment and writing a startup bash script.',
  },
  5: {
    title: 'Git & GitHub — Version Control & Team Workflow',
    description:
      'Every developer’s essential toolkit: commits, branches, merging changes, resolving conflicts, pull requests, and building a professional GitHub portfolio.',
    categoryLabel: 'Foundations',
    badgeName: 'Git Captain',
    topics: [
      'Initializing a repository, file states (untracked, staged, committed), and .gitignore',
      'Readable commit convention (Conventional Commits: feat, fix, chore, docs)',
      'Working with branches: git checkout, git switch, git branch, and git merge',
      'Resolving merge conflicts step by step in VS Code',
      'Remote collaboration with GitHub: git push, git pull, git fetch, and opening Pull Requests',
      'Code Review: reading teammates’ diffs and writing constructive feedback',
    ],
    projectBrief: 'Module Project: Publishing an open GitHub repository with a polished README.md and license.',
  },
  6: {
    title: 'TypeScript — Code Safety & Scalability',
    description:
      'Static typing for the JavaScript ecosystem: primitives, interfaces, type aliases, unions, generics, utility types, and type-safe API communication.',
    categoryLabel: 'Frontend',
    badgeName: 'TypeScript Type Master',
    topics: [
      'Why TypeScript: catching "undefined is not a function" at compile time',
      'Interfaces vs Type Aliases: when to choose interface vs type',
      'Unions and Type Narrowing (typeof, instanceof, in, custom type guards)',
      'Generics in reusable functions and data structures',
      'Built-in Utility Types: Partial, Required, Pick, Omit, Record, Readonly',
      'Configuring tsconfig.json for strict type safety (strict: true)',
    ],
    projectBrief: 'Module Project: Migrating a pure JS utility library to strict TypeScript with 100% type coverage.',
  },
  7: {
    title: 'React — Modern SPA Applications',
    description:
      'The industry standard for building UIs: functional components, JSX, hooks (useState, useEffect, useMemo, useCallback, useRef), forms, and routing.',
    categoryLabel: 'Frontend',
    badgeName: 'React Architect',
    topics: [
      'Declarative UI and Virtual DOM: how React optimizes rendering',
      'State management: useState and immutability rules',
      'Lifecycle and side effects: useEffect, dependency arrays, and cleanup functions',
      'Building Custom Hooks for clean logic reuse',
      'Component communication and avoiding prop drilling (React Context API)',
      'Client-side navigation and routing (React Router)',
    ],
    projectBrief: 'Module Project: Rich interactive analytics dashboard with charts, filters, and live API data.',
  },
  8: {
    title: 'Backend with Node.js & Express',
    description:
      'Server-side architecture: Node.js runtime, Express.js framework, routing, middleware pipelines, REST API design, Zod validation, and error handling.',
    categoryLabel: 'Backend',
    badgeName: 'Node.js Server Master',
    topics: [
      'How V8 engine, the Node.js event loop, and non-blocking async I/O work',
      'Building an HTTP server and routing in Express.js',
      'Middleware architecture: authentication, request logging (Morgan/Winston), JSON parsing',
      'REST API design standard: resources, HTTP methods (GET, POST, PUT, PATCH, DELETE), and status codes',
      'Strict input validation using the Zod schema library',
      'Global error handling: centralized error middleware and safe error responses',
    ],
    projectBrief: 'Module Project: Complete REST API for a booking system with auth and OpenAPI/Swagger docs.',
  },
  9: {
    title: 'Databases — SQL, PostgreSQL & Prisma ORM',
    description:
      'Relational database design: tables, foreign keys, indexes, 1:1, 1:N, N:M relationships, SQL queries, ACID transactions, migrations, and Prisma ORM.',
    categoryLabel: 'Databases',
    badgeName: 'PostgreSQL Data Architect',
    topics: [
      'Relational databases vs NoSQL: when to choose PostgreSQL',
      'SQL language: SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, GROUP BY',
      'Relational JOINs: INNER JOIN, LEFT JOIN, FULL JOIN',
      'Data integrity, ACID transactions, and concurrency locking',
      'Modern Prisma ORM: defining schema.prisma, generating clients, and migrations',
      'Query optimization, column indexing, and eliminating N+1 queries',
    ],
    projectBrief: 'Module Project: Relational e-commerce database model with Prisma migrations and analytical queries.',
  },
  10: {
    title: 'Authentication & Application Security',
    description:
      'Web application security: bcrypt password hashing, sessions, JWTs, Refresh Tokens, HttpOnly cookies, and defense against SQLi, XSS, and CSRF.',
    categoryLabel: 'DevOps & Security',
    badgeName: 'Web Security Officer',
    topics: [
      'Authentication vs Authorization (RBAC) explained clearly',
      'Secure password storage: salting, work factor, and bcrypt/argon2',
      'JSON Web Tokens (JWT): Header.Payload.Signature structure and trade-offs',
      'Safe token storage: HttpOnly, Secure, and SameSite cookie flags',
      'Defending against OWASP Top 10 vulnerabilities: XSS, CSRF, SQL Injection, SSRF',
      'Rate Limiting, Helmet.js security headers, and CORS policies',
    ],
    projectBrief: 'Module Project: Production Auth module with dual-token rotation (Access + Refresh) and RBAC roles.',
  },
  11: {
    title: 'Full Stack — Integrating the Entire Ecosystem',
    description:
      'Connecting all the pieces: React frontend talking to Express and PostgreSQL backend, cloud file uploads, transactional email, and Stripe test payments.',
    categoryLabel: 'Frontend',
    badgeName: 'Full Stack Integrator',
    topics: [
      'Monorepo architecture vs separate frontend/backend repositories',
      'Shared TypeScript types across client and server boundaries',
      'Server state fetching and synchronization with TanStack Query (React Query)',
      'File uploads: secure direct image uploads to cloud storage (S3 / Cloud Storage)',
      'Sending HTML notification emails via transactional mail services',
      'Online payment integration in test mode (Stripe Elements & Webhooks)',
    ],
    projectBrief: 'Module Project: End-to-end course platform app with test Stripe payments and certificates.',
  },
  12: {
    title: 'Testing & Code Quality',
    description:
      'Write code you can trust: unit tests with Vitest, component tests with React Testing Library, End-to-End tests with Playwright, and automated linting.',
    categoryLabel: 'DevOps & Security',
    badgeName: 'Quality & Testing Master',
    topics: [
      'The Testing Pyramid: unit, integration, and End-to-End (E2E) tests',
      'Testing pure business logic with Vitest / Jest',
      'Testing UI with React Testing Library from the user’s perspective',
      'Browser automation and E2E verification with Playwright',
      'Static analysis: ESLint, Prettier, and Git hooks (Husky)',
      'Code Coverage and practical Test-Driven Development (TDD)',
    ],
    projectBrief: 'Module Project: Complete automated test suite (Unit + Integration + E2E) for a critical checkout flow.',
  },
  13: {
    title: 'Deployment & DevOps — Shipping to Production',
    description:
      'From localhost to millions of users: Docker containerization, GitHub Actions CI/CD pipelines, Linux VPS setup, Nginx Reverse Proxy, domains, and free SSL.',
    categoryLabel: 'DevOps & Security',
    badgeName: 'DevOps & Cloud Engineer',
    topics: [
      'Containerization with Docker: Dockerfile, multi-stage builds, and Docker Compose',
      'CI/CD automation: GitHub Actions workflows (test, build, automated deploy)',
      'Managing an Ubuntu Linux VPS: SSH keys, hardening, and UFW firewall',
      'Web server & Nginx Reverse Proxy: routing, caching, and Certbot SSL certificates',
      'Managing Node.js production processes (PM2 or systemd) and restart policies',
      'Environment variables, production secrets management, and automated database backups',
    ],
    projectBrief: 'Module Project: Deploying a containerized Full Stack app onto a public VPS with domain and HTTPS.',
  },
  14: {
    title: 'Advanced Full Stack — Next.js, WebSockets & Caching',
    description:
      'Level up to senior patterns: Server-Side Rendering (SSR) and SSG in Next.js App Router, real-time WebSockets (Socket.io), and fast Redis caching.',
    categoryLabel: 'Frontend',
    badgeName: 'Advanced Full Stack Architect',
    topics: [
      'Next.js App Router architecture: React Server Components (RSC) vs Client Components',
      'Rendering strategies: SSR, SSG, and Incremental Static Regeneration (ISR)',
      'Real-time communication: WebSocket protocol and Socket.io rooms',
      'In-memory Redis database: query caching, background queues (BullMQ), and Pub/Sub',
      'Performance optimization: Code Splitting, dynamic imports, and bundle analysis',
      'Introduction to microservices architecture and horizontal scaling',
    ],
    projectBrief: 'Module Project: Real-time chat application with rooms, typing indicators, and Redis caching.',
  },
  15: {
    title: 'Portfolio, Technical Interviews & Career',
    description:
      'The final mile to your first Junior Full Stack Developer offer: standout portfolio, engineering CV, live coding challenges, mock interviews, and salary negotiation.',
    categoryLabel: 'Career',
    badgeName: 'Certified Junior Full Stack Developer',
    topics: [
      'How to craft a portfolio that stands out among 500 applicants',
      'Structuring a technical CV: showcasing projects, stack, and measurable impact',
      'Common hiring tasks: live coding, algorithms, and refactoring legacy code',
      'Technical interview prep: deep dives on JS, React, HTTP, SQL, and architecture',
      'Engineering culture: Scrum workflow, task estimation, and team communication',
      'Job search channels, speaking with recruiters, and negotiating compensation',
    ],
    projectBrief: 'Academy Final Capstone: Presenting a live production portfolio backed by real commercial projects.',
  },
};

export const LESSONS_META_EN: Record<string, LocalizedLessonMeta> = {
  // Module 1 (14)
  'html-7': {
    title: 'First HTML Tags: Headings (<h1>-<h6>), Paragraphs (<p>), and Bold (<strong>)',
    summary: 'Welcome to lesson one! See how in 3 easy steps you can render a large headline, body text, and bold keywords on screen.',
  },
  'html-10': {
    title: 'Text Formatting, Quotes & Code: Italics (<em>), Highlight (<mark>), Blockquotes (<blockquote>), and Breaks (<br>, <hr>)',
    summary: 'Learn the tags that give character to page copy: italic emphasis (<em>), yellow marker (<mark>), quotes (<blockquote>), inline code (<code>, <pre>), and dividers (<hr>, <br>).',
  },
  'html-8': {
    title: 'Bulleted & Numbered Lists (<ul>, <ol>) and Link Basics (<a href>)',
    summary: 'Learn how to create clean lists (like a shopping list) and clickable hyperlinks leading to other web pages.',
  },
  'html-11': {
    title: 'Links in Practice: New Tab (target="_blank"), Anchors (#section), mailto:, tel:, and File Paths',
    summary: 'Master every link type used on real websites: opening safely in a new tab with rel="noopener", jumping to page sections (#contact), clickable email/phone links, and relative paths.',
  },
  'html-4': {
    title: 'Images on the Web (<img>), Captions (<figure>, <figcaption>), and Lazy Loading (loading="lazy")',
    summary: 'Learn how to embed images properly with <img>, why the alt attribute is mandatory, how to caption photos inside <figure>, and boost page speed with loading="lazy".',
  },
  'html-12': {
    title: 'Data Tables from A to Z (<table>): Headers (<thead>, <th>), Body (<tbody>), Footer (<tfoot>), and colspan',
    summary: 'Build readable pricing, invoice, and analytics tables: semantic split into <thead>, <tbody>, and <tfoot>, table rows <tr>, header cells <th>, and spanning columns with colspan.',
  },
  'html-9': {
    title: 'Containers <div> and <span> Plus Naming Elements with id and class',
    summary: 'Meet the two most popular HTML wrappers: <div> boxes for grouping sections and <span> for styling inline words, along with class and id selectors.',
  },
  'html-1': {
    title: 'Complete HTML5 Document Skeleton: <!DOCTYPE>, <head>, and <body>',
    summary: 'Now that you know core tags, explore the exact skeleton wrapping every real index.html file: how the invisible <head> differs from the visible <body>.',
  },
  'html-2': {
    title: 'Semantic Page Layout: <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>',
    summary: 'Instead of naming every box <div>, use clear semantic landmarks that state what each region represents: <header>, <nav>, <main>, and <footer>.',
  },
  'html-3': {
    title: 'Forms Part 1 — Basics: Text Inputs (<input>), Labels (<label>), and Buttons (<button>)',
    summary: 'Learn how to build a login or contact form: text input fields <input>, accessible field labels <label>, and submit buttons <button>.',
  },
  'html-13': {
    title: 'Forms Part 2 — Dropdowns (<select>), <textarea>, Checkboxes, Radios, and HTML5 Validation',
    summary: 'Upgrade your forms with dropdown lists (<select> and <option>), multi-line message boxes (<textarea>), checkboxes, radio buttons, <fieldset> groups, and native HTML5 validation.',
  },
  'html-6': {
    title: 'Web Multimedia: Video Player (<video>), Audio (<audio>), and <svg> Icons',
    summary: 'See how a single <video> or <audio> element adds a complete media player with Play, Pause, and Volume controls straight into your page.',
  },
  'html-14': {
    title: 'Native Interactive HTML5: FAQ Accordions (<details>, <summary>), <dialog>, and <iframe>',
    summary: 'Unlock modern HTML5 power without a single line of JavaScript: expandable FAQs (<details> and <summary>), native modal dialogs (<dialog>), and safe embeds (<iframe>).',
  },
  'html-5': {
    title: 'Web Accessibility (WCAG) and Google Search Visibility (SEO Basics)',
    summary: 'Final HTML module lesson! Learn how two clean lines of metadata make your site friendly for Google search crawlers and screen readers used by blind visitors.',
  },

  // Module 2 (9)
  'css-7': {
    title: 'First Steps in CSS: Text Colors, Backgrounds, Fonts, and Clean Gradients',
    summary: '90% of the web is typography. Learn how to pair safe font stacks (font-family), optimize line readability (line-height, max-width: 65ch), and craft modern gradients.',
  },
  'css-6': {
    title: 'Targeting Elements in CSS: Classes (.class), Hover Effects (:hover), and Units (px, rem)',
    summary: 'Master precise DOM element targeting using selectors and pseudo-classes, and understand why professionals favor relative rem and vh/vw units over rigid pixels.',
  },
  'css-1': {
    title: 'The Box Model: Inner Spacing (padding), Borders (border), and Outer Margins (margin)',
    summary: 'Understand how browsers calculate element dimensions and cascade priorities. Master box-sizing: border-box and prevent overflow surprises.',
  },
  'css-2': {
    title: 'Flexbox from Scratch: Aligning Items Side by Side and Effortless Centering',
    summary: 'Stop fighting vertical and horizontal centering! Master the flexible Flexbox model: main and cross axes, justify-content, align-items, flex-direction, and gap.',
  },
  'css-8': {
    title: 'CSS Positioning: Sticky Navbars (sticky, fixed) and Layers (relative, absolute)',
    summary: 'Learn how to pin navigation bars to the top of the viewport (sticky), badge cards with corner labels (relative + absolute), and control layers with z-index.',
  },
  'css-3': {
    title: 'CSS Grid Layout: Two-Dimensional Rows and Columns',
    summary: 'While Flexbox manages one axis, CSS Grid gives full control over rows and columns simultaneously. Master fr units, repeat(), and auto-fit without writing media queries.',
  },
  'css-4': {
    title: 'Phones & Desktops: Responsive Design and @media Queries',
    summary: 'Over 65% of web traffic comes from smartphones. Learn why Mobile-First styling is the industry norm and how to write clean @media (min-width) rules.',
  },
  'css-5': {
    title: 'CSS Custom Properties (--color), Smooth Transitions (transition), and Animations',
    summary: 'Build dynamic Dark / Light themes using native CSS variables and add crisp micro-interactions with transition, transform, and @keyframes.',
  },
  'css-9': {
    title: 'Modern Styling with Tailwind CSS: Utility Classes in Practice',
    summary: 'Discover the Utility-First workflow in Tailwind CSS: building responsive interfaces with utility classes, interactive states (hover:, focus-visible:), breakpoints, and dark: variants.',
  },

  // Module 3 (10)
  'js-1': {
    title: 'First Steps in JavaScript: Variables (const, let), Strings, and Numbers',
    summary: 'JavaScript fundamentals: leaving legacy var behind, block scoping, primitives (string, number, boolean, null, undefined), and strict equality ===.',
  },
  'js-6': {
    title: 'Making Decisions in Code: Conditional Statements (if / else)',
    summary: 'Control program flow step by step: make decisions with if and else blocks, evaluate numeric and string conditions, and set clean fallback defaults.',
  },
  'js-8': {
    title: 'Functions from Scratch: Wrapping Logic into Reusable Commands',
    summary: 'Package logic into reusable functions. Learn the difference between console.log and return, default parameters, arrow functions (=>), and variable Scope.',
  },
  'js-7': {
    title: 'Data Lists (Arrays) and Repeating Actions with Loops (for)',
    summary: 'Before functional programming, master collections from the ground up: zero-based array indexing, push/pop/includes/slice, and iterating with for and for...of loops.',
  },
  'js-9': {
    title: 'Objects (Grouping Data) and Browser Persistence (LocalStorage)',
    summary: 'Master key-value Objects, clean destructuring syntax, shallow cloning with the ...spread operator, and persistent browser storage via localStorage.',
  },
  'js-3': {
    title: 'Bringing HTML to Life: Button Clicks (addEventListener) and Live DOM Updates',
    summary: 'Connect logic to the UI: querySelector selectors, mutating text and CSS classes, click listeners, and the scalable Event Delegation pattern.',
  },
  'js-2': {
    title: 'Modern Array Transformations: map, filter, and find',
    summary: 'Leave manual for-loops behind! Master declarative data transformations with map(), filtering collections with filter(), and aggregating values with reduce().',
  },
  'js-4': {
    title: 'Background Work: Promises (Promise) and async / await Syntax',
    summary: 'Browsers run on a single main thread yet handle animations, clicks, and network calls smoothly. Master the Event Loop, Microtask Queue, Promises, and async/await.',
  },
  'js-5': {
    title: 'Fetching Remote Data: Fetch API and JSON Format',
    summary: 'The heartbeat of modern Frontend: communicating with backend APIs via native Fetch API, sending JSON POST payloads, and catching HTTP 404/500 errors.',
  },
  'js-10': {
    title: 'Splitting Code into Modules (import / export) and Catching Errors (try / catch)',
    summary: 'Organize JavaScript into clean ES6 modules, craft custom Error subclasses, validate strings with RegExp, and format dates and currencies with the Intl API.',
  },

  // Module 4 (6)
  'fund-1': {
    title: 'How Does a Website Work? Browser, Server, and Your First Greeting',
    summary: 'Learn from square one what happens when you type a URL, how a Client differs from a Server, and what HTTP 200 and 404 status codes mean.',
  },
  'fund-2': {
    title: 'How Computers Think: Step-by-Step Algorithms and Variables in Memory',
    summary: 'Before writing complex apps, understand how CPU and RAM execute instructions, what an algorithm is, and how interpreted JS compares to compiled code.',
  },
  'fund-3': {
    title: 'Your Code Editor: VS Code, Shortcuts, and Auto-Formatting',
    summary: 'Configure Visual Studio Code like a pro. Master time-saving keyboard shortcuts, automated Prettier formatting, and ESLint code guards.',
  },
  'fund-4': {
    title: 'Terminal Foundations: Creating Folders and Navigating Files',
    summary: 'Tame the command line — every developer’s superpower. Navigate directories, create and edit files, and install packages confidently.',
  },
  'fund-6': {
    title: 'Reading Error Messages and Mastering Browser DevTools (F12)',
    summary: 'Over 50% of engineering time goes into diagnostics. Learn to read stack traces, pause execution in the debugger, and inspect Console and Network tabs.',
  },
  'fund-5': {
    title: 'Project Security: .env Config Files and Hiding Secrets (.gitignore)',
    summary: 'Store database passwords, API keys, and server secrets safely inside .env files and keep them out of public GitHub commits using .gitignore.',
  },

  // Module 5 (6)
  'git-1': {
    title: 'Git Basics: File States, Staging Area, and Conventional Commits',
    summary: 'See how Git stores project snapshots over time. Master the three states (Working Directory, Staging Area, Repository) and Conventional Commits.',
  },
  'git-2': {
    title: 'Branches, Pull Requests, and Resolving Merge Conflicts',
    summary: 'Collaborate without overwriting teammates’ code: feature branches, git merge workflows, resolving merge conflicts cleanly, and opening GitHub Pull Requests.',
  },
  'git-3': {
    title: 'Undoing Mistakes, Rescuing Work & Stashing: restore, revert, reset, and stash',
    summary: 'Broke something or committed the wrong file? Stay calm! Master Git time-travel tools: git restore, git stash, and safe git revert vs destructive git reset.',
  },
  'git-4': {
    title: 'Remote GitHub Repositories: SSH Keys, git remote, fetch vs pull, and Forks',
    summary: 'Connect your local repo to the world: configure Ed25519 SSH keys, manage remotes, distinguish git fetch from git pull, and contribute via Forks.',
  },
  'git-5': {
    title: 'Code Review Culture, git blame, and git merge vs git rebase',
    summary: 'How elite engineering teams collaborate: constructive Code Review etiquette, keeping clean linear history with git rebase, and tracing history with git blame.',
  },
  'git-6': {
    title: 'Production Releases: SemVer (v1.0.0), Git Tags, Releases, and Git Hooks',
    summary: 'Ship stable releases professionally with annotated Git tags (git tag -a), Semantic Versioning (MAJOR.MINOR.PATCH), and automated Git Hooks.',
  },

  // Module 6 (6)
  'ts-1': {
    title: 'Primitive Types, Type Inference, and Interfaces: interface vs type',
    summary: 'Why do over 80% of engineering teams mandate TypeScript? Master static type checking, inference, modeling shapes with interface vs type, and stopping runtime crashes.',
  },
  'ts-3': {
    title: 'Type Narrowing, Type Guards, and Discriminated Unions',
    summary: 'Safely handle values that take multiple shapes. Master Type Narrowing (typeof, instanceof, in), user-defined type predicates (is), and Discriminated Unions.',
  },
  'ts-4': {
    title: 'Advanced Functions, unknown vs any, void vs never, and Tuples',
    summary: 'Why unknown protects your app while any breaks safety. Type callbacks, optional/default arguments, Function Overloads, and fixed-length Tuples like useState.',
  },
  'ts-2': {
    title: 'Generics (<T>) and Built-in Utility Types',
    summary: 'Write universal, reusable, and strict code: generic parameters <T>, extends constraints, and powerful helpers including Partial, Pick, Omit, Record, and Readonly.',
  },
  'ts-5': {
    title: 'Typing DOM Elements, Events, and Async Fetch / Promise<T> Calls',
    summary: 'Work safely with browser APIs in TypeScript: HTMLInputElement, HTMLButtonElement, e.target vs e.currentTarget, and generic Promise<T> payloads.',
  },
  'ts-6': {
    title: 'tsconfig.json Deep Dive, as const, keyof typeof, and Declaration Files (.d.ts)',
    summary: 'Master advanced TypeScript patterns used in production libraries: freezing literals with as const, deriving types via keyof typeof, satisfies, and tsconfig settings.',
  },

  // Module 7 (7)
  'react-1': {
    title: 'Functional Components, JSX, Props, and useState Management',
    summary: 'The core of React: writing components in JSX, passing immutable props, and managing local UI state with useState cleanly.',
  },
  'react-4': {
    title: 'Conditional Rendering, Lists with key, and Composition Pattern (children)',
    summary: 'Render dynamic collections and flexible wrapper components. Understand key reconciliation, avoiding the numeric 0 bug with &&, and ReactNode children.',
  },
  'react-5': {
    title: 'Controlled Forms, Live Validation, and the useRef Hook',
    summary: 'Master React forms: Controlled Components (value + onChange), multi-field form state objects, live validation errors, and useRef for focus and mutable refs.',
  },
  'react-2': {
    title: 'Side Effects with useEffect, Data Fetching, and Custom Hooks',
    summary: 'Synchronize React components with external systems cleanly: useEffect, dependency arrays, effect cleanup functions, and extracting reusable Custom Hooks.',
  },
  'react-6': {
    title: 'Building Custom Hooks: useLocalStorage, useDebounce, and useFetch',
    summary: 'Extract repeatable stateful logic out of JSX components. Design clean hooks following Rules of Hooks, including useLocalStorage, useDebounce, and useWindowSize.',
  },
  'react-3': {
    title: 'Global State with Context API, useReducer, and Performance Optimization (useMemo)',
    summary: 'Eliminate painful prop drilling! Build shared Context providers, model state machines with useReducer, and prevent wasted work with useMemo and useCallback.',
  },
  'react-7': {
    title: 'SPA Navigation: React Router, Dynamic Params, and Protected Routes',
    summary: 'Build multi-view Single Page Applications without full page reloads: Link/NavLink, useParams, useNavigate, useSearchParams, and Protected Route guards.',
  },

  // Module 8 (6)
  'node-1': {
    title: 'Node.js Runtime, Express.js Routing, and the Middleware Pipeline',
    summary: 'Cross over to the backend: how Node.js works under the hood, creating an Express app, HTTP routing, and chaining (req, res, next) middleware.',
  },
  'node-2': {
    title: 'REST API Design, Strict Zod Validation, and Centralized Error Handling',
    summary: 'Never trust unvalidated client payloads! Build rock-solid REST endpoints backed by Zod schemas, inferred TypeScript types, and unified error responses.',
  },
  'node-5': {
    title: 'Scaling REST APIs: Pagination, Filtering, Sorting (req.query), and CORS',
    summary: 'Design collection endpoints that stay fast even at 100,000+ rows: page/limit pagination metadata, req.query filtering, status codes, and strict CORS headers.',
  },
  'node-4': {
    title: 'Built-in Node.js Modules: fs/promises, path, crypto, Buffer, and Streams',
    summary: 'Before installing npm dependencies, leverage Node’s standard library: async file I/O, cross-platform paths, crypto hashes & UUIDs, and memory-safe Streams.',
  },
  'node-3': {
    title: 'Layered Backend Architecture: Controllers, Services, and Error Handler',
    summary: 'Stop cramming all logic into route callbacks! Adopt Controller-Service-Repository separation, isolate business rules from HTTP transport, and standardize exceptions.',
  },
  'node-6': {
    title: 'Production Backend: Structured Logging, Healthchecks, ENV Validation & Graceful Shutdown',
    summary: 'What separates hobby scripts from enterprise servers? Startup environment validation, JSON structured logs (Pino), /health probes, and SIGTERM graceful shutdown.',
  },

  // Module 9 (6)
  'db-1': {
    title: 'Relational Database Basics, SQL Queries, and 1:N Relationships',
    summary: 'Durable data persistence: tables, Primary Keys, Foreign Keys, core SQL queries (SELECT, INSERT), and combining tables via JOIN.',
  },
  'db-3': {
    title: 'Mutating Data (INSERT, UPDATE, DELETE) and Integrity Constraints',
    summary: 'Safely insert, modify, and remove PostgreSQL records: RETURNING clauses, NOT NULL/UNIQUE/CHECK/DEFAULT constraints, ON DELETE CASCADE, and avoiding bare UPDATE mistakes.',
  },
  'db-4': {
    title: 'Aggregate Functions (COUNT, SUM, AVG), Grouping (GROUP BY, HAVING), and JOIN Types',
    summary: 'Compute analytics straight in SQL: aggregation with COUNT/SUM/AVG, filtering groups with HAVING vs WHERE, and choosing LEFT JOIN over INNER JOIN.',
  },
  'db-5': {
    title: 'Many-to-Many (N:M) Relationships and ACID Transactions (BEGIN, COMMIT, ROLLBACK)',
    summary: 'Model complex enrollments where students take many courses: Junction Tables, composite primary keys, and atomic ACID transactions for money and orders.',
  },
  'db-2': {
    title: 'Prisma ORM: Schema Modeling, Migrations, and Type-Safe Prisma Client',
    summary: 'Say goodbye to brittle raw SQL strings! Model tables and relations cleanly in schema.prisma, run safe migrations, and query with 100% TypeScript autocomplete.',
  },
  'db-6': {
    title: 'Database Performance: B-Tree Indexes, EXPLAIN ANALYZE, and N+1 Queries',
    summary: 'Why does a query take 2 ms locally and 12 seconds in production? Understand B-Tree indexes, read EXPLAIN ANALYZE plans, and eliminate N+1 queries.',
  },

  // Module 10 (5)
  'sec-1': {
    title: 'Authentication: bcrypt Password Hashing and Secure JWT Tokens',
    summary: 'Never store plaintext passwords! Master salted cryptographic hashing (bcrypt), JWT structure (Header.Payload.Signature), and HttpOnly cookie storage.',
  },
  'sec-2': {
    title: 'OWASP Top 10 Defense: XSS, CSRF, SQL Injection, Helmet, and Rate Limiting',
    summary: 'Real-world AppSec: protect users from Cross-Site Scripting (XSS), CSRF, SQL Injection, brute-force attacks, and missing headers using Helmet.js and rate limiters.',
  },
  'sec-5': {
    title: 'Secure Cookies (HttpOnly, Secure, SameSite) and Sessions vs JWT Architecture',
    summary: 'Where should auth tokens live in browsers? Understand why localStorage exposes tokens to XSS, configure HttpOnly/SameSite cookies, and revoke compromised sessions.',
  },
  'sec-3': {
    title: 'Role-Based Access Control (RBAC), Access vs Refresh Tokens, and OAuth 2.0',
    summary: 'Separate Authentication (who you are) from Authorization (what you may do): short-lived Access Tokens, Refresh Token rotation, RBAC guards, and OAuth 2.0 flows.',
  },
  'sec-4': {
    title: 'Anti-Bot Protection (Honeypot & Timing), Secrets Management, and npm Audit',
    summary: 'Block automated spam bots on signup forms without frustrating users with CAPTCHAs: honeypot fields, submission timing analysis, secrets hygiene, and npm audit.',
  },

  // Module 11 (5)
  'fullstack-1': {
    title: 'Full Stack Architecture: Monorepo, Shared Types, and TanStack Query',
    summary: 'Unite frontend and backend into one cohesive system: monorepo layout, shared TypeScript contracts, and effortless server-state caching with TanStack Query.',
  },
  'fullstack-4': {
    title: 'HTTP Client, Auth Interceptors, Automatic Token Refresh, and CORS',
    summary: 'Build a resilient React-to-Express HTTP layer: centralized API wrapper, Bearer token injection, and seamless 401 Retry Queue refresh flows.',
  },
  'fullstack-5': {
    title: 'Full Stack Forms: Shared Zod Validation Schemas (Frontend + Backend)',
    summary: 'Single source of truth for data validation: share one Zod schema between React forms for instant UX feedback and Express controllers for server defense.',
  },
  'fullstack-2': {
    title: 'Data Mutations (useMutation), Cloud File Uploads (Presigned URLs), and Notifications',
    summary: 'Send form mutations, profile avatars, and PDFs cleanly: useMutation with automatic cache invalidation (invalidateQueries) and direct S3 Presigned URL uploads.',
  },
  'fullstack-3': {
    title: 'Online Payments (Stripe Checkout & Webhooks) and Transactional Emails',
    summary: 'Monetize your SaaS or store securely: understand why you never trust frontend payment redirects, verify cryptographic Stripe webhooks, and trigger receipt emails.',
  },

  // Module 12 (4)
  'test-1': {
    title: 'The Testing Pyramid, Vitest, and Unit Testing Pure Business Logic',
    summary: 'Why automated tests are your app’s safety net: understand the testing pyramid, write blazing-fast Vitest / node:test suites, and use clear assertions.',
  },
  'test-2': {
    title: 'Testing React Components (React Testing Library) and Dependency Mocking',
    summary: 'Test UI the way real users interact with it: React Testing Library queries (getByRole, userEvent), async assertions (findByText), and controlled API mocking.',
  },
  'test-4': {
    title: 'Integration Testing REST APIs & Databases: Supertest, Isolation, and Test Factories',
    summary: 'The middle layer of the pyramid: test live Express routes together with Zod validation, auth middleware, and an isolated test database using Supertest.',
  },
  'test-3': {
    title: 'End-to-End (E2E) Browser Testing with Playwright & CI Quality Gates',
    summary: 'The top of the pyramid: run real Chromium browsers via Playwright to click through full-stack user flows, verify navigation, capture screenshots, and catch console errors.',
  },

  // Module 13 (4)
  'devops-1': {
    title: 'Docker Containerization and Automated CI/CD Pipelines',
    summary: 'End "it works on my machine" forever! Build slim multi-stage Docker images and automate testing and deployments in GitHub Actions on every push.',
  },
  'devops-2': {
    title: 'Linux VPS, Nginx Reverse Proxy, Custom DNS Domains, and Free HTTPS (Certbot)',
    summary: 'Launch your Node.js app on a custom domain with a green HTTPS lock: Ubuntu UFW firewall setup, DNS A/CNAME records, Nginx proxy_pass, and Let’s Encrypt SSL.',
  },
  'devops-4': {
    title: 'Production Node.js Processes: PM2, Cluster Mode, Zero-Downtime Reload & Firewall',
    summary: 'Keep Node.js online 24/7 on Linux VPS: PM2 process manager, scaling across all CPU cores in Cluster mode, zero-downtime pm2 reload, and UFW hardening.',
  },
  'devops-3': {
    title: 'Production Monitoring, Backups (pg_dump), PWA, and Google Play Publishing (TWA)',
    summary: 'Launch day is just day one! Automate daily PostgreSQL pg_dump backups, monitor runtime errors, and package your PWA for Android distribution.',
  },

  // Module 14 (4)
  'next-1': {
    title: 'Next.js App Router: React Server Components, SSR, and Server Actions',
    summary: 'Master the modern React Full Stack framework: why React Server Components send zero client JS, how SSR renders fast HTML, and mutations via Server Actions.',
  },
  'next-2': {
    title: 'Real-Time Communication: WebSockets, Socket.io, and Server-Sent Events',
    summary: 'Build live chats, collaborative canvases, instant alerts, and live tickers: bidirectional WebSockets (ws:// / wss://), Socket.io Rooms, and SSE streams.',
  },
  'next-3': {
    title: 'Redis Caching, Background Job Queues (BullMQ), and Core Web Vitals Optimization',
    summary: 'Serve 50,000+ concurrent users without overloading PostgreSQL: Cache-Aside with TTL in Redis, async background queues, and tuning LCP, INP, and CLS metrics.',
  },
  'next-4': {
    title: 'Microservices Architecture, API Gateway, Event-Driven Systems, and Horizontal Scaling',
    summary: 'Know when a monolith hits limits: extract independent services, route traffic through an API Gateway, decouple via event brokers, and scale behind Load Balancers.',
  },

  // Module 15 (4)
  'career-1': {
    title: 'Winning Full Stack Portfolio, Engineering CV, and Live Coding Prep',
    summary: 'Turn skills into your first Junior Full Stack Developer offer: what hiring managers actually check, presenting impact metrics, and acing Live Coding rounds.',
  },
  'career-2': {
    title: 'Technical Interview Prep: Top Questions in JS, React, Node.js, SQL, and System Design',
    summary: 'A curated playbook covering 90% of Junior/Mid Full Stack interview questions. Practice concise answers backed by examples from your own portfolio projects.',
  },
  'career-4': {
    title: 'Algorithms & Data Structures for Live Coding: Big-O Complexity, HashMaps, and Refactoring',
    summary: 'Solve interview coding challenges calmly: compare O(n) vs O(n^2) time complexity, optimize nested loops with Map/Set lookups, and narrate your thought process clearly.',
  },
  'career-3': {
    title: 'Engineering Team Workflow: Agile/Scrum, Estimation, Negotiation, and First 90 Days',
    summary: 'Thrive from day one on an IT team: Scrum ceremonies (Sprint, Daily, Planning, Retro), asking sharp questions (30-minute rule), contract negotiation, and 90-day onboarding.',
  },
};

export const CURATED_BEGINNER_AIDS_EN: Record<
  string,
  {
    analogyTitle: string;
    analogyText: string;
    glossary: GlossaryItem[];
  }
> = {
  'fund-1': {
    analogyTitle: 'Think of Visiting a Restaurant',
    analogyText:
      'The browser (e.g., Chrome) is you sitting at a table. The server is the kitchen in the back. When you type a web address, you send a waiter (HTTP protocol) with an order (Request). The kitchen prepares the dish and sends the waiter back with a finished plate — the HTML page you see on screen (Response 200 OK). If you ask for a dish not on the menu, the waiter returns with "404 Not Found".',
    glossary: [
      { term: 'Client (Browser)', simpleDefinition: 'The app on your computer or phone (e.g., Chrome, Safari) that renders web pages.' },
      { term: 'Server', simpleDefinition: 'A computer running 24/7 on the internet that stores website files and sends them on request.' },
      { term: 'HTTP / HTTPS', simpleDefinition: 'The language browsers and servers speak (S stands for Secure, encrypted connection).' },
      { term: 'Status 200 and 404', simpleDefinition: '200 means "Everything worked, here is the page"; 404 means "That page does not exist".' },
    ],
  },
  'fund-2': {
    analogyTitle: 'An Algorithm Is Simply a Cooking Recipe',
    analogyText:
      'A computer never guesses — it follows every line you write step by step, just like a pancake recipe. A variable in RAM is a labeled box on a shelf (e.g., a box labeled "age" containing a note "20"). An "if" condition is a plain check: "If age is at least 18, enter the club".',
    glossary: [
      { term: 'Algorithm', simpleDefinition: 'A finite list of clear steps leading from input to output (like furniture assembly instructions).' },
      { term: 'Variable (const / let)', simpleDefinition: 'A named box in computer memory holding a number, text, or object.' },
      { term: 'Condition if (...)', simpleDefinition: 'Instruction meaning "If this is true, run the code inside braces { ... }".' },
      { term: 'console.log(...)', simpleDefinition: 'Command that prints a text message inside the developer output panel.' },
    ],
  },
  'html-1': {
    analogyTitle: 'An HTML Skeleton Is an Addressed Envelope (<head>) with a Letter Inside (<body>)',
    analogyText:
      'Picture mailing a letter. The stamp, ZIP code, and metadata written on the outside of the envelope are the <head> section — hidden from the letter’s body. Everything printed on the paper sheet you pull out and read with your eyes is the <body> section.',
    glossary: [
      { term: '<!DOCTYPE html>', simpleDefinition: 'First line telling the browser: "This is a modern HTML5 document".' },
      { term: '<head>', simpleDefinition: 'Hidden page configuration — such as the browser tab title (<title>) and meta tags.' },
      { term: '<body>', simpleDefinition: 'The visible canvas! Everything placed here (<h1>, <p>, images) appears on screen.' },
      { term: '<title>', simpleDefinition: 'Text displayed on the browser tab bar and Google search headlines.' },
    ],
  },
  'html-7': {
    analogyTitle: 'A Web Page Works Like the Front Page of a Newspaper',
    analogyText:
      'Imagine a newspaper where every word has the exact same tiny font — nobody could read it! That is why HTML gives us one bold top headline (<h1>), a smaller subheading (<h2>), readable text paragraphs (<p>), and strong highlights (<strong>). Every tag opens with <p> and closes with a slash </p>.',
    glossary: [
      { term: '<h1> and <h2>', simpleDefinition: 'Headings: <h1> is the main page headline and <h2> is a section subheading.' },
      { term: '<p> (Paragraph)', simpleDefinition: 'Standard text paragraph with clean vertical spacing.' },
      { term: '<strong>', simpleDefinition: 'Marks an important word in bold inside a sentence, e.g. <strong>HTML</strong>.' },
      { term: 'Closing </...>', simpleDefinition: 'Pair opening tags (e.g., <p>) with a matching closing tag using a slash (</p>).' },
    ],
  },
  'html-8': {
    analogyTitle: 'Grocery List (<ul>), Recipe Steps (<ol>), and Signpost (<a href>)',
    analogyText:
      'When shopping for groceries, order rarely matters — that is a bulleted list (<ul>). When baking a cake, you must follow Step 1, Step 2, Step 3 — that is an ordered list (<ol>). Inside either list, each item sits inside an <li> tag. And <a href="..."> acts like a clickable signpost sending visitors to a destination!',
    glossary: [
      { term: '<ul> (Bullets)', simpleDefinition: 'Unordered list with bullet dots — when sequence does not matter.' },
      { term: '<ol> (Numbers 1, 2, 3)', simpleDefinition: 'Ordered list — the browser numbers items 1, 2, 3 automatically.' },
      { term: '<li> (List Item)', simpleDefinition: 'A single row or entry inside a <ul> or <ol> list.' },
      { term: '<a href="url">', simpleDefinition: 'Clickable hyperlink — the URL inside href= defines the destination.' },
    ],
  },
  'html-4': {
    analogyTitle: 'A Picture Frame (<img>) with a Museum Plaque (<figure> & <figcaption>)',
    analogyText:
      'The <img> tag acts like a gallery frame on a wall: src="..." points to where the image file lives, while alt="..." describes the scene in words (shown if the file fails to load or read aloud by screen readers). Wrapping both in <figure> with a <figcaption> adds an authentic gallery plaque beneath the photo.',
    glossary: [
      { term: '<img src="..." alt="...">', simpleDefinition: 'Embeds an image onto the page (void element — no closing tag needed).' },
      { term: 'src and alt', simpleDefinition: 'src specifies the file URL; alt supplies mandatory accessible text description.' },
      { term: '<figure> & <figcaption>', simpleDefinition: '<figure> wraps media together with its caption in <figcaption>.' },
      { term: 'loading="lazy"', simpleDefinition: 'Speeds up initial load by downloading images only when scrolled near view.' },
    ],
  },
  'html-10': {
    analogyTitle: 'Editor Toolkit: Highlighter (<mark>), Pull Quote (<blockquote>), and Monospace (<code>)',
    analogyText:
      'When studying from a textbook, you highlight key terms in yellow (<mark>), emphasize spoken words in italics (<em>), and frame memorable author quotes cleanly (<blockquote>). Meanwhile <hr /> draws a crisp horizontal divider between two distinct topics.',
    glossary: [
      { term: '<em> (Italics)', simpleDefinition: 'Slants text and adds vocal stress for screen readers.' },
      { term: '<mark> (Highlighter)', simpleDefinition: 'Highlights key terms with a marker background like yellow ink.' },
      { term: '<blockquote> & <code>', simpleDefinition: '<blockquote> sets off a long quote; <code> formats inline code snippets.' },
      { term: '<br /> and <hr />', simpleDefinition: '<br /> inserts a line break; <hr /> renders a thematic horizontal rule.' },
    ],
  },
  'html-11': {
    analogyTitle: 'Switchboards & Elevators: New Tab, Page Jumps (#id), and Direct Calls (tel:)',
    analogyText:
      'A standard link walks you into another room. Adding target="_blank" opens a second window beside the first so readers never lose their place. A hash link href="#pricing" acts like an elevator straight to the floor stamped id="pricing", while mailto: and tel: launch email clients or dial phones automatically.',
    glossary: [
      { term: 'target="_blank"', simpleDefinition: 'Opens the destination URL in a fresh browser tab.' },
      { term: 'rel="noopener noreferrer"', simpleDefinition: 'Security safeguard paired with target="_blank" to isolate window openers.' },
      { term: 'href="#section" (Anchor)', simpleDefinition: 'Smoothly jumps to an element sharing id="section" on the same page.' },
      { term: 'mailto: & tel:', simpleDefinition: 'URI schemes that trigger email drafts or mobile phone calls.' },
    ],
  },
  'html-12': {
    analogyTitle: 'A Table (<table>) Works Like a Structured Spreadsheet with Totals Below',
    analogyText:
      'A clean table resembles an invoice or Excel sheet: top column titles belong inside <thead> with bold <th> cells, line items sit inside <tbody> using regular <td> cells, and bottom summaries live inside <tfoot> where labels like "Total" can span two columns via colspan="2".',
    glossary: [
      { term: '<thead>, <tbody>, <tfoot>', simpleDefinition: 'Three structural table groups: header row group, body rows, and summary footer.' },
      { term: '<tr> (Table Row)', simpleDefinition: 'One horizontal row of cells inside a table.' },
      { term: '<th> vs <td>', simpleDefinition: '<th> marks bold column/row headers; <td> holds standard table data.' },
      { term: 'colspan="2"', simpleDefinition: 'Merges two adjacent horizontal cells into one wider column span.' },
    ],
  },
  'html-13': {
    analogyTitle: 'Rich Survey Form: Dropdowns (<select>), Big Text Box (<textarea>), and Toggles',
    analogyText:
      'During online checkout, you pick your country from a dropdown list (<select> filled with <option> items), type delivery instructions into a multi-line box (<textarea>), choose a single payment option via radio circles, and check terms consent with a square checkbox.',
    glossary: [
      { term: '<select> & <option>', simpleDefinition: 'Builds a dropdown menu (<select>) with selectable <option> choices.' },
      { term: '<textarea>', simpleDefinition: 'Resizable multi-line box designed for messages, bios, or comments.' },
      { term: 'checkbox vs radio', simpleDefinition: 'Checkboxes allow multiple picks; radio groups allow only one active choice.' },
      { term: 'minlength="10"', simpleDefinition: 'Native browser rule requiring at least 10 typed characters before submit.' },
    ],
  },
  'html-14': {
    analogyTitle: 'Click-to-Open Drawer (<details> & <summary>) and Window Frame (<iframe>)',
    analogyText:
      '<details> behaves like a drawer with a labeled handle (<summary>): until you click the question handle, the answer stays tucked neatly out of sight without any JavaScript! Meanwhile <iframe> cuts a framed window into your layout showing an external interactive map or video.',
    glossary: [
      { term: '<details> & <summary>', simpleDefinition: 'Creates a native collapsible FAQ accordion with zero JavaScript required.' },
      { term: '<dialog>', simpleDefinition: 'Built-in HTML5 modal popup element supporting accessible open/close controls.' },
      { term: '<iframe src="..." title="...">', simpleDefinition: 'Safely embeds another document (such as a map or video player) inside your page.' },
    ],
  },
  'html-9': {
    analogyTitle: 'Moving Cardboard Box (<div>) and Inline Text Highlighter (<span>)',
    analogyText:
      'Think of moving apartments: <div> is a sturdy cardboard box holding several items together (card heading, text, button) stamped with a sticker class="card". Conversely, <span> acts like a thin highlighter marking a single word or price right inside a sentence without starting a new line.',
    glossary: [
      { term: '<div> (Block Box)', simpleDefinition: 'Groups multiple elements into a container that always starts on a new line.' },
      { term: '<span> (Inline Wrapper)', simpleDefinition: 'Targets a word or phrase inside a sentence without breaking line flow.' },
      { term: 'class="name"', simpleDefinition: 'Reusable styling sticker — apply the same class name to many elements.' },
      { term: 'id="unique-name"', simpleDefinition: 'One-of-a-kind identifier (like a passport ID) for a single element.' },
    ],
  },
  'html-2': {
    analogyTitle: 'An Apartment with Labeled Rooms (Foyer, Living Room, Basement)',
    analogyText:
      'Instead of labeling every room in a house "Room 1, Room 2" (generic <div> tags), labeling them Foyer/Banner (<header> + <nav>), Main Hall (<main>), and Footer Cellar (<footer>) makes the blueprint crystal clear to browsers, Google, and assistive tech.',
    glossary: [
      { term: '<header>', simpleDefinition: 'Top banner area typically housing logo branding and top navigation.' },
      { term: '<nav>', simpleDefinition: 'Primary navigation landmark grouping links to key sections or pages.' },
      { term: '<main>', simpleDefinition: 'Central, unique primary content of the current view (one per page).' },
      { term: '<footer>', simpleDefinition: 'Bottom closure band holding copyright, author credits, and legal links.' },
    ],
  },
  'html-3': {
    analogyTitle: 'A Web Form Works Just Like a Paper Order Slip',
    analogyText:
      'The paper sheet holding every field is <form>. The printed prompt above a box ("Your Name:") is <label>. The blank space where you write is <input>. And stamping and dropping it in the mail slot is clicking <button type="submit">Send</button>.',
    glossary: [
      { term: '<form>', simpleDefinition: 'Wrapper uniting inputs and submit controls into one submittable group.' },
      { term: '<label>', simpleDefinition: 'Accessible text prompt linked to an input field via for="id".' },
      { term: '<input type="email" required>', simpleDefinition: 'User input control; required blocks empty submission automatically.' },
      { term: '<button type="submit">', simpleDefinition: 'Action button that validates and submits its parent form.' },
    ],
  },
  'html-6': {
    analogyTitle: 'A TV with Remote Control (<video controls>) and Music Deck (<audio controls>)',
    analogyText:
      'Writing <video> alone places a screen on the wall, whereas adding the controls keyword hands visitors the remote with Play, Pause, Timeline, and Volume. Adding poster="cover.jpg" shows an attractive thumbnail before anyone presses Play.',
    glossary: [
      { term: '<video controls>', simpleDefinition: 'Built-in browser video player complete with interactive playback controls.' },
      { term: '<audio controls>', simpleDefinition: 'Native audio player for songs, sound effects, or podcast tracks.' },
      { term: 'controls', simpleDefinition: 'Boolean attribute showing Play/Pause, scrubbing bar, volume, and fullscreen UI.' },
      { term: 'poster="image.jpg"', simpleDefinition: 'Preview cover frame shown before video playback begins.' },
    ],
  },
  'html-5': {
    analogyTitle: 'A Google Business Card (SEO) and Voice Guide for Blind Visitors (aria-label)',
    analogyText:
      '<meta name="description"> is the two-sentence tagline on your storefront sign — Google displays it right beneath your page title in search results. Meanwhile aria-label="Close" provides a spoken hint to blind screen-reader users explaining what an "X" icon button actually triggers.',
    glossary: [
      { term: 'SEO', simpleDefinition: 'Search Engine Optimization — structuring pages clearly so Google ranks them accurately.' },
      { term: '<meta name="description">', simpleDefinition: 'Concise 1-2 sentence summary shown below links in search engine snippets.' },
      { term: 'Accessibility (WCAG / a11y)', simpleDefinition: 'Building software usable by everyone, including keyboard-only and blind users.' },
      { term: 'aria-label="Label"', simpleDefinition: 'Screen-reader-only voice description for icon buttons lacking visible text.' },
    ],
  },
  'css-7': {
    analogyTitle: 'CSS Is Your Paintbrush, Color Palette, and Font Picker',
    analogyText:
      'Once HTML puts words on the page, CSS dresses them up. The rule is always identical: write the target element name (like h1 or body), open curly braces { }, and list property: value; pairs inside — such as color: white; for text or background: blue; for backdrop fill.',
    glossary: [
      { term: 'color', simpleDefinition: 'Sets foreground text color, e.g. color: #2563eb;' },
      { term: 'background', simpleDefinition: 'Sets backdrop color or smooth linear/radial gradients behind an element.' },
      { term: 'font-size & line-height', simpleDefinition: 'font-size controls letter height; line-height sets breathing space between lines.' },
    ],
  },
  'css-6': {
    analogyTitle: 'CSS Selectors Address Letters to Specific Elements on Your Page',
    analogyText:
      'Your page holds dozens of paragraphs and buttons. How do you paint only one specific button? Attach class="primary-btn" in HTML, then target it in CSS with a leading dot (.primary-btn { ... }). Adding :hover says: "switch styles when a mouse cursor glides over me".',
    glossary: [
      { term: '.class (with a dot)', simpleDefinition: 'Matches every element carrying class="class" in HTML.' },
      { term: ':hover', simpleDefinition: 'Pseudo-class activated while a pointer hovers over the element.' },
      { term: 'px vs rem', simpleDefinition: 'px uses fixed screen dots; rem scales cleanly relative to root font size (1rem = 16px).' },
    ],
  },
  'css-1': {
    analogyTitle: 'Every Element Is a Gift Box Wrapped in Layers (The Box Model)',
    analogyText:
      'Imagine a wristwatch packed inside a box. The watch itself is Content. Protective foam hugging the watch inside is Padding. The cardboard walls are Border. And empty shelf space separating your box from the neighbor box is Margin.',
    glossary: [
      { term: 'padding (inside)', simpleDefinition: 'Inner cushion pushing text or child items away from the element’s border.' },
      { term: 'border (frame)', simpleDefinition: 'Visible stroke surrounding padding and content, e.g. 1px solid gray;' },
      { term: 'margin (outside)', simpleDefinition: 'Outer breathing space pushing neighboring boxes apart.' },
      { term: 'border-radius', simpleDefinition: 'Rounds sharp corners (e.g. 12px creates smooth modern cards).' },
    ],
  },
  'js-1': {
    analogyTitle: 'JavaScript Variables Are Labeled Drawers Holding Live Data',
    analogyText:
      'Every game or store needs to remember a player’s name and score. Variables store that state: const creates a locked drawer whose binding stays constant (e.g. player name), while let opens a flexible drawer whose numeric value updates dynamically (e.g. XP counter).',
    glossary: [
      { term: 'const (constant)', simpleDefinition: 'Declares a variable whose assignment will not be reassigned.' },
      { term: 'let (mutable)', simpleDefinition: 'Declares a variable whose value can change over time (e.g. score = score + 10).' },
      { term: '=== (strict equals)', simpleDefinition: 'Checks whether two values match in both value and type.' },
      { term: 'console.log(...)', simpleDefinition: 'Prints variable values into the output console on the right side.' },
    ],
  },
  'js-6': {
    analogyTitle: 'if / else Works Just Like a Club Bouncer Checking IDs',
    analogyText:
      'Code makes branching choices identically to a doorman: "IF (if) you have a valid ticket — come inside; OTHERWISE (else) — buy a ticket first." Put the test condition inside parentheses ( ) and the actions to execute inside curly braces { }.',
    glossary: [
      { term: 'if (condition) { ... }', simpleDefinition: 'Runs the braced code block only when the condition evaluates to true.' },
      { term: 'else { ... }', simpleDefinition: 'Fallback block executed automatically whenever the if test is false.' },
      { term: '>= and <=', simpleDefinition: 'Checks "greater than or equal to" (>=) and "less than or equal to" (<=).' },
    ],
  },
};

export const PROJECTS_EN: Record<string, LocalizedProjectFields> = {
  'proj-1': {
    title: 'Personal Developer Portfolio Website',
    category: 'HTML & CSS',
    difficulty: 'Beginner',
    description:
      'Your first calling card on the web. Build a clean, 100% semantic, and responsive site showcasing your bio, tech stack, and project links.',
    requirements: [
      'Use semantic HTML5 tags (header, nav, main, section, footer)',
      'Responsive layout working seamlessly on smartphone, tablet, and 4K monitor',
      'Contact form with field validation (name, email, message)',
      'Zero W3C validation errors and Lighthouse Accessibility score above 95',
      'Dark / light mode powered by CSS variables (prefers-color-scheme)',
    ],
    stages: [
      {
        stage: 1,
        title: 'Semantic HTML5 Skeleton',
        description: 'Prepare index.html with full metadata, About Me, Skills, Projects, and Contact sections.',
        tasks: ['DOCTYPE and viewport meta declaration', 'Proper h1-h3 heading hierarchy', 'Accessible links with aria attributes'],
      },
      {
        stage: 2,
        title: 'CSS Styling & Mobile-First Layout',
        description: 'Build a Flexbox/Grid skill tile layout and responsive navigation menu.',
        tasks: ['Define color variables in :root', 'Media queries for 768px and 1024px breakpoints', 'Clean hover and focus states on buttons'],
      },
      {
        stage: 3,
        title: 'Quality Audit & Launch',
        description: 'Run accessibility checks and optimize graphics into WebP format.',
        tasks: ['Keyboard Tab navigation verification', 'Add favicon and OpenGraph meta tags'],
      },
    ],
    acceptanceTests: [
      'No horizontal scrollbar appears at 375px mobile width',
      'Every form input has a paired <label for=""> element',
      'All images declare width/height attributes and descriptive alt text',
      'Navigation targets are readable and touch-friendly on mobile',
    ],
    deployInstructions: [
      'Initialize a git repository: git init',
      'Push code to GitHub and connect GitHub Pages or Vercel',
      'Configure a custom domain or .vercel.app subdomain with active SSL',
    ],
  },
  'proj-2': {
    title: 'Responsive SaaS Company Landing Page',
    category: 'CSS & Design',
    difficulty: 'Beginner',
    description:
      'Complete landing page for a modern cloud product: Hero section with CTAs, CSS Grid feature showcase, pricing table, and FAQ accordion.',
    requirements: [
      'Hero section with compelling headline and dual CTA buttons',
      '3-column CSS Grid displaying product feature cards',
      'Pricing plan comparison highlighting the "Most Popular" tier',
      'Interactive FAQ accordion built natively with <details> and <summary>',
      'Smooth element entrance transitions powered by CSS Transitions',
    ],
    stages: [
      { stage: 1, title: 'Hero & Sticky Navigation Architecture', description: 'Sticky top navigation bar and high-impact hero banner.', tasks: ['Build responsive nav layout', 'Implement primary/secondary CTA buttons'] },
      { stage: 2, title: 'Feature Grid & Pricing Tiers', description: 'Card grid with icons and subscription comparison layout.', tasks: ['Style elevated cards with subtle borders', 'Highlight featured Pro plan'] },
      { stage: 3, title: 'FAQ Accordion & Newsletter Footer', description: 'Use native <details> elements without writing custom JavaScript.', tasks: ['Style accordion marker rotation', 'Validate newsletter input field'] },
    ],
    acceptanceTests: [
      'Sticky header never covers section anchor headings (scroll-margin-top)',
      'Feature cards preserve equal row height across grid columns',
      'FAQ accordion expands smoothly and responds to Spacebar key',
    ],
    deployInstructions: ['Deploy to Netlify or Cloudflare Pages via npx netlify-cli deploy.'],
  },
  'proj-3': {
    title: 'Developer Calculator & Numeral System Converter',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    description:
      'Interactive math web app supporting core operations, operator precedence, calculation history, and live decimal-to-binary/hex conversion.',
    requirements: [
      'Full keyboard input support (digits, operators +, -, *, /, Enter to evaluate, Escape to clear)',
      'Division-by-zero protection and syntax guardrails',
      'Last 10 operations history panel with one-click value recall',
      'Developer mode: instant BIN, OCT, and HEX base conversion',
    ],
    stages: [
      { stage: 1, title: 'Pure JS Math Engine', description: 'Calculation module handling floating-point precision safely.', tasks: ['Implement arithmetic operators', 'Fix IEEE-754 float rounding artifacts'] },
      { stage: 2, title: 'UI & Keyboard Event Wiring', description: 'Bind button clicks and window keydown listeners.', tasks: ['Map keyboard shortcuts', 'Update display state cleanly'] },
      { stage: 3, title: 'Persistent LocalStorage History', description: 'Save and restore user calculation history across reloads.', tasks: ['Serialize via JSON.stringify', 'Hydrate saved history on boot'] },
    ],
    acceptanceTests: [
      'Evaluating 0.1 + 0.2 displays clean 0.3 rather than 0.30000000000000004',
      'Pressing Enter evaluates the active expression accurately',
      'Clicking a history entry restores the value into the calculator display',
    ],
    deployInstructions: ['Deploy onto Vercel with a clean public URL.'],
  },
  'proj-4': {
    title: 'TaskFlow — Kanban Board with Local Persistence',
    category: 'JavaScript & DOM',
    difficulty: 'Intermediate',
    description:
      'Rich task manager: create tasks, assign priorities and due dates, filter live, Drag & Drop cards across columns (To Do, In Progress, Done), and persist state.',
    requirements: [
      'Three Kanban columns: To Do, In Progress, Done',
      'Create tasks with title, description, priority (low, medium, high), and date',
      'Move tasks using HTML5 Drag & Drop or quick-move buttons',
      'Real-time filtering by search text and priority badge',
      'Export board data to JSON file and import backups back in',
    ],
    stages: [
      { stage: 1, title: 'Data Model & State Store', description: 'Create a TaskManager store handling task arrays cleanly.', tasks: ['Implement addTask, deleteTask, moveTask', 'Sync mutations to LocalStorage'] },
      { stage: 2, title: 'UI Rendering & Edit Modal', description: 'Column renderer preserving accessibility and focus.', tasks: ['Render color-coded priority cards', 'Build task edit modal'] },
      { stage: 3, title: 'Drag & Drop Mechanics', description: 'Implement dragstart, dragover, and drop listeners.', tasks: ['Highlight active drop column', 'Persist reordered column state'] },
    ],
    acceptanceTests: [
      'Reloading the page (F5) preserves all created tasks',
      'Empty task titles are blocked cleanly by validation',
      'Dragging a card into Done updates its status persistently',
    ],
    deployInstructions: ['Deploy onto Vercel or GitHub Pages.'],
  },
  'proj-5': {
    title: 'WeatherSphere — Geocoding & External Weather API App',
    category: 'Async JS & API',
    difficulty: 'Intermediate',
    description:
      'Real-time weather forecast app: browser Geolocation API detection, city autocomplete search, 5-day temperature view, and dynamic weather backgrounds.',
    requirements: [
      'Search any city worldwide with full Unicode/accent character support',
      'Display temperature, humidity, pressure, wind speed, and UV index',
      '24-hour hourly breakdown plus 7-day extended forecast',
      'Graceful network error handling (offline or unknown city)',
      'Loading skeletons while awaiting API responses',
    ],
    stages: [
      { stage: 1, title: 'API Communication Layer', description: 'Fetch coordinates and weather forecasts with fetch().', tasks: ['Query Geocoding and Forecast endpoints', 'Normalize returned JSON payloads'] },
      { stage: 2, title: 'Dynamic UI & Weather Vectors', description: 'Map WMO weather codes onto crisp SVG icons.', tasks: ['Adapt theme by day/night and precipitation', 'Render forecast cards'] },
      { stage: 3, title: 'Browser Geolocation Support', description: 'Detect user coordinates automatically when permitted.', tasks: ['Use navigator.geolocation.getCurrentPosition', 'Handle denied permission fallback'] },
    ],
    acceptanceTests: [
      'Searching an unknown city shows a friendly empty message with zero uncaught errors',
      'Offline mode renders a clear connection status notice',
      'Search queries are debounced to respect API rate limits',
    ],
    deployInstructions: ['Host as a static site on Cloudflare Pages with CSP headers configured.'],
  },
  'proj-6': {
    title: 'PulseAnalytics — Executive Dashboard with React Charts',
    category: 'React & TypeScript',
    difficulty: 'Intermediate',
    description:
      'Business analytics workspace: KPI metrics (revenue, active users, conversion), interactive bar & line charts, date-range filters, and CSV exports.',
    requirements: [
      'Modular React component tree (Sidebar, MetricCard, ChartWidget, DataTable)',
      'Interactive date range picker (Last 7 days, 30 days, Year)',
      'Sortable transaction table with pagination and live text search',
      'Multi-currency switcher (PLN, EUR, USD) recalculating displayed figures',
      'Global filter state managed via React Context or Zustand',
    ],
    stages: [
      { stage: 1, title: 'Core Design System Components', description: 'Build reusable typed UI widgets.', tasks: ['MetricCard with trend badges (+12%)', 'Sortable data table'] },
      { stage: 2, title: 'Charts & Responsive Visualization', description: 'Integrate responsive chart containers.', tasks: ['Revenue area/line chart', 'Traffic source breakdown chart'] },
      { stage: 3, title: 'CSV Export & Mobile Drawer', description: 'Export active filtered rows into downloadable CSV.', tasks: ['Implement downloadCSV helper', 'Slide-out mobile sidebar drawer'] },
    ],
    acceptanceTests: [
      'Clicking column headers toggles ascending and descending sort reliably',
      'Changing date ranges updates all KPI cards immediately',
      'Charts stay contained within viewport bounds on mobile screens',
    ],
    deployInstructions: ['Create production build with npm run build and deploy to Vercel.'],
  },
  'proj-7': {
    title: 'SecureGate — Production JWT & RBAC Auth System',
    category: 'Backend & Security',
    difficulty: 'Advanced',
    description:
      'Production-grade authentication engine: signup password rules, login, bcrypt hashing, dual tokens (15m Access + HttpOnly Refresh cookie), and RBAC.',
    requirements: [
      'Strong password hashing with salt (bcrypt 12 rounds)',
      'Refresh token rotation with Token Reuse Detection',
      'Store refresh tokens in HttpOnly, Secure, SameSite=Strict cookies',
      'Role guard middleware restricting /admin routes to authorized roles',
      'Brute-force rate limiting via express-rate-limit',
    ],
    stages: [
      { stage: 1, title: 'Crypto Helpers & JWT Utilities', description: 'Implement signAccessToken, signRefreshToken, and hashPassword.', tasks: ['Enforce JWT_SECRET validation', 'Type token payload claims'] },
      { stage: 2, title: 'Signup & Login Endpoints', description: 'Build POST /register, POST /login, and POST /logout routes.', tasks: ['Check email uniqueness safely', 'Set HttpOnly refresh cookies'] },
      { stage: 3, title: 'Silent Refresh & Route Guards', description: 'Handle background token rotation on POST /refresh.', tasks: ['Verify token hash against DB allowlist', 'Issue fresh short-lived access token'] },
    ],
    acceptanceTests: [
      'Invalid credentials return 401 without leaking whether the email exists',
      'Refresh token cookie cannot be read from browser document.cookie scripts',
      'Logging out invalidates the refresh token server-side immediately',
    ],
    deployInstructions: ['Deploy onto an HTTPS-enabled Linux server with environment secrets in .env.'],
  },
  'proj-8': {
    title: 'DevChronicle — Developer Tech Blog & Custom CMS',
    category: 'Full Stack',
    difficulty: 'Advanced',
    description:
      'Publishing platform for engineers: live Markdown editor with syntax-highlighted snippets, technical tags, article comments, view counter, and moderation CMS.',
    requirements: [
      'Markdown post editor with headings, highlighted code blocks, and quotes',
      'Server-side pagination and filtering by technical tags',
      'Comment system with spam and sanitization protection',
      'Author CMS dashboard: view stats, draft/publish toggles, and editing',
      'Automatic SEO-friendly URL slugs (e.g. how-i-became-a-developer)',
    ],
    stages: [
      { stage: 1, title: 'Prisma Schema Modeling', description: 'Design relational Post, Tag, Comment, and User tables.', tasks: ['Run npx prisma migrate', 'Create seed script with sample posts'] },
      { stage: 2, title: 'Authenticated Article REST API', description: 'CRUD endpoints guarded by author ownership checks.', tasks: ['Support draft vs published states', 'Atomic view counter updates'] },
      { stage: 3, title: 'Reader View & Author CMS UI', description: 'Clean reading typography alongside editor tools.', tasks: ['Sanitize rendered HTML from Markdown', 'Comment submission flow'] },
    ],
    acceptanceTests: [
      'Only the post author can edit or delete their own articles',
      'Injected <script> tags inside comments are stripped safely (XSS protection)',
      'Slug lookups run in under 500ms backed by unique database index',
    ],
    deployInstructions: ['Host PostgreSQL on Neon / Supabase and deploy full-stack server on Railway / Render.'],
  },
  'proj-9': {
    title: 'CodeMarket — E-Commerce Store with Cart & Stripe Payments',
    category: 'Full Stack & Payments',
    difficulty: 'Advanced',
    description:
      'Digital courses and ebooks storefront: searchable catalog with price filters, server-synced cart, Checkout workflow, and Stripe webhook fulfillment.',
    requirements: [
      'Product catalog with keyword search, price range filter, and categories',
      'Shopping cart (add, quantity update, remove, promo codes)',
      'Stripe Payment Intents integration in test mode',
      'Stripe Webhook verification triggering automatic order fulfillment',
      'Order confirmation screen and downloadable digital receipt summary',
    ],
    stages: [
      { stage: 1, title: 'Catalog & Persistent Cart State', description: 'Browse products and manage client cart totals accurately.', tasks: ['Sync cart items safely', 'Display tax/subtotal breakdown'] },
      { stage: 2, title: 'Stripe Payment Gateway Setup', description: 'Create server PaymentIntents and mount Stripe Elements.', tasks: ['Render Stripe Elements in React', 'Exchange clientSecret securely'] },
      { stage: 3, title: 'Production Webhook Fulfillment', description: 'Verify webhook signatures and mark Orders paid in PostgreSQL.', tasks: ['Use stripe.webhooks.constructEvent', 'Persist transaction audit records'] },
    ],
    acceptanceTests: [
      'Test card (4242...) transitions the order to PAID status via webhook',
      'Client-tampered prices are rejected in favor of authoritative DB pricing',
      'Declined test cards render clear actionable error feedback',
    ],
    deployInstructions: ['Configure Stripe test secrets and deploy behind a public webhook endpoint.'],
  },
  'proj-10': {
    title: 'TeamSync — Multi-Tenant B2B SaaS Platform',
    category: 'Full Stack SaaS',
    difficulty: 'Advanced',
    description:
      'Multi-tenant team collaboration platform: organizations, email member invites, Owner/Manager/Member roles, recurring subscription tiers, and quota limits.',
    requirements: [
      'Strict data isolation between organizations (tenant_id scoping)',
      'Member invite system powered by time-limited verification tokens',
      'Subscription tiers (Free, Startup, Pro) via Stripe Billing',
      'Automated quota enforcement (e.g. max 5 seats on Free plan)',
      'Billing portal enabling plan upgrades, downgrades, or cancellations',
    ],
    stages: [
      { stage: 1, title: 'Multi-Tenant Architecture & RBAC', description: 'Enforce tenant_id foreign keys across every resource.', tasks: ['Organization context middleware', 'Role permission matrix'] },
      { stage: 2, title: 'Recurring Stripe Subscriptions', description: 'Sync Stripe subscription status events with DB entitlements.', tasks: ['Handle customer.subscription.updated', 'Gate pro-only workspace actions'] },
      { stage: 3, title: 'Team Invitations & Onboarding', description: 'Smooth flow for teammates joining an existing workspace.', tasks: ['Generate expiring invite links', 'Accept invite and assign role'] },
    ],
    acceptanceTests: [
      'Members of Organization A can never query Organization B records',
      'Exceeding Free seat limits blocks further invitations with an upgrade CTA',
      'Subscription cancellation downgrades workspace entitlements at period end',
    ],
    deployInstructions: ['Deploy Docker containers with managed PostgreSQL and background billing sync.'],
  },
  'proj-11': {
    title: 'CollabBoard — Real-Time Chat & Shared Drawing Canvas',
    category: 'WebSockets & Realtime',
    difficulty: 'Expert',
    description:
      'Live collaboration workspace: topic chat rooms, live typing indicators, online/offline presence lists, and a synchronized HTML5 multiplayer whiteboard.',
    requirements: [
      'Sub-50ms bidirectional real-time messaging over WebSockets',
      'Dedicated chat rooms preloading the latest 50 messages on join',
      'Live typing indicator ("Alex is typing...") with auto-timeout',
      'Shared Canvas syncing brush strokes instantaneously across clients',
      'Horizontal socket scaling backed by Redis Pub/Sub adapter',
    ],
    stages: [
      { stage: 1, title: 'WebSocket Server & Rooms', description: 'Set up Socket.io with authenticated connection handshakes.', tasks: ['Implement join_room, leave_room, send_message', 'Broadcast room updates'] },
      { stage: 2, title: 'Real-Time Canvas Engine', description: 'Stream compressed vector stroke deltas across active peers.', tasks: ['Throttle stroke packet transmission', 'Brush color & width controls'] },
      { stage: 3, title: 'Redis Adapter & Presence', description: 'Track live room participants and recover smoothly from drops.', tasks: ['Connection heartbeat monitoring', 'Auto-rejoin active room after reconnect'] },
    ],
    acceptanceTests: [
      'Messages sent in one tab render inside connected peers without reload',
      'Canvas strokes drawn on one screen mirror smoothly on peer screens',
      'Dropped network connections auto-reconnect cleanly back into rooms',
    ],
    deployInstructions: ['Deploy onto a WebSocket-friendly host (Render or VPS with Nginx Upgrade headers).'],
  },
  'proj-12': {
    title: 'Capstone: Full Stack Production Application Deployed Live',
    category: 'Capstone Full Stack',
    difficulty: 'Expert',
    description:
      'Your academy masterpiece! Architect and ship a production-ready web platform uniting Next.js/React, TypeScript, Express, PostgreSQL, Prisma, Docker, CI/CD, and custom SSL domain.',
    requirements: [
      'Complete Full Stack architecture with database, authentication, and admin panel',
      'Automated test coverage (unit tests for core logic + Playwright E2E suite)',
      'Full Docker & docker-compose.yml containerization',
      'Automated GitHub Actions CI/CD pipeline (lint, tests, image build, deploy)',
      'Live VPS deployment with custom domain, HTTPS Certbot SSL, and Nginx proxy',
      'Polished engineering README with architecture diagram and setup guide',
    ],
    stages: [
      { stage: 1, title: 'System & Database Architecture', description: 'ERD diagram, Prisma schema, and shared TypeScript contracts.', tasks: ['Finalize Prisma schema', 'Define shared API types'] },
      { stage: 2, title: 'Backend & Frontend Implementation', description: 'Build business workflows, auth dashboards, and Vitest tests.', tasks: ['Auth + RBAC layer', 'Core UI views', 'Unit test coverage'] },
      { stage: 3, title: 'Dockerization & CI/CD Pipeline', description: 'Prepare optimized multi-stage Dockerfiles and GitHub Actions.', tasks: ['Multi-stage Dockerfile', 'CI/CD workflow automation'] },
      { stage: 4, title: 'Production Launch & Certification', description: 'Deploy to Linux VPS, attach SSL domain, and showcase in portfolio.', tasks: ['Nginx & Certbot SSL setup', 'Prepare short demo walkthrough'] },
    ],
    acceptanceTests: [
      'GitHub Actions CI/CD passes green across lint, tests, and build',
      'Homepage scores above 90 on Lighthouse Performance & Accessibility',
      'Containers recover automatically on crash (restart: unless-stopped)',
      'All secrets live strictly inside runtime environment variables',
    ],
    deployInstructions: [
      '1. Connect to your Linux VPS via SSH: ssh user@your-ip',
      '2. Install Docker & Compose: apt install docker.io docker-compose',
      '3. Clone the repo and populate production .env secrets',
      '4. Start services cleanly: docker-compose up -d --build',
      '5. Configure Nginx Reverse Proxy and issue free SSL via Certbot',
    ],
  },
};

export const BADGES_EN: Record<string, { name: string; description: string }> = {
  'first-step': {
    name: 'First Step',
    description: 'Completed your very first academy lesson with full understanding.',
  },
  'html-master': {
    name: 'HTML Semantics Master',
    description: 'Completed 5 core lessons inside the HTML5 Foundations module.',
  },
  'quiz-ace': {
    name: 'Flawless Scholar',
    description: 'Scored a perfect 100% on a knowledge check quiz.',
  },
  'streak-3': {
    name: 'Spark of Discipline (3 days)',
    description: 'Maintained a 3-day uninterrupted coding streak.',
  },
  'streak-7': {
    name: 'Iron Consistency (7 days)',
    description: 'Coded every single day for a full week without missing a day.',
  },
  'xp-500': {
    name: 'Knowledge Collector (500 XP)',
    description: 'Passed the 500 XP experience milestone on the platform.',
  },
  'xp-1500': {
    name: 'Full Stack Veteran (1500 XP)',
    description: 'Earned 1,500 XP — reaching advanced developer progression.',
  },
  'project-first': {
    name: 'Portfolio Builder',
    description: 'Completed and validated your first hands-on commercial project.',
  },
};

export const DEFAULT_ANNOUNCEMENTS_EN: Record<
  string,
  { title: string; content: string; category: string; author: string }
> = {
  'ann-1': {
    title: 'Welcome to Full Stack Developer Academy 2026!',
    content:
      'You are starting a structured path from zero experience to Junior Full Stack Developer. Remember: steady daily practice and writing real code in the interactive editor matter most.',
    category: 'Course',
    author: 'Course Architect',
  },
  'ann-2': {
    title: 'Updated Module: HTML5 Semantics & WCAG Digital Accessibility',
    content:
      'Published comprehensive lessons with interactive sandbox exercises and instant automated rule checks.',
    category: 'Update',
    author: 'Curriculum Team',
  },
  'ann-3': {
    title: 'Tip of the Week: Inspect Accessibility Inside Browser DevTools',
    content:
      'Before submitting any form task, check the Accessibility tree in DevTools and verify every input has a linked <label>.',
    category: 'Tip',
    author: 'Lead Instructor',
  },
};

export const PROJECT_SOURCE_DESCRIPTIONS_EN: Record<string, string> = {
  // Project 1: Developer Portfolio
  'proj-1::index.html': 'Complete semantic HTML5 document featuring navigation, Hero showcase, portfolio projects, and an accessible contact form.',
  'proj-1::styles/reset.css': 'Modern CSS reset normalizing box-sizing, typography defaults, media elements, and reduced-motion accessibility.',
  'proj-1::styles/main.css': 'Mobile-First stylesheet powered by CSS custom properties, automatic dark/light theme support, and responsive Grid/Flexbox layout.',
  'proj-1::app.js': 'Theme toggle persistence via localStorage paired with live accessible contact form validation and mobile navigation.',
  'proj-1::README.md': 'Setup, accessibility audit checklist, and GitHub Pages / Vercel deployment guide for the portfolio project.',

  // Project 2: SaaS Landing Page
  'proj-2::index.html': 'Full SaaS landing page featuring sticky navbar, Hero CTA section, 3-column feature grid, pricing table, and native FAQ accordion.',
  'proj-2::css/style.css': 'Sticky header styling with scroll-margin-top, equal-height CSS Grid cards, highlighted Pro plan, and smooth <details> transitions.',
  'proj-2::js/main.js': 'Interactive Monthly/Yearly billing toggle with 20% discount calculation and client-side newsletter validation.',
  'proj-2::README.md': 'Architecture overview and deployment checklist for the responsive SaaS landing page.',

  // Project 3: Developer Calculator
  'proj-3::index.html': 'Developer calculator UI featuring multi-line readout, numeric keypad, BIN/OCT/HEX base panels, and calculation history.',
  'proj-3::style.css': 'Dark calculator interface built with CSS Grid, accented operator keys, and responsive history drawer.',
  'proj-3::app.js': 'Safe math parser without eval() handling IEEE-754 precision (0.1+0.2=0.3), BIN/OCT/HEX conversion, keyboard shortcuts, and localStorage history.',
  'proj-3::README.md': 'Feature overview, keyboard shortcuts, and math parser documentation for the Developer Calculator.',

  // Project 4: TaskFlow Kanban
  'proj-4::index.html': 'Kanban board layout with task creation form, real-time search/filter bar, 3 workflow columns, and JSON backup controls.',
  'proj-4::styles.css': '3-column CSS Grid layout with active dropzone highlight (.drag-over), priority badges, and responsive column stacking.',
  'proj-4::src/state.js': 'TaskFlow state module managing task CRUD, localStorage persistence, search/priority filtering, and JSON export/import.',
  'proj-4::src/dom.js': 'Safe DOM rendering helpers using createElement/textContent (XSS-safe) for Kanban cards, counters, and column controls.',
  'proj-4::src/dragDrop.js': 'HTML5 Drag & Drop controller plus keyboard/button column movement wiring the state and DOM modules together.',
  'proj-4::README.md': 'Module architecture and usage instructions for the TaskFlow Kanban application.',

  // Project 5: WeatherSphere
  'proj-5::index.html': 'WeatherSphere dashboard featuring city search with autocomplete, GPS lookup button, loading skeleton, and 7-day forecast grid.',
  'proj-5::styles.css': 'Glassmorphic weather dashboard styling with animated shimmer skeletons, forecast cards, and responsive layout.',
  'proj-5::js/api.js': 'Async Open-Meteo Geocoding & Forecast API client with WMO weather code mapping, abortable requests, and offline error handling.',
  'proj-5::js/ui.js': 'DOM renderer for current weather hero card, 7-day forecast grid, autocomplete suggestions, skeletons, and error banners.',
  'proj-5::js/app.js': 'WeatherSphere controller with 350ms input debouncing, browser Geolocation integration, recent cities storage, and unit toggle.',
  'proj-5::README.md': 'Setup guide and Open-Meteo API integration overview for WeatherSphere.',

  // Project 6: PulseAnalytics Dashboard
  'proj-6::package.json': 'React 19 + TypeScript + Vite project manifest with dev, type-check, and production build scripts.',
  'proj-6::tsconfig.json': 'Strict TypeScript configuration enabling JSX transform, bundler resolution, and full type safety.',
  'proj-6::index.html': 'Vite SPA entry HTML shell mounting the React root container.',
  'proj-6::src/main.tsx': 'React 19 application bootstrap mounting <App /> inside StrictMode.',
  'proj-6::src/types/analytics.ts': 'Strict TypeScript contracts for transactions, KPI summaries, status filters, and sorting options.',
  'proj-6::src/utils/exportCsv.ts': 'RFC-4180 CSV serializer with UTF-8 BOM support for Microsoft Excel and browser file download helper.',
  'proj-6::src/components/RevenueChart.tsx': 'Interactive SVG revenue bar chart with category breakdown, hover tooltips, and responsive viewBox.',
  'proj-6::src/App.tsx': 'Main PulseAnalytics dashboard computing KPIs (.filter + .reduce), interactive chart, sortable paginated table, and CSV export.',
  'proj-6::README.md': 'Installation, development server, and architecture documentation for PulseAnalytics.',

  // Project 7: SecureGate Auth API
  'proj-7::package.json': 'Node.js + Express + TypeScript backend manifest including bcrypt, jsonwebtoken, pg, helmet, and node:test.',
  'proj-7::tsconfig.json': 'Strict NodeNext TypeScript configuration targeting ES2022 for the authentication API.',
  'proj-7::.env.example': 'Environment variable template for PostgreSQL connection, JWT access/refresh secrets, and CORS origin.',
  'proj-7::database/schema.sql': 'PostgreSQL schema defining users, RBAC roles, and hashed refresh token family storage for reuse detection.',
  'proj-7::src/db/pool.ts': 'PostgreSQL connection pool and parameterized repository helpers for users and refresh tokens.',
  'proj-7::src/utils/jwt.ts': 'Cryptographic helpers signing and verifying short-lived Access Tokens (15m) and Refresh Tokens (7d) with SHA-256 hashing.',
  'proj-7::src/middleware/authMiddleware.ts': 'Bearer JWT verification guard, RBAC role authorization middleware, and in-memory login rate limiter.',
  'proj-7::src/controllers/authController.ts': 'Auth endpoints handling registration, bcrypt login, HttpOnly refresh cookie rotation, token reuse revocation, and logout.',
  'proj-7::src/server.ts': 'Express application wiring Helmet security headers, credential-aware CORS, auth routes, and admin-only endpoints.',
  'proj-7::src/utils/jwt.test.ts': 'Automated node:test unit tests validating token signing, verification, and invalid signature rejection.',
  'proj-7::README.md': 'Security architecture overview, PostgreSQL setup, and API testing guide for SecureGate.',

  // Project 8: DevChronicle Full-Stack Blog CMS
  'proj-8::package.json': 'Full-Stack CMS workspace manifest combining Express, Prisma, Zod, JWT, React 19, and Vite.',
  'proj-8::tsconfig.json': 'Strict TypeScript configuration covering both backend API and React frontend sources.',
  'proj-8::.env.example': 'Environment configuration for PostgreSQL DATABASE_URL, JWT_SECRET, and frontend origin.',
  'proj-8::prisma/schema.prisma': 'Prisma PostgreSQL schema modeling User, Post, Comment, and Tag relations with unique SEO slug index.',
  'proj-8::backend/src/utils/slugify.ts': 'URL-safe Polish diacritics slug generator and XSS-safe text/HTML sanitizer for comments and excerpts.',
  'proj-8::backend/src/middleware/auth.ts': 'JWT Bearer authentication middleware attaching verified author identity to Express requests.',
  'proj-8::backend/src/routes/posts.ts': 'Full CRUD REST API for articles & comments with pagination, tag filtering, atomic view counters, and author ownership checks.',
  'proj-8::backend/src/server.ts': 'Express CMS server combining Helmet, CORS, healthcheck endpoint, and /api/posts routes.',
  'proj-8::frontend/src/App.tsx': 'React CMS frontend featuring tag filters, search, article detail reader with comments, and publish editor form.',
  'proj-8::README.md': 'Prisma migration, local dev startup, and API endpoint documentation for DevChronicle.',

  // Project 9: CodeMarket E-Commerce + Stripe
  'proj-9::package.json': 'Full-Stack E-Commerce manifest bundling Express, Stripe SDK, PostgreSQL, Zod, and React 19.',
  'proj-9::tsconfig.json': 'Strict TypeScript configuration for the Stripe payment server and React storefront.',
  'proj-9::.env.example': 'Environment template for PostgreSQL, Stripe test secret key, and webhook signing secret.',
  'proj-9::database/schema.sql': 'PostgreSQL e-commerce schema with cent-based pricing, orders, order items, and Stripe webhook idempotency table.',
  'proj-9::server/src/validators/orderSchema.ts': 'Zod checkout payload validator and server-side promo discount calculator (DEV20 / WELCOME10).',
  'proj-9::server/src/services/stripeService.ts': 'Transactional checkout service locking stock (FOR UPDATE), computing authoritative DB prices, and creating Stripe Checkout sessions.',
  'proj-9::server/src/webhooks/stripeWebhook.ts': 'Idempotent Stripe webhook handler verifying HMAC signatures, marking orders paid, and decrementing inventory atomically.',
  'proj-9::server/src/index.ts': 'Express API mounting express.raw() for /api/webhooks/stripe before express.json(), plus product catalog and checkout routes.',
  'proj-9::client/src/context/CartContext.tsx': 'React Cart Context with localStorage sync, stock-bounded quantity steppers, and live promo code discount totals.',
  'proj-9::client/src/App.tsx': 'CodeMarket storefront UI with category filters, shopping cart drawer, promo input, and Stripe Checkout redirect.',
  'proj-9::README.md': 'Setup instructions for PostgreSQL, Stripe CLI local webhook forwarding, and anti-tampering security guarantees.',

  // Project 10: TeamSync B2B SaaS Multi-Tenant
  'proj-10::package.json': 'Multi-Tenant SaaS package manifest combining Express, PostgreSQL, Stripe Billing, Zod, and React 19.',
  'proj-10::tsconfig.json': 'Strict TypeScript configuration for the multi-tenant backend and workspace dashboard.',
  'proj-10::.env.example': 'Environment variables for PostgreSQL, Stripe Billing keys, and subscription price IDs.',
  'proj-10::database/schema.sql': 'Multi-tenant PostgreSQL schema isolating organizations, RBAC memberships, hashed invitations, and workspace projects by tenant_id.',
  'proj-10::src/middleware/tenantMiddleware.ts': 'Tenant isolation guard verifying organization membership and enforcing owner/admin/member RBAC roles.',
  'proj-10::src/billing/subscriptionService.ts': 'SaaS plan seat limits (Free/Pro/Enterprise), active + pending seat quota enforcement, and Stripe Billing Portal session builder.',
  'proj-10::src/routes/invitations.ts': 'Team invitation routes with SHA-256 token hashing, seat limit checks, and transactional invite acceptance.',
  'proj-10::src/server.ts': 'Express SaaS API exposing tenant-scoped /api/orgs/:orgSlug routes for projects, invitations, and billing portal.',
  'proj-10::client/src/WorkspaceDashboard.tsx': 'React B2B workspace UI featuring organization switcher, seat quota progress bar, team invite form, and Stripe billing button.',
  'proj-10::README.md': 'Multi-tenant architecture overview, database initialization, and RBAC security guide for TeamSync.',

  // Project 11: CollabBoard Realtime
  'proj-11::package.json': 'Realtime workspace manifest featuring Express, Socket.io, ioredis, React 19, and Vite.',
  'proj-11::tsconfig.json': 'Strict TypeScript configuration for the Socket.io server and React Canvas client.',
  'proj-11::.env.example': 'Environment configuration for WebSocket port, allowed CORS client origin, and optional Redis URL.',
  'proj-11::server/src/redis/presenceAdapter.ts': 'Presence and 50-message chat history store backed by Redis with automatic in-memory fallback.',
  'proj-11::server/src/sockets/collabServer.ts': 'Socket.io room engine handling room joins, chat history replay, typing indicators, online roster, and Canvas stroke broadcasts.',
  'proj-11::server/src/index.ts': 'HTTP + Express + Socket.io server with /health endpoint and graceful SIGTERM shutdown.',
  'proj-11::client/src/canvas/SharedCanvas.tsx': 'Collaborative HTML5 Canvas whiteboard supporting color picker, brush thickness, clear broadcast, and pointer events.',
  'proj-11::client/src/App.tsx': 'CollabBoard client combining room switcher, live online member roster, real-time chat with typing status, and SharedCanvas.',
  'proj-11::README.md': 'Run instructions and multi-tab real-time testing guide for CollabBoard.',

  // Project 12: Capstone Production App
  'proj-12::package.json': 'Capstone production workspace manifest with Express, Prisma, Zod, JWT, React 19, and node:test.',
  'proj-12::tsconfig.json': 'Strict TypeScript configuration covering the Capstone server and React client.',
  'proj-12::.env.example': 'Production environment template for PostgreSQL, 32+ char JWT secret, and CORS origin.',
  'proj-12::prisma/schema.prisma': 'Prisma PostgreSQL schema defining RBAC Users, WorkspaceItems, and immutable AuditLogs.',
  'proj-12::server/src/middleware/auth.ts': 'Production JWT Bearer verification middleware and ADMIN role authorization guard.',
  'proj-12::server/src/routes/items.ts': 'Zod-validated CRUD routes with IDOR ownership protection and automatic AuditLog recording.',
  'proj-12::server/src/index.ts': 'Production Express entry point with Helmet, CORS, DB-backed /api/health, static client serving, and graceful SIGTERM shutdown.',
  'proj-12::server/src/routes/items.test.ts': 'Automated node:test unit tests verifying Zod schemas and IDOR/RBAC access control logic.',
  'proj-12::client/src/App.tsx': 'React Capstone dashboard supporting JWT auth, workspace item CRUD, and Admin Audit Log view.',
  'proj-12::Dockerfile': 'Optimized multi-stage Node 22 Alpine Docker image running as non-root appuser with built-in HEALTHCHECK.',
  'proj-12::docker-compose.yml': 'Production Docker Compose stack orchestrating PostgreSQL 16 (with healthcheck), Node.js app, and Nginx reverse proxy.',
  'proj-12::nginx/default.conf': 'Nginx reverse proxy configuration with gzip compression, security headers, and WebSocket upgrade forwarding.',
  'proj-12::.github/workflows/ci-cd.yml': 'GitHub Actions CI/CD pipeline executing npm ci, Prisma generate, unit tests, build, and Docker image verification.',
  'proj-12::README.md': 'Complete production deployment guide covering Docker Compose, Prisma migrations, and automated tests.',
};

function translatePrerequisite(raw: string, lessonModuleId: number, language: AppLanguage): string {
  if (language === 'pl') return raw;
  if (raw.includes('od zera')) {
    return 'None — starting completely from scratch!';
  }
  const modMatch = raw.match(/^(?:Podstawy z Modułu|Moduł)\s+(\d+)/);
  if (modMatch) {
    const modNum = Number(modMatch[1]);
    const modEn = MODULES_EN[modNum];
    const shortTitle = modEn ? modEn.title.split('—')[0].trim() : `Module ${modNum}`;
    return raw.startsWith('Podstawy')
      ? `Foundations from Module ${modNum} (${shortTitle})`
      : `Module ${modNum}: ${shortTitle}`;
  }
  const lessonMatch = raw.match(/^Lekcja\s+(\d+):\s*(.+)$/);
  if (lessonMatch) {
    return `Previous Lesson #${lessonMatch[1]} in Module ${lessonModuleId}`;
  }
  return raw;
}

function translateRuleDescriptionEn(rule: ExerciseRule): string {
  switch (rule.ruleType) {
    case 'html_tag_exists':
      return `HTML contains <${rule.target}> element`;
    case 'html_attr_exists':
      return `HTML uses ${rule.target}${rule.param ? `="${rule.param}"` : ''} attribute`;
    case 'html_contains':
      return `HTML markup contains "${rule.target}"`;
    case 'css_contains':
      return `CSS stylesheet includes "${rule.target}"`;
    case 'js_contains':
      return `JavaScript includes "${rule.target}"`;
    default:
      return rule.description;
  }
}

export function localizeLesson(lesson: Lesson, language: AppLanguage): Lesson {
  if (language === 'pl') return lesson;
  const lessonMeta = LESSONS_META_EN[lesson.id];
  const modMeta = MODULES_EN[lesson.moduleId];
  const details = LESSON_DETAILS_EN[lesson.id];
  const localizedTitle = lessonMeta?.title || lesson.title;

  return {
    ...lesson,
    title: localizedTitle,
    summary: lessonMeta?.summary || lesson.summary,
    moduleTitle: modMeta?.title || lesson.moduleTitle,
    prerequisites: lesson.prerequisites.map((p) => translatePrerequisite(p, lesson.moduleId, language)),
    objectives: details?.objectives || lesson.objectives,
    theoryMarkdown: details?.theoryMarkdown || lesson.theoryMarkdown,
    codeExamples: details?.codeExamples
      ? lesson.codeExamples.map((ex, idx) => ({
          ...ex,
          title: details.codeExamples?.[idx]?.title || ex.title,
          explanation: details.codeExamples?.[idx]?.explanation || ex.explanation,
        }))
      : lesson.codeExamples,
    stepByStepGuide: details?.stepByStepGuide
      ? lesson.stepByStepGuide.map((step, idx) => ({
          ...step,
          title: details.stepByStepGuide?.[idx]?.title || step.title,
          description: details.stepByStepGuide?.[idx]?.description || step.description,
        }))
      : lesson.stepByStepGuide,
    interactiveExercise: {
      ...lesson.interactiveExercise,
      title: details?.interactiveExercise?.title || localizedTitle,
      instructions:
        details?.interactiveExercise?.instructions ||
        lessonMeta?.summary ||
        lesson.interactiveExercise.instructions,
      task:
        details?.interactiveExercise?.task ||
        (details?.interactiveExercise?.instructions
          ? details.interactiveExercise.instructions
          : `Satisfy all ${lesson.interactiveExercise.rules.length} checks in the live code editor.`),
      hints: details?.interactiveExercise?.hints || lesson.interactiveExercise.hints,
      rules: lesson.interactiveExercise.rules.map((r) => ({
        ...r,
        description:
          details?.interactiveExercise?.ruleDescriptions?.[r.id] ||
          translateRuleDescriptionEn(r),
      })),
    },
    independentTask: details?.independentTask
      ? {
          ...lesson.independentTask,
          ...details.independentTask,
        }
      : lesson.independentTask,
    quiz: details?.quiz
      ? lesson.quiz.map((q) => {
          const tq = details.quiz?.find((item) => item.id === q.id);
          return tq
            ? {
                ...q,
                question: tq.question,
                options: tq.options,
                explanation: tq.explanation,
              }
            : q;
        })
      : lesson.quiz,
    commonMistakes: details?.commonMistakes
      ? lesson.commonMistakes.map((cm, idx) => ({
          ...cm,
          mistake: details.commonMistakes?.[idx]?.mistake || cm.mistake,
          whyItHappens: details.commonMistakes?.[idx]?.whyItHappens || cm.whyItHappens,
          howToFix: details.commonMistakes?.[idx]?.howToFix || cm.howToFix,
        }))
      : lesson.commonMistakes,
    practicalTask: details?.practicalTask
      ? {
          ...lesson.practicalTask,
          ...details.practicalTask,
        }
      : lesson.practicalTask,
    completionCriteria: details?.completionCriteria || [
      `Master the core concepts of: ${localizedTitle}`,
      'Complete the interactive code exercise cleanly',
      'Pass the lesson knowledge quiz with at least 80%',
    ],
  };
}

export function localizeModule(mod: Module, language: AppLanguage): Module & { displayCategory: string } {
  if (language === 'pl') {
    return {
      ...mod,
      displayCategory: mod.category,
    };
  }
  const en = MODULES_EN[mod.id];
  return {
    ...mod,
    title: en?.title || mod.title,
    description: en?.description || mod.description,
    displayCategory: en?.categoryLabel || formatCategoryLabel(mod.category, language),
    badgeName: en?.badgeName || mod.badgeName,
    prerequisites: mod.prerequisites.map((p) => translatePrerequisite(p, mod.id, language)),
    topics: en?.topics || mod.topics,
    projectBrief: en?.projectBrief ?? mod.projectBrief,
    lessons: mod.lessons.map((lesson) => localizeLesson(lesson, language)),
  };
}

export function localizeProject(project: Project, language: AppLanguage): Project & { displayCategory: string; displayDifficulty: string } {
  if (language === 'pl') {
    return {
      ...project,
      displayCategory: project.category,
      displayDifficulty: project.difficulty,
    };
  }
  const en = PROJECTS_EN[project.id];
  return {
    ...project,
    title: en?.title || project.title,
    description: en?.description || project.description,
    displayCategory: en?.category || project.category,
    displayDifficulty: en?.difficulty || formatDifficultyLabel(project.difficulty, language),
    requirements: en?.requirements || project.requirements,
    stages: en?.stages || project.stages,
    acceptanceTests: en?.acceptanceTests || project.acceptanceTests,
    deployInstructions: en?.deployInstructions || project.deployInstructions,
    sourceFiles: project.sourceFiles?.map((file) => ({
      ...file,
      description: PROJECT_SOURCE_DESCRIPTIONS_EN[`${project.id}::${file.path}`] || file.description,
    })),
  };
}

export function localizeBadge(badge: Badge, language: AppLanguage): Badge {
  if (language === 'pl') return badge;
  const en = BADGES_EN[badge.id];
  if (!en) return badge;
  return {
    ...badge,
    name: en.name,
    description: en.description,
  };
}

export function localizeAnnouncement(
  announcement: Announcement,
  language: AppLanguage
): Announcement & { displayCategory: string } {
  if (language === 'pl') {
    return {
      ...announcement,
      displayCategory: announcement.category,
    };
  }
  const en = DEFAULT_ANNOUNCEMENTS_EN[announcement.id];
  return {
    ...announcement,
    title: en?.title || announcement.title,
    content: en?.content || announcement.content,
    author: en?.author || announcement.author,
    displayCategory: en?.category || formatAnnouncementCategory(announcement.category, language),
  };
}
