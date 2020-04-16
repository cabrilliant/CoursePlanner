from django.db import models


# Create your models here.


class Course(models.Model):
    ID = models.CharField(primary_key=True,max_length=20)
    title = models.TextField(null=True, blank = True)
    department = models.CharField(max_length=9, null=True, blank = True)
    code = models.IntegerField(null=True, blank = True)
    term = models.CharField(max_length=5,null=True, blank = True)
    units = models.IntegerField(null=True, blank = True)
    description = models.TextField(null=True, blank = True)

    prereqs = models.ManyToManyField("self", symmetrical= False, related_name='prereqs_rev', through = "Pre")
    exclusions = models.ManyToManyField("self", related_name='ex_rev')
    recommended = models.ManyToManyField("self", symmetrical= False, related_name='rec_rev')
    coreqs = models.ManyToManyField("self", symmetrical= False, related_name='coreqs_rev', through = "Co")

class Pre(models.Model):
    course = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True, related_name = "pre_rev")
    req = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True)
    option = models.IntegerField(null = True, blank= True)

class Co(models.Model):
    course = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True, related_name = "co_rev")
    req = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True)
    option = models.IntegerField(null = True, blank= True)

class Plan(models.Model):
    name = models.CharField(primary_key=True,max_length=50)



class Core_Requirement(models.Model):
    name = models.CharField(max_length=20)
    units = models.IntegerField()
    requires = models.ManyToManyField(Course, symmetrical=False,blank= True)
    belongsTo = models.ForeignKey(Plan, on_delete=models.CASCADE)


class Optional_Requirement(models.Model):
    opName = models.CharField(max_length=50, null = True, blank = True)
    opNumber = models.IntegerField()
    letter = models.CharField(max_length=1)
    units = models.IntegerField()
    requires = models.ManyToManyField(Course, symmetrical=False, blank = True)
    belongsTo = models.ForeignKey(Plan, on_delete=models.CASCADE)

