import { ManagedPlugin } from "@mercuryworkshop/scramjet-controller";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
import { versionInfo } from "@mercuryworkshop/scramjet";

/**
 * Allows you to set a custom error page from an html string.
 * Replaces {{SCRAMJET_VERSION}}, {{SCRAMJET_BUILD}}, {{ORIGIN}}, {{URL}}, and {{ERROR}} in the string with its corresponding value.
 */
export class customErrorPagePlugin extends ManagedPlugin {
  constructor(private content: string) {
    super("error-page", []);
  }

  install(frame: Frame): void {
    this.tap(frame.hooks.error.request, (context: any, props: any) => {
      props.setResponse = {
        body: this.content
          .replaceAll("{{SCRAMJET_VERSION}}", String(versionInfo.version))
          .replaceAll("{{SCRAMJET_BUILD}}", String(versionInfo.build))
          .replaceAll("{{ORIGIN}}", location.host)
          .replaceAll(
            "{{URL}}",
            decodeURIComponent(context.rawrequest.rawUrl)
              .replace(location.origin, "")
              .slice(24),
          )
          .replaceAll("{{ERROR}}", context.error),
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
        status: 500,
        statusText: "Internal Server Error",
      };

      props.suppressError = false;
    });
  }
}
