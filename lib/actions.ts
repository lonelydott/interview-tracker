'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';


const FormSchema = z.object({
    companyName: z.string().min(1),
    role: z.string().min(1),
    appliedAt: z.string().optional(),
    jobPostUrl: z.url().or(z.literal('')).optional(),
    source: z.string().optional(),
    status: z.enum(["INTERVIEWING", "OA", "APPLIED"]).optional(),
    notes: z.string().optional(),
});

export type State = {
    errors?: {
        companyName?: string[];
        role?: string[];
        appliedAt?: string[];
        jobPostUrl?: string[];
        source?: string[];
        status?: string[];
        notes?: string[];
    };
    message?: string | null;
}

export async function createApplication(prevState: State, formData: FormData){
    const validatedFields = FormSchema.safeParse({
        companyName: formData.get('companyName'),
        role: formData.get('role'),
        appliedAt: formData.get('appliedAt'),
        jobPostUrl: formData.get('jobPostUrl'),
        source: formData.get('source'),
        status: formData.get('status'),
        notes: formData.get('notes')
    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: 'Missing Fields.',
        }
    }

    const {
        companyName, 
        role,
        appliedAt,
        jobPostUrl,
        source,
        status,
        notes,
    } = validatedFields.data;
    
    try {
        const company = await prisma.company.upsert({
            where: {
                name: companyName,
            },
            update: {},
            create: {
                name: companyName,
            }
        });
        const newApp = await prisma.application.create({
            data: {
                role: role,
                appliedAt: appliedAt ? new Date(appliedAt) : null,
                jobPostUrl: jobPostUrl || null,
                status: status,
                source: source || null, 
                notes: notes || null,
                company: { connect: { id: company.id } },
            },
        })
        
    }   
    catch (error) {
        return {
            message: 'Database Error: Failed to Create Application',
        }
    }
    revalidatePath('/applications')
    redirect('/applications')
}

const InterviewSchema = z.object({
    type: z.enum([
        "RECRUITER_SCREEN",
        "PHONE_SCREEN",
        "TECHNICAL",
        "SYSTEM_DESIGN",
        "BEHAVIORAL",
        "ONSITE",
        "FINAL",
    ]),
    scheduledAt: z.string().min(1),
    durationMins: z.string().optional(),
    round: z.string().optional(),
    location: z.string().optional(),
    interviewer: z.string().optional(),
    notes: z.string().optional(),
    applicationId: z.string().min(1),
})

export type InterviewState = {
    errors?: {
        type?: string[];
        scheduledAt?: string[];
        durationMins?: string[];
        round?: string[];
        location?: string[];
        interviewer?: string[];
        notes?: string[];
    };
    message?: string | null;
}

export async function createInterview(prevState: InterviewState, formData: FormData) {
    const validatedFields = InterviewSchema.safeParse({
        type: formData.get('type'),
        scheduledAt: formData.get('scheduledAt'),
        durationMins: formData.get('durationMins'),
        round: formData.get('round'),
        location: formData.get('location'),
        interviewer: formData.get('interviewer'),
        notes: formData.get('notes'),
        applicationId: formData.get('applicationId'),
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: 'Missing Fields.',
        }
    }

    const {
        type,
        scheduledAt,
        durationMins,
        round,
        location,
        interviewer,
        notes,
        applicationId,
    } = validatedFields.data;

    try{
        const newInterview = await prisma.interview.create({
            data: {
                type: type,
                scheduledAt: new Date(scheduledAt),
                durationMins: durationMins ? parseInt(durationMins, 10) : null,
                round: round ? parseInt(round, 10) : null,
                location: location || null,
                interviewer: interviewer || null,
                notes: notes || null,
                application: { connect: { id: applicationId}}
            }
        })

    } catch (error) {
        return { message: 'Database Error: Failed to Create Application', }
    }
    
    revalidatePath('/applications/' + applicationId)
    return { message: 'Interview added', }
}

const OASchema = z.object({
    dueAt: z.string().min(1),
    platform: z.string().optional(),
    link: z.url().or(z.literal('')).optional(),
    durationMins: z.string().optional(),
    notes: z.string().optional(),
    applicationId: z.string().min(1),
});

export type OAState = {
    errors?: {
        dueAt?: string[];
        platform?: string[];
        link?: string[];
        durationMins?: string[];
        notes?: string[];
        applicationId?: string[];
    };
    message?: string | null; 
}

export async function createOA(prevState: OAState, formData: FormData){
    const validatedFields = OASchema.safeParse({
        dueAt: formData.get('dueAt'),
        platform: formData.get('platform'),
        link: formData.get('link'),
        durationMins: formData.get('durationMins'),
        notes: formData.get('notes'),
        applicationId: formData.get('applicationId'),
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: 'Missing Fields.',
        }
    }

    const {
        dueAt,
        platform,
        link,
        durationMins,
        notes,
        applicationId,
    } = validatedFields.data;

    try{
        const newOA = await prisma.onlineAssessment.create({
            data: {
                dueAt: new Date(dueAt),
                platform: platform || null,
                link: link || null,
                durationMins: durationMins ? parseInt(durationMins, 10) : null,
                notes: notes || null,
                application: { connect: { id: applicationId}},
            }
        })
    } catch(error) {
        return { message: 'Database Error: Failed to Create OA', }
    }

    revalidatePath('/applications/' + applicationId)
    return { message: 'OA added', }
}

// regex is pretty permissive will assume that users will put a well formed phone number
// could allow some non-phone strings but it should be fine, user's loss anyways

const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;

const RCallSchema = z.object({
    scheduledAt: z.string().min(1),
    recruiter: z.string().optional(),
    phoneOrLink: z.url().or(z.string().regex(phoneRegex)).or(z.literal('')).optional(),
    durationMins: z.string().optional(),
    notes: z.string().optional(),
    applicationId: z.string().min(1),
})

export type RCallState = {
    errors?: {
        scheduledAt?: string[];
        recruiter?: string[];
        phoneOrLink?: string[];
        durationMins?: string[];
        notes?: string[];
        applicationId?: string[];
    };
    message?: string | null; 
}

export async function createRCall(prevState: RCallState, formData: FormData){
    const validatedFields = RCallSchema.safeParse({
        scheduledAt: formData.get('scheduledAt'),
        recruiter: formData.get('recruiter'),
        phoneOrLink: formData.get('phoneOrLink'),
        durationMins: formData.get('durationMins'),
        notes: formData.get('notes'),
        applicationId: formData.get('applicationId'),
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: 'Missing Fields.',
        }
    }

    const {
        scheduledAt,
        recruiter,
        phoneOrLink,
        durationMins,
        notes,
        applicationId,
    } = validatedFields.data;

    try{
        const newRCall = await prisma.recruiterCall.create({
            data: {
                scheduledAt: new Date(scheduledAt),
                recruiter: recruiter || null,
                phoneOrLink: phoneOrLink || null,
                durationMins: durationMins ? parseInt(durationMins, 10) : null,
                notes: notes || null,
                application: { connect: {id: applicationId}},
            }

        })
    } catch (error) {
        return { message: 'Database Error: Failed to Create Recruiter Call', }
    }
    revalidatePath('/applications/' + applicationId)
    return { message: 'Recruiter Call added', }
}