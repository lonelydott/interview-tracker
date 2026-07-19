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
            errors: validatedFields.error.flatten().fieldErrors,
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
    durationMins: z.int().optional(),
    round: z.int().optional(),
    location: z.string().optional(),
    interviewer: z.string().optional(),
    notes: z.string().optional(),
})

export async function createInterview(prevState: State, formData: FormData) {
    
}
