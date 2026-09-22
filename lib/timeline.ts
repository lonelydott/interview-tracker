import type {
    Interview, OnlineAssessment, RecruiterCall, FollowUp,
} from '@/generated/prisma/client'

export type TimelineItem = {
    id: string;
    kind: string;
    title: string;
    date: Date;
    status: string;
};

export function buildTimeline(events: {
    interviews: Interview[];
    assessments: OnlineAssessment[];
    recruiterCalls: RecruiterCall[];
    followUps: FollowUp[];
}) : TimelineItem[] {
    const items: TimelineItem[] = [
        ...events.interviews.map((i) => ({
            id: i.id,
            kind: 'Interview',
            title: i.type,
            date: i.scheduledAt,
            status: i.status,
        })),
        ...events.assessments.map((a) => ({
            id: a.id, 
            kind: 'Online Assessment',
            title: a.platform ?? 'OA',
            date: a.dueAt,
            status: a.status,
        })),
        ...events.recruiterCalls.map((r) => ({
            id: r.id, 
            kind: 'Recruiter Call',
            title: r.recruiter ?? 'Recruiter Call',
            date: r.scheduledAt,
            status: r.status,
        })),
        ...events.followUps.map((f) => ({
            id: f.id,
            kind: 'Follow Up', 
            title: f.title,
            date: f.dueAt,
            status: f.status,
        })),
    ];

    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    return items;
}