from .mixins import CustomLoginRequiredMixin
from django.shortcuts import render
from Alice.ai import generateChatResponse
from django.http import JsonResponse
from django.views import View



class HomeView(CustomLoginRequiredMixin, View):
    template_name = 'Alice/index.html'

    def get(self, request):
        context = {}
        return render(request, self.template_name, context)

    def post(self, request):
        context = {}
        
        if request.method == 'POST':
            prompt = request.POST.get('prompt')
            response = {}
            response['answer'] = generateChatResponse(prompt)
            return JsonResponse(response)

        return render(request, self.template_name, context)


#def home(request):
#    context={}
#    
#    if request.method == 'POST':
#        prompt = request.POST['prompt']
#        Response = {}
#        Response['answer'] = generateChatResponse(prompt)
#        return JsonResponse(Response)
#
#    return render(request, 'Alice/index.html', context)



#def login(request):
#    context={}
#    return render(request,'login.html',context)
