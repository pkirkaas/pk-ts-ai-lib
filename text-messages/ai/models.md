[[ai]]

I have created a CLI AI chat application in NodeJS that allows the user to select an Cloud AI API provider (`OpenAI`, `Anthropic/Claude`, etc).

Each cloud API provider offers several LLM Models (`claude-3-7-sonnet`, `o1-preview`, etc) which the user can also select, after selecting the API provider.

Every model has a different maximum context length and `max_tokens` limit. 

I can look that up manually on the websites documenting the models for OpenAI and Anthropic. But I would like to automate that by retrieving the maximum context length and `max_tokens` for a model directly from an API call.

Is that possible with the OpenAI API? Is that possible with the Anthropic API?

Please provide details.