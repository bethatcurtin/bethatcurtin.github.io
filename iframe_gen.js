// Name: Iframe
// ID: iframe
// Description: Display webpages or HTML over the stage.
// Context: "iframe" is an HTML element that lets websites embed other websites.
// License: MIT AND MPL-2.0

/* This section sets up localization (l10n) for different languages,
   allowing users to interact with the extension in their preferred language. */
Scratch.translate.setup({
  "fi": { "_It works!": "Toimii!", "_close iframe": "sulje iframe" },
  "it": { "_It works!": "Funziona!", "_close iframe": "chiudi iframe" },
  "ja": { "_Iframe": "埋め込み", "_It works!": "うまく動作しています!" },
  // More languages can be added here.
});

(function (Scratch) {
  "use strict";

  /** Variables to store iframe and overlay elements. */
  let iframe = null;
  let overlay = null;

  /** Security policies to restrict iframe capabilities. */
  const featurePolicy = {
     accelerometer: "'none'",
    "ambient-light-sensor": "'none'",
    battery: "'none'",
    camera: "'none'",
    "display-capture": "'none'",
    "document-domain": "'none'",
    "encrypted-media": "'none'",
    fullscreen: "'none'",
    geolocation: "'none'",
    gyroscope: "'none'",
    magnetometer: "'none'",
    microphone: "'none'",
    midi: "'none'",
    payment: "'none'",
    "picture-in-picture": "'none'",
    "publickey-credentials-get": "'none'",
    "speaker-selection": "'none'",
    usb: "'none'",
    vibrate: "'none'",
    vr: "'none'",
    "screen-wake-lock": "'none'",
    "web-share": "'none'",
    "interest-cohort": "'none'",
  };

  /** Sandbox settings for the iframe to prevent security risks. */
  const SANDBOX = [
    "allow-same-origin",
    "allow-scripts",
    "allow-forms",
    "allow-modals",
    "allow-popups",
  ];

  /** Variables for positioning and sizing the iframe. */
  let x = 0;
  let y = 0;
  let width = -1; // Negative means default (full stage width)
  let height = -1; // Negative means default (full stage height)
  let interactive = true;
  let resizeBehavior = "scale";

  /** Updates iframe position and size based on stored values. */
  const updateFrameAttributes = () => {
    if (!iframe) return;

    iframe.style.pointerEvents = interactive ? "auto" : "none";
    const { stageWidth, stageHeight } = Scratch.vm.runtime;
    const effectiveWidth = width >= 0 ? width : stageWidth;
    const effectiveHeight = height >= 0 ? height : stageHeight;

    if (resizeBehavior === "scale") {
      iframe.style.width = `${effectiveWidth}px`;
      iframe.style.height = `${effectiveHeight}px`;
      iframe.style.transform = `translate(${-effectiveWidth / 2 + x}px, ${-effectiveHeight / 2 - y}px)`;
    } else {
      iframe.style.width = `${(effectiveWidth / stageWidth) * 100}%`;
      iframe.style.height = `${(effectiveHeight / stageHeight) * 100}%`;
    }
  };

  /** Creates a new iframe element with the given URL or HTML content. */
  const createFrame = (src) => {
    iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.position = "absolute";
    iframe.setAttribute("sandbox", SANDBOX.join(" "));
    iframe.setAttribute("allow", Object.entries(featurePolicy).map(([name, permission]) => `${name} ${permission}`).join("; "));
    iframe.setAttribute("src", src);

    overlay = Scratch.renderer.addOverlay(iframe, resizeBehavior === "scale" ? "scale-centered" : "manual");
    updateFrameAttributes();
  };

  /** Removes the iframe from the stage. */
  const closeFrame = () => {
    if (iframe) {
      Scratch.renderer.removeOverlay(iframe);
      iframe = null;
      overlay = null;
    }
  };

  /** Updates the iframe when the Scratch stage is resized. */
  Scratch.vm.on("STAGE_SIZE_CHANGED", updateFrameAttributes);
  Scratch.vm.runtime.on("RUNTIME_DISPOSED", closeFrame);

  /** Defines the extension and its available blocks. */
  class IframeModded {
    getInfo() {
      return {
        name: Scratch.translate("Iframe"),
        id: "iframe",
        blocks: [
          {
            opcode: "display",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("show website [URL]"),
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com" },
            },
          },
          {
            opcode: "displayHTML",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("show HTML [HTML]"),
            arguments: {
              HTML: { type: Scratch.ArgumentType.STRING, defaultValue: "<h1>It works!</h1>" },
            },
          },
          {
            opcode: "close",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("close iframe"),
          },
        ],
      };
    }

    async display({ URL }) {
      closeFrame();
      if (await Scratch.canEmbed(URL)) {
        createFrame(Scratch.Cast.toString(URL));
      }
    }

    async displayHTML({ HTML }) {
      closeFrame();
      const url = `data:text/html;,${encodeURIComponent(Scratch.Cast.toString(HTML))}`;
      if (await Scratch.canEmbed(url)) {
        createFrame(url);
      }
    }

    close() {
      closeFrame();
    }
  }

  /** Registers the extension with Scratch. */
  Scratch.extensions.register(new IframeModded());
})(Scratch);
