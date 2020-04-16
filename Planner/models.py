from django.db import models


# This is where database schema is defined

class Course(models.Model):
    #this is the schema for any course added to the database
    ID = models.CharField(primary_key=True,max_length=20) #course ID e.g cisc102
    title = models.TextField(null=True, blank = True) #course title e.g 
    department = models.CharField(max_length=9, null=True, blank = True) #not needed 
    code = models.IntegerField(null=True, blank = True) #not needed
    term = models.CharField(max_length=5,null=True, blank = True) #term(s) offered
    units = models.IntegerField(null=True, blank = True) #how many units is course
    description = models.TextField(null=True, blank = True) #course description

    prereqs = models.ManyToManyField("self", symmetrical= False, related_name='prereqs_rev', through = "Pre") #prereqs for this course, goes through the Pres realtionship
    exclusions = models.ManyToManyField("self", related_name='ex_rev') #exclusions for the course
    recommended = models.ManyToManyField("self", symmetrical= False, related_name='rec_rev') #recommended courses for this course
    coreqs = models.ManyToManyField("self", symmetrical= False, related_name='coreqs_rev', through = "Co") #coreqs for this course, goes through Co

class Pre(models.Model): 
    #the prerequistie realtionship between two courses
    #if you want to add a prereq a to a course b, set course = b and req = a
    course = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True, related_name = "pre_rev") #the course the prereq is for
    req = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True) #the prereq
    option = models.IntegerField(null = True, blank= True) #0 if we absoulutely need this course(i.e no or), 1 if occurs in first OR, 2 in second OR, etc.

class Co(models.Model): 
    #exact same as Pre but for coreqs
    course = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True, related_name = "co_rev")
    req = models.ForeignKey(Course, on_delete= models.SET_NULL, null = True)
    option = models.IntegerField(null = True, blank= True)

class Plan(models.Model):
    #a plan e.g Biomedical Computing 
    name = models.CharField(primary_key=True,max_length=50) #the name of the plan
    units = models.IntegerField() # number of units needed to complete the plan



class Core_Requirement(models.Model):
    #a core requirement for any plan
    name = models.CharField(max_length=20) #the name of the requirement i.e A,B,C etc
    units = models.IntegerField() #the amount of units this requirement requires
    requires = models.ManyToManyField(Course, symmetrical=False,blank= True) #the courses this requirement requires
    belongsTo = models.ForeignKey(Plan, on_delete=models.CASCADE) #the plan this requirement belongs to


class Optional_Requirement(models.Model):
    #an optional requirement for any plan
    opName = models.CharField(max_length=50, null = True, blank = True) #not needed
    opNumber = models.IntegerField() #the options number i.e option 1 option 2 etc
    majorName = models.CharField(max_length = 100, blank = True, null = True) #only for Major plan. Specifies what major option belongs to
    letter = models.CharField(max_length=1) #option letter i.e A,B,C etc
    units = models.IntegerField() #number of units requirement needs 
    requires = models.ManyToManyField(Course, symmetrical=False, blank = True)#the courses this requirement requires
    belongsTo = models.ForeignKey(Plan, on_delete=models.CASCADE)#the plan this requirement belongs to

