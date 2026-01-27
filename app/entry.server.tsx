import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    _loadContext: AppLoadContext
) {
    let shellRendered = false;

    const body = await renderToReadableStream(
        <ServerRouter context={routerContext} url={request.url} />,
        {
            onError(error: unknown) {
                responseStatusCode = 500;
                // Log streaming rendering errors from inside the shell.  Don't log
                // errors encountered during initial shell rendering since they'll
                // reject and get logged in handleDocumentRequest.
                if (shellRendered) {
                    console.error(error);
                }
            },
        }
    );
    shellRendered = true;

    // Ensure we only use abort on bots to avoid layout shift issues on users
    const userAgent = request.headers.get("user-agent");
    if (userAgent && isbot(userAgent)) {
        await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");

    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}
