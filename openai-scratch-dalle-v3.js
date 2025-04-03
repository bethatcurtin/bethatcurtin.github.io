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
                        WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                        HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
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
