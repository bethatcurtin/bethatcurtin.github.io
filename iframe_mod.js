(function (Scratch) {
  "use strict";

  let iframe = null;

  const SANDBOX = [
    "allow-same-origin",
    "allow-scripts",
    "allow-forms",
    "allow-modals",
    "allow-popups"
  ];

  const FIXED_HTML = `
    <h1>Welcome to the Fixed Iframe Extension</h1>
    <p>This content is predefined and cannot be changed.</p>`;

  const createFrame = () => {
    if (iframe) return;

    iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.position = "absolute";
    iframe.setAttribute("sandbox", SANDBOX.join(" "));
    iframe.setAttribute("src", `data:text/html;,${encodeURIComponent(
        Scratch.Cast.toString(HTML)
      )}`);
    
    Scratch.renderer.addOverlay(iframe, "scale-centered");
  };

  const closeFrame = () => {
    if (iframe) {
      Scratch.renderer.removeOverlay(iframe);
      iframe = null;
    }
  };

  Scratch.vm.runtime.on("RUNTIME_DISPOSED", closeFrame);

  class FixedIframeExtension {
    getInfo() {
      return {
        name: "Fixed Iframe",
        id: "fixed_iframe",
        blocks: [
          {
            opcode: "show",
            blockType: Scratch.BlockType.COMMAND,
            text: "Show fixed iframe"
          },
          {
            opcode: "hide",
            blockType: Scratch.BlockType.COMMAND,
            text: "Hide iframe"
          },
          {
            opcode: "close",
            blockType: Scratch.BlockType.COMMAND,
            text: "Close iframe"
          }
        ]
      };
    }

    show() {
      createFrame();
      if (iframe) iframe.style.display = "";
    }

    hide() {
      if (iframe) iframe.style.display = "none";
    }

    close() {
      closeFrame();
    }
  }

  Scratch.extensions.register(new FixedIframeExtension());
})(Scratch);
