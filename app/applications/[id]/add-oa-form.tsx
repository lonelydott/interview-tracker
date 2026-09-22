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
                <input id="dueAt" name="dueAt" type="datetime-local" required/>
                {state.errors?.dueAt && <p>{state.errors.dueAt[0]}</p>}
            </div>

            <div>
                <label htmlFor="platform">Platform</label>
                <input id="platform" name="platform" type="text" />
                {state.errors?.platform && <p>{state.errors.platform[0]}</p>}
            </div>

            <div>
                <label htmlFor="link">Link</label>
                <input id="link" name="link" type="url" />
                {state.errors?.link && <p>{state.errors.link[0]}</p>}
            </div>

            <div>
                <label htmlFor="durationMins">Duration (mins)</label>
                <input id="durationMins" name="durationMins" type="number" />
                {state.errors?.durationMins && <p>{state.errors.durationMins[0]}</p>}
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
                {state.errors?.notes && <p>{state.errors.notes[0]}</p>}
            </div>

            <div>
                <button type="submit">Add Online Assessment</button>
            </div>

            {state.message && <p>{state.message}</p>}

        </form>
    )
}