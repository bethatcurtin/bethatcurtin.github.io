

(function (Scratch) {
    'use strict';

    class OpenRouterExtension {
        constructor() {
            this.apiKey = '';
            this.systemPrompt = 'You are a helpful assistant.';
            this.temperature = 0.7; // Default temperature
            this.modelId = 'gpt-3.5-turbo'; // Default model
        }

        getInfo() {
            return {
                id: 'OpenRouterAPI',
                color1: '#0000FF', // block main colour
                name: 'OpenRouter Text Generator',
                blocks: [
                    {
                        opcode: 'setApiKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set TEXT KEY: [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sk-or-v1-xxxxxx'
                            }
                        }
                    },
                    {
                        opcode: 'setSystemPrompt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set system prompt: [PROMPT]',
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
                        text: 'Set temperature: [TEMP]',
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
                        text: 'Select Model: [MODEL]',
                        arguments: {


                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MODEL_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'askOpenRouter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Prompt to send: [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Tell me a joke'
                            }
                        }
                    }
                ],
                menus: {
                    MODEL_MENU: {
                        acceptReporters: true,
                        items: ['gpt-3.5-turbo', 'gpt-4o-mini','google/gemini-2.0-flash-001','meta-llama/llama-3-8b-instruct','anthropic/claude-3-haiku']
                    }
                }
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
            if (!isNaN(temp) && temp >= 0 && temp <= 2) {
                this.temperature = temp;
            }
        }

        setModelId(args) {
            this.modelId = args.MODEL;
        }

        async askOpenRouter(args) {
            if (!this.apiKey) {
                return 'API key not set!';
            }

            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
                console.log(JSON.stringify({
                        model: this.modelId,
                        messages: [
                            { role: 'system', content: this.systemPrompt },
                            { role: 'user', content: args.PROMPT }
                        ],
                        temperature: this.temperature,
                        max_tokens: 100
                    }))
                if (!response.ok) {
                    return `Error: ${response.status}`;
                }

                const data = await response.json();
                console.log(data)
                return data.choices?.[0]?.message?.content || 'No response';
            } catch (error) {
                return 'Request failed';
            }
        }
    }

    Scratch.extensions.register(new OpenRouterExtension());
})(Scratch);
