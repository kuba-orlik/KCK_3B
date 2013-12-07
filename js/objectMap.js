var objectMap = [];
for(var i = map_size; i>=1; i--){
	objectMap[i] = [];
	for(var j=1; j<=map_size; j++){
		objectMap[i][j] = [];
		//objectMap[i][j].push('luigi');
		//objectMap[i][j].push('tree');
		var rand = Math.ceil(Math.random()*2);
		switch(rand){
			case 1:
				if(MapModel.floorMap[i][j]=='grass'){
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
