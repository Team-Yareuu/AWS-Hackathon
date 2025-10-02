import boto3
from app.config.settings import settings

class BedrockAgent:
    def __init__(self):
        self.client = boto3.client(
            'bedrock-runtime',
            region_name=settings.AWS_REGION # ganti dengan region Anda
        )

    def invoke_claude(self, prompt: str) -> str:
        body = {
            "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
            "max_tokens_to_sample": 300,
            "temperature": 0.1,
            "top_p": 0.9,
        }

        response = self.client.invoke_model(
            body=str.encode(str(body)), 
            modelId='anthropic.claude-v2',
            accept='application/json', 
            contentType='application/json'
        )
        
        response_body = eval(response.get('body').read())
        return response_body.get('completion')

    def generate_image(self, prompt: str) -> str:
        body = {
            "text_prompts": [
                {"text": prompt}
            ],
            "cfg_scale": 10,
            "seed": 0,
            "steps": 50
        }

        response = self.client.invoke_model(
            body=str.encode(str(body)),
            modelId='stability.stable-diffusion-xl-v0',
            accept='application/json',
            contentType='application/json'
        )

        response_body = eval(response.get('body').read())
        return response_body["artifacts"][0]["base64"]

