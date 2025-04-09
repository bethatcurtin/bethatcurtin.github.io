

(function (Scratch) {
    'use strict';

    class imageGeneratorExtension {
        constructor() {
            this.apiKey_hf = '';
            this.modelId_hf = 'stabilityai/stable-diffusion-3.5-medium'; // Default model
            this.imageURL = '';

        }

        getInfo() {
            return {
                id: 'dalleAPI',
                color1: '#C280FF',
                name: 'HF Inference API v1',
                blocks: [
                    {
                        opcode: 'setApiKey_hf',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key (hf) to [KEY_HF]',
                        arguments: {
                            KEY_HF: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sk-hfAPIKeyHere'
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
                        items: ['prompthero/openjourney', 'stabilityai/stable-diffusion-3.5-medium']
                    }
                }
            };
        }

        setApiKeyHF(args) {
            this.apiKey_hf = args.KEY_HF;
        }

        setDalleModelId(args) {
            this.modelId_hf = args.MODEL_HF;
        }

        async generateImage(args) {
            if (!this.apiKey_hf) {
                return 'API key not set!';
            }

            if (this.modelId == 'stabilityai/stable-diffusion-3.5-medium') {
                try {
                    const response = await fetch('https://router.huggingface.co/fal-ai/fal-ai/stable-diffusion-v35-medium', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey_hf}`
                        },
                        body: JSON.stringify({ inputs: args.DESCRIPTION })
                    });

                    if (!response.ok) {
                        return `Error: ${response.status}`;
                    }

                    const data = await response.blob();
                    this.imageURL = URL.createObjectURL(data);
                    return this.imageURL || 'Image generation failed';
                } catch (error) {
                    return 'Request failed';
                }
            } else {
                try {
                    const response = await fetch('https://router.huggingface.co/hf-inference/models/prompthero/openjourney', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey_hf}`
                        },
                        body: JSON.stringify({ inputs: args.DESCRIPTION })
                    });

                    if (!response.ok) {
                        return `Error: ${response.status}`;
                    }

                    const data = await response.blob();
                    this.imageURL = URL.createObjectURL(data);
                    return this.imageURL || 'Image generation failed';
                    
                    
                } catch (error) {
                    return 'Request failed';
                }
            }
        }
    }
    Scratch.extensions.register(new imageGeneratorExtension());
})(Scratch);
