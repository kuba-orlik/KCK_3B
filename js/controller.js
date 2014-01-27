var controller = new function(){

	var self = this;

	this.setup = function(){
		self.main_hero = object_storage.objects.luigi[0];
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
			new_regex = "([\\wóÓłŁżŻźŹćĆąĄęĘśŚ]+)\\W*";
		}
		processed_input = processed_input.replace(param_names[i], new_regex)
		}
	processed_input = processed_input.replace(/([ ,;]|\.\*)+/g, "\\W*");
	processed_input = processed_input.replace(/\([^\(]*\)\?/, function(match){
		match = match.replace("(", "(?:(");
		match = match.replace(")?", ")\\W*)?");
		return match;
		});
	processed_input = processed_input.replace(")?\\W*", ")?");
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

    console.log(notation);

    this.extractParameters = function(input){
    	var matches = input.match(this.regex);
    	if(matches==null){
    		console.log('trying with trailing space');
    		input +=" ";
    		var matches = input.match(this.regex);
    	}
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
    if(input.match(this.regex)!=null){
    	return true;
	}else{
		input+=" ";
		return input.match(this.regex)!=null;
	}
}

function parseDirection(kierunek){
	var coord_x = 0;
	var coord_y = 0;
	var error = false;
	console.log('parsing ', kierunek);
	switch(kierunek){
		case "lewo":
			coord_x=-1;
			break;
		case "zachód":
			coord_x=-1;
			break;
		case "zachod":
			coord_x=-1;
			break;
		case "prawo":
			coord_x=1;
			break;
		case "wschód":
			coord_x=1;
			break;
		case "wschod":
			coord_x=1;
			break;
		case "prosto":
			coord_y=1;
			break;
		case "wprost":
			coord_y=1;
			break;
		case "naprzód":
			coord_y=1;
			break;
		case "naprzod":
			coord_y=1;
			break;
		case "górę":
			coord_y=1;
			break;
		case "góry":
			coord_y=1;
			break;
		case "gory":
			coord_y=1;
			break;
		case "gore":
			coord_y=1;
			break;
		case "góre":
			coord_y=1;
			break;
		case "północ":
			coord_y=1;
			break;
		case "polnoc":
			coord_y=1;
			break;
		case "przód":
			coord_y=1;
			break;
		case "przod":
			coord_y=1;
			break;
		case "przodu":
			coord_y=1;
			break;
		case "dół":
			coord_y=-1;
			break;
		case "dol":
			coord_y=-1;
			break;
		case "dołu":
			coord_y=-1;
			break;
		case "dolu":
			coord_y=-1;
			break;
		case "tylu":
			coord_y=-1;
			break;
		case "tyłu":
			coord_y=-1;
			break;
		case "południe":
			coord_y=-1;
			break;
		case "poludnie":
			coord_y=-1;
			break;
		default:
			say('Nie wiem, jaki to kierunek: "' + kierunek + '"');
			dialog_controller.listen();
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
			case "szesc":
				how_much = 6;
				break;
			case "sześć":
				how_much = 6;
				break;
			case "siedem":
				how_much = 7;
				break;
			case "osiem":
				how_much = 8;
				break;
			case "dziewięć":
				how_much = 9;
				break;
			case "dziewiec":
				how_much = 9;
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

    this.user_input = function(input){
    	var listen = dialog_controller.listen;
    	input = input.toLowerCase();
    	//input+=" ";
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
        	dialog.didnt_understand();
        	//dialog.say('Wybacz, nie rozumiem polecenia. Spróbuj jeszcze raz:')
        	dialog_controller.listen();
        }
    }

}


function dialog_entry(name, text){
	this.name = name;
	this.text = text;
}

dialog = new function(){

	var self = this;

	this.listening = true;

	this.history = []; //array of dialog_entry

	this.container_selector = "#dialog_content";

	this.didnt_understand = function(){
		var apologies = [
			"Sorki,",
			"Wybacz, ale",
			"Niestety",
			"Sorry,",
			""
		];
		var contents = [
			"nie rozumiem polecenia",
			"nie czaję",
			"nie wiem, co starasz mi się przekazać"
		]
		var apology = apologies[Math.floor(Math.random()*apologies.length)];
		var content = contents[Math.floor(Math.random()*contents.length)];
		this.say(apology + " " + content);


	this.need_help = function(){

		var advices = [
		"Pomóż mi poszukać memów, podnieść je i włożyć do jednego z routerów, żeby wysłać je z powrotem do Internetu.",
		"Musimy znaleźć memy, wziąć je i wrzucić do routera, żeby trafiły z powrotem do Internetu.",
		"Memy czekają na ratunek, trzeba je znaleźć, zabrać do routera i uratować Internet"
		];
		this.say(advices[Math.floor(Math.random()*advices.length)]);

	}



	}

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

	this.stop_listening = function(){
		dialog.listening = false;
		$("#query").attr("disabled", "disabled").attr("placeholder", "czekaj...");
	}

	this.listen = function(){
		dialog.listening = true;
		$("#query").removeAttr("disabled").attr("placeholder", "wpisz polecenie....").focus();
	}

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
	dialog_controller.stop_listening();
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

