var map_size = 80;

var water_probability = 3;

var grass_probability = 17;

var MapModel = {};

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


var CameraModel = {
	position: {
		x: 15,
		y:10,
		z:5
	}
};

$(document).ready(function(){
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


