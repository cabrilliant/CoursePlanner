//globals

var inPlan = []; //all the courses that are currently in the planner
var pos = []; //the position within the planner. Index corresponds to index of inPlan
window.bar = "";


function changeOp (ev){
    //controls the logic for when we change options via the dropdown menu
    var opList = ev.target;
    var selected = opList.options[opList.selectedIndex].value;
    console.log(selected);
    var hideme = opList.parentNode.children;
    console.log(hideme);
    //display the right option display and hide the rest of them
    for (var i = 1;  i < hideme.length; i++ ){
        if (hideme[i].id == selected){
            console.log("here");
            hideme[i].style.display = "block";
        }
        else{
        hideme[i].style.display = "none";
        }
    }
    
}

//logic to add recomendations to the sidebar
function addRecoms(course){
    //make an ajax call to get the recommendations
	 $.ajax({
          type: "GET",
          url: "/reversePres/",
          data: {
              "course" : course
          },
        success: function(data){ //data is a list containing every recommendation for the course
        	console.log("called");
             recomList = data;
             var insertList = document.getElementById("recom-area"); 
             insertList.innerHTML = ''; //reset contents of recommendation area
             console.log(insertList);
             if (recomList.length > 0){
                //Create all display but the courses
             	var firstTxt = document.createTextNode("Recommendations based on "+ course);
             	var listEle = document.createElement("li");
             	listEle.textContent = "Recommendations based on "+ course;
             	listEle.setAttribute("onclick","expand(event)");
             	listEle.style.cursor = "pointer";
             	insertList.append(listEle);


                //add the courses to the recommendation area
             	var innerList = document.createElement("ul");
             	for (var i = 0; i < recomList.length; i++){
             		var txt = document.createTextNode(recomList[i]);
             		var li = document.createElement("li");
             		li.appendChild(txt);
             		innerList.appendChild(li);

             	}
             	insertList.append(innerList);
        	 }
              
          }//end success fn
    });//end ajax

	//first we are going to add the courses actual recommendations (i.e the ones that appear on the course webpage)

}
//Menu Toggle Script NO LONGER USED

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

    //Degree Dropdown Menu Script


$(document).ready(function(){
    $("select#planSelect").change(function(){
        $(this).find("option:selected").each(function(){
            var optionValue = $(this).attr("value");
            if(optionValue){
                $(".container").not("#" + optionValue).hide();
                $("#" + optionValue).show();
            } else{
                $(".container").hide();
            }
        });
    }).change();
});

//logic to switch views from requirement view to search view
function switchView(){
    document.getElementById("switchbutton").style.display = "none";
    var containers = document.getElementsByClassName("container");
    var drop = document.getElementById("planSelect");
    drop.style.display = "none";
    for (var i = 0; i < containers.length; i++){
        console.log(containers[i].id);
        if (containers[i].id == "main-search-container"){
            
            containers[i].style.display = "flex";
        }
        else{
            containers[i].style.display = "none";
        }
    }
}

//logic to switch views from search view to requirement view
function switchViewBack(){
    document.getElementById("switchbutton").style.display = "block";
    var containers = document.getElementsByClassName("container");
    var show = document.getElementById("planSelect");
    var selected = show.options[show.selectedIndex];

    show.style.display = "inline-block";
    
    for (var i = 0; i < containers.length; i++){
        if (containers[i].id == selected.value){
            containers[i].style.display = "flex";
        }
        else{
            containers[i].style.display = "none";
        }
    }
}



//functions for the introduction overlay
function on() {
  document.getElementById("overlay-wrapper").style.display = "block";
}

function off() {
  document.getElementById("overlay-wrapper").style.display = "none";
}


