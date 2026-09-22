import type {
    Interview, OnlineAssessment, RecruiterCall, FollowUp,
} from '@/generated/prisma/client'

export type TimelineItem = {
    id: string;
    kind: string;
    title: string;
    date: Date;
    status: string;
    // app context related characteristics
    applicationId: string;
    companyName: string;
    role: string;
};

export function buildTimeline(app: {
    id: string;
    role: string;
    company: { name: string };
    
    interviews: Interview[];
    assessments: OnlineAssessment[];
    recruiterCalls: RecruiterCall[];
    followUps: FollowUp[];
    
}) : TimelineItem[] {
    const items: TimelineItem[] = [
        ...app.interviews.map((i) => ({
            id: i.id,
            kind: 'Interview',
            title: i.type,
            date: i.scheduledAt,
            status: i.status,
            applicationId: app.id,
            companyName: app.company.name,
            role: app.role,
        })),
        ...app.assessments.map((a) => ({
            id: a.id, 
            kind: 'Online Assessment',
            title: a.platform ?? 'OA',
            date: a.dueAt,
            status: a.status,
            applicationId: app.id,
            companyName: app.company.name,
            role: app.role,
        })),
        ...app.recruiterCalls.map((r) => ({
            id: r.id, 
            kind: 'Recruiter Call',
            title: r.recruiter ?? 'Recruiter Call',
            date: r.scheduledAt,
            status: r.status,
            applicationId: app.id,
            companyName: app.company.name,
            role: app.role,
        })),
        ...app.followUps.map((f) => ({
            id: f.id,
            kind: 'Follow Up', 
            title: f.title,
            date: f.dueAt,
            status: f.status,
            applicationId: app.id, 
            companyName: app.company.name,
            role: app.role,
        })),
    ];

    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    return items;
}

export function formatDateTime(date: Date | null) {
    if (!date) {
        return '---';
    }
    return new Date(date).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

export function checkOverdue(date: Date | null, status: string) {
    return date && status === 'UPCOMING' && date < new Date();
}

