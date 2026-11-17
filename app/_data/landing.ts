import {
  FileText,
  SquareKanban,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const hero = {
  eyebrow: "Early access",
  headline: {
    before: "A ",
    highlight: "thinkspace",
    after: " for whatever you’re building",
  },
  subtitle:
    "A shared workspace where an AI agent writes and draws alongside you and your team, live. Docs and canvases, in one place.",
  primaryCta: { label: "Start building free", href: "/sign-up" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  video: {
    poster: "/videos/hero-poster.jpg",
    webm: "/videos/hero.webm",
    mp4: "/videos/hero.mp4",
    label:
      "ThinkSpace product demo: an AI agent draws a software architecture on a shared canvas, shape by shape.",
  },
};

export const howItWorks = {
  eyebrow: "How it works",
  heading: "From a sentence to a shared plan",
  steps: [
    {
      title: "Describe it",
      description:
        "Tell the agent what you’re building in plain words: a product, a process, a system or a team.",
    },
    {
      title: "Watch the agent draw",
      description:
        "It lays the diagram out on a shared canvas, shape by shape, and writes the spec when you ask.",
    },
    {
      title: "Keep iterating together",
      description:
        "Ask for changes, edit by hand and bring teammates in. Everyone works on the same board, live.",
    },
  ],
};

export const pricing = {
  eyebrow: "Pricing",
  // badge: "Coming soon",
  heading: "Start free, upgrade when it clicks",
  body: "upgrade just yourself or your whole team.billed per member",
};

export const closingCta = {
  heading: "Start your first thinkspace",
  body: "Describe what you’re building and watch it take shape, with your team right there with you.",
  cta: hero.primaryCta,
  // Decorative: the heading already says everything, so screen readers skip the mascot.
  mascot: { src: "/brand/mascot-dark.png", alt: "" },
};

export const footer = {
  brand: "ThinkSpace",
  credit: "Made by DR Bytes",
};

export const audience = {
  label: "Built for",
  items: ["Product teams", "Founders", "Solo builders", "Agencies", "Consultants"],
};

export type CanvasMock = {
  kind: "canvas";
  label: string;
  breadcrumb: string;
  tag: string;
  start: string;
  decision: string;
  yes: { branch: string; step: string };
  no: { branch: string; step: string };
  end: string;
  agent: string;
};

export type DocMock = {
  kind: "doc";
  label: string;
  breadcrumb: string;
  tag: string;
  title: string;
  source: string;
  overview: { heading: string; body: string; agent: string };
  steps: { heading: string; items: string[] };
};

export type BoardMock = {
  kind: "board";
  label: string;
  breadcrumb: string;
  tag: string;
  columns: {
    name: string;
    cards: { title: string; members: string[]; cursor?: string }[];
  }[];
};

export type FeatureMockData = CanvasMock | DocMock | BoardMock;

export type Feature = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: [string, string, string];
  mock: FeatureMockData;
};

export const featuresSection = {
  heading: "One agent, one workspace, your whole team",
};

export const features: Feature[] = [
  {
    id: "canvas",
    icon: Workflow,
    title: "Canvas",
    description:
      "An infinite whiteboard where the agent draws flowcharts, ERDs, architecture diagrams and org charts shape by shape, and edits them in place when you ask.",
    bullets: [
      "Type a prompt and watch each shape appear",
      "Follow every step in the agent panel",
      "Draw alongside the agent on the same board",
    ],
    mock: {
      kind: "canvas",
      label:
        "A small sign-up flowchart on the canvas, with the agent drawing its final arrow.",
      breadcrumb: "Acme Studio / Sign-up flow",
      tag: "Canvas",
      start: "Visitor signs up",
      decision: "Invited to an org?",
      yes: { branch: "Yes", step: "Join the team" },
      no: { branch: "No", step: "Create an org" },
      end: "Open dashboard",
      agent: "Agent · drawing arrow",
    },
  },
  {
    id: "docs",
    icon: FileText,
    title: "Docs",
    description:
      "A block editor where the agent turns a diagram into a written spec, and rewrites or summarizes sections on command.",
    bullets: [
      "Go from diagram to written spec in one prompt",
      "Rewrite or summarize just the section you pick",
      "Keep editing the result yourself, block by block",
    ],
    mock: {
      kind: "doc",
      label:
        "A spec document written from the sign-up flowchart, with the agent summarizing its overview section.",
      breadcrumb: "Acme Studio / Sign-up flow",
      tag: "Doc",
      title: "Sign-up flow spec",
      source: "Written by the agent from the Sign-up flow canvas",
      overview: {
        heading: "Overview",
        body: "New visitors create an account and land in the right org. Invited people join their team, and everyone else creates their own.",
        agent: "Agent · summarizing",
      },
      steps: {
        heading: "Steps",
        items: [
          "Visitor signs up",
          "Join the team, or create an org",
          "Open the dashboard",
        ],
      },
    },
  },
  {
    id: "team-board",
    icon: SquareKanban,
    title: "Team board",
    description:
      "A kanban board of every workspace in your org, with live cursors so teammates can jump in together.",
    bullets: [
      "See every workspace and its status at a glance",
      "Spot where teammates are working right now",
      "Jump into the same workspace together",
    ],
    mock: {
      kind: "board",
      label:
        "A kanban board of workspaces grouped by status, with two teammates’ live cursors on it.",
      breadcrumb: "Acme Studio / Workspaces",
      tag: "Team board",
      // Column names mirror the WorkspaceStatus enum in prisma/schema.prisma.
      columns: [
        {
          name: "Planning",
          cards: [
            { title: "Q1 roadmap", members: ["S"] },
            { title: "Pricing page", members: ["Y", "A"] },
          ],
        },
        {
          name: "In progress",
          cards: [
            { title: "Launch plan", members: ["A", "S"], cursor: "Alex" },
            { title: "Sign-up flow", members: ["Y"] },
          ],
        },
        {
          name: "In review",
          cards: [{ title: "API migration", members: ["S", "Y"], cursor: "Sam" }],
        },
        {
          name: "Done",
          cards: [{ title: "Brand refresh", members: ["A"] }],
        },
      ],
    },
  },
];
