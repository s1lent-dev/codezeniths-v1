import { ErrorHandlerService } from '@codezeniths/service/error';

export function asyncHandler<TInput, TOutput>(
    fn: (payload: TInput) => Promise<TOutput> | TOutput
): (payload: TInput) => Promise<TOutput> {
    return async (payload: TInput) => {
        try {
            return await fn(payload);
        } catch (error) {
            throw ErrorHandlerService.handle(error);
        }
    };
}
