import { isRight } from 'fp-ts/lib/Either';
import { Validation } from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

export function validateOrThrow<T>(inputValidation: Validation<T>): T {
    if (isRight(inputValidation)) {
        return inputValidation.right;
    } else {
        const reportedError = PathReporter.report(inputValidation);
        throw new Error(`Response validation failed!, error: ${reportedError}`);
    }
}
