'use client'

import { useActionState, useState } from "react"
import { createRCall, RCallState } from "@/lib/actions"

const initialState: RCallState = {errors: {}, message: null};

export default function AddRcallForm({applicationId}: {applicationId: string}) {
    const [state, formAction] = useActionState(createRCall, initialState);
    const [contactType, setContactType] = useState<'phone' | 'link'>('link');
    return (
        <form action={formAction}>
            <input type="hidden" name="applicationId" value={applicationId} />

            <div>
                <label htmlFor="scheduledAt">Scheduled At</label>
                <input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
                {state.errors?.scheduledAt && <p>{state.errors.scheduledAt[0]}</p>}
            </div>

            <div>
                <label htmlFor="recruiter">Recruiter</label>
                <input id="recruiter" name="recruiter" type="text" />
                {state.errors?.recruiter && <p>{state.errors.recruiter[0]}</p>}
            </div>

            {/* contactType for choosing whether phone or link before user inputs the data */}

            <div>
                <label htmlFor="contactType">Contact through:</label>
                <select id="contactType" value={contactType} onChange={(e) => setContactType(e.target.value as 'phone' | 'link')}>
                    <option value="link">Link</option>
                    <option value="phone">Phone</option>
                </select>
            </div>

            <div>
                <label htmlFor="phoneOrLink">
                    {contactType === 'phone' ? 'Phone Number' : 'Meeting Link'}
                </label>
                <input id="phoneOrLink" name="phoneOrLink" type={contactType === 'phone' ? 'tel' : 'url'} placeholder={contactType === 'phone' ? '+1 123-456-7890' : 'https://zoom.us/j/...'} />
                {state.errors?.phoneOrLink && <p>{state.errors.phoneOrLink[0]}</p>}
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
                <button type="submit">Add Recruiter Call</button>
            </div>            

            {state.message && <p>{state.message}</p>}

        </form>

    )
}
