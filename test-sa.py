import marimo

__generated_with = "0.16.4"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _():
    # import boto3
    # from strands.models import BedrockModel
    # from strands import Agent

    # # Create a custom boto3 session
    # session = boto3.Session(
    #     aws_access_key_id='',
    #     aws_secret_access_key='',
    #     region_name='ap-southeast-2' 
    # )

    # # Create a Bedrock model with the custom session
    # bedrock_model = BedrockModel(
    #     model_id="amazon.nova-micro-v1:0", # Changed to a valid text model
    #     boto_session=session
    # )

    # # Pass the configured model to the Agent
    # agent = Agent(model=bedrock_model)

    # response = agent("jelaskan tentang sate")
    return


@app.cell
def _(mo, response):
    # Convert the response object to a string before displaying it as markdown
    mo.md(str(response))
    return


if __name__ == "__main__":
    app.run()
