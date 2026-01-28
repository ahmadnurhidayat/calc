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

export default {
    async fetch(request: Request, env: CloudflareEnvironment, ctx: ExecutionContext) {
        return requestHandler(request, {
            cloudflare: { env, ctx },
        });
    },
} satisfies ExportedHandler<CloudflareEnvironment>;

