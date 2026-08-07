import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AddInterviewForm from './add-interview-form';
import AddOAForm from './add-oa-form';

function formatDateTime(date: Date | null) {
    if (!date) {
        return '---';
    }
    return new Date(date).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

function checkOverdue(date: Date | null, status: string) {
    return date && status === 'UPCOMING' && date < new Date();
}
export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{
        id: string,
    }>;
}) {
    const { id } = await params;
    const app = await prisma.application.findUnique({
        where: { id },
        include: {
            company: true,
            assessments: true,
            interviews: true,
            recruiterCalls: true,
            followUps: true,
        },
    });

    if (!app) {
        notFound();
    }

    return (
        <div>
            <header>
                <h1>
                    {app.role}
                </h1>
                <p>
                    {app.company.name}
                    {app.company.location ? ` ${app.company.location} ` : ''}
                </p>
                <p>
                    Status: {app.status}
                </p>
                <p> Applied: {formatDateTime(app.appliedAt)} </p>
                {app.notes && <p>{app.notes}</p>}
            </header>

            <section>
                <h2>Interviews</h2>
                {app.interviews.length === 0 ? (
                    <p>No interviews.</p>
                ) : (
                    <ul>
                        {app.interviews.map((interview) => (
                            <li key={interview.id}>
                                {interview.type} - {formatDateTime(interview.scheduledAt)} [{interview.status}] {checkOverdue(interview.scheduledAt, interview.status) ? 'OVERDUE' : ''}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Render Interview form */}
                <AddInterviewForm applicationId={app.id} />
            </section>

            <section>
                <h2>Online Assessments</h2>
                {app.assessments.length === 0 ? (
                    <p>No assessments.</p>
                ): (
                    <ul>
                        {app.assessments.map((oa) => (
                            <li key={oa.id}>
                                {oa.platform ?? 'OA'} - due {formatDateTime(oa.dueAt)} [{oa.status}] {checkOverdue(oa.dueAt, oa.status) ? 'OVERDUE' : ''}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Render OAs */}
                <AddOAForm applicationId={app.id} />
            </section>

            <section>
                <h2>Recruiter Calls</h2>
                {app.recruiterCalls.length === 0 ? (
                    <p>No calls.</p>
                ) : (
                    <ul>
                        {app.recruiterCalls.map((call) => (
                            <li key={call.id}>
                                {call.recruiter ?? 'Recruiter'} - {formatDateTime(call.scheduledAt)} [{call.status}] {checkOverdue(call.scheduledAt, call.status) ? 'OVERDUE' : ''}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Render Rec Calls */}
                

            </section>

            <section>
                <h2>Follow Ups</h2>
                {app.followUps.length === 0 ? (
                    <p>No follow ups.</p>
                ) : (
                    <ul>
                        {app.followUps.map((followup) => (
                            <li key={followup.id}>
                                {followup.title} - due {formatDateTime(followup.dueAt)} [{followup.priority}] [{followup.status}] {checkOverdue(followup.dueAt, followup.status) ? 'OVERDUE' : ''}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Render Follow Ups */}

            </section>
        </div>
    );
}