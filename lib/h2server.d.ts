import { SecureServerOptions, ServerHttp2Stream, IncomingHttpHeaders, Http2Server } from 'http2';

// Configuration and callback function types
type ServerConfig = SecureServerOptions & {
    allowHTTP1?: boolean;
};

type StreamHandler = (stream: StreamLike, headers: IncomingHttpHeaders) => void;

// Interface for the simulated HTTP/2 stream
interface StreamLike {
    headers: IncomingHttpHeaders & {
        ':method'?: string;
        ':path'?: string;
        ':scheme'?: string;
        ':authority'?: string;
        'httpVersion'?: string;
    };
    respond(headers: {
        ':status'?: number;
        [key: string]: string | number | undefined;
    }): void;
    write(chunk: string | Buffer): boolean;
    end(): void;
}

// Main server function
export function h2s(
    port?: number,
    configOrHandler?: ServerConfig | StreamHandler,
    handler?: StreamHandler
): Http2Server;

// Helper functions
export function getArgv(argv: (ServerConfig | StreamHandler)[]): {
    config: ServerConfig;
    f_stream: StreamHandler;
};

export function simulateHttp2Stream(
    req: any,
    res: any
): StreamLike;

export function f_stream_default(
    stream: StreamLike,
    headers: IncomingHttpHeaders
): void;

export function f_stream_test(
    stream: StreamLike,
    headers: IncomingHttpHeaders
): void;