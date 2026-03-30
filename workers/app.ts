import { createRequestHandler } from "react-router";
// @ts-expect-error - virtual module provided by @react-router/dev
import * as serverBuild from "virtual:react-router/server-build";

declare global {
    interface CloudflareEnvironment extends Env { }
}

declare module "react-router" {
    export interface AppLoadContext {
        cloudflare: {
            env: CloudflareEnvironment;
            ctx: ExecutionContext;
        };
    }
}

const requestHandler = createRequestHandler(serverBuild, import.meta.env.MODE);

const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
].join('; ');

export default {
    async fetch(request: Request, env: CloudflareEnvironment, ctx: ExecutionContext) {
        const response = await requestHandler(request, {
            cloudflare: { env, ctx },
        });
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Content-Security-Policy', CSP);
        newHeaders.set('X-Content-Type-Options', 'nosniff');
        newHeaders.set('X-Frame-Options', 'DENY');
        newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    },
} satisfies ExportedHandler<CloudflareEnvironment>;

