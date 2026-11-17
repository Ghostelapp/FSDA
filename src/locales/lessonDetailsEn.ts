import { CommonMistake, InteractiveExercise, QuizQuestion } from '../types';

export interface LocalizedLessonDetail {
  objectives?: string[];
  theoryMarkdown?: string;
  codeExamples?: {
    title: string;
    explanation: string;
  }[];
  stepByStepGuide?: {
    step: number;
    title: string;
    description: string;
  }[];
  interactiveExercise?: Partial<
    Pick<InteractiveExercise, 'title' | 'instructions' | 'task' | 'hints'>
  > & {
    ruleDescriptions?: Record<string, string>;
  };
  independentTask?: {
    title: string;
    instructions: string;
    expectedOutcome: string;
    starterHint: string;
  };
  quiz?: {
    id: string;
    question: string;
    options: string[];
    explanation: string;
  }[];
  commonMistakes?: {
    mistake: string;
    whyItHappens: string;
    howToFix: string;
  }[];
  practicalTask?: {
    title: string;
    brief: string;
    instructions?: string;
    steps: string[];
    deliverable: string;
  };
  completionCriteria?: string[];
}

export const LESSON_DETAILS_EN: Record<string, LocalizedLessonDetail> = {
  'html-7': {
    objectives: [
      'Understand that an HTML tag is simply a word enclosed in angle brackets < >, e.g. <h1>',
      'Create a large headline with <h1> and a regular text paragraph with <p>',
      'Emphasize an important keyword in bold using the <strong> tag',
    ],
    theoryMarkdown: `Welcome to lesson one! Every website — from a personal blog to YouTube or online stores — is built from plain-text markup instructions defining document structure. **HTML (HyperText Markup Language)** requires no complex math: it consists of readable building blocks called **tags**.

**1. How is a typical HTML tag structured?**
A tag is a short keyword wrapped inside angle brackets \`<\` and \`>\`. Think of it as a box you open before your content and close right after it:
- **Opening tag:** \`<h1>\` — tells the browser: *"here starts the main headline"*.
- **Content:** \`My first headline\` — the actual text rendered on screen.
- **Closing tag (with slash \`/\`):** \`</h1>\` — closes the box and ends the headline.

\`\`\`html
<h1>My first headline</h1>
\`\`\`

**2. Heading hierarchy (\`<h1>\` – \`<h6>\`), paragraphs (\`<p>\`), and strong bold (\`<strong>\`):**
- **Headings \`<h1>\` through \`<h6>\`:** \`<h1>\` is the primary title of the entire page (like a book cover title — it should appear **exactly once** per view). \`<h2>\` introduces major sections, and \`<h3>\` marks nested subheadings. Never pick a heading level purely for font size — CSS controls visual sizing, while headings build the outline for Google search bots and screen readers!
- **Paragraph (\`<p>\`):** Wraps prose sentences cleanly; browsers automatically add vertical spacing between consecutive paragraphs.
- **Strong emphasis (\`<strong>\`):** Highlights key words inside a sentence. Unlike legacy \`<b>\`, \`<strong>\` semantically conveys importance to screen readers and search engines.`,
    codeExamples: [
      {
        title: 'Simple profile card with headline, subtitle, and strong emphasis',
        explanation:
          'The browser parses top to bottom: first rendering the large <h1> headline, followed by the smaller <h2> subheading, and finally the <p> paragraph with bold HTML keyword.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Open a tag', description: 'Type the keyword inside angle brackets, e.g. <p>.' },
      { step: 2, title: 'Write text inside', description: 'Type any sentence, e.g. I enjoy building websites.' },
      { step: 3, title: 'Close with a slash', description: 'Always finish with a matching slash closing tag, e.g. </p>.' },
    ],
    interactiveExercise: {
      title: 'Add Your First Paragraph with Bold Emphasis',
      instructions:
        'We already placed a large <h1> headline and an <h2> subheading in the editor. Add a single <p> paragraph at the bottom containing one bold word inside <strong>.',
      task: 'At the bottom of the HTML editor add a <p> paragraph containing <strong> (e.g. <p>Learning <strong>HTML</strong> step by step</p>).',
      hints: [
        'At the very bottom of the HTML editor type: <p>Learning <strong>HTML</strong>!</p>',
        'Remember every opened <p> and <strong> tag needs its matching closing </p> and </strong>.',
        'You can also click "Insert solution template" above the editor anytime to inspect the working answer!',
      ],
      ruleDescriptions: {
        r1: 'Added a text paragraph <p>',
        r2: 'Used strong emphasis <strong>',
      },
    },
    independentTask: {
      title: 'Add a third smaller heading <h3>',
      instructions: 'Below your paragraph try adding an even smaller subheading: <h3>My hobbies</h3>.',
      expectedOutcome: 'An additional smaller subheading renders inside the live preview.',
      starterHint: 'Type <h3>My hobbies</h3> at the end of your HTML code.',
    },
    quiz: [
      {
        id: 'q-h7-1',
        question: 'How do you properly close an <h1> heading tag?',
        options: [
          'With a slash closing tag: </h1>',
          'With a period at the end of the sentence',
          'By typing <h1> a second time',
          'HTML tags never need closing',
        ],
        explanation:
          'In HTML a closing tag repeats the tag name with a forward slash "/" right after "<", giving </h1>.',
      },
      {
        id: 'q-h7-2',
        question: 'How many main <h1> headings should typically appear on a single web page?',
        options: [
          'One primary <h1> heading describing the main topic of the page',
          'At least ten, one for every paragraph',
          'Zero — <h1> is deprecated and replaced by <p>',
          'Exactly six, from <h1> through <h6> in every section',
        ],
        explanation:
          'Good SEO and WCAG accessibility practice recommends one main <h1> for the page title, with nested sections organized under <h2> and <h3>.',
      },
      {
        id: 'q-h7-3',
        question: 'How does <strong> differ from plain CSS font-weight: bold?',
        options: [
          '<strong> conveys semantic importance (recognized by screen readers and search engines), not just visual thickness',
          '<strong> automatically turns the text color red',
          '<strong> only works inside <h1> headings',
          'There is no difference — both mean the exact same thing to screen readers',
        ],
        explanation:
          'The <strong> element signals strong semantic importance for assistive technologies and search crawlers.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the forward slash "/" in the closing tag',
        whyItHappens: 'Early on it is easy to type <p> twice instead of closing with </p>.',
        howToFix: 'Verify the second tag starts with </ (e.g. </h1>, </p>, </strong>).',
      },
    ],
    practicalTask: {
      title: 'Personalize the heading with your name',
      brief: 'Inside the editor above, replace the <h1> text with your own name and watch the live preview update immediately.',
      steps: ['Click the first line of the HTML editor', 'Type your name between <h1> and </h1>', 'Inspect the live output'],
      deliverable: 'Your very first personalized web page.',
    },
    completionCriteria: [
      'Understand h1, h2, p, and strong tags',
      'Write a paragraph with strong emphasis in the editor',
      'Pass the quick knowledge quiz',
    ],
  },
  'html-8': {
    objectives: [
      'Build bulleted <ul> and numbered <ol> lists',
      'Add individual list entries using <li> tags',
      'Create clickable hyperlinks using <a href="url">',
    ],
    theoryMarkdown: `Almost every website relies on structured lists (product features, navigation menus, checkout steps) and clickable links connecting pages together. Hyperlinks are what turned isolated text files into the World Wide Web.

**1. Two core list types — bulleted (\`<ul>\`) and numbered (\`<ol>\`):**
Every HTML list consists of a list wrapper and individual **\`<li>\`** (*list item*) rows:
- **\`<ul>\` (*Unordered List* — bullet dots):** Use whenever item order does not change meaning (shopping lists, package features, top navigation links).
- **\`<ol>\` (*Ordered List* — numbers 1, 2, 3...):** Use wherever sequence matters — step-by-step guides, recipes, leaderboards. Inserting a new \`<li>\` automatically renumbers everything below!
- **Validity rule:** Only \`<li>\` elements may sit as direct children of \`<ul>\` or \`<ol>\`.

\`\`\`html
<ul>
  <li>Coffee</li>
  <li>Tea</li>
</ul>
\`\`\`

**2. Clickable link (\`<a href="...">\` — Anchor):**
Wrap text or a button inside **\`<a>\`** with a mandatory **\`href\`** attribute (*Hypertext Reference*):
\`\`\`html
<a href="https://google.com">Visit Google</a>
\`\`\`
Always make link text descriptive (e.g. *"View pricing tiers"* instead of vague *"Click here"*) to boost both SEO clarity and screen-reader accessibility.`,
    codeExamples: [
      {
        title: 'Ordered study plan list and clickable external link',
        explanation:
          '<ol> automatically numbers each <li> item 1 through 3, while <a href="..."> renders an interactive hyperlink below.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Open a <ul> or <ol> list', description: 'Use <ul> for bullets or <ol> for numbered steps.' },
      { step: 2, title: 'Insert <li> list items', description: 'Place every row inside its own <li>Text</li> pair.' },
      { step: 3, title: 'Add a link <a href="...">', description: 'Provide the destination URL inside href="...".' },
    ],
    interactiveExercise: {
      title: 'Extend the List and Add a Clickable Link',
      instructions:
        'An ordered list <ol> with two steps is already ready. Add a clickable <a> link with an href attribute at the bottom (e.g. <a href="https://google.com">Search Google</a>).',
      task: 'Add a clickable hyperlink <a href="...">Link label</a> at the bottom of the HTML editor.',
      hints: [
        'Keep the existing <ol> list untouched at the top.',
        'Add at the bottom: <a href="https://google.com">My first link</a>',
        'Click "Check code" to verify all checks pass!',
      ],
      ruleDescriptions: {
        r1: 'Code contains list items <li>',
        r2: 'Added anchor link tag <a>',
        r3: 'Link specifies an href="..." destination attribute',
      },
    },
    independentTask: {
      title: 'Append a third <li> list item',
      instructions: 'Inside <ol> add a third entry: <li>Step three: Launch your portfolio</li>.',
      expectedOutcome: 'The list automatically renders item #3.',
      starterHint: 'Insert <li>...</li> just above the closing </ol> tag.',
    },
    quiz: [
      {
        id: 'q-h8-1',
        question: 'Which tag creates an individual row item inside either <ul> or <ol>?',
        options: [
          'Tag <p>',
          'Tag <li> (list item)',
          'Tag <item>',
          'Tag <h1>',
        ],
        explanation: 'Both bulleted <ul> and numbered <ol> lists wrap every single entry inside <li>...</li>.',
      },
      {
        id: 'q-h8-2',
        question: 'Which list type should you pick for recipe steps or a step-by-step guide?',
        options: [
          '<ol> (ordered list numbered 1, 2, 3...)',
          '<ul> (unordered bulleted list)',
          '<dl> without child tags',
          '<nav> instead of a list',
        ],
        explanation:
          'Whenever item order affects meaning (such as step-by-step instructions), <ol> is the proper semantic tag.',
      },
      {
        id: 'q-h8-3',
        question: 'Which attribute on the <a> tag specifies the destination URL of the link?',
        options: ['href', 'src', 'action', 'target'],
        explanation:
          'The href (Hypertext Reference) attribute points to the destination URL or resource opened by the <a> link.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Writing bare text directly inside <ul> without <li> wrappers',
        whyItHappens: 'Forgetting that <ul> is only the outer wrapper while every entry needs <li>.',
        howToFix: 'Always wrap each list entry inside <li> and </li>.',
      },
    ],
    practicalTask: {
      title: 'Top 3 Favorite Movies or Games List',
      brief: 'Edit the <li> items in the editor to list your favorite movies or games.',
      steps: ['Edit the first <li> text', 'Edit the second <li> text', 'Add a third <li> entry'],
      deliverable: 'Your custom TOP 3 numbered list.',
    },
    completionCriteria: [
      'Understand ul, ol, and li tags',
      'Add a working <a href="..."> link in the exercise',
      'Pass the lesson quiz',
    ],
  },
  'html-10': {
    objectives: [
      'Apply semantic emphasis <em>, highlighting <mark>, and fine print <small>',
      'Create readable blockquotes <blockquote> and technical code snippets with <code> and <pre>',
      'Distinguish single line breaks <br> from thematic horizontal dividers <hr>',
    ],
    theoryMarkdown: `In lesson one we covered headings \`<h1>\`–\`<h6>\`, paragraphs \`<p>\`, and strong importance \`<strong>\`. Real articles, tech blogs, and documentation sites also rely on richer inline and block text formatting!

**1. Emphasis (\`<em>\`), highlighter (\`<mark>\`), and fine print (\`<small>\`):**
- **\`<em>\` (Emphasis / italics):** Renders italicized text while signaling vocal stress to screen readers (e.g. \`This is <em>really</em> clear!\`).
- **\`<mark>\` (Highlight):** Highlights key phrases like a bright highlighter pen on study notes or matching search results.
- **\`<small>\` (Side comments & legal fine print):** Scales down secondary notices — ideal for legal disclaimers, updated timestamps, or footer copyright text.

**2. Quotations (\`<blockquote>\`) and displaying source code (\`<code>\` & \`<pre>\`):**
- **\`<blockquote>\`:** Sets apart a longer external quote or testimonial (typically indented with a left accent border).
- **\`<code>\`:** Marks a short command or code token inside prose (e.g. \`Use the <code>&lt;h1&gt;</code> tag\`) in monospace typography.
- **\`<pre>\` (Preformatted text):** Preserves exact whitespace and line breaks as typed — pair it with \`<code>\` for multi-line code listings!

**3. Single line breaks (\`<br>\`) and thematic dividers (\`<hr>\`):**
- **\`<br>\` (Line Break):** Moves text to a new line within the same paragraph (e.g. mailing addresses or poetry lines).
- **\`<hr>\` (Horizontal Rule):** Draws a clean thematic divider between topics. Both are void tags and need no closing slash tag!`,
    codeExamples: [
      {
        title: 'Richly formatted article with quote, highlighter, and code snippet',
        explanation:
          '<mark> highlights the SEO keyword, <em> applies italic emphasis, <blockquote> sets off the quote, and <hr /> inserts a horizontal divider.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Highlight words inside sentences', description: 'Use <em> for italic stress or <mark> for yellow marker highlighting.' },
      { step: 2, title: 'Add a <blockquote> citation', description: 'Wrap a key quote inside <blockquote>...</blockquote> tags.' },
      { step: 3, title: 'Separate topics with <hr />', description: 'Place a self-contained <hr /> divider between content sections.' },
    ],
    interactiveExercise: {
      title: 'Format Study Notes with Quotes and Highlights',
      instructions:
        'A heading and study notes paragraph are already in the editor. Add a quote inside <blockquote> and a paragraph containing a highlighted word inside <mark> below.',
      task: 'Add both <blockquote> and <mark> tags inside your HTML markup.',
      hints: [
        'Add at the bottom: <blockquote>Learning by building gives the strongest results!</blockquote>',
        'Below it add: <p>Core topic: <mark>HTML5</mark></p>',
        'Click "Check code" to pass all rules!',
      ],
      ruleDescriptions: {
        r1: 'Used quote block <blockquote>',
        r2: 'Used highlight tag <mark>',
      },
    },
    independentTask: {
      title: 'Divide sections with a horizontal rule <hr />',
      instructions: 'Insert a void <hr /> tag between <h2> and <blockquote>, plus an inline <code> snippet inside a sentence.',
      expectedOutcome: 'A crisp horizontal rule visually divides sections of the note.',
      starterHint: 'Void tag <hr /> never requires a closing tag.',
    },
    quiz: [
      {
        id: 'q-h10-1',
        question: 'Which HTML5 tag highlights an important term in text like a yellow marker pen?',
        options: ['Tag <mark>', 'Tag <hr>', 'Tag <br>', 'Tag <table>'],
        explanation: 'The <mark> element semantically highlights a key phrase or reference text.',
      },
      {
        id: 'q-h10-2',
        question: 'What is the purpose of the nested pair <pre><code>...</code></pre>?',
        options: [
          'Rendering multi-line source code blocks while preserving spaces and indentation',
          'Playing background audio automatically',
          'Submitting form fields to an API',
          'Hiding text from browser rendering',
        ],
        explanation: '<pre> preserves whitespace/line breaks and <code> marks the content as computer code.',
      },
      {
        id: 'q-h10-3',
        question: 'When is it best to use <em> instead of <i>?',
        options: [
          'When you want to give a word semantic vocal stress in a sentence (e.g. "This is REALLY important")',
          'Only for rendering CSS icon fonts',
          'When centering a paragraph on the screen',
          'For creating bold table headers',
        ],
        explanation:
          'The <em> (emphasis) tag conveys spoken stress and meaning, helping screen readers emphasize that word.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Stacking multiple <br><br><br> tags to create tall vertical spacing',
        whyItHappens: 'Treating <br> like pressing Enter repeatedly in a word processor.',
        howToFix: 'Wrap separate thoughts in individual <p> tags and control vertical spacing cleanly via CSS margin or padding.',
      },
    ],
    practicalTask: {
      title: 'Format a Postal Address Using <br />',
      brief: 'Write a street line and move the postal code and city onto the next line inside one <p> using <br />.',
      steps: ['Type <p>12 Oak Street<br />00-001 Warsaw</p>', 'Inspect how <br /> keeps lines grouped inside one paragraph'],
      deliverable: 'Properly formatted contact address block.',
    },
    completionCriteria: [
      'Apply <blockquote> and <mark> properly',
      'Pass the quiz with at least 80% accuracy',
    ],
  },
  'html-1': {
    objectives: [
      'Master the 4 permanent building blocks of an HTML5 file (DOCTYPE, html, head, body)',
      'Distinguish invisible metadata (<head> & <title>) from visible page content (<body>)',
      'Add a main <h1> heading inside the visible <body> section',
    ],
    theoryMarkdown: `In the opening exercises we jumped straight into \`<h1>\` and \`<p>\` tags because the built-in editor handled page boilerplate behind the scenes. Whenever you create a real \`index.html\` file on disk, every web document needs a full **HTML5 document skeleton** so browsers detect UTF-8 encoding, mobile viewport scaling, and browser tab titles properly.

**1. Four mandatory parts of every complete HTML5 file:**
1. **\`<!DOCTYPE html>\`:** Placed on line 1 before anything else. It switches browsers into modern *Standards Mode* instead of legacy 1990s *Quirks Mode*.
2. **\`<html lang="en">\`:** The root node of the entire DOM tree. Setting \`lang\` correctly helps screen readers pick the right pronunciation accent, assists browser translation tools, and strengthens regional SEO.
3. **\`<head>\` (Invisible document metadata):** Technical metadata never shown in the main viewport. Here we keep \`<meta charset="UTF-8" />\`, \`<meta name="viewport" content="width=device-width, initial-scale=1.0" />\` (essential for mobile responsiveness), the tab \`<title>\`, SEO descriptions, and \`<link rel="stylesheet" />\` assets.
4. **\`<body>\` (Visible page content):** Everything users read and click — headings, navigation bars, articles, photos, forms, and footers — belongs inside \`<body>...</body>\`.

**2. Everyday pro workflow in VS Code:**
Developers never type boilerplate \`head\` and \`meta\` tags from scratch! Inside an empty \`index.html\`, simply type a single exclamation mark **\`!\`** and press \`Tab\` (built-in *Emmet* abbreviation) to expand the full HTML5 skeleton instantly.`,
    codeExamples: [
      {
        title: 'Complete index.html split cleanly into <head> and <body>',
        explanation:
          'Text inside <title> populates the browser tab strip at the top, whereas <h1> and <p> inside <body> render on the visible canvas.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Keep configuration in <head>', description: 'Store <title> (tab label) and character encoding inside <head>.' },
      { step: 2, title: 'Locate the <body> section', description: 'This is where every visible heading and component lives.' },
      { step: 3, title: 'Add <h1> inside <body>', description: 'Insert your main page headline between <body> and </body>.' },
    ],
    interactiveExercise: {
      title: 'Add Main <h1> Heading Inside Visible <body>',
      instructions:
        'A full HTML5 skeleton (<!DOCTYPE html>, <html>, <head>, and <body>) is ready in the editor. Add an <h1> headline inside <body> with your name or page title!',
      task: 'Insert an <h1>Any heading</h1> element inside <body>.',
      hints: [
        'Keep the existing <!DOCTYPE html>, <head>, and <body> tags intact.',
        'Inside <body> simply type: <h1>My Personal Homepage</h1>',
        'Click "Check code" to pass the exercise!',
      ],
      ruleDescriptions: {
        r1: 'Preserved <!DOCTYPE html> declaration',
        r2: 'Preserved <head> section with <title>',
        r3: 'Added <h1> heading inside <body>',
      },
    },
    independentTask: {
      title: 'Add a <p> paragraph below <h1>',
      instructions: 'Inside <body> right below <h1> add a short welcome paragraph: <p>Welcome to my site!</p>.',
      expectedOutcome: 'Complete HTML5 document with title and visible copy.',
      starterHint: 'Make sure your new tag sits above the closing </body> line.',
    },
    quiz: [
      {
        id: 'q-h1-1',
        question: 'In which section of an HTML file should all visible headings, paragraphs, photos, and buttons be placed?',
        options: [
          'Inside the <body>...</body> section',
          'Inside the <head>...</head> section',
          'Inside the <title> tag',
          'Before the <!DOCTYPE html> line',
        ],
        explanation: 'The <body> section holds everything rendered visually to visitors, whereas <head> stores hidden configuration and metadata.',
      },
      {
        id: 'q-h1-2',
        question: 'Where does the text inside <title> within <head> appear?',
        options: [
          'At the bottom page footer',
          'In the browser tab bar at the top and in Google search snippets',
          'Only inside the error console',
          'Nowhere on screen',
        ],
        explanation: '<title> defines the browser tab title (e.g. "My First Website") and search result headline.',
      },
      {
        id: 'q-h1-3',
        question: 'Why do we place the <!DOCTYPE html> declaration at the very top of the document?',
        options: [
          'It tells the browser to render the page in modern HTML5 Standards Mode (instead of legacy Quirks Mode)',
          'It imports Tailwind CSS automatically',
          'It generates the first heading on the page',
          'It encrypts the website with HTTPS',
        ],
        explanation:
          'Omitting <!DOCTYPE html> can push browsers into legacy compatibility mode (Quirks Mode), breaking modern CSS layouts.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Placing visible headlines and buttons inside <head> instead of <body>',
        whyItHappens: 'Confusing document <head> metadata with visible page headings.',
        howToFix: 'Keep only <meta>, <link>, and <title> in <head>. Always place visible UI elements inside <body>.',
      },
    ],
    practicalTask: {
      title: 'The "!" Emmet Shortcut in VS Code',
      brief: 'In VS Code typing a single exclamation mark "!" and pressing Tab expands the complete HTML5 document boilerplate in under a second!',
      steps: ['Remember the shortcut: ! + Tab', 'No need to memorize raw <meta> strings by heart'],
      deliverable: 'Fast workflow for bootstrapping new HTML files.',
    },
    completionCriteria: [
      'Distinguish <head> metadata from visible <body> content',
      'Add an <h1> heading inside <body>',
      'Pass the quick HTML5 skeleton quiz',
    ],
  },
  'css-7': {
    objectives: [
      'Define resilient font stacks with system fallbacks and proper font weights',
      'Improve reading comfort using line-height (1.5–1.7) and optimal line measure',
      'Craft crisp linear-gradient backdrops and distortion-free object-fit: cover images',
    ],
    theoryMarkdown: `Over 90% of content in web apps consists of prose, labels, and buttons. Even bespoke artwork cannot save an interface if body text is cramped, lines stretch too wide, or contrast fails readability standards.

**1. Four pillars of crisp browser typography:**
- **Font Stack (\`font-family\`):** Always declare fallback fonts, e.g. \`font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\`. If a webfont stalls on slow networks, users see a clean native UI font immediately.
- **Line Height (\`line-height\`):** Set unitless \`1.55\`–\`1.7\` on body paragraphs so eyes track smoothly from line to line. Tighten large headings (\`h1\`, \`h2\`) to \`1.15\`–\`1.25\` for compact visual authority.
- **Measure Control (\`max-width: 65ch\`):** One \`ch\` equals the width of the \`0\` glyph in the active font. Limiting text columns to \`60ch–70ch\` stops long lines from tiring the reader on widescreen monitors.
- **Fluid Sizing (\`clamp()\`):** Use \`font-size: clamp(1.75rem, 3.5vw, 3rem);\` so headings scale effortlessly between mobile and desktop without repetitive breakpoints.

**2. Layered CSS Gradients:**
\`linear-gradient(135deg, #0f172a 0%, #312e81 100%)\` creates rich depth, card highlights, and readable photo overlays with zero PNG/JPEG HTTP weight and razor-sharp HiDPI clarity.

**3. Proportion-Safe Cropping (\`object-fit: cover\`):**
Giving a wide photo fixed dimensions like \`80px × 80px\` squashes faces unless you pair it with \`object-fit: cover; object-position: center;\` so the image fills the frame cleanly.`,
    codeExamples: [
      {
        title: 'Modern Hero banner with linear-gradient and balanced typography',
        explanation:
          'The ch unit measures the width of character "0" in the active font — ideal for capping comfortable paragraph column width.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Configure body font-family and line-height', description: 'Guarantee readable spacing across every text block.' },
      { step: 2, title: 'Apply linear-gradient to the featured card', description: 'Blend two harmonious hues such as indigo and violet.' },
      { step: 3, title: 'Protect images from distortion', description: 'Apply object-fit: cover on avatars and thumbnails.' },
    ],
    interactiveExercise: {
      title: 'Style a Banner with linear-gradient and line-height',
      instructions:
        'In CSS style the .banner class with a linear-gradient(...) background and define line-height: 1.6; for crisp multi-line text spacing.',
      task: 'Apply both linear-gradient and line-height inside .banner.',
      hints: [
        'Add: background: linear-gradient(135deg, #4f46e5, #7c3aed);',
        'Add: line-height: 1.6;',
      ],
      ruleDescriptions: {
        r1: 'linear-gradient function used in CSS',
        r2: 'line-height property defined cleanly',
      },
    },
    independentTask: {
      title: 'Fluid Typography with clamp()',
      instructions: 'Try font-size: clamp(1.5rem, 4vw, 3rem) to scale headings smoothly between 1.5rem and 3rem without media queries.',
      expectedOutcome: 'Responsive heading sizing from mobile to widescreen.',
      starterHint: 'Syntax: clamp(minimum, preferred, maximum).',
    },
    quiz: [
      {
        id: 'q-css7-1',
        question: 'Which CSS property prevents an <img> element with fixed 200x200px dimensions from stretching or squashing?',
        options: ['text-align: justify', 'object-fit: cover', 'font-weight: bold', 'display: inline'],
        explanation: 'object-fit: cover preserves the image aspect ratio while filling the 200x200px box and trimming overflow edges cleanly.',
      },
      {
        id: 'q-css7-2',
        question: 'Which CSS property sets the foreground text color of an element (such as a <p> paragraph)?',
        options: ['color', 'background-color', 'font-color', 'text-fill'],
        explanation: 'In CSS, text foreground color is set simply with the color property (there is no font-color property).',
      },
      {
        id: 'q-css7-3',
        question: 'What does linear-gradient(135deg, #4f46e5, #06b6d4) produce in CSS?',
        options: [
          'A smooth color transition angled at 135 degrees between two colors',
          'An infinite 135-degree rotation animation',
          'A thick border around a card',
          'A drop shadow beneath heading text',
        ],
        explanation:
          'linear-gradient creates a smooth background gradient across multiple color stops along the specified angle or direction.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Applying text-align: justify inside narrow mobile columns',
        whyItHappens: 'Carrying over print book habits into responsive web layouts.',
        howToFix: 'Without automatic multi-language hyphenation, justified web columns produce awkward gaps between words. Prefer text-align: left.',
      },
    ],
    practicalTask: {
      title: 'Circular Profile Avatar Card',
      brief: 'Create an 80x80px avatar with border-radius: 50% and object-fit: cover.',
      steps: ['Place a rectangular <img> element', 'Apply width: 80px; height: 80px; border-radius: 50%; object-fit: cover'],
      deliverable: 'Proportionally cropped circular user avatar.',
    },
    completionCriteria: [
      'Style headings and paragraphs in style.css',
      'Verify contrast, linear-gradient, and line-height rules in the editor',
      'Pass the CSS styling quiz',
    ],
  },
  'css-2': {
    objectives: [
      'Distinguish Flex Container vs Flex Items and the Main vs Cross axes',
      'Align navigation items and cards using justify-content, align-items, and gap',
      'Control responsiveness and wrapping using flex-wrap and flex: 1',
    ],
    theoryMarkdown: `Before Flexbox, centering elements vertically required fragile floats or tables. **CSS Flexbox** (\`display: flex\`) makes one-dimensional row and column layouts effortless across navigation bars, toolbars, cards, and modals.

**1. Container–Item Relationship & Two Layout Axes:**
Adding \`display: flex\` on a parent container (*Flex Container*) turns its direct children into flexible *Flex Items*:
- **Main Axis:** Runs left-to-right horizontally by default (\`flex-direction: row\`). Controlled via **\`justify-content\`** (\`flex-start\`, \`center\`, \`flex-end\`, \`space-between\`, \`space-around\`).
- **Cross Axis:** Runs top-to-bottom vertically by default. Controlled via **\`align-items\`** (\`stretch\`, \`center\`, \`flex-start\`, \`flex-end\`).

When you switch to \`flex-direction: column\`, those two axes swap: \`justify-content\` controls vertical spacing and \`align-items\` handles horizontal alignment!

**2. Effortless Centering and Clean Gaps (\`gap\`):**
\`\`\`css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
\`\`\`
The \`gap\` property places spacing strictly *between* items so you never have to strip trailing margins with \`:last-child\`.

**3. Growth, Wrapping, and Icon Protection (\`flex: 1\`, \`flex-wrap\`):**
- **\`flex-wrap: wrap\`:** Lets cards flow onto the next row on narrow screens rather than overflowing horizontally.
- **\`flex: 1\`:** Expands a main panel or search bar to fill remaining free space automatically.
- **\`flex-shrink: 0\`:** Essential on icons and avatars in narrow rows so adjacent long text never squashes circular badges.`,
    codeExamples: [
      {
        title: 'Responsive Navbar Built with Flexbox',
        explanation:
          'justify-content: space-between pushes the brand logo to the left edge and navigation links to the right edge.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Enable Flex mode on the parent container', description: 'Declare display: flex.' },
      { step: 2, title: 'Distribute items along the Main Axis', description: 'Use justify-content: space-between or center.' },
      { step: 3, title: 'Align on the Cross Axis and add gap', description: 'Set align-items: center and gap: 16px.' },
    ],
    interactiveExercise: {
      title: 'Center Items and Build a Flexible Navbar',
      instructions:
        'In CSS configure the .navbar class with display: flex, justify-content: space-between, and align-items: center.',
      task: 'Apply display: flex, justify-content, and align-items on .navbar.',
      hints: ['Add display: flex;', 'Add justify-content: space-between;', 'Add align-items: center;'],
      ruleDescriptions: {
        r1: 'display: flex property is present',
        r2: 'Horizontal distribution justify-content: space-between applied',
        r3: 'Vertical centering align-items: center applied',
      },
    },
    independentTask: {
      title: 'Enable Responsive Line Wrapping with flex-wrap: wrap',
      instructions: 'Add flex-wrap: wrap so navigation items wrap gracefully on smaller viewports without horizontal overflow.',
      expectedOutcome: 'Zero horizontal scrollbar on mobile widths.',
      starterHint: 'flex-wrap: wrap prevents children from overflowing or crushing to zero width.',
    },
    quiz: [
      {
        id: 'q-css2-1',
        question: 'Which CSS Flexbox property aligns items along the Main Axis?',
        options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
        explanation: 'justify-content controls placement along the Main Axis (horizontally by default when flex-direction is row).',
      },
      {
        id: 'q-css2-2',
        question: 'Which Flexbox property allows items to wrap onto a new line when horizontal space runs out?',
        options: [
          'flex-wrap: wrap;',
          'justify-content: space-between;',
          'align-items: stretch;',
          'flex-direction: row-reverse;',
        ],
        explanation:
          'By default flex-wrap is nowrap (squeezing items into one row); setting flex-wrap: wrap lets items flow gracefully onto multiple rows.',
      },
      {
        id: 'q-css2-3',
        question: 'Inside a display: flex container, how do you cleanly add an even 16px space between every item without trailing margins?',
        options: ['gap: 16px;', 'margin-auto: 16px;', 'padding-between: 16px;', 'flex-spacing: 16px;'],
        explanation:
          'The gap property in Flexbox and CSS Grid adds spacing strictly between adjacent items.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Setting display: flex on child items instead of their parent container',
        whyItHappens: 'Mixing up the flex container role versus individual flex children.',
        howToFix: 'Always place display: flex on the parent wrapper whose direct children you want to arrange.',
      },
    ],
    practicalTask: {
      title: 'Three-Card Flexbox Row',
      brief: 'Build a row of 3 profile cards using display: flex and gap: 20px.',
      steps: ['Create a wrapper with 3 card divs', 'Apply display: flex and gap: 20px', 'Verify spacing responsiveness'],
      deliverable: 'Reusable Flexbox card row layout.',
    },
    completionCriteria: [
      'Understand Main vs Cross axes in Flexbox',
      'Apply justify-content and align-items cleanly',
      'Pass the Flexbox quiz with 80%+',
    ],
  },
  'js-1': {
    objectives: [
      'Declare immutable references with const and mutable counters with let instead of var',
      'Work confidently with primitive vs reference types (string, number, boolean, null)',
      'Compare values safely using strict equality === and format strings with template literals',
    ],
    theoryMarkdown: `**JavaScript (ES6+)** turns static pages into reactive applications that compute prices, validate forms, and fetch API data. Building solid habits right from day one means mastering variable declarations, scopes, and type-comparison traps.

**1. Variable Declarations: \`const\` and \`let\` instead of \`var\`:**
- **\`const\` (constant binding):** Default choice for almost every variable — numbers, strings, functions, objects. Blocks accidental \`=\` reassignment, though properties inside an object or array can still be updated cleanly.
- **\`let\` (rebindable variable):** Reserved strictly for values that genuinely change (e.g. loop counters or running totals). Both \`const\` and \`let\` enforce safe **block scope** bounded by \`{ }\`.
- **\`var\` (legacy):** Function-scoped and subject to confusing *hoisting* (\`undefined\` leaks before initialization). Avoid completely in modern ES6+ code.

**2. Primitive vs Reference Types:**
JS defines seven primitives (\`string\`, \`number\`, \`boolean\`, \`undefined\`, \`null\`, \`bigint\`, \`symbol\`) copied by **value**, whereas objects, arrays, and functions are passed by **reference**. Watch out for the classic historical quirk: \`typeof null\` returns \`"object"\`, so always test null directly with \`val === null\`.

**3. Strict Equality (\`===\`) vs Loose (\`==\`) & Template Literals:**
\`==\` performs implicit coercion with surprising results (\`0 == ''\` evaluates to \`true\`). Always use **\`===\`** and **\`!==\`** to check both value and type, and compose readable interpolated strings with backticks: \`\`Hello \${name}!\`\`.`,
    codeExamples: [
      {
        title: 'Safe declarations and template literal formatting',
        explanation: 'Backtick ${expression} interpolation stays clean and avoids string concatenation mistakes.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Prefer const by default', description: 'Use const for constants, objects, arrays, and callbacks.' },
      { step: 2, title: 'Reach for let only for counters', description: 'Use let strictly when the binding must be reassigned.' },
      { step: 3, title: 'Compare with triple equals', description: 'Always write === and !== rather than loose ==.' },
    ],
    interactiveExercise: {
      title: 'Declare Variables and Print Output to Console',
      instructions:
        'In app.js declare const courseName = "Full Stack Academy"; and let lessonsCompleted = 5; then inspect both values with console.log().',
      task: 'Declare courseName and lessonsCompleted and invoke console.log.',
      hints: [
        'Write const courseName = "Full Stack Academy";',
        'Write let lessonsCompleted = 5;',
        'Call console.log(courseName, lessonsCompleted);',
      ],
      ruleDescriptions: {
        r1: 'Declared constant courseName',
        r2: 'Used the const keyword',
        r3: 'console.log() call present',
      },
    },
    independentTask: {
      title: 'Compose a Personalized Greeting',
      instructions: 'Create const city = "Warsaw"; and log a sentence combining your name and city to the console.',
      expectedOutcome: 'Formatted multi-variable message printed in the console.',
      starterHint: 'Use console.log(userName, city) or template backticks.',
    },
    quiz: [
      {
        id: 'q-js1-1',
        question: 'Why should modern JavaScript code avoid the legacy "var" keyword?',
        options: [
          'var uses function scope and hoists declarations, leading to subtle variable leaks outside loops and blocks',
          'var cannot store decimal numbers',
          'Chrome V8 completely removed var syntax',
          'var only works on Windows systems',
        ],
        explanation: 'Unlike let and const, var ignores { } block boundaries and leaks out of loops and if-statements.',
      },
      {
        id: 'q-js1-2',
        question: 'When should you declare variables with const vs let in JavaScript?',
        options: [
          'Default to const, and use let only when the binding needs to be reassigned later',
          'Always use let, because const blocks adding items to arrays',
          'const works only for numbers and let only for strings',
          'let works outside functions while const only works inside for loops',
        ],
        explanation:
          'const prevents accidental reassignment of the variable binding, making JavaScript code clearer and safer.',
      },
      {
        id: 'q-js1-3',
        question: 'What does typeof "42" evaluate to in JavaScript?',
        options: ['"string"', '"number"', '"boolean"', '"undefined"'],
        explanation: 'Any value wrapped in quotes ("42") is a string primitive, not a number.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using loose == equality instead of strict ===',
        whyItHappens: 'Carrying over double-equals habits from other programming languages.',
        howToFix: 'In JS always write === so empty strings ("") or booleans never coerce silently to 0.',
      },
    ],
    practicalTask: {
      title: 'Inspect Runtime Types in DevTools',
      brief: 'Open browser DevTools console and test typeof 42, typeof "text", and typeof null.',
      steps: ['Run typeof "hello" in console', 'Run typeof 100 and compare with typeof null'],
      deliverable: 'Hands-on familiarity with JavaScript runtime types.',
    },
    completionCriteria: [
      'Declare variables with const and let without legacy var',
      'Run script output cleanly in the JS Console',
      'Pass the JavaScript fundamentals quiz',
    ],
  },
  'fund-1': {
    objectives: [
      'Trace how a browser (Client) talks to a Server via HTTP/HTTPS requests',
      'Interpret key HTTP status codes (200 OK, 404 Not Found, 500 Server Error)',
      'Author your first <h1> heading and <p> paragraph inside the live editor',
    ],
    theoryMarkdown: `Before writing your first line of code, let's look at how every website works under the hood. No advanced math required — the entire web runs on a straightforward conversation between two computers.

**1. Two Characters on the Web: Client and Server**
- **Client (Your Browser):** Chrome, Firefox, or Safari running on your screen to display text, buttons, and layouts.
- **Server:** A remote machine running 24/7 inside a data center that stores website files and data.

**2. Step-by-step when you enter a website URL:**
1. **The Internet's Phonebook (DNS):** Humans remember domain names like \`google.com\`, whereas machines communicate via IP addresses (like \`142.250.180.206\`). **DNS** automatically maps domain names to server IP numbers.
2. **Sending an HTTP Request:** Your browser sends a short request such as \`GET /home\` — asking *"Please send me the home page"*.
3. **Server HTTP Response:** The server returns the page together with a status code:
- **\`200 OK\`** — Success! Here is the page.
- **\`404 Not Found\`** — Nothing exists at that URL (for instance, a typo).
- **\`500 Server Error\`** — Something crashed on the backend server.
4. **Rendering on Screen:** Your browser reads **HTML** (structure), **CSS** (colors & typography), and **JavaScript** (interactivity) to paint the page.`,
    codeExamples: [
      {
        title: 'How a Browser–Server HTTP Conversation Looks',
        explanation:
          'GET requests a resource, status 200 OK confirms success, and the response body delivers HTML markup.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Open Browser DevTools', description: 'Press F12 and open the "Network" tab.' },
      { step: 2, title: 'Inspect the Initial Document Request', description: 'Reload the page and click the first row returning status 200.' },
      { step: 3, title: 'Review Response Headers', description: 'Check Response Headers and Content-Type.' },
    ],
    interactiveExercise: {
      title: 'Simulate a Page Header & Welcome Greeting',
      instructions:
        'In the HTML editor write a main heading <h1> containing "Welcome to Academy" (or "Witaj w Akademii") and a descriptive <p> paragraph below it.',
      task: 'Add an <h1> heading containing "Witaj w Akademii" and a <p> paragraph.',
      hints: [
        'Wrap your headline inside opening <h1> and closing </h1> tags.',
        'Include the exact greeting phrase "Witaj w Akademii" to satisfy the automated check.',
        'Add a <p>...</p> paragraph directly underneath.',
      ],
      ruleDescriptions: {
        r1: '<h1> heading tag exists in HTML markup',
        r2: 'Heading contains the greeting phrase "Witaj w Akademii"',
        r3: 'Paragraph <p> element exists in HTML',
      },
    },
    independentTask: {
      title: 'Personalize with Your Role Subtitle',
      instructions: 'Add an <h2> element with your name and target role underneath the greeting.',
      expectedOutcome: 'Clean hierarchy with primary title and subtitle.',
      starterHint: 'Try <h2>Alex Taylor — Future Full Stack Developer</h2>.',
    },
    quiz: [
      {
        id: 'q-f1-1',
        question: 'Which HTTP status code tells the browser that the requested resource does not exist?',
        options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently'],
        explanation: 'Status 404 signals that no resource could be located at the requested URI.',
      },
      {
        id: 'q-f1-2',
        question: 'What role does DNS play during web communication?',
        options: [
          'Encrypts user passwords inside databases',
          'Translates human-readable domain names (e.g. google.com) into numeric server IP addresses',
          'Compiles CSS rules inside the browser',
          'Transpiles TypeScript into JavaScript',
        ],
        explanation: 'DNS acts like a distributed directory resolving domain names to numeric IP addresses.',
      },
      {
        id: 'q-f1-3',
        question: 'Which HTTP status code family indicates a client-side error (such as 401 Unauthorized or 404 Not Found)?',
        options: ['4xx (400-499)', '2xx (200-299)', '3xx (300-399)', '1xx (100-199)'],
        explanation:
          '2xx means success, 3xx indicates redirects, 4xx signals client request errors, and 5xx indicates server-side failures.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Attempting to connect browser code directly to a SQL database',
        whyItHappens: 'Mixing up the three-tier web model (Client -> API Server -> Database).',
        howToFix: 'The browser calls a backend REST API via fetch(), and the server securely queries the database.',
      },
    ],
    practicalTask: {
      title: 'Inspect Live Network Traffic in DevTools',
      brief: 'Inspect HTTP requests on any favorite website and check status codes and headers.',
      steps: ['Open DevTools (F12) -> Network', 'Reload the page', 'Click the top HTML document entry'],
      deliverable: 'Clear grasp of live HTTP status codes and headers.',
    },
    completionCriteria: [
      'Understand the Client vs Server HTTP request cycle',
      'Pass the introductory HTML exercise',
      'Score at least 80% on the Foundations quiz',
    ],
  },
  'react-1': {
    objectives: [
      'Understand React declarative UI rendering and JSX syntax',
      'Define typed component Props and pass read-only values down the tree',
      'Manage local state safely with useState without mutating objects or arrays in place',
    ],
    theoryMarkdown: `React revolutionized UI engineering through **declarative rendering**. Instead of manually querying DOM nodes with \`document.querySelector\` and patching elements on every click, your component declares how the UI looks for a given state — and React updates only what changed via **Virtual DOM** reconciliation.

**1. Functional Components, JSX, and Props:**
A React component is a capitalized TypeScript function returning **JSX** markup compiled down to JavaScript calls. Inputs passed from a parent component are called **Props** and are strictly **read-only** inside the child component.

**2. Local State Management via \`useState\`:**
Whenever user clicks or API responses change data over time, store that data with \`useState\`. Always prefer the functional updater \`setCount(prev => prev + 1)\` whenever the next value builds on the previous state:
\`\`\`tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

**3. React's Golden Rule — State Immutability:**
React compares object references via \`Object.is\`. Mutating \`todos.push(newItem)\` in place keeps the same array reference, so React **skips re-rendering**! Always return a fresh copy via spread syntax: \`setTodos((prev) => [...prev, newTodo])\`.`,
    codeExamples: [
      {
        title: 'Interactive Student Card Component with Props and State',
        explanation:
          'Each button click triggers a clean re-render with updated state while props remain immutable.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Declare a capitalized function component', description: 'React components always start with an uppercase letter.' },
      { step: 2, title: 'Initialize state with useState', description: 'const [state, setState] = useState(initialValue).' },
      { step: 3, title: 'Return a valid JSX tree', description: 'Return a single root wrapper or <>...</> fragment.' },
    ],
    interactiveExercise: {
      title: 'Interactive React Like Counter Structure',
      instructions:
        'Design the visual markup of a React LikeButton widget: a container with class like-widget, a button labeled "Polubienie" / Like, and a counter badge <span class="badge">42</span>.',
      task: 'Create a .like-widget wrapper containing a button ("Polubienie") and <span class="badge">.',
      hints: [
        'Use <div class="like-widget">.',
        'Include <button type="button">Polubienie</button>.',
        'Include <span class="badge">42</span>.',
      ],
      ruleDescriptions: {
        r1: 'Container class .like-widget is present',
        r2: 'Interactive button element is present',
        r3: 'Counter badge with class .badge is present',
      },
    },
    independentTask: {
      title: 'Conditional Rendering Expression',
      instructions: 'Write a JSX ternary guard: {isLoggedIn ? <UserAvatar /> : <LoginButton />}.',
      expectedOutcome: 'Dynamic UI switching based on authentication state.',
      starterHint: 'Use either the ternary operator ? : or short-circuit && inside JSX.',
    },
    quiz: [
      {
        id: 'q-react1-1',
        question: 'Why must you NEVER mutate a state array directly in React (e.g. state.push(newItem))?',
        options: [
          'React compares object references (Shallow Compare); in-place mutation keeps the same array reference so React skips re-rendering the view',
          'Browsers immediately throw a syntax error on push()',
          'React arrays only hold up to 10 items',
          'Array.prototype.push was removed in ES6',
        ],
        explanation: 'React checks reference identity. Always pass a new array [...state, newItem] to trigger a UI update.',
      },
      {
        id: 'q-react1-2',
        question: 'What is true about props passed into a child React component?',
        options: [
          'Props are read-only (immutable) from the child component perspective — data flows top-down',
          'The child component should directly reassign props.title = "New"',
          'Props can only hold boolean values',
          'Props only work inside class components',
        ],
        explanation:
          'One-way data flow means child components never mutate incoming props directly; they notify parents via callback props or update local state.',
      },
      {
        id: 'q-react1-3',
        question: 'Why is setCount(prev => prev + 1) safer than setCount(count + 1) when updating state multiple times in one action?',
        options: [
          'The functional updater always reads the latest queued state value instead of a stale closure value from the render',
          'The functional updater skips re-rendering the UI',
          'setCount(count + 1) only works for strings',
          'The functional updater persists counts to cookies automatically',
        ],
        explanation:
          'React batches state updates; passing an updater function guarantees each update computes cleanly from the latest queued value.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Mutating state objects directly instead of calling the state setter',
        whyItHappens: 'Carrying imperative OOP patterns into immutable React state updates.',
        howToFix: 'Always return a cloned object via the setter: setUser(prev => ({ ...prev, name: "Alex" })).',
      },
    ],
    practicalTask: {
      title: 'Searchable List Component in React',
      brief: 'Bind an <input> to useState and filter a list of students in JSX using .filter().',
      steps: ['Wire an input onChange handler', 'Store query text in state', 'Render filtered items via .map()'],
      deliverable: 'Controlled search input paired with dynamic list rendering.',
    },
    completionCriteria: [
      'Understand JSX syntax and useState immutability',
      'Pass the interactive React widget exercise',
      'Score at least 80% on the quiz',
    ],
  },
  'node-1': {
    objectives: [
      'Understand Node.js server runtime and non-blocking asynchronous I/O',
      'Define REST routes in Express: app.get, app.post, app.put, app.delete',
      'Build composable Middleware pipelines and advance flow via next()',
    ],
    theoryMarkdown: `**Node.js** executes JavaScript and TypeScript directly on servers with full access to networking, OS processes, databases, and filesystems. Powered by Chrome's **V8** engine and **libuv**, Node handles network and database I/O **asynchronously without blocking** the Event Loop — enabling a single process to serve thousands of concurrent connections efficiently.

**1. Express.js Framework & HTTP Routing:**
Express maps HTTP verbs and paths directly to route handler callbacks: \`app.get('/api/courses', ...)\`, \`app.post('/api/orders', ...)\`, \`app.patch()\`, \`app.delete()\`. Read URL parameters via \`req.params.id\`, query flags via \`req.query\`, and parsed JSON payloads via \`req.body\`.

**2. Middleware Pipeline:**
Every incoming HTTP request flows step by step through registered **Middleware** functions until a response is sent:
\`\`\`
Client ---> [express.json()] ---> [logger] ---> [authGuard] ---> [Route Handler] ---> res.json()
\`\`\`
Each middleware receives \`(req, res, next)\`:
- **\`req\` (Request):** Incoming headers, cookies, params, JSON body, IP metadata.
- **\`res\` (Response):** Outgoing response helper (\`res.status(201).json({ ok: true })\`). Return early after responding to prevent duplicate header errors.
- **\`next()\`:** Hands control to the next middleware in the pipeline. Forgetting both \`res.send/json()\` and \`next()\` hangs client requests until timeout.`,
    codeExamples: [
      {
        title: 'Minimal Complete Express Server in TypeScript',
        explanation:
          'app.use() registers global middleware before any route handler processes requests.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Install express packages', description: 'Run npm install express @types/express.' },
      { step: 2, title: 'Mount app.use(express.json())', description: 'Without JSON middleware, req.body stays undefined.' },
      { step: 3, title: 'Declare GET/POST route handlers', description: 'Return structured payloads via res.json().' },
    ],
    interactiveExercise: {
      title: 'Express Server Health Status Widget',
      instructions:
        'Design an Express status banner containing a .server-status container, the route snippet <code>GET /api/courses</code>, and status badge <span class="status-200">200 OK</span>.',
      task: 'Build a .server-status widget showing GET /api/courses and 200 OK.',
      hints: [
        'Wrap in <div class="server-status">.',
        'Include <code>GET /api/courses</code>.',
        'Include <span class="status-200">200 OK</span>.',
      ],
      ruleDescriptions: {
        r1: 'Container class .server-status is present',
        r2: 'Endpoint route GET /api/courses is rendered',
        r3: 'HTTP 200 OK status badge is rendered',
      },
    },
    independentTask: {
      title: 'Write an Auth Guard Middleware',
      instructions: 'Inspect req.headers.authorization and respond with res.status(401).json({ error: "Missing token" }) if absent.',
      expectedOutcome: 'Clean reusable route protection middleware.',
      starterHint: 'Remember to call next() when the Authorization header is valid.',
    },
    quiz: [
      {
        id: 'q-node1-1',
        question: 'What happens in Express if custom middleware forgets both to send a response and to call next()?',
        options: [
          'The client request hangs indefinitely until a Request Timeout occurs',
          'Express automatically infers the next route handler',
          'The Node process crashes immediately',
          'Express sends a 404 Not Found automatically',
        ],
        explanation: 'Without calling next() or sending a response with res, the pipeline stalls and the browser waits indefinitely.',
      },
      {
        id: 'q-node1-2',
        question: 'What does app.use(express.json()) do in an Express.js backend?',
        options: [
          'Mounts built-in middleware that parses incoming JSON request bodies into req.body',
          'Creates a package.json file in the root directory',
          'Automatically connects Express to PostgreSQL',
          'Converts every HTML response into a PDF document',
        ],
        explanation:
          'Without express.json() middleware, req.body remains undefined on incoming POST and PUT requests.',
      },
      {
        id: 'q-node1-3',
        question: 'What is the difference between req.params and req.query in Express?',
        options: [
          'req.params captures dynamic URL path segments (e.g. /users/:id -> req.params.id), whereas req.query captures query-string pairs after ? (e.g. ?page=2)',
          'req.params is only for passwords and req.query is only for images',
          'req.query only works on DELETE routes',
          'There is no difference — both read Authorization headers',
        ],
        explanation:
          'Route params identify a specific resource (/users/42), while query strings handle filtering, sorting, and pagination.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Mounting POST routes before app.use(express.json())',
        whyItHappens: 'Assuming Express parses JSON request bodies out of the box.',
        howToFix: 'Register app.use(express.json()) at the top before route declarations.',
      },
    ],
    practicalTask: {
      title: 'Add a /health Diagnostic Route to server.ts',
      brief: 'Implement GET /health returning server status and process uptime.',
      steps: ['Import express', 'Add GET /health route', 'Return 200 JSON with timestamp'],
      deliverable: 'Production-ready server healthcheck endpoint.',
    },
    completionCriteria: [
      'Understand Express routing and middleware next() flow',
      'Pass the interactive Express widget exercise',
      'Pass the backend quiz with 80%+',
    ],
  },
  'db-1': {
    objectives: [
      'Understand relational table schemas, Primary Keys, and Foreign Keys in PostgreSQL',
      'Author SELECT queries with WHERE filters, ORDER BY sorting, and LIMIT clauses',
      'Join related tables cleanly using INNER JOIN',
    ],
    theoryMarkdown: `In-memory JavaScript variables wipe clean on every server restart. Production apps persist accounts, enrollments, and transactions durably in relational databases (**RDBMS**), with **PostgreSQL** serving as the industry workhorse.

**1. Strict Schemas, Primary Keys & Foreign Keys:**
Every column enforces strong data types (\`INTEGER\`, \`TEXT\`, \`BOOLEAN\`, \`TIMESTAMPTZ\`). Relationships link separate entities cleanly without duplicating data:
- **Primary Key (PK):** Unique row identifier (e.g. \`id SERIAL PRIMARY KEY\` or \`UUID DEFAULT gen_random_uuid()\`).
- **Foreign Key (FK):** Child-table column referencing a parent Primary Key. PostgreSQL enforces *referential integrity* automatically — rejecting orphaned orders pointing to non-existent users.

**2. One-to-Many (1:N) Relations in Practice:**
One student can place many orders, whereas each order belongs to one student. Therefore the \`user_id\` foreign key sits on the "many" side inside \`orders\`.

**3. Querying & Joining Data (\`SELECT\`, \`INNER JOIN\`):**
\`\`\`sql
-- Fetch Top 10 active learners sorted by XP:
SELECT id, name, xp
FROM users
WHERE is_active = true
ORDER BY xp DESC
LIMIT 10;

-- Join order totals with owner names from users:
SELECT users.name, orders.amount, orders.status
FROM orders
INNER JOIN users ON orders.user_id = users.id
WHERE orders.status = 'PAID';
\`\`\`
Always select explicit columns instead of \`SELECT *\` in production and index columns frequently filtered in \`WHERE\` or \`JOIN\`.`,
    codeExamples: [
      {
        title: 'Users & Orders PostgreSQL Schema with 1:N Foreign Key',
        explanation:
          'ON DELETE CASCADE automatically cleans up linked orders if a parent user row is removed, preserving referential integrity.',
      },
    ],
    stepByStepGuide: [
      { step: 1, title: 'Define a table with PRIMARY KEY', description: 'Assign every entity a unique row identifier.' },
      { step: 2, title: 'Link tables with REFERENCES', description: 'Add a Foreign Key connecting child rows to parent rows.' },
      { step: 3, title: 'Query across tables via JOIN', description: 'Combine columns cleanly using matching keys.' },
    ],
    interactiveExercise: {
      title: 'SQL Schema & 1:N Relation Card',
      instructions:
        'Create a .db-schema widget displaying <code>SELECT * FROM users JOIN orders</code> alongside a badge showing "1 : N (One-to-Many)".',
      task: 'Add a .db-schema wrapper with SELECT * FROM users JOIN orders and 1 : N indicator.',
      hints: [
        'Use <div class="db-schema">.',
        'Include <code>SELECT * FROM users JOIN orders</code>.',
        'Include <span class="rel">1 : N (One-to-Many)</span>.',
      ],
      ruleDescriptions: {
        r1: 'Container class .db-schema is present',
        r2: 'SELECT * FROM users query text is present',
        r3: '1 : N relation badge is present',
      },
    },
    independentTask: {
      title: 'Aggregate Enrollments with GROUP BY',
      instructions: 'Write SELECT module_id, COUNT(*) FROM enrollments GROUP BY module_id; to count learners per module.',
      expectedOutcome: 'Analytical summary grouped cleanly per module.',
      starterHint: 'GROUP BY collapses rows sharing the same column value.',
    },
    quiz: [
      {
        id: 'q-db1-1',
        question: 'What is the purpose of the SQL JOIN clause?',
        options: [
          'Combines rows from two or more related tables based on matching key columns (such as a Foreign Key)',
          'Deletes duplicate rows permanently from a table',
          'Encrypts passwords using SHA256 hashing',
          'Exports full database snapshots to disk',
        ],
        explanation: 'JOIN links related rows across normalized tables into unified query results.',
      },
      {
        id: 'q-db1-2',
        question: 'What is a Foreign Key in a relational database (such as user_id inside an orders table)?',
        options: [
          'A column storing the primary key ID of a related row in another table, enforcing referential integrity at the database level',
          'A master password used to encrypt the entire database',
          'A Google Maps API key stored in text format',
          'An automatic full-text index used only in NoSQL',
        ],
        explanation:
          'Foreign keys ensure database integrity so child records cannot point to non-existent parent rows.',
      },
      {
        id: 'q-db1-3',
        question: 'Which SQL clause sorts query results from highest value to lowest value?',
        options: ['ORDER BY column DESC', 'SORT BY column MAX', 'GROUP BY column TOP', 'FILTER column DESC'],
        explanation:
          'ORDER BY ... DESC sorts rows in descending order (for example newest posts or highest XP scores first), whereas ASC sorts ascending.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Omitting database INDEXES on Foreign Keys and frequent WHERE/JOIN columns',
        whyItHappens: 'Skipping EXPLAIN ANALYZE query-plan profiling on small dev datasets.',
        howToFix: 'Once a table reaches 100k rows, missing indexes trigger slow Full Table Scans. Create indexes on user_id and search keys.',
      },
    ],
    practicalTask: {
      title: 'Inspect a 1:N Relation in Prisma Schema',
      brief: 'Review a schema.prisma model pairing User with Post via userId foreign key.',
      steps: ['Define User model', 'Define Post with userId scalar field', 'Add @relation attribute'],
      deliverable: 'Modern typed ORM schema linking related entities.',
    },
    completionCriteria: [
      'Understand relational SQL queries and 1:N Foreign Keys',
      'Pass the interactive SQL schema exercise',
      'Pass the database quiz with 80%+',
    ],
  },
};

export type CommonMistakeTextOnly = Pick<CommonMistake, 'mistake' | 'whyItHappens' | 'howToFix'>;
export type QuizTranslationOnly = Pick<QuizQuestion, 'id' | 'question' | 'options' | 'explanation'>;
