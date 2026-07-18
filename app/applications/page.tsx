import { prisma } from "@/lib/prisma";
import Link from 'next/link'

export default async function Page() {
    const allApps = await prisma.application.findMany(
        {
            include: {company: true},
            orderBy: {createdAt: 'desc'}
        }
    );

    

    if (allApps.length === 0) {
        return <p>No applications to show.</p>
    }
    
    return (
        <>
            <Link
                href={{
                    pathname: '/applications/new',
                }}
            >
                New Application
            </Link>

            <ul>
                {allApps.map((app) => (
                    <li key={app.id}>{app.company.name} {app.role} {app.status}</li>
                ))}
            </ul>
        </>
    );
}