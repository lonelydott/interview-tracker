import { prisma } from "@/lib/prisma";

export default async function Page() {
    const allApps = await prisma.application.findMany(
        {
            include: {company: true},
            orderBy: {createdAt: 'desc'}
        }
    );
    
    return (
        <ul>
            {allApps.map((app) => (
                <li key={app.id}>{app.company.name} {app.role} {app.status}</li>
            ))}
        </ul>
    );
}