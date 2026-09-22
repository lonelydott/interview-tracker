'use client'

import { useActionState } from "react";
import { createInterview, InterviewState } from "@/lib/actions";

const initialState: InterviewState = { errors: {}, message: null};

export default function AddInterviewForm({ applicationId } : { applicationId : string}) {
    const [state, formAction] = useActionState(createInterview, initialState);

    return (
        <form action={formAction}>
            <input type="hidden" name="applicationId" value={applicationId} />
            
            <div>
                <label htmlFor="type">Type</label>
                <select id="type" name="type" defaultValue="TECHNICAL">
                    <option value="RECRUITER_SCREEN">Recruiter Screen</option>
                    <option value="PHONE_SCREEN">Phone Screen</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="SYSTEM_DESIGN">System Design</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="FINAL">Final</option>
                </select>
            </div>

            <div>
                <label htmlFor="scheduledAt">Scheduled At</label>
                <input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
            </div>

            <div>
                <label htmlFor="durationMins">Duration (mins)</label>
                <input id="durationMins" name="durationMins" type="number" />
            </div>

            <div>
                <label htmlFor="round">Round</label>
                <input id="round" name="round" type="number" />
            </div>

            <div>
                <label htmlFor="location">Location</label>
                <input id="location" name="location" type="text" />
            </div>

            <div>
                <label htmlFor="interviewer">Interviewer</label>
                <input id="interviewer" name="interviewer" type="text" />
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
            </div>

            <div>
                <button type="submit">Add Interview</button>
            </div>

            {state.message && <p>{state.message}</p>}
        </form>
    )
}