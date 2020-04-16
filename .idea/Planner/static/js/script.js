
//requiremtn dropdowns
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}




//Menu Toggle Script

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

    //Degree Dropdown Script


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

//option Dropdown Script



