// Dev data: one demo user and 15 prompts (enough for 2 pages). Safe to re-run.
// Log in locally with demo@example.com / demo-password-123
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const prompts = [
  [
    "Explain like I'm five",
    "Explain {topic} as if I were five years old. Use one short analogy.",
    "learning, writing",
  ],
  [
    "Code reviewer",
    "Review this code for bugs, readability and performance. List issues by severity.\n\n{code}",
    "coding, review",
  ],
  [
    "Commit message writer",
    "Write a conventional commit message for this diff. Keep the subject under 50 characters.\n\n{diff}",
    "coding, git",
  ],
  [
    "SQL from English",
    "Turn this request into a SQL query for PostgreSQL. Explain each clause.\n\n{request}",
    "coding, sql",
  ],
  [
    "Meeting summary",
    "Summarize this transcript into decisions, action items with owners, and open questions.\n\n{transcript}",
    "productivity, writing",
  ],
  [
    "Polite decline email",
    "Write a short, warm email declining {request}. Offer one alternative.",
    "email, writing",
  ],
  [
    "Unit test generator",
    "Write Vitest unit tests for this function. Cover edge cases and one happy path.\n\n{code}",
    "coding, testing",
  ],
  [
    "Regex explainer",
    "Explain this regular expression piece by piece, then give 3 matching and 3 non-matching examples.\n\n{regex}",
    "coding, learning",
  ],
  [
    "Blog post outline",
    "Create an outline for a blog post about {topic} with a hook, 5 sections and a conclusion.",
    "writing, marketing",
  ],
  [
    "Interview practice",
    "Act as an interviewer for a {role} position. Ask one question at a time and give feedback.",
    "career, learning",
  ],
  [
    "Bug report triage",
    "Given this bug report, guess the likely cause, list what info is missing and suggest next steps.\n\n{report}",
    "coding, review",
  ],
  [
    "Tweet thread",
    "Turn this article into a 5-tweet thread. First tweet must hook the reader.\n\n{article}",
    "marketing, writing",
  ],
  [
    "Study plan",
    "Make a 4-week study plan to learn {skill}, with weekly goals and one small project.",
    "learning, productivity",
  ],
  [
    "Rubber duck debugger",
    "I will describe a bug. Ask me clarifying questions one at a time until we find the cause.",
    "coding, debugging",
  ],
  [
    "Product description",
    "Write a 60-word product description for {product}. Focus on benefits, not features.",
    "marketing",
  ],
];

const toTags = (s) => s.split(",").map((t) => t.trim().toLowerCase());

const user = await db.user.upsert({
  where: { email: "demo@example.com" },
  update: {},
  create: {
    email: "demo@example.com",
    passwordHash: await bcrypt.hash("demo-password-123", 10),
  },
});
await db.prompt.deleteMany({ where: { authorId: user.id } });

// Spread createdAt over the last 15 days so "newest first" is visible.
for (const [i, [title, body, tags]] of prompts.entries()) {
  const createdAt = new Date(Date.now() - (prompts.length - i) * 86_400_000);
  await db.prompt.create({
    data: {
      title,
      body,
      authorId: user.id,
      createdAt,
      updatedAt: createdAt,
      tags: {
        connectOrCreate: toTags(tags).map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });
}

console.log(`Seeded ${prompts.length} prompts for demo@example.com`);
await db.$disconnect();
