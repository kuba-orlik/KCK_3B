var objectMap = [];
for(var i = 1; i<=100; i++){
	objectMap[i] = [];
	for(var j=1; j<=100; j++){
		objectMap[i][j] = [];
		var rand = Math.ceil(Math.random()*2);
		switch(rand){
			case 1:
				objectMap[i][j].push('tree');
				break;
		}
	}
}


console.log(objectMap);
