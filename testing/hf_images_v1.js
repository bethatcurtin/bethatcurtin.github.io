 

(function (Scratch) {
    'use strict';

    class hfApiImages {
        constructor() {
            this.apiKeyHF = '';
            this.modelIdHF = 'stable-diffusion-3.5-medium'; // Default model
            this.imageSize = 100;
        }

        getInfo() {
            return {
                id: 'hfAPI',
                color1: '#D14A7A',
                name: 'HF Api Images v1',
                blocks: [
                    {
                        opcode: 'setApiKeyHF',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key (dall-e) to [KEY_DALLE]',
                        arguments: {
                            KEY_DALLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sk-HFAPIKeyHere'
                            }
                        }
                    },
                    {
                        opcode: 'setModelIdHF',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set model ID to [MODEL_DALLE]',
                        arguments: {
                            MODEL_DALLE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MODEL_DALLE_MENU'
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
                                defaultValue: 'A cute cat wearing a hat'
                            }
                        }
                    },
                    {
                        opcode: 'setImageSize',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Set size [SIZE]',
                        arguments: {
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    }
                ],
                menus: {
                    MODEL_DALLE_MENU: {
                        acceptReporters: true,
                        items: ['AuraFlow-v0.3','FLUX.1-dev','FLUX.1-schnell','HiDream-I1-Dev','HiDream-I1-Fast','HiDream-I1-Full','stable-diffusion-3.5-large','stable-diffusion-3.5-large-turbo','stable-diffusion-3.5-medium']
                    }
                }
            };
        }

        setApiKeyHF(args) {
            this.apiKeyHF = args.KEY_DALLE;
        }

        setHFModelId(args) {
            this.modelIdHF = args.MODEL_DALLE;
        }
        setImageSize(args) {
            this.imageSize = args.SIZE;
        }

        async generateImage(args) {
            if (!this.apiKeyHF) {
                return 'API key not set!';
            }
            models_aliases = {
                "AuraFlow-v0.3": {
                    "hfId": "fal/AuraFlow-v0.3",
                    "providerId": "fal-ai/aura-flow"
                },
                "FLUX.1-dev": {
                    "hfId": "black-forest-labs/FLUX.1-dev",
                    "providerId": "fal-ai/flux/dev"
                },
                "FLUX.1-schnell": {
                    "hfId": "black-forest-labs/FLUX.1-schnell",
                    "providerId": "fal-ai/flux/schnell"
                },
                "HiDream-I1-Dev": {
                    "hfId": "HiDream-ai/HiDream-I1-Dev",
                    "providerId": "fal-ai/hidream-i1-dev"
                },
                "HiDream-I1-Fast": {
                    "hfId": "HiDream-ai/HiDream-I1-Fast",
                    "providerId": "fal-ai/hidream-i1-fast"
                },
                "HiDream-I1-Full": {
                    "hfId": "HiDream-ai/HiDream-I1-Full",
                    "providerId": "fal-ai/hidream-i1-full"
                },
                "stable-diffusion-3.5-large": {
                    "hfId": "stabilityai/stable-diffusion-3.5-large",
                    "providerId": "fal-ai/stable-diffusion-v35-large"
                },
                "stable-diffusion-3.5-large-turbo": {
                    "hfId": "stabilityai/stable-diffusion-3.5-large-turbo",
                    "providerId": "fal-ai/stable-diffusion-v35-large/turbo"
                },
                "stable-diffusion-3.5-medium": {
                    "hfId": "stabilityai/stable-diffusion-3.5-medium",
                    "providerId": "fal-ai/stable-diffusion-v35-medium"
                }
            }
            const hfId = models_aliases[model]?.hfId;

            
                try {
                    const response = await fetch(`https://router.huggingface.co/fal-ai/${providerId}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            sync_mode: true,
                            prompt: prompt,
                        })
                    });

                    if (!response.ok) {
                        return `Error: ${response.status}`;
                    }

                    const data = await response.json();
                    
                    const return_html= `<img src="${data.images[0].url}" alt="generated image" width="${imageSize}" height="${imageSize}">` 
                    return return_html || 'Image generation failed';
                    
                } catch (error) {
                    return 'Request failed';
                }
            
        }
    }
    Scratch.extensions.register(new hfApiImages());
})(Scratch);
