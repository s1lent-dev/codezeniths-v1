import type { ZodType } from 'zod';
import { asyncHandler } from './asyncHandler.utils';

type HandlerFn<TInput, TOutput> = (payload: TInput) => Promise<TOutput> | TOutput;

class QRPCBuilder<TInput = unknown, TOutput = unknown> {
    private inputSchema?: ZodType<TInput>;
    private outputSchema?: ZodType<TOutput>;
    private handlerFn?: HandlerFn<TInput, TOutput>;

    input<TInputNew>(schema: ZodType<TInputNew>): QRPCBuilder<TInputNew, TOutput> {
        (this as any).inputSchema = schema;
        return this as unknown as QRPCBuilder<TInputNew, TOutput>;
    }

    output<TOutputNew>(schema: ZodType<TOutputNew>): QRPCBuilder<TInput, TOutputNew> {
        (this as any).outputSchema = schema;
        return this as unknown as QRPCBuilder<TInput, TOutputNew>;
    }

    handler(fn: HandlerFn<TInput, TOutput>): this {
        this.handlerFn = fn;
        return this;
    }

    build(): (payload: TInput) => Promise<TOutput> {
        if (!this.handlerFn) {
            throw new Error('qRPC: handler() must be called before build().');
        }
        const { inputSchema, outputSchema, handlerFn } = this;
        return asyncHandler(async (payload: TInput) => {
            const parsedInput = inputSchema ? inputSchema.parse(payload) : payload;
            const result = await handlerFn(parsedInput);
            return outputSchema ? outputSchema.parse(result) : (result as TOutput);
        });
    }
}

/** Start a new query definition. */
export const qRPC = (): QRPCBuilder => new QRPCBuilder();
