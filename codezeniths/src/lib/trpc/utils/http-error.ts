import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';

/**
 * Maps a tRPC error (or any generic error) to a proper Next.js NextResponse with the correct HTTP status code.
 */
export function mapTRPCErrorToHTTPResponse(error: unknown) {
    if (error instanceof TRPCError) {
        const status = getHTTPStatusCodeForTRPC(error.code);
        return NextResponse.json(
            { error: { message: error.message, code: error.code } },
            { status }
        );
    }
    
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
        { error: { message, code: 'INTERNAL_SERVER_ERROR' } },
        { status: 500 }
    );
}

function getHTTPStatusCodeForTRPC(code: TRPCError['code']): number {
    switch (code) {
        case 'PARSE_ERROR':
        case 'BAD_REQUEST':
            return 400;
        case 'UNAUTHORIZED':
            return 401;
        case 'FORBIDDEN':
            return 403;
        case 'NOT_FOUND':
            return 404;
        case 'TIMEOUT':
            return 408;
        case 'CONFLICT':
            return 409;
        case 'PRECONDITION_FAILED':
            return 412;
        case 'PAYLOAD_TOO_LARGE':
            return 413;
        case 'UNPROCESSABLE_CONTENT':
            return 422;
        case 'TOO_MANY_REQUESTS':
            return 429;
        case 'CLIENT_CLOSED_REQUEST':
            return 499;
        default:
            return 500;
    }
}
