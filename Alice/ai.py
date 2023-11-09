import openai
from django.conf import settings

# import json
# import os
# import gradio as gr

openai.api_key = settings.OPENAI_API_KEY




# #variable to save all history of all users
# database = {}

# sending a request to dolle and return the url
# def imagine(text):
#    response = openai.Image.create(
#    prompt=text,
#    n=1,
#    size="512x512")
#    return response['data'][0]['url']

# def Speech2Text(path):
#    audio_file= open(path, "rb")
#    return openai.Audio.transcribe("whisper-1", audio_file)

# def Translate(audio):
#    audio_file= open(audio, "rb")
#    text = openai.Audio.translate("whisper-1", audio_file)
#    return text ['text']

# sending request to gpt
def generateChatResponse(prompt):
    messages = []
    messages.append({"role": "system", "content": "Your name is Alice. You are a helpful assistant."})

    question = {}
    question['role'] = 'user'
    question['content'] = prompt
    messages.append(question)

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=messages)

    try:
        answer = response['choices'][0]['message']['content'].replace('\n', '<br>')
    except:
        answer = 'Oops you beat the AI, try a different question, if the problem persists, come back later.'

    return answer


# def transcribe(audio):
#     # Transcribe the audio to text
#     response = openai.Speech.create(audio)
#     transcription = response['choices'][0]['text']
#     return transcription

# def Voice_Answer(audio):
#    audio_file= open(audio, "rb")
#    text = openai.Audio.translate("whisper-1", audio_file)
#    return generateChatResponse(text ['text'])


# with gr.Blocks() as UI:
#     gr.Markdown("بات هوش مصنوعی آلیس")
#     with gr.Tab("چت با متن"):
#         text_input = gr.Textbox()
#         text_output = gr.Textbox()
#         text_button = gr.Button("ارسال")
#     with gr.Tab("چت صوتی"):
#         with gr.Row():
#             Voice_input = gr.Audio(source="microphone",type="filepath")
#             Voice_output = gr.Textbox()
#         Voice_button = gr.Button("ارسال")
#     with gr.Tab("تولید عکس"):
#         with gr.Row():
#             image_input = gr.Textbox()
#             image_output = gr.Image(height="512",width="512",min_width="512")
#         image_button = gr.Button("ساختن")
#     # with gr.Accordion("Open for More!"):
#     #     gr.Markdown("Look at me...")

#     text_button.click(generateChatResponse, inputs=text_input, outputs=text_output)
#     Voice_button.click(Voice_Answer, inputs=Voice_input, outputs=Voice_output)
#     image_button.click(imagine, inputs=image_input, outputs=image_output)

# UI.launch(
# share=False,
# debug=False,
# server_name="n-or-th.ir",
# ssl_certfile="/root/cert.crt",
# ssl_keyfile="/root/private.key")