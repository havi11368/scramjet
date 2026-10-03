import {
  css,
  type Delegate,
  type Component,
  createState,
} from "dreamland/core";
import {
  CatchEscapedLinksPlugin,
  UrlWatcherPlugin,
  customErrorPagePlugin,
} from "@mercuryworkshop/scramjet-utils";
import { versionInfo } from "@mercuryworkshop/scramjet";
import { cachePlugin, controller } from "..";
import { demoSettingsStore } from "../store";
import homepage from "./homepage.html?raw";
import type { Frame } from "@mercuryworkshop/scramjet-controller";

export const browserState = createState({
  url: demoSettingsStore.homeUrl,
  frame: null! as Frame,
});

export const Omnibox: Component = function (cx) {
  const navigate = () => {
    if (!browserState.url.startsWith("http")) {
      browserState.url = `https://${browserState.url}`;
    }
    demoSettingsStore.homeUrl = browserState.url;
    browserState.frame?.go(browserState.url);
  };
  return (
    <form
      class="url-form"
      on:submit={(e: SubmitEvent) => {
        e.preventDefault();
        navigate();
      }}
    >
      <div class="browser-omnibox-shell">
        <div class="omnibox-nav" aria-hidden="true">
          <button
            type="button"
            class="nav-btn"
            on:click={() => browserState.frame?.back()}
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            type="button"
            class="nav-btn"
            on:click={() => browserState.frame?.forward()}
          >
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            type="button"
            class="nav-btn"
            on:click={() => browserState.frame?.reload()}
          >
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
        <input
          id="search"
          class="url-input"
          type="text"
          value={use(browserState.url)}
          spellcheck="false"
          placeholder="Enter URL or search..."
        />
      </div>
    </form>
  );
};
Omnibox.style = css`
  :scope {
    display: flex;
    align-items: center;
    /*padding: 0.25em 0.45em;*/
    background: #0f0f0f;
    border-bottom: 1px solid #2a2a2a;
    min-width: 0;
    width: 100%;
  }
  .browser-omnibox-shell {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.35em;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 0;
    flex: 1;
  }
  .omnibox-nav {
    display: flex;
    align-items: center;
    gap: 0.15em;
    padding-right: 0.25em;
    border-right: 1px solid #2a2a2a;
  }
  .nav-btn {
    border: 0;
    background: transparent;
    color: #8f8f8f;
    width: 1.5em;
    height: 1.5em;
    padding: 0;
    border-radius: 3px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .nav-btn:hover {
    background: #1f1f1f;
    color: #d0d0d0;
  }
  .browser-omnibox-shell .material-symbols-outlined {
    font-size: 15px !important;
    line-height: 1 !important;
    font-variation-settings:
      "OPSZ" 20,
      "wght" 300,
      "FILL" 0,
      "GRAD" 0;
  }
  .url-input {
    box-sizing: border-box;
    width: 100%;
    padding: 0.22em 0.18em;
    font-size: 0.9em;
    border: 1px solid transparent;
    border-radius: 3px;
    background: transparent;
    color: #e5e7eb;
    outline: none;
  }
  .url-input::placeholder {
    color: #6f7680;
  }
`;

