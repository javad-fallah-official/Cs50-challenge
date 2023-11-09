from django.shortcuts import render
from Alice.ai import generateChatResponse
from django.http import JsonResponse

def home(request):
    context={}
    
    if request.method == 'POST':
        prompt = request.POST['prompt']
        Response = {}
        Response['answer'] = generateChatResponse(prompt)
        return JsonResponse(Response)

    return render(request, 'Alice/index.html', context)



def login(request):
    context={}
    return render(request,'login.html',context)