//intro form submission script which generates the correct years and such for the planner
$(document).on('submit','#yearForm', function(e){
    e.preventDefault();
    var form = document.getElementById("yearForm");
    var year = form.elements[0].value; //the year the student is in


    //now update the planner to have the right years
    var overlay = document.getElementById("overlay");
    var y1 = document.getElementById("y1Head");
    var y2 = document.getElementById("y2Head");
    var y3 = document.getElementById("y3Head");
    var y4 = document.getElementById("y4Head");
    var date = new Date().getFullYear();
    //make the search area visible
    var selected = document.getElementById("selected"); //the area to display selected courses
    selected.innerHTML = ""; //wipe the area of previous content
     var yearList = document.createElement("ul");
     selected.appendChild(yearList);
    if (year == "year1"){
        y1.textContent = date;
        y2.textContent = date +1;
        y3.textContent = date + 2;
        y4.textContent = date + 3;
        var termList = document.createElement("ul");
        var y1li = document.createElement("li");
        var y1txt = document.createTextNode("First Year");
        y1li.appendChild(y1txt);
        yearList.appendChild(y1li);
        y1li.appendChild(termList);
        var wli = document.createElement("li");
        wli.id = "y1w";
        var fli = document.createElement("li");
        fli.id = "y1f"
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
        wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

    }
    else if(year == "year2"){
        y1.textContent = date - 1;
        y2.textContent = date;
        y3.textContent = date + 1;
        y4.textContent = date + 2;
        var termList = document.createElement("ul");
        var y1li = document.createElement("li");
        var y1txt = document.createTextNode("First Year");
        y1li.appendChild(y1txt);
        yearList.appendChild(y1li);
        y1li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y1w";
        fli.id = "y1f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

        var termList = document.createElement("ul");
        var y2li = document.createElement("li");
        var y2txt = document.createTextNode("Second Year");
        y2li.appendChild(y2txt);
        yearList.appendChild(y2li);
        y2li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y2w";
        fli.id = "y2f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

    }
    else if(year == "year3"){
        y1.textContent = date - 2;
        y2.textContent = date - 1;
        y3.textContent = date ;
        y4.textContent = date + 1;

        var termList = document.createElement("ul");
        var y1li = document.createElement("li");
        var y1txt = document.createTextNode("First Year");
        y1li.appendChild(y1txt);
        yearList.appendChild(y1li);
        y1li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y1w";
        fli.id = "y1f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

        var termList = document.createElement("ul");
        var y2li = document.createElement("li");
        var y2txt = document.createTextNode("Second Year");
        y2li.appendChild(y2txt);
        yearList.appendChild(y2li);
        y2li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y2w";
        fli.id = "y2f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

        var termList = document.createElement("ul");
        var y3li = document.createElement("li");
        var y3txt = document.createTextNode("Thrid Year");
        y3li.appendChild(y3txt);
        yearList.appendChild(y3li);
        y3li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y3w";
        fli.id = "y3f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);
    }
    else if(year == "year4"){
        y1.textContent = date - 3;
        y2.textContent = date - 2;
        y3.textContent = date - 1;
        y4.textContent = date ;

        var termList = document.createElement("ul");
        var y1li = document.createElement("li");
        var y1txt = document.createTextNode("First Year");
        y1li.appendChild(y1txt);
        yearList.appendChild(y1li);
        y1li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y1w";
        fli.id = "y1f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

        var termList = document.createElement("ul");
        var y2li = document.createElement("li");
        var y2txt = document.createTextNode("Second Year");
        y2li.appendChild(y2txt);
        yearList.appendChild(y2li);
        y2li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y2w";
        fli.id = "y2f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

        var termList = document.createElement("ul");
        var y3li = document.createElement("li");
        var y3txt = document.createTextNode("Thrid Year");
        y3li.appendChild(y3txt);
        yearList.appendChild(y3li);
        y3li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
        wli.id = "y3w";
        fli.id = "y3f";
        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);

        var termList = document.createElement("ul");
        var y4li = document.createElement("li");
        var y4txt = document.createTextNode("Fourth Year");
        y4li.appendChild(y4txt);
        yearList.appendChild(y4li);
        y4li.appendChild(termList);
        var wli = document.createElement("li");
        var fli = document.createElement("li");
         wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        wli.id = "y4w";
        fli.id = "y4f";

        wli.appendChild(document.createTextNode("Winter"));
        fli.appendChild(document.createTextNode("Fall"));
         wli.appendChild(document.createElement("ul"));
        fli.appendChild(document.createElement("ul"));
        wli.setAttribute("onclick","expand(event)");
        fli.setAttribute("onclick","expand(event)");
        termList.appendChild(fli);
        termList.appendChild(wli);
    }




    //create the instructions
    var insertArea = document.getElementById("insert-area");
    insertArea.innerHTML = ""; //clear previous
    var para = document.createElement("p");
    para.appendChild(document.createTextNode("Please enter your classes for: Year 1 Fall (double click to add or remove a course)"));
    para.appendChild(document.createTextNode("If your course does not appear, press the 'Add Elective' Button"));
    para.id = "introPara";
    insertArea.appendChild(para);
    //create the finsihed adding button
    var button = document.createElement("button");
    button.innerHTML = "Finished Adding This Term";
    button.id = "doneAddingButton";
    button.setAttribute("onclick","nextTerm(event)");
    insertArea.append(button);
    document.getElementById("search-cover").style.display = "none";

    var button2 = document.createElement("button");
    button2.innerHTML = "Add Elective";
    button2.id = "addElectiveButton";
    button2.setAttribute("onclick","addElective(event)");
    insertArea.append(button2);


    //declare globals needed
    window.studYear = year; //the year the student is in
    window.activeTerm = "y1f"; //set the active year to first year fall. Used for the intro selection
}); //end intro from submission



