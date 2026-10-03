import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";

export class customErrorPagePlugin extends ManagedPlugin {
    constructor(
            private content: string
        ) {
            super("error-page", []);
        }
    install(frame: Frame): void {
        this.tap(
            frame.hooks.error.request, (context: any, props: any) => {
                
               props.setResponse = {body: this.content.replaceAll(
"{{SCRAMJET_VERSION}}", "version maybe").replaceAll(
"{{SCRAMJET_BUILD}}", "build maybe").replaceAll("{{URL}}", "https://url.com").replaceAll("{{ERROR}}", "wow cool error"), headers: {
							"content-type": "text/html; charset=utf-8"},
                status: 500, statusText: "Internal Server Error"}
               props.suppressError = false /*new Response(
					this.content,
					{
						status: 500,
						headers: {
							"content-type": "text/plain; charset=utf-8",
							"cache-control": "no-store",
						},
					}
				)*/
            }
        )
    }
}