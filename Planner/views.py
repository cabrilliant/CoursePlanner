from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from .models import*
from django.db.models import Q
import json
from django.template.loader import render_to_string
courses = Course.objects.all()
pre = Pre.objects.all()
# co = Co.objects.all(),
# plans = Plan.objects.all(),
core_reqs = Core_Requirement.objects.all()
op_reqs = Optional_Requirement.objects.all()
# #Additonal context needed
preDic = {}
coDic = {}


# Create your views here.
def plan(request):
    #main view i.e the homepage. all this function does is render template and pass through context
    context = {
        'courses': Course.objects.all(),
        'plans': Plan.objects.all(),
        'core_reqs': Core_Requirement.objects.all(),
        'op_reqs': Optional_Requirement.objects.all()
    }
    return render(request, 'planner/index.html',context)



def reversePres(request):
    #returns all courses the course is a prereq for
    if request.is_ajax():
        course1 = request.GET.get("course") #get the course to lookup from AJAX call
        recList = []
        courseOb = Course.objects.get(ID = course1) #get the course object for this course

        #return a list of all courses this course is a prereq for
        for c in courseOb.prereqs_rev.all():
            recList.append(c.ID)
        return JsonResponse(recList, safe=False)
    else:
        raise Http404


def reqBarHandler(request):
    #this handels all the logic needed to update a requirement bar on a course drop
    #it takes a course from the AJAX call and returns a list coantaining 3 things:
    #The names of all the requirements the course belongs to
    #the names of all the plans these requirements belong to
    #the amount of units of the course(3 or 6)

    if request.is_ajax() and request.POST:
        lookup = request.POST.get("course")
        courseOb = Course.objects.get(ID = lookup)
        planNames = []
        reqNames = []
        for req in core_reqs:
            #check for core requirements the course belongs to and save them as well as the plans the belong to
            if courseOb in req.requires.all():
                planName = req.belongsTo.name
                reqName = req.name
                planNames.append(planName)
                reqNames.append(reqName)

        for req in op_reqs:
            #check for optional requirements the course belongs to and save them as well as the plans the belong to
            if courseOb in req.requires.all():
                planName = req.belongsTo.name
                reqName = req.opNumber
                planNames.append(planName)
                reqNames.append(reqName)

        returnVal = [planNames,reqNames,courseOb.units]
        return JsonResponse(returnVal, safe=False)
    else:
        raise Http404

def search(request):
    #search bar logic
    #takes a query and returns all course ID's matching that query
    if request.is_ajax() and request.GET:
        query = request.GET.get("query")

        #get course objects that match the query
        results = Course.objects.filter(Q(ID__icontains=query)).exclude(Q(ID__icontains="*")).exclude(Q(ID__icontains = "+")).exclude(Q(ID__icontains="4U")).order_by("ID")
        resultList = []
        for r in results:
            #add the ID's of the course objects to a list to return
            resultList.append(r.ID)
        return JsonResponse(resultList, safe=False)
    else:
        raise Http404

def getUnits(request):
    #takes a course from ajax call and returns the amount of units its worth
    if request.is_ajax() and request.GET:
        c = request.GET.get("course")
        if len(c) > 7:
            c = c[0:7]
        unit = Course.objects.get(ID = c).units

        
        return HttpResponse (unit)
    else:
        raise Http404


def getRec(request):
    #returns the reccommended courses for the course
    #returns false if no recommendations for the course

    if request.is_ajax() and request.POST:
        course1 = request.POST.get("course")
        courseOb = Course.objects.get(ID=course1)
        rec = courseOb.recommended.all()
        if len(rec) == 0:#no reccommendations for this course
            return JsonResponse("false",safe = False)
        else:
            recommended = []
            for item in rec: #transform query set of recomendations into list
                recommended.append(item.ID)
            return JsonResponse(recommended,safe = False)
    else:
        raise Http404

