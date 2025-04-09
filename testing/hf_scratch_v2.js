

(function (Scratch) {
    'use strict';

    class dalleApiExtension {
        constructor() {
            this.apiKeyDalle = '';
            this.modelIdDalle = 'dall-e-2'; // Default model
        }

        getInfo() {
            return {
                id: 'dalleAPI',
                color1: '#3233F4',
                name: 'OpenAI Dalle v1',
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
                        opcode: 'setModelIdDalle',
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
                    }
                ],
                menus: {
                    MODEL_DALLE_MENU: {
                        acceptReporters: true,
                        items: ['dall-e-2', 'dall-e-3']
                    }
                }
            };
        }

        setApiKeyDalle(args) {
            this.apiKeyDalle = args.KEY_DALLE;
        }

        setDalleModelId(args) {
            this.modelIdDalle = args.MODEL_DALLE;
        }

        async generateImage(args) {
            if (!this.apiKeyDalle) {
                return 'API key not set!';
            }

            if (this.modelId == 'dall-e-2') {
                try {
                    const response = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKeyDalle}`
                        },
                        body: JSON.stringify({
                            model: `${this.modelIdDalle}`,
                            prompt: args.DESCRIPTION,
                            n: 1,
                            size: '256x256'
                        })
                    });

                    if (!response.ok) {
                        return `Error: ${response.status}`;
                    }

                    const data = await response.json();
                    return data.data?.[0]?.url || 'Image generation failed';
                } catch (error) {
                    return 'Request failed';
                }
            } else {
                try {
                    const response = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKeyDalle}`
                        },
                        body: JSON.stringify({
                            model: `${this.modelIdDalle}`,
                            prompt: args.DESCRIPTION,
                            n: 1,
                            size: '1024x1024'
                        })
                    });

                    if (!response.ok) {
                        return `Error: ${response.status}`;
                    }

                    const data = await response.json();
                    return data.data?.[0]?.url || 'Image generation failed';
                } catch (error) {
                    return 'Request failed';
                }
            }
        }
    }
    Scratch.extensions.register(new dalleApiExtension());
})(Scratch);