//introduction screen search bar logic, just adds the courses from query to the search display
$(document).on('submit','#intro-search', function(e) {

    e.preventDefault(); //stop the page from refreshing
    var form = document.getElementById("intro-search");
    var query = form.elements[0].value; //the query to search



    $.ajax({
          type: "GET",
          url: "/search/",
          data: {
              "query" : query
          },
        success: function(data){ //data is a list containing every course matching the query
              var area = document.getElementById("search-area");
              area.innerHTML = ""; //reset previous results
                var list = document.createElement("ul");
                area.appendChild(list);
              for (var index in data){
                  var txt = document.createTextNode(data[index]);
                  var li = document.createElement("li");
                  li.appendChild(txt);
                  list.appendChild(li);
                  li.setAttribute("ondblclick","introCourseAdd(event)"); //give the courses the click event
              }
          }//end success fn
    });//end ajax

});//end intro search logic






// same as above but for the main search bar 
$(document).on('submit','#main-search', function(e) {

    e.preventDefault(); //stop the page from refreshing
    var form = document.getElementById("main-search");
    var query = form.elements[0].value; //the query to search



    $.ajax({
          type: "GET",
          url: "/search/",
          data: {
              "query" : query
          },
        success: function(data){ //data is a list containing every course matching the query
              var area = document.getElementById("main-search-insert");
              area.innerHTML = ""; //reset previous results
              for (var index in data){
                  var txt = document.createTextNode(data[index]);
                  var li = document.createElement("li");
                  li.appendChild(txt);
                  area.appendChild(li);
                  li.setAttribute("draggable","true"); //give the courses the click event
                  li.setAttribute("ondragstart","drag(event)"); //give the courses the click event
                  li.setAttribute("onclick","displayCourse(event)");
              }
          }//end success fn
    });//end ajax

});//end main search logic


//the logic for adding Electives in the introduction screen
async function addElective(e){
    var cont = true;
    var counter = window.introCount;
     let promise = new Promise((resolve, reject) => {
         if (window.introCount >= 5) {
                 cont = false;
                 alert("can not add more than 5 courses per term");

             }

         else {
             if (cont == true) {

                 var active = document.getElementById(window.activeTerm); //this is the position in the list that we want to add the courses under
                 var listEle = document.createElement("li");
                 var course = document.createTextNode("Elective");
                 listEle.appendChild(course);
                 listEle.setAttribute("ondblclick", "introCourseRemove(event)"); //add the remove event to the course
                 active.children[0].appendChild(listEle); //add course to list
                 window.introCount += 1;
             }
         }
          resolve(); //resolve the promise
     });//end promise


    await promise;
    //now we have to add the course to the planner
    if (cont == true) {
        var year = window.activeTerm[1];
        var term = window.activeTerm[2];
        var lookupClass = term.concat(year);
        var dropLocations = document.getElementsByClassName(lookupClass); //these are the potential slots we can put the course in
        var found = false;


        var course = document.createTextNode($(e.target).text());
        let promise2 = new Promise((resolve, reject) => {
            for (var i = 0; i < dropLocations.length; i++) {
                if (dropLocations[i].children.length == 0) { //then we can put the course here
                    if (found == false) {
                        var listEle2 = document.createElement("li");
                        listEle2.appendChild(course);
                        listEle2.setAttribute("draggable", "true");
                        listEle2.setAttribute("ondragstart", "dragoff(event)");
                        dropLocations[i].appendChild(listEle2); //adds the course to the planner
                        dropLocations[i].style.opacity = 0.4;
                        //update the globals
                        inPlan.push($(e.target).text());
                        pos.push(dropLocations[i].id);
                        found = true;
                    }

                }
            }
            resolve();
        }); //end promise 2
        await promise2;
        if (found == false) {
            alert("please do not add more than 5 courses per term");
        }
    } // if cont == true
}//end fn





