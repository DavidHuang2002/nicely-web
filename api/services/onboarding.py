from typing import List, AsyncGenerator
from ..models.chat import ClientMessage
from ..chat.stream import stream_text
from ..utils.prompt import convert_to_openai_messages
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import json
import logging

logger = logging.getLogger(__name__)

class OnboardingStep:
    def __init__(self, name: str, prompt: str, required_fields: List[str]):
        self.name = name
        self.prompt = prompt
        self.required_fields = required_fields

class OnboardingService:
    def __init__(self):
        # Initialize Qdrant client
        self.qdrant_client = QdrantClient(
            url="your-qdrant-url",
            api_key="your-api-key"
        )
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('nomic-ai/nomic-embed-text-v1')
        
        # Define onboarding steps
        self.steps = {
            "intro": OnboardingStep(
                name="intro",
                prompt="Hi! Let's start with some basic information. What's your name?",
                required_fields=["name"]
            ),
            "therapy_frequency": OnboardingStep(
                name="therapy_frequency",
                prompt="How often do you typically attend therapy sessions?",
                required_fields=["frequency"]
            ),
            "goals": OnboardingStep(
                name="goals",
                prompt="What are your main goals in therapy? What would you like to work on?",
                required_fields=["goals"]
            ),
            "challenges": OnboardingStep(
                name="challenges",
                prompt="What challenges have you been facing lately?",
                required_fields=["challenges"]
            )
        }

    async def process_step(self, user_id: str, messages: List[ClientMessage]) -> AsyncGenerator[str, None]:
        """Process the current onboarding step and determine next action"""
        
        # Determine current step based on conversation history
        current_step = self._determine_step(messages)
        
        # Extract information from user's last message
        if len(messages) > 1:
            await self._extract_and_store_memory(user_id, messages)
        
        # Get next step prompt
        next_prompt = self._get_next_prompt(current_step)
        
        # Convert messages and add system prompt
        system_prompt = {"role": "system", "content": "You are a compassionate therapy companion helping with onboarding. Keep responses warm and engaging, but focused on gathering necessary information."}
        all_messages = [system_prompt] + convert_to_openai_messages(messages)
        
        if next_prompt:
            all_messages.append({"role": "assistant", "content": next_prompt})
        
        # Stream response
        async for chunk in stream_text(all_messages):
            yield chunk

    def _determine_step(self, messages: List[ClientMessage]) -> str:
        """Determine which onboarding step we're currently on"""
        # Logic to determine current step based on message history
        message_count = len(messages)
        
        if message_count <= 2:
            return "intro"
        elif message_count <= 4:
            return "therapy_frequency"
        elif message_count <= 6:
            return "goals"
        else:
            return "challenges"

    async def _extract_and_store_memory(self, user_id: str, messages: List[ClientMessage]):
        """Extract insights from user message and store in vector DB"""
        try:
            # Extract last user message
            last_message = messages[-1].content
            
            # Use your existing extraction logic here
            # This would use the logic from your reference code
            extracted_data = self._extract_profile_data(last_message)
            
            # Store in vector DB
            for item in extracted_data:
                vector = self.embedding_model.encode(item['summary'])
                self.qdrant_client.upsert(
                    collection_name="user_profiles",
                    points=[{
                        "id": hash(f"{user_id}_{item['summary']}"),
                        "vector": vector.tolist(),
                        "payload": {
                            "user_id": user_id,
                            "content": item
                        }
                    }]
                )
                
        except Exception as e:
            logger.error(f"Error extracting/storing memory: {str(e)}")

    def _get_next_prompt(self, current_step: str) -> str:
        """Get the prompt for the next step"""
        return self.steps.get(current_step, self.steps["intro"]).prompt

    def _extract_profile_data(self, message: str) -> List[dict]:
        """Extract profile data using your existing extraction logic"""
        # Implement your extraction logic here
        # This would use the logic from your reference code
        pass 