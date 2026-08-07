import { z } from 'zod';
import {
    GetModulesOutputSchema,
    GetSingleModuleInputSchema,
    GetSingleModuleOutputSchema,
    GetSingleModuleProgressInputSchema,
    GetSingleModuleProgressOutputSchema,
} from '@codezeniths/schemas/db';

export interface IModuleQueries {
    getModules: (payload: void) => Promise<z.infer<typeof GetModulesOutputSchema>>;

    getSingleModule: (
        payload: z.infer<typeof GetSingleModuleInputSchema>,
    ) => Promise<z.infer<typeof GetSingleModuleOutputSchema>>;

    getSingleModuleProgress: (
        payload: z.infer<typeof GetSingleModuleProgressInputSchema>,
    ) => Promise<z.infer<typeof GetSingleModuleProgressOutputSchema>>;
}