//logic for adding and removing courses in the introductory screen
function introCourseAdd(e){
    var cont = true;
    var counter = window.introCount;
    var c = $(e.target).text();
    
         if (window.introCount >= 5) {
                 cont = false;
                 alert("can not add more than 5 courses per term");
                 
             }

         else {
            
             if (cont == true) {

                 var active = document.getElementById(window.activeTerm); //this is the position in the list that we want to add the courses under
                 var listEle = document.createElement("li");
                 var course = document.createTextNode($(e.target).text());
                 listEle.appendChild(course);
                 listEle.setAttribute("ondblclick", "introCourseRemove(event)"); //add the remove event to the course
                 active.children[0].appendChild(listEle); //add course to list
                 updateBarAdd(c);
                 window.introCount += 1;
             }
         }
          


    
    //now we have to add the course to the planner
    if (cont == true) {
        $.ajax({  //get the units for the course
                type: "GET",
                url: "/getUnits/",
                data: {
                    "course" : c
                 },
                success: function(data){ //data is units
                    var units = data;
                    console.log(units);
                    if (units == 3){
                        var year = window.activeTerm[1];
                        var term = window.activeTerm[2];
                        var lookupClass = term.concat(year);
                        var dropLocations = document.getElementsByClassName(lookupClass); //these are the potential slots we can put the course in
                        var found = false;


                        var course = document.createTextNode($(e.target).text() + "/" +units+"."+"0");
                            for (var i = 0; i < dropLocations.length; i++) {
                                if (dropLocations[i].children.length == 0) { //then we can put the course here
                                    if (found == false) {
                                        var listEle2 = document.createElement("li");
                                        listEle2.appendChild(course);
                                        listEle2.setAttribute("draggable", "true");
                                        listEle2.setAttribute("ondragstart", "dragoff(event)");
                                        dropLocations[i].appendChild(listEle2); //adds the course to the planner
                                        //update the globals
                                        inPlan.push($(e.target).text());
                                        pos.push(dropLocations[i].id);
                                        found = true;
                                        //gray out dropped course and make it non draggable
                                        $("#".concat(c.slice(0, 7))).css("opacity", 0.4); //gray out dropped course
            							$("#".concat(c.slice(0, 7))).attr("draggable", "false");
            							
            							//make div nondroppable
            							 dropLocations[i].setAttribute("ondragover", "default");
            							 dropLocations[i].style.opacity = 0.4;
            							 
                                    }

                                }
                            }
                            
                        if (found == false) {
                            alert("please do not add more than 5 courses per term");
                        }
                }//end if units = 3

                else{ //if units = 6
                        var year = window.activeTerm[1];
                        var term = window.activeTerm[2];
                        var lookupClass = term.concat(year);
                        var dropLocations = document.getElementsByClassName(lookupClass); //these are the potential slots we can put the course in
                        var found = false;


                        var course = document.createTextNode($(e.target).text() + "/" +units+"."+"0");
                        
                            for (var i = 0; i < dropLocations.length; i++) {
                                if (dropLocations[i].children.length == 0) { //then we can put the course here
                                    if (dropLocations[i].nextElementSibling.children.length == 0){
                                    if (found == false) {
                                        var listEle2 = document.createElement("li");
                                        listEle2.appendChild(course);
                                        listEle2.setAttribute("draggable", "true");
                                        listEle2.setAttribute("ondragstart", "dragoff(event)");
                                        dropLocations[i].appendChild(listEle2); //adds the course to the planner


                                        var course1 = document.createTextNode($(e.target).text() + "/" +units+"."+"0");
                                        var listEle3 = document.createElement("li");
                                        listEle3.appendChild(course1);
                                        listEle3.setAttribute("draggable", "true");
                                        listEle3.setAttribute("ondragstart", "dragoff(event)");
                                        dropLocations[i].nextElementSibling.appendChild(listEle3); //adds the course to the planner
                                        //update the globals
                                        inPlan.push($(e.target).text());
                                        inPlan.push($(e.target).text());
                                        pos.push(dropLocations[i].id);
                                        pos.push(dropLocations[i].nextElementSibling.id);
                                        found = true;

                                        //gray out dropped course and make it non draggable
                                        $("#".concat(c.slice(0, 7))).css("opacity", 0.4); //gray out dropped course
            							$("#".concat(c.slice(0, 7))).attr("draggable", "false");
            							
            							//make both divs nondroppable
            							 dropLocations[i].setAttribute("ondragover", "default");
            							 dropLocations[i].style.opacity = 0.4;
            							 dropLocations[i].nextElementSibling.setAttribute("ondragover", "default"); 
            							 dropLocations[i].nextElementSibling.style.opacity = 0.4;
                                    }
                                } //if sibling

                                }
                            }
                            
                        if (found == false) {
                            alert("please do not add more than 5 courses per term");
                        }

                }

                                
                 }//end success fn
        });//end ajax
	
		
       
    } // if cont == true
}//end fn


