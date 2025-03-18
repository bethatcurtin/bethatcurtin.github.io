

(function (Scratch) {
    'use strict';

    class OpenAIApiExtension {
        constructor() {
            this.apiKey = '';
            this.systemPrompt = 'You are a helpful assistant.';
            this.temperature = 0.7; // Default temperature
            this.modelId = 'gpt-3.5-turbo'; // Default model
        }

        getInfo() {
            return {
                id: 'openaiAPI',
                name: 'OpenAI Dalle v1',
                blocks: [
                    {
                        opcode: 'setApiKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set OpenAI API key to [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sk-YourAPIKeyHere'
                            }
                        }
                    },
       
                
                    {
                        opcode: 'setModelId',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set model ID to [MODEL]',
                        arguments: {
                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'gpt-3.5-turbo'
                            }
                        },
                        FORMAT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'FORMAT_MENU'
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
                    FORMAT_MENU: {
                      acceptReporters: true,
                      items: ['dalle-2', 'dalle-3']
                    }
                  }
            };
        }

        setApiKey(args) {
            this.apiKey = args.KEY;
        }

       

        setModelId(args) {
            this.modelId = args.MODEL;
        }

        

        async generateImage(args) {
            if (!this.apiKey) {
                return 'API key not set!';
            }

            try {
                const response = await fetch('https://api.openai.com/v1/images/generations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'dall-e-2',
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
        }
    }

    Scratch.extensions.register(new OpenAIApiExtension());
})(Scratch);

