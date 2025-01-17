from typing import List, AsyncGenerator
from ..models.chat import ClientMessage
from ..utils.prompt import convert_to_openai_messages
from ..chat.stream import stream_responses
from ..services.llm import generate_response_stream

import logging

logger = logging.getLogger(__name__)

class OnboardingChat:
    def __init__(self):
        self.system_prompt = """
        You are a compassionate, friendly, and fun therapy companion helping with onboarding. 
        Guide the user through the following steps:
        
        1. Gather basic information:
           - Name
           - Therapy frequency
        
        2. Discuss therapy goals:
           - Current work in therapy
           - Specific goals (e.g., managing anxiety, improving relationships)
           - Definition of progress or success
        
        3. Explore current challenges:
           - Recent challenges
           - Overwhelming situations or emotions
           - Self-understanding
        
        4. Reflect on the last therapy session:
           - Key takeaways
           - Emotions during and after the session
           - Learnings and action steps
           - Unaddressed topics
        
        5. Finalize with a summary and the completion message guiding the user to go to the home page where they can either work through a recent issue, do daily self care, or take notes from previous sessions.
        """

    def handle_onboarding(self, messages: List[ClientMessage]) -> AsyncGenerator[str, None]:
        # Convert messages and add system prompt
        system_prompt = {"role": "system", "content": self.system_prompt}
        all_messages = [system_prompt] + convert_to_openai_messages(messages)
        
        # Generate and stream responses
        return generate_response_stream(all_messages)