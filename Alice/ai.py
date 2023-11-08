import openai
import config
from django.conf import settings
openai.api_key = settings.OPENAI_API_KEY



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

print (generateChatResponse('hi'))