(function (Scratch) {
    'use strict';

    class OpenAIApiExtension {
        constructor() {
            this.apiKey = '';
        }

        getInfo() {
            return {
                id: 'openaiAPI',
                name: 'OpenAI Chatbot',
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
                        opcode: 'askOpenAI',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ask OpenAI [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Tell me a joke'
                            }
                        }
                    }
                ]
            };
        }

        setApiKey(args) {
            this.apiKey = args.KEY;
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
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: args.PROMPT }],
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
    }

    Scratch.extensions.register(new OpenAIApiExtension());
})(Scratch);
