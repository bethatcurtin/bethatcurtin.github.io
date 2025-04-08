
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
    iframe.setAttribute(
      "allow",
      Object.entries(featurePolicy)
        .map(([name, permission]) => `${name} ${permission}`)
        .join("; ")
    );
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

class ImageExtension {
    constructor() {
        this.imageUrl = "https://via.placeholder.com/150"; // Fallback image
        this.width = 100;
        this.height = 100;
        this.x = 0;
        this.y = 0;
        this.imageElement = null;
        this.apiKeyDalle = "";
        this.modelIdDalle = "dall-e-2";
        this.createImageElement();
    }

    createImageElement() {
        if (!this.imageElement) {
            this.imageElement = document.createElement("img");
            this.imageElement.style.position = "absolute";
            this.imageElement.style.pointerEvents = "none";
            this.imageElement.style.zIndex = "1000";
            document.body.appendChild(this.imageElement);
        }
    }

    getInfo() {
        return {
            id: "imageExtension",
            color1: '#f09e4b',
            name: 'OpenAI Dalle v3',
            blocks: [
                {
                    opcode: "setImage",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "set image to [URL]",
                    arguments: {
                        URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com/image.png" }
                    }
                },
                {
                    opcode: "setSize",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "set size to width [WIDTH] height [HEIGHT]",
                    arguments: {
                        WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: Scratch.vm.runtime.stageWidth },
                        HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: Scratch.vm.runtime.stageHeight }
                    }
                },
                {
                    opcode: "setPosition",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "set position to x [X] y [Y]",
                    arguments: {
                        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                    }
                },
                {
                    opcode: "displayHTML",
                    blockType: Scratch.BlockType.COMMAND,
                    text: Scratch.translate("show HTML [HTML]"),
                    arguments: {
                      HTML: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: `<h1>${Scratch.translate("It works!")}</h1>`,
                      },
                    },
                  },
                {
                    opcode: "setApiKeyDalle",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "set DALL·E API key to [KEY_DALLE]",
                    arguments: {
                        KEY_DALLE: { type: Scratch.ArgumentType.STRING, defaultValue: "sk-DalleAPIKeyHere" }
                    }
                },
                {
                    opcode: "setModelIdDalle",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "set DALL·E model to [MODEL_DALLE]",
                    arguments: {
                        MODEL_DALLE: { type: Scratch.ArgumentType.STRING, menu: "MODEL_DALLE_MENU" }
                    }
                },
                {
                    opcode: "generateImage",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "generate image for [DESCRIPTION]",
                    arguments: {
                        DESCRIPTION: { type: Scratch.ArgumentType.STRING, defaultValue: "A cute cat wearing a hat" }
                    }
                }
            ],
            menus: {
                MODEL_DALLE_MENU: {
                    acceptReporters: true,
                    items: ["dall-e-2", "dall-e-3"]
                }
            }
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

    setImage(args) {
        this.imageUrl = args.URL || "https://via.placeholder.com/150";
        console.log("Setting Image URL:", this.imageUrl);
        this.updateImage();
    }

    setSize(args) {
        this.width = args.WIDTH;
        this.height = args.HEIGHT;
        this.updateImage();
    }

    setPosition(args) {
        this.x = args.X;
        this.y = args.Y;
        this.updateImage();
    }

    setApiKeyDalle(args) {
        this.apiKeyDalle = args.KEY_DALLE;
    }

    setModelIdDalle(args) {
        this.modelIdDalle = args.MODEL_DALLE;
    }

    async generateImage(args) {
        if (!this.apiKeyDalle) {
            return "API key not set!";
        }

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKeyDalle}`
                },
                body: JSON.stringify({
                    model: this.modelIdDalle,
                    prompt: args.DESCRIPTION,
                    n: 1,
                    size: this.modelIdDalle === "dall-e-2" ? "256x256" : "1024x1024"
                })
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (!response.ok || !data.data?.[0]?.url) {
                return `Error: ${response.status} - ${data.error?.message || "Unknown error"}`;
            }

            this.imageUrl = data.data[0].url;
            this.updateImage();
            return this.imageUrl;
        } catch (error) {
            console.error("Request failed", error);
            return "Request failed";
        }
    }

    updateImage() {
        if (!this.imageElement) {
            this.createImageElement();
        }
        console.log("Updating image element with URL:", this.imageUrl);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Prevent CORS issues
        img.src = this.imageUrl;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, this.width, this.height);
        };
        document.body.appendChild(canvas);
        this.imageElement.style.width = `${this.width}px`;
        this.imageElement.style.height = `${this.height}px`;
        
        const stageWidth = 480;
        const stageHeight = 360;
        
        const left = (stageWidth / 2) + this.x - (this.width / 2);
        const top = (stageHeight / 2) - this.y - (this.height / 2);
        
        this.imageElement.style.left = `${left}px`;
        this.imageElement.style.top = `${top}px`;
    }
}

Scratch.extensions.register(new ImageExtension());
