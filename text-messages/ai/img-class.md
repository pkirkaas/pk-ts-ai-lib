{| Image Classification Training |}
[[ai]] [[python]] [[ts]] [[pcspec]]

I have created several CLI multi-shot AI Chat applications, in both Python and Typescript, using both cloud-based API LLM endpoints and models (OpenAI, "gpt-4o-2024-11-20"; Anthropic/Claude  'claude-3-5-sonnet-latest', etc), as well as LLMs running on my local development machine using `LMStudio` & `ollama` with `qwen 2.5` and other small llms. I know how to do this.

However, now I have a new AI project - training an AI for image classification. Let's say, just classifying `jpg` images into only two categories - `has a face` for photos that include a human face, & `doesn't have a face` for photos that DO NOT have a human face.

To be clear, I first want to fine-tune an image classification model on my local computer, on my custom images.

Then, I want to be able to use the fine-tuned/custom trained model to classify other images in my photo library as face/not-face.

This is a rapid prototyping/experimental project, NOT intended for production. Your recommendations should prioritize ease of implementation.

This will also be a CLI program. 

I know there are different AI models used for image classification, and many various Python libraries/tool kits to support this. I want to use as much existing libraries as possible to minimize my development work.

I have several thousand photos available for training, divided into two subdirectories - `with-faces` & `without-faces`, but I can reduce the number if that is too many to be practical on my local machine.

Speed of inference is not an issue, and real-time classification is not required.

This is a long term, multi-step project - currently your immediate task is to deeply evaluate the latest, most current AI Classification models, and Python Classification libraries, and give me several recommendations and alternatives.

If using Python libraries, prefer `pytorch` based libraries over `tensorflow/keras` libraries.