let errorPage = `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Scramjet</title>
                    <style>
                    :root {
                        --deep: #080602;
                        --shallow: #181412;
                        --beach: #f1e8e1;
                        --shore: #b1a8a1;
                        --accent: #ffa938;
                        --font-sans: -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
                        --font-monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    }

                    *:not(div,p,span,ul,li,i,span) {
                        background-color: var(--deep);
                        color: var(--beach);
                        font-family: var(--font-sans);
                    }

                    textarea,
                    button {
                        background-color: var(--shallow);
                        border-radius: 0.6em;
                        padding: 0.6em;
                        border: none;
                        appearance: none;
                        font-family: var(--font-sans);
                        color: var(--beach);
						cursor: pointer;
                    }

                    button.primary {
                        background-color: var(--accent);
                        color: var(--deep);
                        font-weight: bold;
                    }

                    textarea {
                        resize: none;
                        height: 20em;
                        text-align: left;
                        font-family: var(--font-monospace);
						cursor: text;
                    }

                    body {
                        width: 100vw;
                        height: 100vh;
                        justify-content: center;
                        align-items: center;
                    }

                    body,
                    html,
                    #inner {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        gap: 0.5em;
                        overflow: hidden;
                    }

                    #inner {
                        z-index: 100;
                    }

                    #cover {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-color: color-mix(in srgb, var(--deep) 70%, transparent);
                        z-index: 99;
                    }

                    #info {
                        display: flex;
                        flex-direction: row;
                        align-items: flex-start;
                        gap: 1em;
                    }

                    #version-wrapper {
                        width: auto;
                        text-align: right;
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        font-size: 0.8rem;
                        color: var(--shore)!important;
                        i {
                            background-color: color-mix(in srgb, var(--deep), transparent 50%);
                            border-radius: 9999px;
                            padding: 0.2em 0.5em;
                        }
                        z-index: 101;
                    }

                    #errorTrace-wrapper {
                        position: relative;
                        width: fit-content;
                    }

                    #copy-button {
                        position: absolute;
                        top: 0.5em;
                        right: 0.5em;
                        padding: 0.23em;
                        cursor: pointer;
                        opacity: 0;
                        transition: opacity 0.4s;
                        font-size: 0.9em;
                    }

                    #errorTrace-wrapper:hover #copy-button {
                        opacity: 1;
                    }
                    </style>
                </head>
                <body>
                    <div id="cover"></div>
                    <div id="inner">
                        <h1 id="errorTitle">Uh oh!</h1>
                        <p>There was an error loading <b id="fetchedURL">{{URL}}</b></p>
                        <!-- <p id="errorMessage">Internal Server Error</p> -->

                        <div id="info">
                            <div id="errorTrace-wrapper">
                                <textarea id="errorTrace" cols="40" rows="10" readonly>Internal Service Worker Error: {{ERROR}}</textarea>
                                <button id="copy-button" class="primary" onclick="copyError()">Copy</button>
                            </div>
                            <div id="troubleshooting">
                                <p>Try:</p>
                                <ul>
                                    <li>Checking your internet connection</li>
                                    <li>Verifying you entered the correct address</li>
                                    <li>Clearing the site data</li>
                                    <li>Contacting <b id="hostname">{{ORIGIN}}</b>'s administrator</li>
                                    <li>Verify the server isn't censored</li>
                                </ul>
                                <p>If you're the administrator of <b id="hostname">{{ORIGIN}}</b>, try:</p>
                                    <ul>
                                    <li>Restarting your server</li>
                                    <li>Updating Scramjet</li>
                                </ul>
                            </div>
                        </div>
                        <br>
                        <button id="reload" class="primary" onclick="window.location.reload()">Reload</button>
                    </div>
                    <p id="version-wrapper"><i>Scramjet v<span id="version">{{SCRAMJET_VERSION}}</span> (build <span id="build">{{SCRAMJET_BUILD}}</span>)</i></p>
					<script>
					function copyError() {
						navigator.clipboard.writeText(document.querySelector("#errorTrace").value)
						document.querySelector("#copy-button").innerHTML = "Copied!"
					}
				</script>
                </body>
            </html>`;

const BrowserView: Component<
  {
    active: boolean;
  },
  {},
  {
    frameel: HTMLIFrameElement;
  }
> = function (cx) {
  cx.mount = async () => {
    await controller.wait();

    let urlWatcher = new UrlWatcherPlugin((url) => {
      browserState.url = url;
    });
    let catchEscapedLinks = new CatchEscapedLinksPlugin(
      (url) =>
        new URL(`/?goto=${encodeURIComponent(url.href)}`, location.origin),
    );
    let customErrorPage = new customErrorPagePlugin(errorPage);
    browserState.frame = controller.createFrame(this.frameel, {
      plugins: [cachePlugin, urlWatcher, catchEscapedLinks, customErrorPage],
    });
    let realHomepage = homepage;
    realHomepage = realHomepage.replaceAll(
      "{{SCRAMJET_VERSION}}",
      String(versionInfo.version),
    );
    realHomepage = realHomepage.replaceAll(
      "{{SCRAMJET_BUILD}}",
      String(versionInfo.build),
    );
    realHomepage = realHomepage.replaceAll(
      "{{SCRAMJET_DATE_PRETTY}}",
      new Date(versionInfo.date).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      }),
    );
    this.frameel.src = `data:text/html;base64,${btoa(realHomepage)}`;

    let goto = new URL(location.href).searchParams.get("goto");
    if (goto) {
      browserState.frame?.go(goto);
      history.replaceState(null, "", location.href.split("?")[0]);
    }
  };

  return (
    <div
      class={use(this.active).map(
        (active) => `tab-panel browser-view ${active ? "active" : ""}`,
      )}
    >
      <iframe this={use(this.frameel)}></iframe>
    </div>
  );
};

BrowserView.style = css`
  :scope {
    flex: 1;
    width: 100%;
    min-width: 0;
    min-height: 0;
    display: none;
    flex-direction: column;
  }
  :scope.active {
    display: flex;
  }

  iframe {
    background: white;
    flex: 1;
    border: none;
  }
`;

export default BrowserView;
