from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from .models import*
import json
from django.template.loader import render_to_string
courses = Course.objects.all()
pre = Pre.objects.all()
# co = Co.objects.all(),
# plans = Plan.objects.all(),
# core_reqs = Core_Requirement.objects.all()
# op_reqs = Optional_Requirement.objects.all()
# #Additonal context needed
preDic = {}
coDic = {}
for course in courses:
    reqList = []
    reqs = Pre.objects.filter(course=course)
    for req in reqs:
        reqList.append(req)
    preDic['course'] = course;
    preDic['reqs'] = reqList;

for course in courses:
    coList = []
    reqs = Co.objects.filter(course=course)
    for req in reqs:
        reqList.append(req)
    coDic['course'] = course;
    coDic['reqs'] = coList;

# Create your views here.
def plan(request):
    context = {
        'courses': Course.objects.all(),
        'pre_rel': preDic,
        'co_rel': coDic,
        'plans': Plan.objects.all(),
        'core_reqs': Core_Requirement.objects.all(),
        'op_reqs': Optional_Requirement.objects.all()
    }
    return render(request, 'planner/index.html',context)


def validate_drop(request):
    '''validates the drop of a course'''
    if request.is_ajax() and request.POST: #check if we can drop the course
        msg = "drop okay!"  #default
        bool = "true"  #default
        course = request.POST.get("course")
        inplan = request.POST.get("inplan")

        #build the requires query sets
        courseOb = Course.objects.get(ID = course)
        exclusions = courseOb.exclusions.all()
        prereqs = Pre.objects.filter(course = courseOb)

        #check no exlcusions are violated
        if exclusions is not None:
            for ex in exclusions:
                if ex.ID in inplan:
                    msg = ("drop failed because of exclusion between: ", course, " and ", ex.ID)
                    bool = "false"

        #check all pre reqs are met
        max = 0
        for ob in prereqs:
            if ob.option > max:
                max = ob.option
        for ob in prereqs:
            if ob.option == 0:  # this is a require prereq, no option to replace with a different course
                if ob.req.ID not in inplan:
                    msg = ("drop failed because of missing prereq ", ob.req.ID, " for course ", course)
                    bool = "false"

        for i in range (1,max+1):
                valid = False
                options = prereqs.filter(option = i)
                for ob in options: #for options we only need one of the courses
                    if ob.req.ID in inplan:
                        valid = True
                if valid == False:
                    msg = ("drop failed because of missing prereqs, need one of the following: ")
                    bool = "false"
                    for ob in options:
                        msg = msg + ob.req.ID + " "

        return HttpResponse(msg,bool)
    else:
        raise Http404
