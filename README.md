<h1>Queens School of Computing Course/Degree Path Planning tool</h1>
 An open source degree-path planning web application created for my undergraduate project at Queen's University
 
 <h3> Introduction </h3> 
The Queen’s University School of Computing Course Planner is an open-source project created to aid School of Computing students in planning their degree path. It was created to provide a single organized space for students to view all necessary information on the different degree programs offered, as well as allow students to visibly plan their courses based on the requirements they need to successfully complete their degree of choice. The application additionally can recommend courses the student may be interested in based on almost any other course stored in the application, as well as provide the student with dynamic updates that show degree progress as well as alert the student of any missing pre/corequisites, or any violated exclusions between courses. Currently, the program only contains information for School of Computing plans and courses that appear within them, however the framework allows for other departments to easily be added to the application

<h3>How to run the program</h3>
To run the program, first you will need to install python3.8 and django: https://www.djangoproject.com/, https://www.python.org/
Once install, open command prompt and cd to the directory "CoursePlanner" (the top level one) you should see a file called manage.py here. if you dont not, you are in the wrong folder.
Next, simply type: python manage.py runserver. This will start the server and provide you with the local address at which you can access the web application.

<h3> break down of the code </h3>
All the important parts of the code are heavily commented, and anyone with django experience should be able to understand it quite easily. For those looking to add to the code I highly suggest watching django tutorial if you are not familiar with it. Here is a brief breakdown of the important parts of code for this who do not wish to learn django:

-	Planner/Templates/planner/<b>index.html</b>:
Contains the HTML source code combined with Django template language. Anywhere you see the tags {{ }} or {% %} means anything in between those tags is part of Django template language, and is there to dynamically generate HTML code based on what is in the database. Almost everything you see as a user of the application is generated here, unless it requires JavaScript to generate. If additional webpages are to be made as part of the application, there HTML files should also be stored in this folder. Some of the functions (or tags as Django calls them) inside curly brackets can be found in planner/templatetags/extras.py

-	Planner/static
Contains all the static files, such as JavaScript and CSS files. The JavaScript code often makes AJAX calls to the backend, these calls are handled in the Planner/views.py file. All JavaScript functions are heavily commented to detail what they do, and the CSS is straight forward to understand (mostly id selections where the id is self-explanatory). 
-	Planner/<b>views.py</b>
This is where all the backend logic occurs. You can think of a “view” in Django as simply a page of the web application. Each view is defined as a Python function. There is one view defined here that is visible to the users (the main application view), which is handled by the “plan” function. This function essentially just handles the request to the main page and renders the HTML template as a result of that request, as well as passing in some database context the Django templating language needs. The rest of the views defined here all handle AJAX calls from the JavaScript files, and can do things such as return all courses matching a search query or telling us how much we need to update a degree progress bar on a course add. These additional views do not have an HTML template rendered to them. To map a view here to a URL, you must do this in the  Planner/urls.py file.
-	Planner/<b>urls.py</b> (different from CoursePlanner/urls.py)
Here is where all the URL mapping occurs. The first argument in each “path” statement here is the relative URL we want to map, and the second argument is the view from views.py  that we want to map it to
-	Planner/<b>models.py</b>
Here is where the database schema is defined. Any changes to database schema should be made here. Each class represents what it is named after (i.e. Course is the schema for courses). Each attribute within the class represents an attribute of the object/relationship it represents. The classes themselves and their attributes are all heavily commented.

<h3> The admin page <h3>
 The admin page can be accessed by simply adding /admin to the end of the local adress. Currently the user name and password are both admin. 
