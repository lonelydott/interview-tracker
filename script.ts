import { prisma } from "./lib/prisma";

// Seed script: creates sample companies, applications, and a spread of events
// so you have data to look at in Prisma Studio and on the timeline.
// Run with:  npm run seed
//
// Dates are relative to "now" so some events land in the past (COMPLETED /
// MISSED) and some in the future (UPCOMING) — that makes the timeline and
// dashboard interesting immediately.

// Small helper: a date N days from now (negative = in the past).
function daysFromNow(days: number, hour = 10): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  // Start clean so re-running the seed doesn't pile up duplicates.
  // Order matters: delete children before parents (or rely on cascade).
  await prisma.followUp.deleteMany();
  await prisma.recruiterCall.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.onlineAssessment.deleteMany();
  await prisma.application.deleteMany();
  await prisma.company.deleteMany();

  // --- Company 1: an active, deep-in-the-process application ---
  const acme = await prisma.company.create({
    data: {
      name: "Acme Corp",
      website: "https://acme.example.com",
      location: "Remote (US)",
      applications: {
        create: {
          role: "New Grad Software Engineer",
          status: "INTERVIEWING",
          source: "Referral",
          jobPostUrl: "https://acme.example.com/careers/123",
          appliedAt: daysFromNow(-21),
          notes: "Referred by a friend on the platform team.",
          recruiterCalls: {
            create: {
              recruiter: "Jordan Lee",
              scheduledAt: daysFromNow(-18),
              durationMins: 30,
              phoneOrLink: "https://zoom.us/j/000",
              status: "COMPLETED",
              notes: "Went well. Confirmed remote + comp range.",
            },
          },
          assessments: {
            create: {
              platform: "CodeSignal",
              link: "https://app.codesignal.com/xyz",
              assignedAt: daysFromNow(-16),
              dueAt: daysFromNow(-12),
              durationMins: 90,
              status: "COMPLETED",
              notes: "3/4 solved. Passed to onsite.",
            },
          },
          interviews: {
            create: [
              {
                type: "TECHNICAL",
                scheduledAt: daysFromNow(-5, 14),
                durationMins: 60,
                location: "Zoom",
                interviewer: "Priya N.",
                round: 1,
                status: "COMPLETED",
                notes: "DSA — trees + a hashmap question. Felt solid.",
              },
              {
                type: "SYSTEM_DESIGN",
                scheduledAt: daysFromNow(3, 11),
                durationMins: 60,
                location: "Zoom",
                round: 2,
                status: "UPCOMING",
                notes: "Prep: URL shortener, rate limiting, caching.",
              },
            ],
          },
          followUps: {
            create: {
              title: "Send thank-you note to Priya",
              dueAt: daysFromNow(-4),
              priority: "MEDIUM",
              // Deliberately still UPCOMING with a past date -> shows as overdue.
              status: "UPCOMING",
              notes: "Reference the tree question we discussed.",
            },
          },
        },
      },
    },
  });

  // --- Company 2: earlier stage, OA deadline coming up ---
  const globex = await prisma.company.create({
    data: {
      name: "Globex",
      website: "https://globex.example.com",
      location: "New York, NY",
      applications: {
        create: {
          role: "Backend Engineer (Entry)",
          status: "OA",
          source: "LinkedIn",
          appliedAt: daysFromNow(-6),
          assessments: {
            create: {
              platform: "HackerRank",
              link: "https://hackerrank.com/tests/abc",
              assignedAt: daysFromNow(-2),
              dueAt: daysFromNow(2, 23), // due in 2 days -> upcoming deadline
              durationMins: 120,
              status: "UPCOMING",
              notes: "Two problems. Do it this weekend.",
            },
          },
          followUps: {
            create: {
              title: "Follow up with recruiter if no OA feedback",
              dueAt: daysFromNow(9),
              priority: "LOW",
              status: "UPCOMING",
            },
          },
        },
      },
    },
  });

  // --- Company 3: just applied, waiting ---
  const initech = await prisma.company.create({
    data: {
      name: "Initech",
      location: "Austin, TX",
      applications: {
        create: {
          role: "Full-Stack Engineer",
          status: "APPLIED",
          source: "Company website",
          appliedAt: daysFromNow(-1),
          notes: "Cover letter tailored to their design-systems work.",
        },
      },
    },
  });

  console.log("Seeded companies:", [acme.name, globex.name, initech.name].join(", "));

  // Read it back the way the app will: applications with all their events.
  const apps = await prisma.application.findMany({
    include: {
      company: true,
      assessments: true,
      interviews: true,
      recruiterCalls: true,
      followUps: true,
    },
  });
  console.log(`\n${apps.length} applications in the database:`);
  for (const a of apps) {
    const eventCount =
      a.assessments.length +
      a.interviews.length +
      a.recruiterCalls.length +
      a.followUps.length;
    console.log(`  • ${a.company.name} — ${a.role} [${a.status}] (${eventCount} events)`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
