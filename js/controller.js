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
	
	//first parse all the (opt1|opt2|...) alternatives
	var opt_reg = /\([\w\| ]+\)/g;
	var matches = input.match(opt_reg);
	for(var i in matches){
		var match = matches[i];
		}
	
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
			new_regex = "([\\w]+)";
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

}

function scheme(notation, command){
    this.regex = Parser.parseToRegex(notation);

    this.command = command;

    this.execute = function(input){
        var params = Parser.extractAttributes(this.regex, input);
        this.command();
    }
}

scheme.prototype.matches = function(input){
    return input.match(this.regex)!=null;
}

scheme_collection = new function(){
    this.collection = [
        new scheme("(id(z|ź)|p(ó|o)jd(z|ź)|sk(a|o)cz) w #kierunek", function(kierunek){
            alert('idz w ' + kierunek);
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
    	console.log("user_input:" + input);
    	console.log(this.collection);
        for(var i in this.collection){
            var scheme = this.collection[i];
            if(scheme.matches(input)){
            	console.log('found match: ', scheme);
                scheme.execute();
            }
        }
    }

}


function submit_user_input(){
	var user_input = $('#query').val();
	scheme_collection.user_input(user_input);
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

