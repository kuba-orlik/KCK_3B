Meme = function(machine_name, tile, acceptable_names){
	this.machine_name = machine_name;
	this.tile = tile;
	this.acceptable_names = acceptable_names;

	this.type="meme";
}

Meme.prototype = new MapObject();

var memes = [
	new Meme("batman", "batman.png", [
		"batman",
		"dark knight",
		"batmana"
	]),
	new Meme("fuuu", "fuuu.png", [
		"rageguy",
		"rageman",
		"ragemen",
		"fu",
		"fuu",
		"fuuu",
		"fuuuu",
		"fuuuuu",
		"fuuuuuu",
		"ffu",
		"ffuu",
		"ffuuu",
		"ffuuuu",
		"fffu",
		"fffuu",
		"fffuuu",
		"fffuuuu",
		"ffffuuuu",
		"ragemana",
		"ragemena",
		"rageguya"
	]),
	new Meme("awesome", "lol.png", [
		"awesome",
		"awesome face",
		"epic smiley",
		"smiley",
		"smileya",
		"smiley'a",
		"epic smiley'a",
	]),
	new Meme("megusta", "megusta.png", [
		"megusta",
		"i like it"
	]),
	new Meme("mickey", "mickey.png", [
		"mickey",
		"mickey mouse",
		"mouse",
		"myszka miki",
		"miki",
		"myszkę miki",
		"mikiego",
		"mickey'ego",
		"mickey'a",
		"myszke miki"
	]),
	new Meme("nyan", "nyan.png", [
		"nyan cat",
		"cat",
		"nyan",
		"nyan cata",
		"cata",
		"kota"

	]),
]

var meme_collection = new function(){
	this.collection = memes;

	this.getMemeByMachineName = function(machine_name){
		for(var i in this.collection){
			if(this.collection[i].machine_name==machine_name){
				console.log('getMemeByMachineName returning', this.collection[i])
				return this.collection[i];
			}
		}
		console.log('getMemeByMachineName returning', null)
		return null;
	}

	this.getMemeByName = function(meme_name){
		meme_name = meme_name.toLowerCase();
		for(var i in this.collection){
			var meme = this.collection[i];
			for(var j in meme.acceptable_names){
				if(meme_name == meme.acceptable_names[j].toLowerCase()){
					return meme;
				}
			}
		}
		return null;
	}

	function randomCoor(){
		return Math.ceil(Math.random()*map_size);
	}

	this.putOnMap = function(){
		for(var i in this.collection){
			var meme = this.collection[i];
			//alert(meme);
			do{
				var coor_x = randomCoor();
				var coor_y = randomCoor();
			}while(MapModel.isObstacle(coor_x, coor_y).obstacle);
			console.log(coor_x, coor_y);
			MapModel.objectMap[coor_x][coor_y].push("meme/" + meme.machine_name);
			//alert('pushing meme/' + meme.machine_name);
			//alert("read: " +MapModel.objectMap[coor_x][coor_y][0] );
			meme.init(coor_x, coor_y, "meme");
			//object_storage.registerObject(meme);
			app.addObject(meme);
		}
		do{
			var coor_x = randomCoor();
			var coor_y = randomCoor();
		}while(
			MapModel.isObstacle(coor_x, coor_y).obstacle
		||	MapModel.isObstacle(coor_x+1, coor_y).obstacle
		||	MapModel.isObstacle(coor_x-1, coor_y).obstacle
		||	MapModel.isObstacle(coor_x, coor_y+1).obstacle
		||	MapModel.isObstacle(coor_x, coor_y-1).obstacle);
		//coor_x= 8;
		//coor_y = 8;
		alert('adding router');
		var router = new Router();
		MapModel.objectMap[coor_x][coor_y].push("router");
		router.init(coor_x, coor_y, "router");
		app.addObject(router);
	}
}