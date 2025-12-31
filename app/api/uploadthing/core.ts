import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth'; // Your Better Auth instance
import { headers } from 'next/headers';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            // If you throw, the user will not be able to upload
            if (!session || session.user.role !== 'admin')
                throw new Error('Unauthorized');

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId);
            console.log('file url', file.url);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
