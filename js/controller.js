var controller = new function(){

	var self = this;

	this.setup = function(){
		self.main_hero = object_storage.objects.luigi[0];
	}

	this.getMemeByName = function(meme_name){
		var meme = meme_collection.getMemeByName(meme_name);
		if(meme==null){
			say("nie wiem, co to za mem: <i>" + meme_name + "</i>");
			dialog_controller.listen();
		}
		return meme;
	}

	this.getClosestMeme = function(){
		var memes = object_storage.objects.meme;
	    var min_dist = Infinity;
	    min_meme = null;
	    for(var i in memes){
	        var meme = memes[i];
	        var dist = this.main_hero.howFarIs(meme.x, meme.y);
	        if(dist<min_dist && !meme.in_router && !meme.in_basket){
	            min_dist = dist;
	            min_meme = meme;
	        }
	    }
	    return min_meme;
	}

	this.howManyMemesInRouter = function(){
		var s = 0;
		for(var i in meme_collection.collection){
			var meme = meme_collection.collection[i];
			if(meme.in_router){
				s++;
			}
		}
		return s;
	}

	this.howManyMemesFree = function(){
		var s = 0;
		for(var i in meme_collection.collection){
			var meme = meme_collection.collection[i];
			if(!meme.in_basket && !meme.in_router){
				s++;
			}
		}
		return s;
	}



	this.report = function(){
		say("Memów w Internecie: " + this.howManyMemesInRouter() + ".");
		var meme_amount = this.howManyMemesFree();
		var meme_word="memów";
		switch(meme_amount){
			case 1:
				meme_word="mem";
				break;
			case 2:
				meme_word="memy";
				break;
			case 3:
				meme_word="memy";
				break;
			case 4:
				meme_word="memy";
				break;
		}
		say("Do złapania pozostało: " + meme_amount+ " " + meme_word + ".");
		basket.reportState();
		dialog_controller.listen();
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
}

function scheme(notation, command){
    this.regex = Parser.parseToRegex(notation);

    this.command = command;

    this.notation = notation;


    this.extractParameters = function(input){
    	var matches = input.match(this.regex);
    	if(matches==null){
    		input +=" ";
    		var matches = input.match(this.regex);
    	}
    	matches.splice(0, 1);
    	return matches;
    }

    this.execute = function(input){
        var params = this.extractParameters(input);
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
		case "tył":
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
	if(isNaN(parseInt(ile))){
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
		return parseInt(ile);
	}
}

scheme_collection = new function(){

    this.user_input = function(input){
    	var listen = dialog_controller.listen;
    	input = input.toLowerCase();
    	//input+=" ";
    	var found = false;
        for(var i in this.collection){
            var scheme = this.collection[i];
            if(scheme.matches(input)){
            	found = true;
                scheme.execute(input);
                break;
            }
        }
        if(!found){
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

	this.not_understood_combo = 0;

	this.didnt_understand = function(){
		this.not_understood_combo+=1;
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
		if(this.not_understood_combo>4){
			this.need_help();
		}		
	}


	this.need_help = function(){

		var advices = [
		"Pomóż mi poszukać memów, podnieść je i włożyć do jednego z routerów, żeby wysłać je z powrotem do Internetu.",
		"Musimy znaleźć memy, wziąć je i wrzucić do routera, żeby trafiły z powrotem do Internetu.",
		"Memy czekają na ratunek, trzeba je znaleźć, zabrać do routera i uratować Internet"
		];
		this.say(advices[Math.floor(Math.random()*advices.length)]);

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


var basket = new function(){
	this.memes = [];

	this.reportState = function(){
		var to_say = "W koszyku mam " + this.memes.length;
		if(this.memes.length==0){
			to_say+=" memów"
		}else if(this.memes.length==1){
			to_say+=" mem";
		}else if(this.memes.length<5 ){
			to_say+=" memy"
		}else{
			to_say+="memów";
		}
		if(this.memes.length==0){
			to_say+=".";
		}else{
			to_say+=":";
		}
		say(to_say);
		for(var i in this.memes){
			say(this.memes[i].acceptable_names[0]);
		}	
	}

	this.removeMeme = function(meme){
		for(var i in this.memes){
			if(this.memes[i].machine_name == meme.machine_name){
				console.log("splicing", this.memes[i]);
				this.memes[i].x=map_size+2;
				this.memes.splice(i, 1);
				break;
			}
		}
	}

	this.insertMeme = function(meme){
		for(var i in this.memes){
			var already = false;
			if(meme.machine_name==this.memes[i].machine_name){
				already = true;
				break;
			}
		}
		if(!already){
			this.memes.push(meme);
			meme.in_basket = true;
			say("Ok, wrzuciłem mema " + meme.acceptable_names[0] + " do koszyka.");
		}else{
			say("Mem " + meme.acceptable_names[0] + " już jest w koszyku.");
		}
		this.reportState();
	}
}
