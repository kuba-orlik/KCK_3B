var OBJECT_COUNT = 0;

var object_storage = new function(){

	this.objects= {};

	this.registerObject= function(object){
		console.log('register');
		var type = object.type;
		console.log(type);
		if(this.objects[type]==undefined){
			this.objects[type]=[];
		}
		this.objects[type].push(object);
	};

	this.getObjectsByType= function(type){
		console.log(this.objects);
		for(var i in this.objects){
			console.log(objects[i]);
		}
	}
}

function mapObject(){

	OBJECT_COUNT++;

	this.id = OBJECT_COUNT;

	this.goto = function(x, y){
		
	}

}

var objectMap = [];
for(var i = map_size; i>=1; i--){
	objectMap[i] = [];
	for(var j=1; j<=map_size; j++){
		objectMap[i][j] = [];
		//objectMap[i][j].push('luigi');
		//objectMap[i][j].push('tree');
		var rand = Math.ceil(Math.random()*3);
		switch(rand){
			case 1:
				if(MapModel.floorMap[i][j]=='grass' && i!=15 && j!=15){
					objectMap[i][j].push('tree');					
				}
				break;
		}
	}
}
objectMap[15][15].push('luigi');

MapModel.objectMap = objectMap;


console.log(objectMap);

//console.log(objectMap);
