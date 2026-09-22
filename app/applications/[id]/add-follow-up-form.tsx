'use client'

import { useActionState } from "react"
import { createFollowUp, FollowUpState } from "@/lib/actions"

const initialState: FollowUpState = { errors: {}, message: null};

export default function AddFollowUpForm({applicationId} : {applicationId: string}) {
    const [state, formAction] = useActionState(createFollowUp, initialState);

    return (
        <form action={formAction}>
            <input type="hidden" name="applicationId" value={applicationId} />
            
            <div>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" required/>
            </div>

            <div>
                <label htmlFor="dueAt">Due At</label>
                <input id="dueAt" name="dueAt" type="datetime-local" required/>
            </div>

            <div>
                <label htmlFor="priority">Priority</label>
                <select id="priority" name="priority" defaultValue="MEDIUM">
                    <option value="HIGH">High</option> 
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
            </div>

            <div>
                <button type="submit">Add Follow Up</button>
            </div>

            {state.message && <p>{state.message}</p>}
        </form>

    )

}


