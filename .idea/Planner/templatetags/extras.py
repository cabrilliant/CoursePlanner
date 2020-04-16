from django import template
from Planner.models import*
from django.db.models import Max
register = template.Library()

@register.simple_tag
def getPres(course):
    if len(Pre.objects.filter(course=course)) != 0:
        preOb = Pre.objects.filter(course=course).order_by('option')
        return preOb
    else:
        return []

@register.simple_tag
def getCos(course):
    if len(Co.objects.filter(course=course)) != 0:
        coOb = Co.objects.filter(course=course).order_by('option')
        return coOb
    else:
        return []

@register.simple_tag
def in_plan(plan):
    planOb = Plan.objects.get(name = plan)
    return Core_Requirement.objects.filter(belongsTo=planOb)

@register.simple_tag
def in_planOp(plan):
    planOb = Plan.objects.get(name = plan)
    return Optional_Requirement.objects.filter(belongsTo=planOb)

@register.simple_tag
def idEqual(ID):
    cOb = Course.objects.get(ID = ID)
    return cOb
@register.simple_tag
def maxOption(plan):
    reqs = Optional_Requirement.objects.filter(belongsTo=plan)
    max1 = reqs.aggregate(Max('opNumber'))
    return (max1['opNumber__max']+1)

@register.filter(name='times')
def times(number):
    return range(number)

@register.simple_tag
def coursePre(ID):
    cOb = Course.objects.get(ID=ID)
    preOb = Pre.objects.filter(course=cOb)
    return preOb.req.all()


@register.simple_tag
def getName(plan,opNum):
    inPlan = Optional_Requirement.objects.filter(belongsTo=Plan)
    op = Optional_Requirement.objects.filter(opNumber=opNum)
    if len (op) > 0:
        return op.first().opName
    else:
        return "none"

@register.simple_tag
def falseVar():
    return False

@register.simple_tag
def trueVar():
    return True