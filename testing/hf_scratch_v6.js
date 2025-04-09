(function (Scratch) {
    'use strict';

    class imageGeneratorExtension {
        constructor() {
            this.apiKey_hf = '';
            this.modelId_hf = 'openjourney'; // Default model
            this.imageURL = '';
        }

        getInfo() {
            return {
                id: 'hfAPI',
                color1: '#0A6E4D', //primary-dark 
                name: 'HF Inference API v6',
                blocks: [
                    {
                        opcode: 'setApiKey_hf',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key (hf) to [KEY_HF]',
                        arguments: {
                            KEY_HF: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'hf-APIKeyHere'
                            }
                        }
                    },
                    {
                        opcode: 'setModelId_hf',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set model ID to [MODEL_HF]',
                        arguments: {
                            MODEL_HF: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MODEL_HF_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'generateImage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'generate image for [DESCRIPTION]',
                        arguments: {
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Astronaut riding a horse'
                            }
                        }
                    }
                ],
                menus: {
                    MODEL_HF_MENU: {
                        acceptReporters: true,
                        items: ['openjourney', 'stable-diffusion-3.5-medium']
                    }
                }
            };
        }

        setApiKey_hf(args) {
            this.apiKey_hf = args.KEY_HF;
        }

        setModelId_hf(args) {
            this.modelId_hf = args.MODEL_HF;
        }

        async generateImage(args) {
            if (!this.apiKey_hf) {
                return 'Error: API key not set!';
            }

            const modelUrls = {
                'stable-diffusion-3.5-medium': 'https://router.huggingface.co/fal-ai/fal-ai/stable-diffusion-v35-medium',
                'openjourney': 'https://router.huggingface.co/hf-inference/models/prompthero/openjourney'
            };

            const url = modelUrls[this.modelId_hf];

            if (!url) {
                return 'Error: Invalid model ID';
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey_hf}`
                    },
                    body: JSON.stringify({ inputs: args.DESCRIPTION })
                });

                if (!response.ok) {
                    return `Error: ${response.status} ${response.text}`;
                }
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error body:', errorText);
                    return `Error: ${response.status} - ${errorText}`;
                }

                const img = await response.blob();
                return img || 'Image generation failed';
            } catch (error) {
                return `Request failed: ${error.message}`;
            }
        }
    }

    Scratch.extensions.register(new imageGeneratorExtension());
})(Scratch);
