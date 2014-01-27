Meme = function(machine_name, tile, acceptable_names){
	this.machine_name = machine_name;
	this.tile = tile;
	this.acceptable_names = acceptable_names;

	this.type="meme";
}

Meme.prototype = MapObject;

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
				return this.collection[i];
			}
		}
		return null;
	}
}