import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { buildTimeline, formatDateTime, checkOverdue } from '@/lib/timeline';

export default async function DashboardPage() {
    const applications = await prisma.application.findMany({
        include: {
            company: true,
            interviews: true,
            assessments: true,
            recruiterCalls: true,
            followUps: true,
        },
    });

    const items = applications.flatMap((app) => buildTimeline(app));

    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    const overdue = items.filter((item) => checkOverdue(item.date, item.status));

    const upcoming = items
        .filter((item) => item.status === 'UPCOMING' && item.date >= now && item.date <= in7Days)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const activeCount = applications.filter((app) =>
        ['APPLIED', 'OA', 'INTERVIEWING'].includes(app.status)
    ).length;
    const offerCount = applications.filter((app) => app.status === 'OFFER').length;

    return (
        <div>
            <h1>Dashboard</h1>

            <section>
                <h2>Overview</h2>
                <p>Active applications: {activeCount}</p>
                <p>Offers: {offerCount}</p>
                <p>Overdue items: {overdue.length}</p>
            </section>

            <section>
                <h2>Overdue</h2>
                {overdue.length === 0 ? (
                    <p>Nothing overdue.</p>
                ) : (
                    <ul>
                        {overdue.map((item) => (
                            <li key={item.kind + item.id}>
                                {formatDateTime(item.date)} — {item.companyName} ({item.role}) — {item.kind}: {item.title}
                                {' '}
                                <Link href={`/applications/${item.applicationId}`}>View</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2>Next 7 days</h2>
                {upcoming.length === 0 ? (
                    <p>No upcoming.</p>
                ) : (
                    <ul>
                        {upcoming.map((item) => (
                            <li key={item.kind + item.id}>
                                {formatDateTime(item.date)} — {item.companyName} ({item.role}) — {item.kind}: {item.title}
                                {' '}
                                <Link href={`/applications/${item.applicationId}`}>View</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}