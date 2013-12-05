var objectMap = [];
for(var i = map_size; i>=1; i--){
	objectMap[i] = [];
	for(var j=1; j<=map_size; j++){
		objectMap[i][j] = [];
		var rand = Math.ceil(Math.random()*2);
		switch(rand){
			case 1:
				objectMap[i][j].push('tree');
				break;
		}
	}
}

MapModel.objectMap = objectMap;

//console.log(objectMap);
