# Generated by Django 3.0.3 on 2020-02-19 01:02

from django.db import migrations
from Planner.models import Course

temp = []


def parse(req, lis):
    space = req.find(" ")
    if space == -1:  # no more spaces left
        lis.append(req)

    else:
        before = req[0:space]  # everything before the first space
        lis.append(before)
        parse(req[space + 1::], lis)


def buildMissing(apps, schema_editor):

    snIn = open("Planner\dataFILES\MISSINGCOURSES.txt", "r", errors='replace')

    while True:
        ID1 = snIn.readline().rstrip()
        if ID1 == "":
            break
        units1 = snIn.readline().rstrip()
        title1 = snIn.readline().rstrip()
        department1 = ID1[0:4]
        code1 = ID1[4::]
        term1 = snIn.readline().rstrip()

        # exclusions
        exclusionList = []
        exclusionLine = snIn.readline().rstrip()
        parse(exclusionLine, exclusionList)

        # preReqs
        preList = []
        preLine = snIn.readline().rstrip()
        parse(preLine, preList)

        # CoReqs
        coList = []
        coLine = snIn.readline().rstrip()
        parse(coLine, coList)

        # Recommended
        recList = []
        recLine = snIn.readline().rstrip()
        parse(recLine, recList)

        description1 = snIn.readline().rstrip()

        skip = "skip"
        while skip.rstrip() != "":
            skip = snIn.readline()

        # build course object

        if len(Course.objects.filter(ID=ID1)) == 0:  # course not in list yet
            print("creating course with ID",ID1)
            c = Course.objects.create(
                ID=ID1,
                title=title1,
                department=department1,
                code=code1,
                term=term1,
                units = units1)
        else:  # course is already in list, just update
            print("updating Course with ID",ID1)
            c = Course.objects.get(ID=ID1)
            c.title = title1
            c.department = department1
            c.code = code1
            c.term = term1
            c.description = description1
            c.units = units1
            c.save()
        # exclusions
        for ex in exclusionList:
            if len(Course.objects.filter(ID=ex)) > 0:  # exclusion course already exsists
                exclus = Course.objects.get(ID=ex)
                c.exclusions.add(exclus)
            else:  # exclusion course does not exsist yet so we must create it first
                print("creating Course with ID",ex)
                exclus = Course.objects.create(ID=ex)
                c.exclusions.add(exclus)

        # prereqs
        count = 0
        for pre in preList:
            if pre == "OR":
                count +=1
            elif len(Course.objects.filter(ID=pre)) > 0:  # exclusion course already exsists
                prereq = Course.objects.get(ID=pre)
                c.prereqs.add(prereq, through_defaults = {'option': count})
            else:  # exclusion course does not exsist yet so we must create it first
                print("creating Course with ID", pre)
                prereq = Course.objects.create(ID=pre)
                c.prereqs.add(prereq, through_defaults = {'option': count})

        # coreqs
        count = 0
        for co in coList:
            if co == "OR":
                count+=1
            elif len(Course.objects.filter(ID=co)) > 0:  # exclusion course already exsists
                coreq = Course.objects.get(ID=co)
                c.coreqs.add(coreq, through_defaults = {'option': count})
            else:  # exclusion course does not exsist yet so we must create it first
                print("creating Course with ID", co)
                coreq = Course.objects.create(ID=co)
                c.coreqs.add(coreq, through_defaults = {'option': count})

        # recommended
        for rec in recList:
            if len(Course.objects.filter(ID=rec)) > 0:  # exclusion course already exsists
                recreq = Course.objects.get(ID=rec)
                c.recommended.add(recreq)
            else:  # exclusion course does not exsist yet so we must create it first
                print("creating Course with ID", rec)
                recreq = Course.objects.create(ID=rec)
                c.recommended.add(recreq)

        c.save()

    snIn.close()

class Migration(migrations.Migration):

    dependencies = [
        ('Planner', 'removeNone'),
    ]

    operations = [migrations.RunPython(buildMissing)
    ]
