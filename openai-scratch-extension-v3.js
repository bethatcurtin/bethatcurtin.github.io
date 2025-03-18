

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
                name: 'OpenAI Chatbot v3',
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
                        opcode: 'setSystemPrompt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set system prompt to [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'You are a helpful assistant.'
                            }
                        }
                    },
                    {
                        opcode: 'setTemperature',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set temperature to [TEMP]',
                        arguments: {
                            TEMP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.7
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
                        }
                    },
                    {
                        opcode: 'askOpenAI',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ask OpenAI [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Tell me a joke'
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
                ]
            };
        }

        setApiKey(args) {
            this.apiKey = args.KEY;
        }

        setSystemPrompt(args) {
            this.systemPrompt = args.PROMPT;
        }

        setTemperature(args) {
            const temp = parseFloat(args.TEMP);
            if (!isNaN(temp) && temp >= 0 && temp <= 1) {
                this.temperature = temp;
            }
        }

        setModelId(args) {
            this.modelId = args.MODEL;
        }

        async askOpenAI(args) {
            if (!this.apiKey) {
                return 'API key not set!';
            }

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        messages: [
                            { role: 'system', content: this.systemPrompt },
                            { role: 'user', content: args.PROMPT }
                        ],
                        temperature: this.temperature,
                        max_tokens: 100
                    })
                });

                if (!response.ok) {
                    return `Error: ${response.status}`;
                }

                const data = await response.json();
                return data.choices?.[0]?.message?.content || 'No response';
            } catch (error) {
                return 'Request failed';
            }
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

