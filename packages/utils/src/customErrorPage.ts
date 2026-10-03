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
               props.setResponse = new Response(
					this.content,
					{
						status: 500,
						headers: {
							"content-type": "text/plain; charset=utf-8",
							"cache-control": "no-store",
						},
					}
				)
            }
        )
    }
}