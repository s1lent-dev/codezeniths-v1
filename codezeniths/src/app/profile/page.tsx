import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '@/lib/auth/auth.service';

export const metadata = {
    title: 'Profile | CodeZeniths',
    description: 'Redirecting to your user profile on CodeZeniths.',
};

export default async function ProfileRedirectPage() {
    const headersList = await headers();
    const { user } = await AuthService.getContext(headersList);

    if (!user) {
        redirect('/sign-in');
    }

    if (user.username) {
        redirect(`/profile/${encodeURIComponent(user.username)}`);
    }

    redirect('/settings/profile-details');
}