//logic for intro course removal from list
function introCourseRemove(e){
     var course = $(e.target); //the course to be removed from the list
    window.introCount -=1;
    course.remove();
    updateBarRemove($(e.target).text());
    $("#".concat($(e.target).text().slice(0, 7))).css("opacity", 1); //ungray out removed course
    $("#".concat($(e.target).text().slice(0, 7))).attr("draggable", "true"); //make course draggable again

    //remove from planner
    columns = document.getElementsByClassName("column");
    
    for (i = 0; i< columns.length; i++){
    	if (columns[i].children.length > 0){
    		var childText = columns[i].children[0].innerHTML.slice(0,7);
    		if (childText == course.text()){
    			columns[i].children[0].remove();
    			columns[i].setAttribute("ondragover", "allowDrop(event)");
    			columns[i].style.opacity = 1;
    			
    			
    			
    		}
    }
}

    //update globals
    var index = inPlan.indexOf(course.text());
    inPlan.splice(index,1);
    pos.splice(index,1);

    var index2 = inPlan.indexOf(course.text());
    if (index2 != -1){
        inPlan.splice(index2,1);
        pos.splice(index2,1);

    }


}


//logic for nextterm button in the introdcution screen
async function nextTerm(e){
    //happens when the finished adding button is clicked
    var activeYear = parseInt(window.activeTerm[1]);
    var term = window.activeTerm[2];
    var studentYear = parseInt(window.studYear[4]);
    if (activeYear == studentYear  & term =="w"){

            var toClose = document.getElementById("overlay-wrapper");
            toClose.style.display = "none";
    }

    else{
        //remove ability to remove courses from previous terms
       var active = document.getElementById(window.activeTerm);

       var child = active.children[0];
       var children = child.children;
        for (var i = 0; i < children.length; i++){
           children[i].setAttribute("ondblclick","none");

       }
        //update the term
        if (term == "f") {
            term = "w";
        }
        else{ //active term is winter so switch to fall and increment the year
            term = "f";
            activeYear += 1;
        }
    }
    var baseString = "Please enter your classes for: ";
        var yearString = "";
        var termString = "";
        var change = "";

    let promise = new Promise((resolve, reject) => {
        change = document.getElementById("introPara");

        if (activeYear == 1) {
            yearString = "Year 1 "
        } else if (activeYear == 2) {
            yearString = "Year 2 "
        } else if (activeYear == 3) {
            yearString = "Year 3 "
        } else if (activeYear == 4) {
            yearString = "Year 4 "
        }

        if (term == "w") {
            termString = "Winter"
        } else {
            termString = "Fall"
        }
        resolve();
    });

    await promise;
    change.innerHTML = baseString.concat(yearString.concat(termString));
    //update globals
    var stringOne = "y".concat(activeYear.toString().concat(term));

    window.activeTerm = stringOne;

    window.introCount = 0;



}
//logic for expanding and collpasing buttons
function expand(e) {
    //covers both expanding and collapsing

    var child = e.target.nextElementSibling;
    var children = child.children;

    for (var i = 0; i < children.length; i++) {

        if (children[i].style.display == "none") {

            children[i].style.display = "list-item";
        } else {
            children[i].style.display = "none";
        }
    }
}//end fn

