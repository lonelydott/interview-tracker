import { Metadata } from 'next';
import CreateForm from './create-form';

export const metadata: Metadata = {
    title: 'New Application'
}

export default function Page() {
    return <CreateForm />
}

