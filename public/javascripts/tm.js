$(document).ready(function(){
    $("input.btn.btn-primary").click(function(){
        $(".jumbotron").remove();
        $(".col-md-8.col-md-offset-2").load("form.html");
        
    });
});