//fn for expanding and collapsing requirement buttons
function expandReq(e){
    //covers both expanding and collapsing

    var bar = e.target.nextElementSibling; //progress bar
    var clist = bar.nextElementSibling; //list of courses for requirment
    if (bar.style.display =="none"){
    	bar.style.display = "block";
    
    }else{
    	bar.style.display = "none";
    }

    var children = clist.children;

    for (var i = 0; i < children.length ; i++){

        if (children[i].style.display == "none"){

            children[i].style.display ="list-item";
        }
        else{
            children[i].style.display = "none";
        }
    }



} //end fn


//planner default functions
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", $(ev.target).text());

}

//function to drag a course off of the planner i.e remove course from planner
function dragoff(ev) {
    ev.dataTransfer.setData("text", $(ev.target).text());
    text = $(ev.target).text();
    units = parseInt (text[8]);
    position = ev.target.parentNode.id;

    if(units == 3){

    ev.target.parentNode.setAttribute("ondragover","allowDrop(event)") //make div droppable again
    ev.target.style.display = "none";//remove course
    $("#".concat($(ev.target).text().slice(0,7))).css("opacity",1);//ungray out course
    $("#".concat($(ev.target).text().slice(0,7))).attr("draggable","true"); //allow the course to be dragged again
    index = inPlan.indexOf($(ev.target).text().slice(0, 7));
    inPlan.splice(index,1); //remove from inPlan
    pos.splice(index,1); //remove from pos list
    }

    if (units == 6){


    
    ev.target.parentNode.setAttribute("ondragover","allowDrop(event)") //make div droppable again
    ev.target.style.display = "none"; //remove course
    console.log(position[0]);
    if (position[0] == "f"){
    ev.target.parentNode.nextElementSibling.setAttribute("ondragover","allowDrop(event)") //make div beside it droppable again
    console.log(ev.target.parentNode.nextElementSibling);
    ev.target.parentNode.nextElementSibling.innerHTML = '';//remove course from adjacent div
    $("#".concat($(ev.target).text().slice(0,7))).css("opacity",1);//ungray out course
    $("#".concat($(ev.target).text().slice(0,7))).attr("draggable","true"); //allow the course to be dragged again
    index = inPlan.indexOf($(ev.target).text().slice(0, 7));
    inPlan.splice(index,1); //remove from inPlan
    pos.splice(index,1); //remove from pos list
    }
    
    else {
    ev.target.parentNode.previousElementSibling.setAttribute("ondragover","allowDrop(event)") //make div beside it droppable again
    console.log(ev.target.parentNode.nextElementSibling);
    ev.target.parentNode.previousElementSibling.innerHTML = ''; //remove course from left adjacent div
    $("#".concat($(ev.target).text().slice(0,7))).css("opacity",1);//ungray out course
    $("#".concat($(ev.target).text().slice(0,7))).attr("draggable","true"); //allow the course to be dragged again
    index = inPlan.indexOf($(ev.target).text().slice(0, 7));
    inPlan.splice(index,1); //remove from inPlan
    pos.splice(index,1); //remove from pos list
    }

    //also remove the second occurance
    index = inPlan.indexOf($(ev.target).text().slice(0, 7));
    inPlan.splice(index,1); //remove from inPlan
    pos.splice(index,1); //remove from pos list
    


    }
    //update bar
    updateBarRemove(ev.target.innerText);

    //set the recommended courses back to white highlight i.e no highlight
    //ajax call
      $.ajax({
          type: "POST",
          url: "/getRec/",
          data: {
              "course": $(ev.target).text().slice(0, 7)
          },
          success: function (data) {
              recom = data //remove highlight from recommended courses
              if (data != "false"){
                for (r in recom) {
                    $("li").not("#" + r).css("background", "none");
              }
              }
          } //end success fn
      }); //end ajax call
}


