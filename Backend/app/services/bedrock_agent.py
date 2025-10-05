import boto3
import os
from strands.models import BedrockModel
from strands import Agent
from app.config.settings import settings

class BedrockAgent:
    def __init__(self):
        # Force set AWS region environment variable to override any defaults
        os.environ['AWS_DEFAULT_REGION'] = settings.AWS_REGION
        
        # Create a custom boto3 session with credentials from .env
        session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

        # Create a Bedrock model with the custom session
        bedrock_model = BedrockModel(
            model_id="amazon.nova-micro-v1:0",
            boto_session=session
        )

        # Pass the configured model to the Agent
        self.agent = Agent(model=bedrock_model)

    def invoke_claude(self, prompt: str) -> str:
        """
        Invoke Amazon Nova Micro model for text generation using strands Agent
        Model: amazon.nova-micro-v1:0
        """
        try:
            # Use strands Agent to handle the request
            response = self.agent(prompt)
            
            # Convert AgentResult to string
            return str(response)
            
        except Exception as e:
            print(f"❌ Bedrock API Error: {e}")
            raise

