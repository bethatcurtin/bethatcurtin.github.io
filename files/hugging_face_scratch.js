

(function (Scratch) {
    'use strict';

    class hfApiImages {
        constructor() {
            this.apiKeyHF = '';
            this.modelIdHF = 'FLUX.1-schnell'; // Default model
            this.imageSize = 100;
        }

        getInfo() {
            return {
                id: 'hfAPI',
                color1: '#ff00ff',
                name: 'HF Image Generator',
                blocks: [
                    {
                        opcode: 'setApiKeyHF',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set IMAGE KEY: [KEY_HF]',
                        arguments: {
                            KEY_HF: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'hf_xxxxxx'
                            }
                        }
                    },
                    {
                        opcode: 'setModelIdHF',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Select Model: [MODEL_HF]',
                        arguments: {
                            MODEL_HF: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MODELS_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'generateImage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Generate image of: [DESCRIPTION]',
                        arguments: {
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'A cute cat wearing a hat'
                            }
                        }
                    }
                    // {
                    //     opcode: 'setImageSize',
                    //     blockType: Scratch.BlockType.COMMAND,
                    //     text: 'Set size: [SIZE]',
                    //     arguments: {
                    //         SIZE: {
                    //             type: Scratch.ArgumentType.NUMBER,
                    //             defaultValue: 150
                    //         }
                    //     }
                    // }
                ],
                menus: {
                    MODELS_MENU: {
                        acceptReporters: true,
                        // items: ['AuraFlow-v0.3', 'FLUX.1-dev', 'FLUX.1-schnell', 'HiDream-I1-Dev', 'HiDream-I1-Fast', 'HiDream-I1-Full', 'stable-diffusion-3.5-large', 'stable-diffusion-3.5-large-turbo', 'stable-diffusion-3.5-medium']
                        items: [ 'FLUX.1-schnell', 'AuraFlow-v0.3',  'HiDream-I1-Fast', 'stable-diffusion-3.5-large-turbo']
                    }
                }
            };
        }

        setApiKeyHF(args) {
            this.apiKeyHF = args.KEY_HF;
        }

        setModelIdHF(args) {
            this.modelIdHF = args.MODEL_HF;
        }
        // setImageSize(args) {
        //     this.imageSize = args.SIZE;
        // }



        async generateImage(args) {
            if (!this.apiKeyHF) {
                return 'API key not set!';
            }
            const models_aliases = {
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
            const providerId = models_aliases[this.modelIdHF]?.providerId;
            console.log(providerId)
            console.log(this.apiKeyHF)

            try {
                const response = await fetch(`https://router.huggingface.co/fal-ai/${providerId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.apiKeyHF}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sync_mode: true,
                        prompt: args.DESCRIPTION,
                    })
                });

                if (!response.ok) {
                    return `Error: ${response.status}`;
                }

                const data = await response.json();
                // console.log(return_html)
                // const return_html = `<img src="${data.images[0].url}" alt="generated image" width="${this.imageSize}">`
                const return_html = `<img src="${data.images[0].url}" alt="generated image" width="100%">`
                console.log(return_html)
                return return_html || 'Image generation failed';

                // return data.images[0].url || 'Image generation failed';
            } catch (error) {
                console.log(error)
                return 'Request failed';
            }

        }
    }
    Scratch.extensions.register(new hfApiImages());
})(Scratch);
