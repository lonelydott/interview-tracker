import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { buildTimeline, formatDateTime, checkOverdue } from '@/lib/timeline';

export default async function TimelinePage() {
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
    items.sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div>
            <h1>Timeline</h1>
            {items.length === 0 ? (
                <p>No events.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.kind + item.id}>
                            {formatDateTime(item.date)} - {item.companyName} ({item.role}) - {item.kind}: {item.title} [{item.status}]
                            {checkOverdue(item.date, item.status) ? ' OVERDUE' : ''}
                            {' '}
                            <Link href={`/applications/${item.applicationId}`}>view</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    
}