//logic to drop a course into the planner
async function dropCourse(ev) {
  ev.preventDefault();
  var course = ev.dataTransfer.getData("text");
  console.log(course);
  if (course.length > 7){
  	course = course.slice(0,7);
  }
  var position = $(ev.target).attr('id'); //position we are trying to drop into
  console.log(position);
  var safe = true;

  let promise = new Promise((resolve, reject) => {
      //ajax call
      $.ajax({
          type: "POST",
          url: "/validate/",
          data: {
              "course": course.slice(0, 7),
              "inplan": JSON.stringify(inPlan),
              "posList": JSON.stringify(pos),
              "pos": position //the position we are trying to drop into
          },
          success: function (data) {
              var msg = data[0]; //the msg box to display
              var bool = data[1]; //wether drop was succesful or not
              window.recommended = data[2];

              if (bool == "false") { //drop failed
                  alert(msg);
                  safe = false;
              }
           resolve() //resolve the promise so function can continue
          } //end success function
      }); //end ajax call
  }); //end promise

    await promise; //wait for the ajax call to finish so safe has the right value

     $.ajax({
                type: "GET",
                url: "/getUnits/",
                data: {
                    "course" : course
                 },
                success: function(data){
                    if (safe == true) { //drop was a success

        var units = parseInt(data);
        console.log(units);
         var node = document.createElement("LI");// Create a <li> node
        node.setAttribute("draggable","true");
        node.setAttribute("ondragstart","dragoff(event)");
        var textnode = document.createTextNode(course + "/" +units+"."+"0");
        node.appendChild(textnode);

        

        if (units == 3){
            ev.target.appendChild(node);
            //update the ajax lists
            inPlan.push(course.slice(0, 7)); //add the course to the list of courses in plan
           
            pos.push(position); //add the position of the course to the position list e.g "f1"
            //gray out dropped courses and make in undraggable in the course list, as well make the div its dropped into no longer droppable
            ev.target.setAttribute("ondragover", "default"); //dont let any more courses get dropped in this div
            $("#".concat(course.slice(0, 7))).css("opacity", 0.4); //gray out dropped course
            $("#".concat(course.slice(0, 7))).attr("draggable", "false");
            //update bars
            updateBarAdd(course);
        

            //update the recommended courses
            for (item in recommended){
             $("#".concat(item)).css("background-color","green") //highlight the courses in green if they are recommended
            }
        }

        if (units == 6){
            //then it needs to take up two slots
            if (position[0] == "f"){
            sibling = ev.target.nextElementSibling;
            position2 = sibling.id;
            console.log(position2);
            ev.target.appendChild(node);

            var node2 = document.createElement("LI");// Create a <li> node
            node2.setAttribute("draggable","true");
            node2.setAttribute("ondragstart","dragoff(event)");
            var textnode = document.createTextNode(course + "/" +units+"."+"0");
            node2.appendChild(textnode);

            sibling.appendChild(node2);
            //update the ajax lists
            inPlan.push(course.slice(0, 7)); //add the course to the list of courses in plan
            inPlan.push(course.slice(0, 7)); //add it again
            

            pos.push(position); //add the position of the course to the position list e.g "f1"
            pos.push(position2); //also add the second position of the course
            //gray out dropped courses and make in undraggable in the course list, as well make the div its dropped into no longer droppable
            ev.target.setAttribute("ondragover", "default"); //dont let any more courses get dropped in this div
            sibling.setAttribute("ondragover", "default");
            $("#".concat(course.slice(0, 7))).css("opacity", 0.4); //gray out dropped course
            $("#".concat(course.slice(0, 7))).attr("draggable", "false");
            //update bars
            updateBarAdd(course);
        

            //update the recommended courses
            for (item in recommended){
                $("#".concat(item)).css("background-color","green") //highlight the courses in green if they are recommended
                }
            }
            else{
                alert("Can't drop 6 unit course into winter term (must start in fall)")
            }

        }

    

        
    }

    } //end sucess
}); //end ajaxx
    
}

