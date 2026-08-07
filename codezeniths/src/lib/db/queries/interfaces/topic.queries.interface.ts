import { z } from 'zod';
import {
    GetSingleTopicInputSchema,
    GetSingleTopicOutputSchema,
    GetSingleTopicProgressInputSchema,
    GetSingleTopicProgressOutputSchema,
} from '@codezeniths/schemas/db';

export interface ITopicQueries {
    getSingleTopic: (
        payload: z.infer<typeof GetSingleTopicInputSchema>,
    ) => Promise<z.infer<typeof GetSingleTopicOutputSchema>>;

    getSingleTopicProgress: (
        payload: z.infer<typeof GetSingleTopicProgressInputSchema>,
    ) => Promise<z.infer<typeof GetSingleTopicProgressOutputSchema>>;
}
