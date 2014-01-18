var controller = new function(){

	this.setup = function(){
		this.main_hero = object_storage.objects.luigi[0];
	}


	this.command = function(command){
		
	}

}

var Parser = {}

Parser.parseToRegex = function (input){
	input = input.replace(/\?/g, "\\?");
	input = input.replace(/\)\\\?/g, ")?");
	input = input.replace(/\(/g, "(?:");
	//first parse all the (opt1|opt2|...) alternatives
	var opt_reg = /\([\w\| ]+\)/g;
	var matches = input.match(opt_reg);
	for(var i in matches){
		var match = matches[i];
	}
	input.replace("(", "(?:"); //aby nie zapamiętywać wyników w tych grupach
	
	//if parameter starts with "#", its value does not contain spaces.
	var param_names = [];
	var hash_param_reg = /\#\w+/g;
	var new_param_names = input.match(hash_param_reg);
	for(var i in new_param_names){
		param_names.push(new_param_names[i]);
		}
	var processed_input = input;
	for(var i in param_names){
		var new_regex;
		if(param_names[i][0]=="$"){
			new_regex = "([\\w ]+)";
		}else{
			new_regex = "([\\wóÓłŁżŻźŹćĆąĄęĘśŚ]+)";
		}
		processed_input = processed_input.replace(param_names[i], new_regex)
		}
	processed_input = processed_input.replace(/[ ,.;]+/g, "\\W+");
	processed_input = processed_input.replace(/\([^\(]*\)\?/, function(match){
		match = match.replace("(", "((");
		match = match.replace(")?", ")\\W+)?");
		return match;
		});
	processed_input = processed_input.replace(")?\\W+", ")?");
	processed_input="^" + processed_input + "$"; 	
	var ret = new RegExp(processed_input);
	return ret;
};

Parser.notationMatchesInput = function(notation, input){
	if(input==undefined){
		return false;
	}else{
		input = input.toLowerCase();
		notation = notation.toLowerCase();
		var regex = Parser.parseToRegex(notation);
		return input.match(regex)!=null;			
	}	
};

Parser.extractAttributes = function(regex, input){
	console.log(input.match(regex));
}

function scheme(notation, command){
    this.regex = Parser.parseToRegex(notation);

    this.command = command;

    this.notation = notation;

    this.extractParameters = function(input){
    	var matches = input.match(this.regex);
    	matches.splice(0, 1);
    	return matches;
    }

    this.execute = function(input){
    	console.log(input);
        var params = this.extractParameters(input);
        console.log(params);
        this.command.apply(this, params);
    }
}

scheme.prototype.matches = function(input){
    return input.match(this.regex)!=null;
}

scheme_collection = new function(){
    this.collection = [
        new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz) w #kierunek", function(kierunek){
        	var coord_x = 0;
        	var coord_y = 0;
        	switch(kierunek){
        		case "lewo":
        			coord_x=-1;
    				break;
    			case "prawo":
    				coord_x=1;
					break;
				case "górę":
					coord_y=1;
					break;
				case "dół":
					coord_y=-1;
					break;
        	}
        	var amount = Math.ceil(Math.random()*3);
        	coord_y = coord_y*amount;
        	coord_x = coord_x*amount;
            controller.main_hero.translate(coord_x, coord_y);
        }),
		new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz) (o)? #ile (pole|pola|pól)? w #kierunek", function(ile, kierunek){
            alert('idz w ' + ile + kierunek);
        }),
		new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz) #ilex (pole|pola)? w #kierunekx, (id(z|ź)|p(ó|o)jd(z|ź)) #iley (pole|pola)? w #kieruneky", function(ilex, kierunekx, iley, kieruneky){
            alert('idz w ' + ilex + kierunekx + iley + kieruneky);
		}),
		new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz) do #item", function(item){
			alert('idz do ' + item);
		})
    ];

    this.user_input = function(input){
    	input = input.toLowerCase();
    	//console.log("user_input:" + input);
    	//console.log(this.collection);
    	console.log('looking for a match...');
    	var found = false;
        for(var i in this.collection){
            var scheme = this.collection[i];
            if(scheme.matches(input)){
            	found = true;
            	console.log('found match: ', scheme);
                scheme.execute(input);
                break;
            }
        }
        if(!found){
        	console.log('none found');
        	dialog.say('Wybacz, nie rozumiem polecenia. Spróbuj jeszcze raz:')
        }
    }

}


function dialog_entry(name, text){
	this.name = name;
	this.text = text;
}

dialog = new function(){
	this.history = []; //array of dialog_entry

	this.container_selector = "#dialog_content";

	this.log = function(text){
		var entry = new dialog_entry('me', text);
		this.pushEntry(entry);
	}

	this.say = function(text){
		var entry = new dialog_entry('Luigi', text);
		this.pushEntry(entry);
	}

	this.pushEntry = function(entry){
		this.history.push(entry);
		this.render();
	}

	this.render = function(){
		var selector = this.container_selector;
		$(selector).html("");
		var container = $(selector);
		for(var i in this.history){
			var entry = this.history[i];
			console.log(entry);
			var div = $("<tr></tr>");
			//div.addClass('dialog_entry');
			var name = $("<td style='font-weight:bold; vertical-align:top'></td>");
			name.appendTo(div);
			name.text(entry.name + ": ");
			var content = $("<td></td>");
			content.appendTo(div);
			content.text(entry.text);
			div.appendTo(container);
		}
		//console.log(container.parent())
		container.parent()[0].scrollTop = container.parent()[0].scrollHeight;
	}
};


function submit_user_input(){
	var user_input = $('#query').val();
	dialog.log(user_input);
	scheme_collection.user_input(user_input);
	$("#query").val("");
}


$(document).ready(function(){
	$('#go').click(function(){
		submit_user_input();	
	})	

	$("#query").keypress(function(e){
		if(e.keyCode==13){
			submit_user_input();
		}
	})
});

