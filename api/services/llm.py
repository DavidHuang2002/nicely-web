from langchain_openai import ChatOpenAI
import os
from typing import List, Generator
from openai import OpenAI
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# initialize the llm
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=os.getenv("OPENAI_API_KEY"))


def generate_response_stream(messages: List[ChatCompletionMessageParam]) -> Generator[str, None, None]:
    stream = client.chat.completions.create(
        messages=messages,
        model="gpt-4",
        stream=True,
    )
    return stream
