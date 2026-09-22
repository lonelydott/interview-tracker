'use client';

import { useActionState } from "react";
import { createApplication, State } from "@/lib/actions";

const initialState: State = { errors: {}, message: null };

export default function CreateForm() {
    const [state, formAction] = useActionState(createApplication, initialState);

    return (
        <form action={formAction}>
            <div>
                <label htmlFor="role">Role</label>
                <input id="role" name="role" type="text" required />
                {state.errors?.role && <p>{state.errors.role[0]}</p>}
            </div>
            
            <div>
                <label htmlFor="companyName">Company Name</label>
                <input id="companyName" name="companyName" type="text" required />
                {state.errors?.companyName && <p>{state.errors.companyName[0]}</p>}
            </div>

            <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue="APPLIED">
                    <option value="APPLIED">APPLIED</option>
                    <option value="INTERVIEWING">INTERVIEWING</option>
                    <option value="OA">OA</option>
                </select>
                {state.errors?.status && <p>{state.errors.status[0]}</p>}
            </div>

            <div>
                <label htmlFor="source">Source</label>
                <input id="source" name="source" type="text" />
                {state.errors?.source && <p>{state.errors.source[0]}</p>}
            </div>

            <div>
                <label htmlFor="jobPostUrl">Job Post URL</label>
                <input id="jobPostUrl" name="jobPostUrl" type="url" />
                {state.errors?.jobPostUrl && <p>{state.errors.jobPostUrl[0]}</p>}
            </div>

            <div>
                <label htmlFor="appliedAt">Applied On</label>
                <input id="appliedAt" name="appliedAt" type="date" />
                {state.errors?.appliedAt && <p>{state.errors.appliedAt[0]}</p>}
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
                {state.errors?.notes && <p>{state.errors.notes[0]}</p>}
            </div>

            <div>
                <button type="submit">Create Application</button>
            </div>

            {state.message && <p>{state.message}</p>}
        </form>
    )
}