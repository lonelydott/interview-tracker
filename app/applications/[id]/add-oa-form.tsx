'use client'

import { useActionState } from "react";
import { createOA, OAState } from "@/lib/actions";

const initialState: OAState = { errors: {}, message: null};

export default function AddOAForm({applicationId} : {applicationId : string}) {
    const [state, formAction] = useActionState(createOA, initialState);

    return (
        <form action={formAction}>
            <input type="hidden" name="applicationId" value={applicationId} />
            
            <div>
                <label htmlFor="dueAt">Due At</label>
                <input id="dueAt" name="dueAt" type="datetime-local" />
            </div>

            <div>
                <label htmlFor="platform">Platform</label>
                <input id="platform" name="platform" type="text" />
            </div>

            <div>
                <label htmlFor="link">Link</label>
                <input id="link" name="link" type="url" />
            </div>

            <div>
                <label htmlFor="durationMins">Duration (mins)</label>
                <input id="durationMins" name="durationMins" type="number" />
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
            </div>

            <div>
                <button type="submit">Add Online Assessment</button>
            </div>
        </form>
    )
}