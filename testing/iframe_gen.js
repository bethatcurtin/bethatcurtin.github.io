(function(Scratch) {
    'use strict';

    class DalleBackdropExtension {
        constructor() {
            this.apiKeyDalle = '';
        }
        getInfo() {
            return {
                id: 'dalleBackdrop',
                name: 'DALL·E Backdrop',
                blocks: [
                     {
                        opcode: 'setApiKeyDalle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key (dall-e) to [KEY_DALLE]',
                        arguments: {
                            KEY_DALLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sk-DalleAPIKeyHere'
                            }
                        }
                    },
                    {
                        opcode: 'generateBackdrop',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Generate backdrop from prompt [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'A beautiful landscape'
                            }
                        }
                    }
                ]
            };
        }
        setApiKeyDalle(args) {
            this.apiKeyDalle = args.KEY_DALLE;
        }

        async generateBackdrop(args, util) {
            const prompt = args.PROMPT;
            // Replace the following with your actual OpenAI API key
            const apiKey = 'YOUR_OPENAI_API_KEY';
            
            const requestBody = {
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            };

            try {
                const response = await fetch("https://api.openai.com/v1/images/generations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.apiKeyDalle}`
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    console.error("DALL·E API error:", response.statusText);
                    return;
                }

                const data = await response.json();
                if (data && data.data && data.data.length > 0) {
                    const imageUrl = data.data[0].url;
                    // Load the image and convert it to a data URL
                    const image = new Image();
                    image.crossOrigin = 'Anonymous';
                    image.src = imageUrl;

                    image.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(image, 0, 0);
                        const backdropData = canvas.toDataURL();

                        // Set the generated image as the stage backdrop.
                        // Note: This approach modifies the stage element's background.
                        const stage = Scratch.vm.runtime.renderer.canvas;
                        stage.style.backgroundImage = `url(${backdropData})`;
                        stage.style.backgroundSize = 'cover';
                    };

                    image.onerror = (e) => {
                        console.error("Failed to load the generated image.", e);
                    };
                } else {
                    console.error("No image data received from DALL·E.");
                }
            } catch (error) {
                console.error("Error during DALL·E image generation:", error);
            }
        }
    }

    Scratch.extensions.register(new DalleBackdropExtension());
})(Scratch);
