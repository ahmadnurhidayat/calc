import { createRequestHandler } from "react-router";
// Import the server build
import * as serverBuild from "../dist/server/index.js";

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

const requestHandler = createRequestHandler(serverBuild, "production");

export default {
    async fetch(request: Request, env: CloudflareEnvironment, ctx: ExecutionContext) {
        return requestHandler(request, {
            cloudflare: { env, ctx },
        });
    },
} satisfies ExportedHandler<CloudflareEnvironment>;
