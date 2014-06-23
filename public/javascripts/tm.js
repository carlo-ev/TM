$(document).ready(function(){
    String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    }
    var $alert = $(".alert");
    var $header = $(".page-header");
    var states;
    var inputAlphabet;
    var tapeAlphabet;
    var initial;
    var accepting;
    var rejecting;
    var chain;
    var statesObject = {};
    var RgxList = /^([A-Za-z0-9][,]?)*([A-Za-z0-9])$/;
    var Rgxtape = /^([A-Za-z0-9@#$%^&*=+><:;][,]?)*([A-Za-z0-9@#$%^&*=+><:;])$/;

    $("input.btn.btn-primary").click(function(){            
        $(".jumbotron").remove();
        $header.show();
        $(".col-md-8.col-md-offset-2").append(
            $("<div id='main'>").load("form.html #form", function(){
                $alert.addClass("alert-info");
                $alert.text("Press Enter to get to the next TM definition step!");
                $alert.show("slow");
                setTimeout(function(){
                    $alert.removeClass(".alert-info");
                    $alert.hide("slow");
                },7000);
                setEvents();
            })
        );
    });

    function execute(){
        var tapePosition = 0;
        var actualState = initial;
        var $list = $("#results");
        var $results;
        while(actualState !== accepting && actualState !== rejecting){
            $list.append("<li><ul class='pagination'>")
            $results = $($("#results .pagination")[$("#results .pagination").length-1]);
            $.each(chain.split(","), function(index, ele){
                if((index*2) === tapePosition){
                    $results.append("<li class='active'><a>"+actualState+"</a></li>");
                }
                $results.append("<li><a>"+ele+"</a></li>");
            });
            $list.append("</ul></li>");
            if(statesObject[actualState][chain[tapePosition]] === undefined){
                console.log("Maquina se quedo ciclada");
                $alert.addClass("alert-danger");
                $alert.text("The Turing Machine Lost itself during execution please try again with a new one.");
                $alert.show("slow");
                setTimeout(function(){
                    $alert.removeClass(".alert-danger");
                    $alert.hide("slow");
                },7000);
                break;
            }else{
                var rules = statesObject[actualState][chain[tapePosition]];
                chain = chain.replaceAt(tapePosition, rules[1]);
                if(rules[2] === "R"){
                    tapePosition+=2;
                }else{
                    tapePosition-=2;
                }
                actualState = rules[0];
            }
        }
        if(actualState === accepting){
            console.log("Se llego a un estado de acceptacion");
            $alert.addClass("alert-success");
                $alert.text("The Turing Machine Accepted the given input!");
                $alert.show("slow");
                setTimeout(function(){
                    $alert.removeClass(".alert-success");
                    $alert.hide("slow");
                },7000);
        }
        if(actualState === rejecting){
            console.log("Se rechazo la cadena");
            $alert.addClass("alert-info");
                $alert.text("The Turing Machine rejected the give input!");
                $alert.show("slow");
                setTimeout(function(){
                    $alert.removeClass(".alert-info");
                    $alert.hide("slow");
                },7000);
        }
        console.log("ejecucion terminada");
    }

    function setExecution(){
        console.log(statesObject);
        $("#go").click(function(el, ev){
            var $string= $("#string");
            var parent = $string.parent(".form-group");
            chain = $string.val();
            var chainok = true;
            $.each(chain.split(","), function(index, ele){
                if($.inArray(ele, inputAlphabet)===-1)
                    chainok = false;
            });
            if(RgxList.test(chain) && chainok){
                $("#original").html("");
                $.each(chain.split(","), function(index, ele){
                    $("#original").append(
                        "<li><a>"+ele+"</a></li>"
                        );
                });
                parent.removeClass("has-error");
                execute(chain);
            }else{
                parent.addClass("has-error");
            }
        });
    }

    function setTransition(){
        $.each(states, function(index, ele){
            statesObject[ele] = {};
        });
        $("#next").click(function(el, ev){
            var state = $("#state");
            var input = $("#input");
            var destination = $("#destination");
            var output = $("#output");
            var movement = $("#movement");
            if(state.val() !== "" && $.inArray(state.val(),states)!==-1){
                if( input.val()!=="" && $.inArray(input.val(),inputAlphabet)!==-1){
                    if(destination.val()!==""&& $.inArray(destination.val(),states)!==-1){
                        if(output.val()!=="" || $.inArray(output.val(), tapeAlphabet)!==-1){
                            if(movement.val()==="L" || movement.val()==="R"){
                                $(".list-group").append(
                                    $("<li class='list-group-item'>").html(("<h4>&delta;("+state.val()+","+input.val()+" -> "+destination.val()+","+output.val()+","+movement.val()+")</h4>"))
                                    );
                                statesObject[state.val()][input.val()] = [destination.val(), output.val(), movement.val()];
                                state.val("");
                                input.val("");
                                destination.val("");
                                output.val("");
                                movement.val("");
                            }
                        }
                    }
                }

            }
        });
        $("#done").click(function(el, ev){
            if($(".list-group-item").length < 1){
                $alert.addClass("alert-warning");
                $alert.text("Press Enter Atlest 1 Transition!");
                $alert.show("slow");
                setTimeout(function(){
                    $alert.removeClass(".alert-warning");
                    $alert.hide("slow");
                },7000);  
            }else{
                $("#transitions").prepend(
                    $("<div>").load("form.html #execution")
                    );
                $("#story").hide("clip", "slow",function(){
                    $("#story").remove();
                    $("#execution").show("blind", "slow");
                    setExecution();
                })
            }
        });
    }

    function setEvents(){
        $("#states").keypress(function(ev){
            if(ev.which === 13){
                var self = $(this);
                var parent = self.parent(".form-group");
                var value = self.val();
                if(RgxList.test(value) && value.split(",").length >=3){
                    states = value.split(",");
                    self.attr("disabled", true);
                    parent.removeClass("has-error");
                    parent.addClass("has-success");
                    $("#inputAlphabet").parent(".form-group").show("slow");
                    $("#inputAlphabet").focus();
                }else{
                    parent.addClass("has-error");
                }
            }
        });
        $("#inputAlphabet").keypress(function(ev){
            if(ev.which === 13){
                var self = $(this);
                var parent = self.parent(".form-group");
                var value = self.val();
                if(RgxList.test(value)){
                    inputAlphabet = value.split(",");
                    self.attr("disabled", true);
                    parent.removeClass("has-error");
                    parent.addClass("has-success");
                    $("#tapeAlphabet").parent(".form-group").show("slow");
                    $("#tapeAlphabet").focus();
                }else{
                    parent.addClass("has-error");
                }
            }
        });
        $("#tapeAlphabet").keypress(function(ev){
            if(ev.which === 13){
                var self = $(this);
                var parent = self.parent(".form-group");
                var value = self.val();
                if(Rgxtape.test(value) && $.inArray("_",value.split(","))===-1 ){
                    tapeAlphabet = value.split(",");
                    self.attr("disabled", true);
                    parent.removeClass("has-error");
                    parent.addClass("has-success");
                    $("#initial").parent(".form-group").show("slow");
                    $("#initial").focus();
                }else{
                    parent.addClass("has-error");
                }
            }
        });
        $("#initial").keypress(function(ev){
            if(ev.which === 13){
                var self = $(this);
                var parent = self.parent(".form-group");
                var value = self.val();
                if(value !== "" && $.inArray(value, states)!==-1){
                    initial = value;
                    self.attr("disabled", true);
                    parent.removeClass("has-error");
                    parent.addClass("has-success");
                    $("#accepting").parent(".form-group").show("slow");
                    $("#accepting").focus();
                }else{
                    parent.addClass("has-error");
                }
            }
        });
        $("#accepting").keypress(function(ev){
            if(ev.which === 13){
                var self = $(this);
                var parent = self.parent(".form-group");
                var value = self.val();
                if(value !== "" && $.inArray(value, states)!==-1 && value !== initial){
                    accepting = value;
                    self.attr("disabled", true);
                    parent.removeClass("has-error");
                    parent.addClass("has-success");
                    $("#rejecting").parent(".form-group").show("slow");
                    $("#rejecting").focus();
                }else{
                    parent.addClass("has-error");
                }
                
                
            }
        });
        $("#rejecting").keypress(function(ev){
            if(ev.which === 13){
                var self = $(this);
                var parent = self.parent(".form-group");
                var value = self.val();
                if(value !== "" && $.inArray(value, states)!==-1 && value !== initial && value !== accepting){
                    rejecting = value;
                    self.attr("disabled", true);
                    parent.removeClass("has-error");
                    parent.addClass("has-success");
                    $("#main").hide("drop", "slow", function(){
                        $("#main").remove();
                        $(".col-md-8.col-md-offset-2").append(
                            $("<div id='main'>").load("form.html #transitions", function(){
                                setTransition();
                            })
                        );
                    });
                    
                }else{
                    parent.addClass("has-error");
                }
            }
        });
    }

});