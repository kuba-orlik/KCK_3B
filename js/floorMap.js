var map_size = 80;

var water_probability = 3;

var grass_probability = 17;

var MapModel = new (function(){})();

var types_amount = 2;
var floorMap = [];

for(var i=1; i<=map_size; i++){
	floorMap[i]=[];
	for(var j=1; j<=map_size; j++){
		var ran = Math.ceil(Math.random()*(water_probability + grass_probability));
		/*switch(ran){
			case 1:
				floorMap[i][j]='grass';
				break;
			case 2: 
				floorMap[i][j]='water';
				break;
		}*/
		if(ran<=water_probability){
			floorMap[i][j]='water';
		}else{
			floorMap[i][j]='grass';
		}
	}
}

MapModel.floorMap = floorMap;

MapModel.isObstacle = function(x,y){
	var floor = this.floorMap[x][y];
	var objects = this.objectMap[x][y];
	var response = {
		obstacle: false,
		type: null,
		reason: null
	}
	if(floor=='water'){
		response.obstacle = true;
		response.type = 'floor';
		response.reason = 'water';
	}
	if(objects.length>0 && this.objectMap[x][y][0]!="luigi"){
		response.obstacle = true;
		response.type = 'object';
		response.reason = this.objectMap[x][y][0];
	}
	return response;
	//console.log(floor, objects);
}


var CameraModel = new function(){
	this.position= {
		x: 15,
		y:10,
		z:5
	}

	var padding = 2;

	var y_offset = -5;

	this.updatePosition = function(){
		var hero_position = controller.main_hero.mesh.position;
		var dif_x = hero_position.x-this.position.x;
		var dif_y = hero_position.y-(this.position.y-y_offset);
		if(Math.abs(dif_x)>padding){
			console.log('dif_x:', dif_x);
			var to_move_x = (dif_x/Math.abs(dif_x))*Math.abs(Math.abs(dif_x)-padding);
			console.log('to_move_x:', to_move_x);
			this.position.x+=to_move_x;
		}
		if(Math.abs(dif_y)>padding){
			console.log('dif_y:', dif_y);
			var to_move_y = (dif_y/Math.abs(dif_y))*Math.abs(Math.abs(dif_y)-padding);
			console.log('to_move_y:', to_move_y);
			this.position.y+=to_move_y;
		}
	}
};

/*$(document).ready(function(){
	$(document).keydown(function(e){
		var c = e.keyCode;
		//console.log(e);
		switch(c){
			case 38:
				if(e.shiftKey){
					CameraModel.position.z-=1;
				}else{
					CameraModel.position.y+=1;					
				}
				break;
			case 39:
				CameraModel.position.x+=1;
				break;
			case 40:
				if(e.shiftKey){
					CameraModel.position.z+=1;
				}else{
					CameraModel.position.y-=1;
				}
				break;
			case 37:
				CameraModel.position.x-=1;
				break;
		}
		//console.log(CameraModel.position.x, CameraModel.position.y);
	});
	//alert('keypress added');
});


*/