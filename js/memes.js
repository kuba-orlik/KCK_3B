Meme = function(machine_name, tile, acceptable_names){
	this.machine_name = machine_name;
	this.tile = tile;
	this.acceptable_names = acceptable_names;
}

meme.prototype = MapObject;

var memes = [
	new Meme("batman", "batman.png", [
		"batman",
		"dark knight"
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
		"ffffuuuu"
	]),
	new Meme("awesome", "lol.png", [
		"awesome",
		"awesome face",
		"epic smiley",
		"smiley"
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
		"miki"
	])
]