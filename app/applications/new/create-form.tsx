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
            </div>
            
            <div>
                <label htmlFor="companyName">Company Name</label>
                <input id="companyName" name="companyName" type="text" required />
            </div>

            <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue="APPLIED">
                    <option value="APPLIED">APPLIED</option>
                    <option value="INTERVIEWING">INTERVIEWING</option>
                    <option value="OA">OA</option>
                </select>
            </div>

            <div>
                <label htmlFor="source">Source</label>
                <input id="source" name="source" type="text" />
            </div>

            <div>
                <label htmlFor="jobPostUrl">Job Post URL</label>
                <input id="jobPostUrl" name="jobPostUrl" type="url" />
            </div>

            <div>
                <label htmlFor="appliedAt">Applied On</label>
                <input id="appliedAt" name="appliedAt" type="date" />
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
            </div>

            <div>
                <button type="submit">Create Application</button>
            </div>

            {state.message && <p>{state.message}</p>}
        </form>
    )
}