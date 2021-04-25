import * as z from 'zod';
import { IncomingMessage } from 'http';

export interface HttpResponse<T> {
    statusCode: number;
    body: T;
}

/**
 * See https://nodejs.org/en/knowledge/HTTP/clients/how-to-create-a-HTTP-request/
 */
export function httpsCallbackHandler<T>(typeGuard: z.ZodType<T>, callback: (response: HttpResponse<T>) => void) {
    return (httpResponse: IncomingMessage) => {
        let data = '';

        // A chunk of data has been received.
        httpResponse.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        httpResponse.on('end', (): void => {
            const statusCode: number = z.number().parse(httpResponse.statusCode);
            const responseBody: T = typeGuard.parse(JSON.parse(data));
            callback({
                statusCode: statusCode,
                body: responseBody,
            });
        });
    };
}
