import json
from typing import List, Generator
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from openai import OpenAI
import os
import logging

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

logger = logging.getLogger(__name__)

def generate_text(messages: List[ChatCompletionMessageParam]) -> Generator[str, None, None]:
    stream = client.chat.completions.create(
        messages=messages,
        model="gpt-4",
        stream=True,
    )
    return stream

def stream_responses(stream: Generator) -> Generator[str, None, None]:
    for chunk in stream:
        for choice in chunk.choices:
            if choice.finish_reason == "stop":
                continue
            else:
                yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))

        if chunk.choices == []:
            usage = chunk.usage
            prompt_tokens = usage.prompt_tokens
            completion_tokens = usage.completion_tokens

            yield 'e:{{"finishReason":"{reason}","usage":{{"promptTokens":{prompt},"completionTokens":{completion}}},"isContinued":false}}\n'.format(
                reason="stop",
                prompt=prompt_tokens,
                completion=completion_tokens
            )

def handle_chat_stream(messages: List[ChatCompletionMessageParam], protocol: str = 'data') -> Generator[str, None, None]:
    logger.debug(f"Handling chat stream with messages: {messages}")
    stream = generate_text(messages)
    return stream_responses(stream)