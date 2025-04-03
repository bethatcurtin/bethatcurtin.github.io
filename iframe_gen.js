class IframeExtension {
    constructor() {
        this.iframe = null;
    }

    openIframe(url) {
        if (this.iframe) {
            this.iframe.src = url;
            this.iframe.style.display = "block";
        } else {
            this.iframe = document.createElement("iframe");
            this.iframe.src = url;
            this.iframe.style.position = "absolute";
            this.iframe.style.top = "10px";
            this.iframe.style.left = "10px";
            this.iframe.style.width = "480px";
            this.iframe.style.height = "360px";
            this.iframe.style.zIndex = "9999";
            document.body.appendChild(this.iframe);
        }
    }

    hideIframe() {
        if (this.iframe) {
            this.iframe.style.display = "none";
        }
    }

    getInfo() {
        return {
            id: "iframeExtension",
            name: "Iframe Opener",
            blocks: [
                {
                    opcode: "openIframe",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Open iframe with URL [URL]",
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "https://example.com"
                        }
                    }
                },
                {
                    opcode: "hideIframe",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Hide iframe"
                }
            ]
        };
    }
}

Scratch.extensions.register(new IframeExtension());
