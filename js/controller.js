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
		match = match.replace("(", "(?:(");
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

function parseDirection(kierunek){
	var coord_x = 0;
	var coord_y = 0;
	var error = false;
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
		case "gore":
			coord_y=1;
			break;
		case "góre":
			coord_y=1;
			break;
		case "dół":
			coord_y=-1;
			break;
		case "dol":
			coord_y=-1;
			break;
		default:
			say('Nie wiem, jaki to kierunek: "' + kierunek + '"');
			return null;
			break;
	}
	return {x: coord_x, y: coord_y};
}

function parseNumber(ile){
	var how_much = 0;
	console.log('parseNumber(', ile, ")");
	if(isNaN(parseInt(ile))){
		console.log('input is not an integer, trying to match with a string pattern')
		var error = false;
		switch(ile){
			case "jeden":
				how_much = 1;
				break;
			case "jedną":
				how_much = 1;
				break;
			case "jedna":
				how_much = 1;
				break;
			case "jedno":
				how_much = 1;
				break;
			case "dwa":
				how_much = 2;
				break;
			case "dwie":
				how_much = 2;
				break;
			case "trzy":
				how_much = 3;
				break;
			case "cztery":
				how_much = 4;
				break;
			case "pięć":
				how_much = 5;
				break;
			case "piec":
				how_much = 5;
				break;
			default:
				say("<i>'" + ile + "'</i>? Nie wiem, co to za liczba.");
				return null;
				break;
		}
		return how_much;		
	}else{
		console.log('input is an integer. returning parseInt(input)', parseInt(ile));
		return parseInt(ile);
	}
}

scheme_collection = new function(){
    this.collection = [
        new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(z|ź)) w #kierunek", function(kierunek){        	
        	var amount = Math.ceil(Math.random()*3);
        	var coords = parseDirection(kierunek);
        	if(coords!=null){
	        	coords.y = coords.y*amount;
	        	coords.x = coords.x*amount;
	            controller.main_hero.translate_steps(coords.x, coords.y);        		
        	}
        }),
		new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (o)? #ile (pole|pola|pól|pol)? w #kierunek", function(ile, kierunek){
			controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) w #kierunek (o)? #ile (pole|pola|pól|pol)?", function(kierunek, ile){
			controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("(elo|witaj|siema|joł|cześć|czesc)", function(){
        	say('Dzień dobry. Mamy dzisiaj piękny dzień');
        }),
        new scheme("(opowiedz mi (z|ż)art|tell (me)? (a)? joke|rozbaw mnie|jest mi smutno|smutno mi|walnij suchara|corny joke|Krzysiu Weiss)", function(){
        	$.get('http://api.icndb.com/jokes/random', function(data){
        		say("Ok, znasz ten angielski żart? <i>" + data.value.joke + "</i>");
        	})
        }),
		new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz) #ilex (pole|pola|pól|pol)? w #kierunekx, (id(z|ź)|p(ó|o)jd(z|ź)) #iley (pole|pola|pól|pol)? w #kieruneky", function(ilex, kierunekx, iley, kieruneky){
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
            console.log(scheme.regex);
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

	var self = this;

	this.history = []; //array of dialog_entry

	this.container_selector = "#dialog_content";

	this.log = function(text){
		var entry = new dialog_entry('ja', text);
		this.pushEntry(entry);
	}

	this.say = function(text){
		var entry = new dialog_entry('Luigi', text);
		self.pushEntry(entry);
	}

	this.pushEntry = function(entry){
		self.history.push(entry);
		self.render();
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
			var name = $("<td style='font-weight:bold; vertical-align:top; text-align:right'></td>");
			name.appendTo(div);
			name.text(entry.name + ": ");
			name.addClass('dialog_name');
			var content = $("<td></td>");
			content.addClass("message_" + entry.name );
			content.appendTo(div);
			content.html(entry.text);
			div.appendTo(container);
		}
		//console.log(container.parent())
		container.parent()[0].scrollTop = container.parent()[0].scrollHeight;
	}
};
var say = dialog.say;

dialog_controller = new function(){
	this.offset = 0;

	this.getHistory = function(){
		var c = -1;
		var last_entry =null;
		for(var i=dialog.history.length-1; i>=0; i--){
			var entry = dialog.history[i];
			if(entry.name=='ja'){
				last_entry = entry;
				c++;
				if(c==this.offset){
					return entry.text;
				}
			}
		}
		return last_entry.text;
	}
}

function submit_user_input(){
	var user_input = $('#query').val();
	dialog.log(user_input);
	scheme_collection.user_input(user_input);
	dialog_controller.offset = -1;
	$("#query").val("");
}


$(document).ready(function(){
	$('#go').click(function(){
		submit_user_input();	
	})	

	$("#query").keydown(function(e){
		if(e.keyCode==13){
			submit_user_input();
		}
		//alert(e.keyCode);
		if(e.keyCode==38){
			//alert('eee');
			dialog_controller.offset+=1;
			$("#query").val(dialog_controller.getHistory());
			e.preventDefault();
			return null;
		}
		if(e.keyCode==40){
			//alert('eee');
			dialog_controller.offset-=1;
			if(dialog_controller.offset<0){
				dialog_controller.offset=0;
			}
			$("#query").val(dialog_controller.getHistory());
			e.preventDefault();
			return null;
		}
	})
});

