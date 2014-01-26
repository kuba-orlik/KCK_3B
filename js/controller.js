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
			new_regex = "([\\wóÓłŁżŻźŹćĆąĄęĘśŚ]+)\\W*";
		}
		processed_input = processed_input.replace(param_names[i], new_regex)
		}
	processed_input = processed_input.replace(/([ ,;]|\.\*)+/g, "\\W+");
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
        new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(z|ź)) (w|do|na) #kierunek", function(kierunek){        	
        	var amount = Math.ceil(Math.random()*3);
        	var coords = parseDirection(kierunek);
        	if(coords!=null){
	        	coords.y = coords.y*amount;
	        	coords.x = coords.x*amount;
	            controller.main_hero.translate_steps(coords.x, coords.y);        		
        	}
        }),
        new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (si(ę|e))? (jak)? (najdalej|najbardziej|najdalej|max|ma(x|ks)ymalnie) (w|do|na) #kierunek(jak (tylko)? si(ę|e) da|jak to (tylke)? mo(z|ż)liwe)?", function(kierunek){
        	controller.main_hero.goAsFarAsPossible(parseDirection(kierunek));
        }),
        new scheme("nasza notacja #parametr", function(parametr){
        	say(parametr);
        	dialog_controller.listen();
        }),
        new scheme("nie (id(ź|z)|p(ó|o)jd(ź|z)|sk(a|o)cz|przech(o|ó)d(ź|z)) (w #kierunek)?.*", function(kierunek){
        	if(kierunek!=undefined){
        		say("Dobrze, nie pójdę w " + kierunek);        		
        	}else{
        		say("Dobrze, nie pójdę. TAK BĘDĘ STAŁ")
        	}
        	dialog_controller.listen();
        }),
		new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (si(ę|e))? (o)? #ile (pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kratki|kratk(e|ę))? (w|do|na) #kierunek", function(ile, kierunek){
			controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("gdzie jeste(s|ś)?", function(){
        	say("za sałatą!");
			say(controller.main_hero.mesh.position.x, controller.main_hero.mesh.position.y)
        	dialog_controller.listen();
        }),
        new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (si(ę|e))? (w|do|na) #kierunek (o)? #ile (pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kratki|kratk(e|ę))?", function(kierunek, ile){
			controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("zr(ó|o)b #ile (kroki|kroków|krok) w #kierunek", function(ile, kierunek){
        	controller.main_hero.parseTranslate(ile, kierunek);
        }),
<<<<<<< HEAD
		new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)|zr(ó|o)b) (si(ę|e))? (o)? (pol(e|ę)|kwadrat|kratk(ę|e)|krok) w #kierunek", function(kierunek){
			controller.main_hero.parseTranslate("jeden", kierunek);
=======
		new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)|zr(ó|o)b) (si(ę|e))? (o)? (pol(e|ę)|kwadrat|kratk(ę|e)|krok) w #kierunek", function(ile, kierunek){
			controller.main_hero.parseTranslate(1, kierunek);
>>>>>>> a3caba415c92a8d1c06e74ba7b14255fcfed30fa
		}),
        new scheme("(elo|witaj|siema|joł|cześć|czesc)", function(){
        	say('Dzień dobry. Mamy dzisiaj piękny dzień');
        	listen();
        }),
        new scheme("(opowiedz mi (z|ż)art|tell (me)? (a)? joke|rozbaw mnie|jest mi smutno|smutno mi|walnij suchara|corny joke|karny suchar|Krzysiu Weiss)", function(){
        	$.get('http://api.icndb.com/jokes/random', function(data){
        		say("Ok, znasz ten angielski żart? <i>" + data.value.joke + "</i>");
        		dialog_controller.listen();
        	})
        }),
		new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (si(ę|e))? (o)? #ilex (pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kratki|kratk(e|ę))? (w|do|na) #kierunekx, (id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (si(ę|e))? (o)? #iley (pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kratki|kratk(e|ę))? (w|do|na) #kieruneky", function(ilex, kierunekx, iley, kieruneky){
            alert('idz w ' + ilex + kierunekx + iley + kieruneky);
		})
		new scheme("(id(z|ź)|przesu(n|ń)|p(ó|o)jd(z|ź)|sk(a|o)cz|przejd(ź|z)) (si(ę|e))? (o)? #ilex (pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kratki|kratk(e|ę))? (w|do|na) #kierunekx, (a)? (nast(ę}e)pnie|potem) (o)? #iley (pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kratki|kratk(e|ę))? (w|do|na) #kieruneky", function(ilex, kierunekx, iley, kieruneky){
            alert('idz w ' + ilex + kierunekx + iley + kieruneky);
		})
    ];

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

