# Generated by Django 3.0.3 on 2020-04-15 23:39

from django.db import migrations

from django.db import migrations
from Planner.models import*


def parse(req, lis):
    space = req.find(" ")
    if space == -1:  # no more spaces left
        lis.append(req)

    else:
        before = req[0:space]  # everything before the first space
        lis.append(before)
        parse(req[space + 1::], lis)

def condense(lis):
    #takes a list and returns elements as one string
    string = ""

    for element in lis[2::]:
        string = string + " " + element

    return string





def build(apps, schema_editor):
    snIn = open("Planner\dataFILES\MAJORS.txt", "r", errors='replace')
    planName = ""
    while True:
        if planName == "DONE":
            break
        planName = snIn.readline().rstrip()
        print("planName",planName)
        if planName == "":
            print("here")
            planName = snIn.readline()
        if planName == "DONE":
            break
        activePlan = Plan.objects.create(name = planName, units = 72)
        snIn.readline() #skip the CORE line

        while True: #core reqs
            reqLine = snIn.readline().rstrip()
            print("reqLine",reqLine)
            if reqLine == "ENDCORE":
                break
            reqList = []
            parse(reqLine,reqList)
            print("creating Core ob with name", reqList[0],"units",reqList[1],"belonging to",activePlan.name)
            reqOb = Core_Requirement.objects.create(
                name = reqList[0],
                units = int(reqList[1]),
                belongsTo = activePlan
            )
            count = 0
            for r in reqList[2::]:
                if r[0] == "*":
                    req = condense(reqList)
                    c = Course.objects.create(ID = req)
                    reqOb.requires.add(c)
                    break

                else: #we dont need the first two elements(letter and units)
                    if len(Course.objects.filter(ID=r)) == 0: #req doesnt yet exsist
                        print("creating course",r)
                        c = Course.objects.create(
                            ID=r)
                        reqOb.requires.add(c)
                        print("added core course", c.ID, )
                        reqOb.save()
                    else:
                        print("adding course",r)
                        cOb = Course.objects.get(ID=r) #get the object for the course
                        reqOb.requires.add(cOb)
                        print("added core course", cOb.ID, )
                        reqOb.save()
                count +=1
            reqOb.save()

        while True: #optional reqs
            op = snIn.readline().rstrip()
            print("opLine",op)
            if op == "ENDPLAN" or op =="":
                break
            print ("len",len(op))
            if len(op) > 6:
                print("here")
                number = op[6]
            else:
                number = 1
            major = snIn.readline().rstrip()
            print("major name",major)
            while True:
                reqLine = snIn.readline().rstrip()
                print("reqLine1",reqLine)
                if reqLine[0:9] == "ENDOPTION" or reqLine == "ENDPLAN":
                    break
                reqList = []
                parse(reqLine, reqList)
                print("list",reqList)
                character = reqList[0]
                units = reqList[1]
                print("creating optional req with number",number, "letter",character,"units",units,"belonging to",activePlan.name)
                reqOb = Optional_Requirement.objects.create(
                    opNumber = number,
                    majorName = major,
                    letter = character,
                    units = units,
                    belongsTo= activePlan)
                count = 0
                for r in reqList[2::]:
                    if r[0] == "*":
                        req = condense(reqList)
                        if len(Course.objects.filter(ID=req)) == 0: #req doesnt yet exsist
                            c = Course.objects.create(ID=req)
                            print("creating and adding to optional reqs",req)
                            reqOb.requires.add(c)
                            reqOb.save()
                        else:
                            print("adding to optional reqs", req)
                            cOb = Course.objects.get(ID=req)  # get the object for the course
                            reqOb.requires.add(cOb)
                            reqOb.save()

                        break
                    else:
                        if len(Course.objects.filter(ID=r)) == 0: #req doesnt yet exsist
                            print("creating and adding to optional reqs", r)
                            c = Course.objects.create(
                                ID=r)
                            reqOb.requires.add(c)
                            reqOb.save()
                        else:
                            cOb = Course.objects.get(ID=r)  # get the object for the course
                            print("adding to optional reqs", r)
                            reqOb.requires.add(cOb)
                            reqOb.save()
                    count +=1
                reqOb.save()


class Migration(migrations.Migration):

    dependencies = [
        ('Planner', '0001_optional_requirement_majorname'),
    ]

    operations = [migrations.RunPython(build)
    ]
