// tslint:disable:no-console
export function log(severity: 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG', ...output: any[]): void {
    switch (severity) {
        case 'DEBUG':
            console.log(output);
            break;
        case 'INFO':
            console.info(output);
            break;
        case 'WARNING':
            console.warn(output);
            break;
        case 'ERROR':
            console.error(output);
            break;
    }
}
