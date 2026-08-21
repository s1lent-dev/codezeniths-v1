import type { GetPlaylistInfoOutputSchema } from '@codezeniths/schemas/db';
import { z } from 'zod';

export type PlaylistInfoData = z.infer<typeof GetPlaylistInfoOutputSchema>;

export interface PlaylistDetailProps {
    slug?: string;
    className?: string;
}
