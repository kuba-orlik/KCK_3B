var map_size = 80;

var MapModel = {};

var types_amount = 2;
var floorMap = [];

for(var i=1; i<=map_size; i++){
	floorMap[i]=[];
	for(var j=1; j<=map_size; j++){
		var ran = Math.ceil(Math.random()*types_amount);
		switch(ran){
			case 1:
				floorMap[i][j]='grass';
				break;
			case 2: 
				floorMap[i][j]='water';
				break;
		}
	}
}

MapModel.floorMap = floorMap;