def validate_drop(request):
    #backend logic for validating a drop i.e making sure prereqs and coreqs are met and exlcusions are not violated
    #if you were to add code to implement term checking you could do it here or reference the function for it here

    if request.is_ajax() and request.POST: #check if we can drop the course
        msg = "drop okay!"  #default
        bool = "true"  #default
        cont = True;

        course = request.POST.get("course") #the course were are trying to validate
        inplan = eval(request.POST.get("inplan")) #the courses currently in the planner
        position = request.POST.get("pos") #the postion we are trying to drop the course into
        posList = eval(request.POST.get("posList")) #a list containing the postions of each course in inPlan, matched by index
        dropYear = int(position[1]) #the year we are trying to drop the course into (1,2,3 or 4)
        dropTerm = position[0] #the term we are dropping into (f or w)

        #build the requires query sets
        courseOb = Course.objects.get(ID = course) #the course object
        exclusions = courseOb.exclusions.all() #exlucsion for this course
        prereqs = Pre.objects.filter(course = courseOb) #prereqs for this course
        coreqs = Co.objects.filter(course = courseOb) #coreqs for this course
        rec= courseOb.recommended.all() #recommendations for this course
        recommended = []
        for item in rec:
            recommended.append(item.ID)

        #check no exlcusions are violated
        if exclusions is not None:
            for ex in exclusions: #iterate through the course we are trying to drops exlusions
                if ex.ID in inplan: #if an exclusion is in the plan the drop fails
                    msg = ("drop failed because of exclusion between: "+ course+ " and " + ex.ID) #msg to display to user
                    bool = "false"
                    cont = False; #no need to continue checking the rest


        if cont == True: #only continue if no exclusions are violated
            #check all pre reqs are met
            max = 0
            for ob in prereqs:
                if ob.option > max:
                    #find out how many options (i.e OR's) we have for the prereqs
                    max = ob.option

            for ob in prereqs: #for course in prereq list
                if ob.option == 0:  # this is a require prereq, no option to replace with a different course (i.e no OR)
                    if ob.req.ID not in inplan: #since this is required if its not in plan drop fails
                        msg = ("drop failed because of missing prereq: "+ ob.req.ID + " for course " + course) #msg to display to user
                        bool = "false"
                        cont = False;
                    elif ob.req.ID in inplan: #if the prereq is in the plan still need to make sure it appears BEFORE the postion
                    #we are trying to drop into
                        index = inplan.index(ob.req.ID) #index of the element to look up its position in the planner
                        inPos = posList[index] #the postion of the prereq in the planner
                        reqYear = int(inPos[1]) #the year the prereq is in
                        reqTerm = inPos[0] #term prereq is in

                        if reqYear > dropYear: #if the prereq course appears in a year later than the year we are trying to drop into, drop fails
                            msg = ("drop failed because prereq "+ ob.req.ID + " must appear atleast a term BEFORE " + course)#msg to display to user
                            bool = "false"
                            cont = False;
                        elif reqYear == dropYear: #courses appear in same year, need to check it appears in the term before though
                            if dropTerm == "f": # prereq cannot be in the same year if the course we are dropping is dropped in fall
                                msg = ("drop failed because prereq "+ ob.req.ID + " must appear atleast a term BEFORE " + course)#msg to display to user
                                bool = "false"
                                cont = False;
                            elif dropTerm == "w":
                                if reqTerm == "w": #if we are dropping into winter the prereq cannot appear in winter of the same year
                                    msg = ("drop failed because prereq "+ ob.req.ID + " must appear atleast a term BEFORE " + course)#msg to display to user
                                    bool = "false"
                                    cont = False;
                        # if inYear > posYear then pre req is fine

        if cont == True:
            for i in range (1,max+1):
                    valid = False 
                    options = prereqs.filter(option = i)
                    for ob in options: #i.e for course in the current OR
                    #for options we only need one of the courses
                        if ob.req.ID in inplan:
                            index = inplan.index(ob.req.ID)  # index of the element to look up its position in the planner
                            inPos = posList[index]
                            reqYear = int(inPos[1])
                            reqTerm = inPos[0]
                            if reqYear < dropYear: #prereq appears before so this is ok
                                valid = True #found a valid preqreq
                            elif reqYear == dropYear:
                                if dropTerm == "w":
                                    if reqTerm == "f":
                                        valid = True; #found a valid prereq

                    if valid == False: #we didnt find a valid prereq in the planner
                        msg = ("drop failed because of missing prereqs, need one of the following: ")
                        bool = "false"
                        for ob in options:
                            msg = msg + ob.req.ID + " "

        if cont == True:
            # check all co reqs are met
            #logic is generally the same as prereqs except need to check if it appears in the SAME TERM or BEFORE as opposed to only before
            max = 0
            for ob in coreqs:
                if ob.option > max:
                    max = ob.option
            for ob in coreqs:
                if ob.option == 0:  # this is a require coreq, no option to replace with a different course (i.e no OR)
                    if ob.req.ID not in inplan:
                        msg = ("drop failed because of missing coreq " +  ob.req.ID +  " for course " + course)
                        bool = "false"
                        cont = False;
                    elif ob.req.ID in inplan:
                        index = inplan.index(ob.req.ID)  # index of the element to look up its position in the planner
                        inPos = posList[index]
                        reqYear = int(inPos[1])
                        reqTerm = inPos[0]
                        if reqYear > dropYear:  # if the prereq course appears in a year later than the year we are trying to drop into, drop fails
                            msg = ("drop failed because coreq " + ob.req.ID + " must appear in the same term or a term BEFORE " +  course)
                            bool = "false"
                            cont = False;
                        elif reqYear == dropYear:
                            if dropTerm == "f":
                                if reqTerm == "w": #coreq can not appear in a later term in the same uear
                                    msg = ( "drop failed because coreq " + ob.req.ID + " must appear in the same term or a term BEFORE " +  course)
                                    bool = "false"
                                    cont = False;
                                #if reqTerm == F we are ok

                        # if inYear > posYear then co req is fine

        if cont == True:
            for i in range(1, max + 1):
                valid = False
                options = coreqs.filter(option=i)
                for ob in options:  # for options we only need one of the courses
                    if ob.req.ID in inplan:
                        index = inplan.index(ob.req.ID)  # index of the element to look up its position in the planner
                        inPos = posList[index]
                        reqYear = int(inPos[1])
                        reqTerm = inPos[0]
                        if reqYear < dropYear:  # coreq appears before so this is ok
                            valid = True
                        elif reqYear == dropYear:
                            if dropTerm == "w":
                                valid = True;
                            elif dropTerm == "f" and reqTerm == "f":  #coreq appears in same term so ok
                                valid = True

                if valid == False:
                    msg = ("drop failed because of missing coreqs, need one of the following: ")
                    bool = "false"
                    for ob in options:
                        msg = msg + ob.req.ID + " "

        returnval = [msg,bool,recommended]
        return JsonResponse(returnval, safe = False)
    else:
        raise Http404