//update progress bar on course add to planner
function updateBarAdd(txt){
    if (txt.length >= 7){
    var id = txt.substring(0,7);
    console.log(id);
    }

    else{
        var id = txt
    }
    //do some ajax to get every req it belongs to
    $.ajax({
          type: "POST",
          url: "/reqBarHandler/",
          data: {
              "course": id

          },
          success: function (data) {
                var planNames = data[0]; //the plan names the course belongs to
               var reqNames = data[1]; //the requirement names the course belongs to
              var units = data[2];
               //update bars have id in the following format: core/option-plan name-req letter

               for (var i = 0; i < planNames.length; i++){
                   var pn = planNames[i]; //planName
                   var rn = reqNames[i]; //reqName
                   var idString = "core-" + pn + "-"+rn;
                   var toUpdate = document.getElementById(id = idString); //the requirement bar to update
                   var planString = pn + "-bar";
                   var updateBar =  document.getElementById(id = planString); //the plan bar to update
                   if (toUpdate == null){
                        var idString = "option-" + pn + "-"+rn;
                        var toUpdate = document.getElementById(id = idString);

                    }


                   if (toUpdate.style.width != "100%"){
                     
                        var inner = toUpdate.innerText;
                       var slashPos = inner.search("/");
                       var before = parseInt(inner.substring(0,slashPos)); //the amount of units so far
                       var after = parseInt(inner.substring(slashPos+1)); //the total units need
                       var newProg = before + units; //our new progress for this bar

                       //update bar text
                    
                       toUpdate.innerText = newProg.toString() + "/" + after.toString() + " units";

                       //update bar width
                       var newWidth = (newProg/after) * 100; //get our new width as the percentage of completed units
                       toUpdate.style.width = newWidth.toString() + "%";
                   }

                if (updateBar.style.width != "100%"){
                        var inner = updateBar.innerText;
                       var slashPos = inner.search("/");
                       var before = parseInt(inner.substring(0,slashPos)); //the amount of units so far
                       var after = parseInt(inner.substring(slashPos+1)); //the total units need
                       var newProg = before + units; //our new progress for this bar

                       //update bar text
                       
                       updateBar.innerText = newProg.toString() + "/" + after.toString() + " units";

                       //update bar width
                       var newWidth = (newProg/after) * 100; //get our new width as the percentage of completed units
                       updateBar.style.width = newWidth.toString() + "%";
                   }

             }

          } //end success function
      }); //end ajax call
}

//update progress bar on course remove from planner
function updateBarRemove(txt){
    if (txt.length > 7){
    var id = txt.substring(0,7);
    console.log(id);
    }

    else{
        var id = txt
    }

    //do some ajax to get every req it belongs to
    $.ajax({
          type: "POST",
          url: "/reqBarHandler/",
          data: {
              "course": id

          },
          success: function (data) {
                var planNames = data[0]; //the plan names the course belongs to
               var reqNames = data[1]; //the requirement names the course belongs to
              var units = data[2];
               //update bars have id in the following format: core/option-plan name-req letter
               for (var i = 0; i < planNames.length; i++){
                   var pn = planNames[i]; //planName
                   var rn = reqNames[i]; //reqName
                   var idString = "core-" + pn + "-"+rn;
                   var toUpdate = document.getElementById(id = idString);
                   var planString = pn + "-bar";
                   var updateBar =  document.getElementById(id = planString); //the plan bar to update

                    if (toUpdate == null){
                        var idString = "option-" + pn + "-"+rn;
                        var toUpdate = document.getElementById(id = idString);
                    }
                   if (toUpdate.style.width != "0%"){
                    
                        var inner = toUpdate.innerText;
                       var slashPos = inner.search("/");
                       var before = parseInt(inner.substring(0,slashPos)); //the amount of units so far
                       var after = parseInt(inner.substring(slashPos+1)); //the total units need
                       var newProg = before - units; //our new progress for this bar
                       //update bar text
                       
                       toUpdate.innerText = newProg.toString() + "/" + after.toString() + " units";
                       //update bar width
                       var newWidth = (newProg/after) * 100; //get our new width as the percentage of completed units
                       toUpdate.style.width = newWidth.toString() + "%";
                   }

                   if (updateBar.style.width != "0%"){
                    
                        var inner = updateBar.innerText;
                       var slashPos = inner.search("/");
                       var before = parseInt(inner.substring(0,slashPos)); //the amount of units so far
                       var after = parseInt(inner.substring(slashPos+1)); //the total units need
                       var newProg = before - units; //our new progress for this bar
                       //update bar text
                       
                       updateBar.innerText = newProg.toString() + "/" + after.toString() + " units";
                       //update bar width
                       var newWidth = (newProg/after) * 100; //get our new width as the percentage of completed units
                       updateBar.style.width = newWidth.toString() + "%";
                   }
             }

          } //end success function
      }); //end ajax call
}


//courseinfo display logic for when a course is clicked on
function displayCourse(ev){
    var target = ev.target;
    console.log(target);
    target.style.color = "blue";
    var course = target.textContent.slice(0,7);
    addRecoms(course);
    $("li").not(target).css("color","black");
    $(".infotxt").not("#info" + course).hide();
    $("#info" + course).css("display","block");
  

}

//Django code from thier cookies section

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
//ajax setup
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
