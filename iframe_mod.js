// Name: Iframe
// ID: iframe
// Description: Display webpages or HTML over the stage.
// Context: "iframe" is an HTML element that lets websites embed other websites.
// License: MIT AND MPL-2.0



(function (Scratch) {
  "use strict";

  /** @type {HTMLIFrameElement|null} */
  let iframe = null;
  let overlay = null;



  const SANDBOX = [
    "allow-same-origin",
    "allow-scripts",
    "allow-forms",
    "allow-modals",
    "allow-popups",

    // The big one we don't want to include is allow-top-navigation
  ];

  let x = 0;
  let y = 0;
  let width = -1; // negative means default
  let height = -1; // negative means default
  let interactive = true;
  let resizeBehavior = "scale";

  const updateFrameAttributes = () => {
    if (!iframe) {
      return;
    }

    iframe.style.pointerEvents = interactive ? "auto" : "none";

    const { stageWidth, stageHeight } = Scratch.vm.runtime;
    const effectiveWidth = width >= 0 ? width : stageWidth;
    const effectiveHeight = height >= 0 ? height : stageHeight;

    if (resizeBehavior === "scale") {
      iframe.style.width = `${effectiveWidth}px`;
      iframe.style.height = `${effectiveHeight}px`;

      iframe.style.transform = `translate(${-effectiveWidth / 2 + x}px, ${
        -effectiveHeight / 2 - y
      }px)`;
      iframe.style.top = "0";
      iframe.style.left = "0";
    } else {
      // As the stage is resized in fullscreen mode, only % can be relied upon
      iframe.style.width = `${(effectiveWidth / stageWidth) * 100}%`;
      iframe.style.height = `${(effectiveHeight / stageHeight) * 100}%`;

      iframe.style.transform = "";
      iframe.style.top = `${
        (0.5 - effectiveHeight / 2 / stageHeight - y / stageHeight) * 100
      }%`;
      iframe.style.left = `${
        (0.5 - effectiveWidth / 2 / stageWidth + x / stageWidth) * 100
      }%`;
    }
  };

  const getOverlayMode = () =>
    resizeBehavior === "scale" ? "scale-centered" : "manual";

  const createFrame = (src) => {
    iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.position = "absolute";
    iframe.setAttribute("sandbox", SANDBOX.join(" "));
 
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("src", src);

    overlay = Scratch.renderer.addOverlay(iframe, getOverlayMode());
    updateFrameAttributes();
  };

  const closeFrame = () => {
    if (iframe) {
      Scratch.renderer.removeOverlay(iframe);
      iframe = null;
      overlay = null;
    }
  };

  Scratch.vm.on("STAGE_SIZE_CHANGED", updateFrameAttributes);

  Scratch.vm.runtime.on("RUNTIME_DISPOSED", closeFrame);

  class IframeExtension {
    getInfo() {
      return {
        name: "Iframe",
        id: "iframe",
        blocks: [
          
          {
            opcode: "displayHTML",
            blockType: Scratch.BlockType.COMMAND,
            text: "show HTML [HTML]",
            arguments: {
              HTML: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: `<h1>${"It works!"}</h1>`,
              },
            },
          },
          "---",
          {
            opcode: "show",
            blockType: Scratch.BlockType.COMMAND,
            text: "show iframe",
          },
          {
            opcode: "hide",
            blockType: Scratch.BlockType.COMMAND,
            text: "hide iframe",
          },
          
          {
            opcode: "setX",
            blockType: Scratch.BlockType.COMMAND,
            text: "set iframe x position to [X]",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "setY",
            blockType: Scratch.BlockType.COMMAND,
            text: "set iframe y position to [Y]",
            arguments: {
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "setWidth",
            blockType: Scratch.BlockType.COMMAND,
            text: "set iframe width to [WIDTH]",
            arguments: {
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: Scratch.vm.runtime.stageWidth,
              },
            },
          },
          {
            opcode: "setHeight",
            blockType: Scratch.BlockType.COMMAND,
            text: "set iframe height to [HEIGHT]",
            arguments: {
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: Scratch.vm.runtime.stageHeight,
              },
            },
          },
          
        ],
       
      };
    }



    async displayHTML({ HTML }) {
      closeFrame();
      const url = `data:text/html;,${encodeURIComponent(
        Scratch.Cast.toString(HTML)
      )}`;
      if (await Scratch.canEmbed(url)) {
        createFrame(url);
      }
    }

    show() {
      if (iframe) {
        iframe.style.display = "";
      }
    }

    hide() {
      if (iframe) {
        iframe.style.display = "none";
      }
    }

    close() {
      closeFrame();
    }


    setX({ X }) {
      x = Scratch.Cast.toNumber(X);
      updateFrameAttributes();
    }

    setY({ Y }) {
      y = Scratch.Cast.toNumber(Y);
      updateFrameAttributes();
    }

    setWidth({ WIDTH }) {
      width = Scratch.Cast.toNumber(WIDTH);
      updateFrameAttributes();
    }

    setHeight({ HEIGHT }) {
      height = Scratch.Cast.toNumber(HEIGHT);
      updateFrameAttributes();
    }

  }

  Scratch.extensions.register(new IframeExtension());
})(Scratch);
