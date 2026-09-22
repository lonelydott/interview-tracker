import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AddInterviewForm from './add-interview-form';
import AddOAForm from './add-oa-form';
import AddRcallForm from './add-rec-call-form';
import AddFollowUpForm from './add-follow-up-form';
import { updateInterviewStatus, updateOAStatus, updateRCStatus, updateFollowUpStatus, updateApplicationStatus, deleteApplication } from '@/lib/actions';
import { deleteInterview, deleteOA, deleteRC, deleteFollowUp } from '@/lib/actions';
import { buildTimeline } from '@/lib/timeline';
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

    const timeline = buildTimeline(app);

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
                <form action={updateApplicationStatus.bind(null, app.id)}>
                    <label htmlFor="appStatus">Status</label>
                    <select key={app.status} id="appStatus" name="status" defaultValue={app.status}>
                        <option value="WISHLIST">Wishlist</option>
                        <option value="APPLIED">Applied</option>
                        <option value="OA">OA</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                        <option value="GHOSTED">Ghosted</option>
                    </select>
                    <button type="submit">Update</button>
                </form>
                <p> Applied: {formatDateTime(app.appliedAt)} </p>
                {app.notes && <p>{app.notes}</p>}

                <form action={deleteApplication.bind(null, app.id)}>
                    <button type="submit">Delete Application</button>
                </form>
            </header>

            <section>
                <h2>Timeline</h2>
                {timeline.length === 0 ? (
                    <p>No events yet.</p>
                ) : (
                    <ul>
                        {timeline.map((item) => (
                            <li key={item.kind + item.id}>
                                {formatDateTime(item.date)} - {item.kind}: {item.title} [{item.status}]
                                {checkOverdue(item.date, item.status) ? ' OVERDUE' : ''}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2>Interviews</h2>
                {app.interviews.length === 0 ? (
                    <p>No interviews.</p>
                ) : (
                    <ul>
                        {app.interviews.map((interview) => (
                            <li key={interview.id}>
                                {interview.type} - {formatDateTime(interview.scheduledAt)} [{interview.status}] {checkOverdue(interview.scheduledAt, interview.status) ? 'OVERDUE' : ''}

                                <form action={updateInterviewStatus.bind(null, interview.id, app.id)}>
                                    <select key={interview.status} name="status" defaultValue={interview.status}>
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="MISSED">Missed</option>
                                        <option value="CANCELED">Canceled</option>                                        
                                    </select>
                                    <button type="submit">Update</button>
                                </form>

                                <form action={deleteInterview.bind(null, interview.id, app.id)}>
                                    <button type="submit">Delete</button>
                                </form>
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
                                <form action={updateOAStatus.bind(null, oa.id, app.id)}>
                                    <select key={oa.status} name="status" defaultValue={oa.status}>
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="MISSED">Missed</option>
                                        <option value="CANCELED">Canceled</option>                                        
                                    </select>
                                    <button type="submit">Update</button>
                                </form>

                                <form action={deleteOA.bind(null, oa.id, app.id)}>
                                    <button type="submit">Delete</button>
                                </form>
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
                                <form action={updateRCStatus.bind(null, call.id, app.id)}>
                                    <select key={call.status} name="status" defaultValue={call.status}>
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="MISSED">Missed</option>
                                        <option value="CANCELED">Canceled</option>                                        
                                    </select>
                                    <button type="submit">Update</button>
                                </form>

                                <form action={deleteRC.bind(null, call.id, app.id)}>
                                    <button type="submit">Delete</button>
                                </form>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Render Rec Calls */}
                <AddRcallForm applicationId={app.id} />

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
                                
                                <form action={updateFollowUpStatus.bind(null, followup.id, app.id)}>
                                    <select key={followup.status} name="status" defaultValue={followup.status}>
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="MISSED">Missed</option>
                                        <option value="CANCELED">Canceled</option>                                        
                                    </select>
                                    <button type="submit">Update</button>
                                </form>

                                <form action={deleteFollowUp.bind(null, followup.id, app.id)}>
                                    <button type="submit">Delete</button>
                                </form>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Render Follow Ups */}
                <AddFollowUpForm applicationId={app.id} />
            </section>
            
        </div>
    );
}