import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";

export class customErrorPagePlugin extends ManagedPlugin {
    constructor(
            content: string
        ) {
            super("url-watcher", []);
        }
    install(frame: Frame): void {
        this.tap(
            frame.hooks.error.request, (context: any, props: any) => {
               props.earlyResponse = new Response(
					`hi scrammy`,
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