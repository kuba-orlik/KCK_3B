﻿Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
		
var visibility = 8;

var tree_offset = 0.65;



block_size=1;


// Constructor

MapApp = function()
{
    Sim.App.call(this);
}


// Subclass Sim.App
MapApp.prototype = new Sim.App();

// Our custom initializer
MapApp.prototype.init = function(param)
{
    Sim.App.prototype.init.call(this, param);
    
    for(var i=1; i<=map_size+map_padding; i++){
        for(var j=map_size+map_padding; j>=1-map_padding; j--){
            var square = new Square();
            square.init(i, j);
            this.addObject(square);   
            if(i<=map_size && j<=map_size){
                console.log(i, j);
                var arr = MapModel.objectMap[i][j];
                for(var k in arr){
                    var obj = new MapObject();
                    obj.init(i, j, arr[k]);
                    this.addObject(obj);
                }
            }                 
        }
    }

    controller.setup();
    
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);

    this.camera.position.x = 15*block_size;
    this.camera.position.y = 10*block_size;
    this.camera.position.z=30*block_size;
    this.camera.rotation.x = Math.round(45 * 100* Math.PI/180)/100;

    //console.log(this.camera.lookAt);

   // this.progression = 0;

   var camera_speed = 0.1;

    this.appUpdate = function(){
        if(this.camera.position.x>CameraModel.position.x){
            this.camera.position.x-=camera_speed;
        }
        if(this.camera.position.x<CameraModel.position.x){
            this.camera.position.x+=camera_speed;
        }
        if(this.camera.position.y>CameraModel.position.y){
            this.camera.position.y-=camera_speed;
        }
        if(this.camera.position.y<CameraModel.position.y){
            this.camera.position.y+=camera_speed;
        }
        //this.camera.position = CameraModel.position;
        //this.camera.position.x += block_size/30;
        //this.camera.position.y += block_size/30;
        this.camera.position.z = CameraModel.position.z;
    }

}

MapApp.prototype.appUpdate = function(){
    console.log('self2');
}

// Custom Earth class
Square = function()
{
    Sim.Object.call(this);
    this.size = block_size;
}

Square.prototype = new Sim.Object();


Square.prototype.init = function(x, y){   
    var type=MapModel.floorMap[x][y];
    this.x = x;
    this.y = y;
    var reflectivity = 0;    
    switch(type){
        case "grass":
            var earthmap = "tiles/grass_4pak.png";
            break;
        case "water":
            var earthmap = "tiles/water background.png";
            reflectivity = 1;
            break;
        case "ice":
            var earthmap = "tiles/ice.png";
            reflectivity = 0;
            break;
            
    }
    //console.log(earthmap);
    var geometry = new THREE.PlaneGeometry(this.size, this.size);
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial( { transparent: true, opacity: 1, map: texture, color: 0xffffff, reflectivity: reflectivity } );
    //material.depthWrite = true;
    var mesh = new THREE.Mesh( geometry, material ); 

    mesh.translateX(x*this.size);
    mesh.translateY(y*this.size);
    this.mesh = mesh;
    this.material = material;
    //mesh.rotation.x = Math.round(-45 * 100 * Math.PI /180)/100;
    //mesh.renderDepth = y*block_size;

    //this.original_texture = 



    this.setObject3D(mesh); 
}


Square.prototype.update = function()
{
    var main_hero = controller.main_hero;
    var hero_position = main_hero.mesh.position;
    var distance = Math.sqrt(Math.pow((hero_position.x-this.x), 2)+Math.pow((hero_position.y-this.y), 2))
    if(distance>visibility){
        var opacity = 0
    }else{
        var opacity = 1-distance/visibility;
    }
    this.material.opacity = opacity;
    //if(Math.abs(hero.position.x-this.mesh.position.x)>5)
}

// Custom Sun class
Sun = function()
{
    Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function()
{
    // Create a point light to show off the earth - set the light out back and to left a bit
    //var light = new THREE.DirectionalLight( 0xa8813b, 2);
    var light = new THREE.DirectionalLight( 0xffffff, 1);
    light.position.set(-10, 0, 20);
    


    // Tell the framework about our object
    this.setObject3D(light);    
}

MapObject = function(){
    Sim.Object.call(this);
}

MapObject.prototype = new Sim.Object();

MapObject.prototype.init = function(x, y, type){
    this.x = x;
    this.y = y;
    var register = false;
    this.type=type;
    switch(type){
        case "tree":
            var textureURL = "tiles/tree_smile.png";
            var width = 1;
            var height = 2;
            y=y+0.2;
            break;
        case "luigi":
            //alert('luigi');
            //console.log('luigi')
            var textureURL = "tiles/luigi.png";
            var width = 0.4;
            var height = 0.8;
            var att = 0;
            register = true;
            break;
        case "water":
            var textureURL = "tiles/samawoda.png";
            break;
        case "meme":
            var width = 1;
            var height = 1;
            var att = 0.5;
            var textureURL = "tiles/"  + this.tile;
            break;
        case "router":
            var width = 1;
            var height = 1;
            var att=0.5;
            var textureURL = "tiles/router.png";

            break;
            
    }
    object_storage.registerObject(this);
    width = width*block_size;
    height = height * block_size;
    //alert(textureURL);
    var geometry = new THREE.PlaneGeometry(width, height);
    var texture = THREE.ImageUtils.loadTexture(textureURL);
    var material = new THREE.MeshPhongMaterial( { map: texture, transparent:true, color: 0xffffff } );
    //material.depthWrite = false;
    this.texture = texture;

    this.material = material;

    var mesh = new THREE.Mesh( geometry, material ); 

    this.mesh = mesh;

    mesh.position.x=x*block_size;
    //mesh.position.y=(y + 0.7)*block_size;
    mesh.position.y = y*block_size;
    mesh.translateZ(1*block_size);  
    mesh.position.z = 0.5;

    mesh.rotation.x = Math.round(45 * 100 * Math.PI /180)/100;

    //mesh.renderDepth = y*block_size;
    //mesh.renderDepth = -y*1000 ;
    
    //console.log(mesh.rotation.x);

    this.setObject3D(mesh); 
}

function getGray(ratio){
    ratio = Math.floor(ratio*10)/10;
    switch(ratio){
        case 0:
            return 0x000000;
            break;
        case 0.1:
            return 0x111111;
            break;
        case 0.2:
            return 0x222222;
            break;
        case 0.3:
            return 0x333333;
            break;
        case 0.4:
            return 0x444444;
            break;
        case 0.5:
            return 0x666666;
            break;
        case 0.6:
            return 0x888888;
            break;
        case 0.7:
            return 0xaaaaaa;
            break;
        case 0.8:
            return 0xcccccc;
            break;
        case 0.9:
            return 0xeeeeee;
            break;
        case 1:
            return 0xffffff;
            break;
    }
}

MapObject.prototype.update = function(){
    switch(this.type){
        case 'tree':
            this.mesh.position.z=0.65;
            break;
        case 'luigi':
            this.mesh.position.z = 0.3;
            break;
        case 'meme':
            this.mesh.position.z = 0.5;
    }
    if(this.type!="luigi"){
        var main_hero = controller.main_hero;
        var hero_position = main_hero.mesh.position;
        var distance = Math.sqrt(Math.pow((hero_position.x-this.x), 2)+Math.pow((hero_position.y-this.y), 2))
        if(distance>visibility){
            var opacity = 0
        }else{
            var opacity = 1-distance/visibility;
        }
        //this.material =  new THREE.MeshPhongMaterial( { map: this.texture, transparent:true, color: 0x000000 } );
        //this.material.color = 0x000000;
        //this.material.color = 0xffffff;
        this.material.color = new THREE.Color(getGray(opacity));   
        var tree_add_hack = 0;
        if(this.type=="tree"){
            tree_add_hack=1;
        }
        if(hero_position.x==this.mesh.position.x && (hero_position.y+tree_add_hack>=this.mesh.position.y)){
            this.material.opacity = 0.5;
        }else{
            this.material.opacity = 1;
        }
    }
    if(this.type=="meme"){
        if(this.in_basket || this.in_router){
            this.material.opacity = 0;
        }
    }
}

MapObject.prototype.setPos = function(x, y){
    this.mesh.position.x = x;
    this.mesh.position.y = y;
}

MapObject.prototype.setZ = function(z){
    this.mesh.position.z = z;
}

MapObject.prototype.translate = function(x, y){

/*

    console.log('translate(', x, y, ")");
	
	if(x!=0 || y!=0){
		var new_x = parseInt(this.mesh.position.x)+parseInt(x);
		var new_y = parseInt(this.mesh.position.y)+parseInt(y);
		console.log(MapModel.isObstacle(new_x, new_y));
    
    
    //this.mesh.position.x+=x;
    //this.mesh.position.y+=y;
		var position = this.mesh.position;
        var obstacle = MapModel.isObstacle(position.x+new_x, position.y+new_y);
        console.log(obstacle);
        if(!obstacle.obstacle){
            this.setPos(new_x, new_y);
			CameraModel.updatePosition();
        }else{
            if(obstacle.reason=="water"){
                say("Dalej nie pójdę! Tam jest mokro!");
            }else{
                say('Dalej nie mogę iść, ponieważ na mojej drodze stoi przeszkoda');                
            }
			dialog_controller.listen();
		}
		}else{
			if(x!=undefined){
				say('Ok, doszedłem na miejsce! Co teraz?');
				dialog_controller.listen();            
        }
    }
}

*/

    console.log('translate(', x, y, ")");
    var new_x = parseInt(this.mesh.position.x)+parseInt(x);
    var new_y = parseInt(this.mesh.position.y)+parseInt(y);
    console.log(MapModel.isObstacle(new_x, new_y));
    this.setPos(new_x, new_y);
    CameraModel.updatePosition();
    //this.mesh.position.x+=x;
    //this.mesh.position.y+=y;
	dialog_controller.listen(); 
}


MapObject.prototype.translate_steps = function(x, y, avoid_obstacles, callback){
    if(avoid_obstacles==undefined){
        avoid_obstacles=true;
    }
    var self = this;
    var position = this.mesh.position;
    console.log('translate_steps(', x, y, ")");
    if(x!=0 || y!=0){
        var step_x = x/Math.abs(x);
        if(x==0){
            step_x = 0;
        }
        var step_y = y/Math.abs(y);
        if(y==0){
            step_y = 0;
        }
        console.log('step_y', step_y);
        var obstacle = MapModel.isObstacle(position.x+step_x, position.y+step_y);
        console.log(obstacle);
        if(!obstacle.obstacle  || !avoid_obstacles){
            this.translate(step_x, step_y);
            setTimeout(function(){
                self.translate_steps(x-step_x, y-step_y, avoid_obstacles, callback);
            }, 500)                    
        }else{
            if(obstacle.reason=="water"){
                say("Dalej nie pójdę! Tam jest mokro!");
            }else{
                say('Dalej nie mogę iść, ponieważ na mojej drodze stoi przeszkoda');                
            }
            dialog_controller.listen();
        }
    }else{
        if(callback!=undefined){
            callback();
        }else{
            if(x!=undefined){
                say('Ok, doszedłem na miejsce! Co teraz?');
                dialog_controller.listen();            
            }            
        }
    }
}

MapObject.prototype.goNear = function(x,y, callback){
    var self_pos = this.mesh.position;
    var dif_x=0;
    var dif_y=0;
     if(x>self_pos.x){
        dif_x=-1;
    }
    if(x<self_pos.x){
        dif_x=1;
    }
    if(x==self_pos.x){
         if(y>self_pos.y){
            dif_y=-1;
        }
        if(y<self_pos.y){
            dif_y=1;
        }   
    }
    var found = false;
    if(MapModel.isObstacle(x+dif_x, y+dif_y).obstacle){
        for(var i=-1; i<=1; i++){
            for(var j=-1; j<=1; j++){
                var temp_dif_x=i;
                var temp_dif_y=j;
                if(!MapModel.isObstacle(x+temp_dif_x, y+temp_dif_y).obstacle){
                    found = true;
                    break;
                }
            }
            if(found){
                break;
            }
        }
    }
    if(found){
        dif_x=temp_dif_x;
        dif_y = temp_dif_y;
    }
    this.goStraightTo(x+dif_x, y+dif_y, callback);
}

MapObject.prototype.parseTranslate = function(ile, kierunek){
    var amount = parseNumber(ile);
    if(amount!=null){
        console.log('number_parse_result:', amount);
        var coords = parseDirection(kierunek);
        //alert(coords);
        if(coords!=null){
            coords.y = coords.y*amount;
            coords.x = coords.x*amount;
            controller.main_hero.translate_steps(coords.x, coords.y);               
        }        
    }else{
        dialog_controller.listen()
    }
}

MapObject.prototype.goAsFarAsPossible = function(direction){
    if(direction!=null){
        var new_position =  {
            x: this.mesh.position.x + direction.x,
            y: this.mesh.position.y + direction.y
        }
        var self = this;
        var obstacle = MapModel.isObstacle(new_position.x, new_position.y);
        if(!obstacle.obstacle){
            this.translate(direction.x, direction.y);
            setTimeout(function(){
                self.goAsFarAsPossible(direction);
            }, 500)
        }else{
            say("Ok, dalej nie mogę!");
            dialog_controller.listen();
        }        
    }
}

MapObject.prototype.lookAround = function(radius){
    CameraModel.position.x = this.mesh.position.x;
    CameraModel.position.y = this.mesh.position.y+CameraModel.y_offset;
    console.log('look around');
    var current_position = this.mesh.position;
    var surroundings = MapModel.getObjects(current_position.x, current_position.y+1, radius);
    var objects = surroundings.objects;
    var summary = surroundings.summary;
    //console.log(summary);
    if(Object.size(summary)==0){
        say("Nie widzę nic ciekawego dookoła");
    }else{
        say("W pobliżu widzę:...");        
    }
    for(var i in summary){
        var type=i;
        switch(type){
            case "tree":
                //var to_say = "Widzę ";
                var to_say = "";
                if(summary[i]==1){
                    to_say+="jedno drzewo."
                }else{
                    to_say+= summary[i] + " drzew.";
                }
                say(to_say);
                break;
            case "meme":
                var meme_count=0;
                for(var i in objects){
                    if(objects[i].type=="meme" && !objects[i].in_basket && !objects[i].in_router){
                        meme_count++;
                    }
                }
                if(meme_count==1){
                    var to_say = "OMG widzę mema";                    
                }else if(meme_count>1){
                    var to_say = "OMG widzę memy";
                }else if(meme_count==0){
                    var to_say = "W zasięgu mojego wzroku nie widzę żadnych memów.";
                }
                say(to_say);
                for(var i in objects){
                    if(objects[i].type=="meme" && !objects[i].in_basket && !objects[i].in_router){
                        say("W pobliżu grasuje mem '" + objects[i].acceptable_names[0] + "'");                           
                    }
                }
                break;
            case "router":
                say ("Zauważyłem router. Pomyśl czy to nie czas, żeby wysłać jakieś memy do Interentu.");
                break;
        }
    }
    if(summary.meme==undefined){
        say("W zasięgu mojego wzroku nie widzę żadnych memów.");
    }
    dialog_controller.listen();
}

MapObject.prototype.howFarIs = function(x, y){
    var position = this.mesh.position;
    var distance = Math.sqrt(Math.pow((x-position.x), 2)+Math.pow((y-position.y), 2));
    return Math.round(distance);
}

MapObject.prototype.reportRelativeDirection = function(x, y, what){
    var position = this.mesh.position;
    var to_say = "Wiem, że " + what + " jest";
    var coma = false;
    if(position.x>x){
        to_say+=  " na lewo";
        coma = true;
    }else if(position.x<x){
        to_say += " na prawo";
        coma = true;
    }else{

    }
    if(position.y>y){
        if(coma){
            to_say+=",";
        }
        to_say+= " na dół";
    }else if(position.y<y){
        if(coma){
            to_say+=",";
        }
        to_say+=" do góry";
    }
    to_say +=" ode mnie.";
    say(to_say);
}

MapObject.prototype.findClosestMeme = function(){
    var min_meme = controller.getClosestMeme();
    if(min_meme==null){
        say("Nie ma już żadnych memów luzem. Zanieś memy, które masz w koszyku, do routera!");
    }else{
        say("Najbliżej jest mem " + min_meme.acceptable_names[0] + ".");        
       this.reportRelativeDirection(min_meme.x, min_meme.y, min_meme.acceptable_names[0]);
    }
    dialog_controller.listen();
}

MapObject.prototype.gotoMemeIfVisible = function(meme_name){
    var meme = controller.getMemeByName(meme_name);
    if(meme!=null){
        var meme_position = meme.mesh.position;
        var distance = this.howFarIs(meme_position.x, meme_position.y);
        //alert(distance);
        if(distance>visibility){
            say("Nie wiem, jak dojść do mema <i>" + meme.acceptable_names[0] + "</i>. Jest za daleko.");
        }else{
            this.goNear(meme.x, meme.y);
            /*var self_pos = this.mesh.position;
            var dif_x=0;
            var dif_y=0;
            if(meme.x>self_pos.x){
                dif_x=-1;
            }
            if(meme.x<self_pos.x){
                dif_x=1;
            }
            if(meme.x==self_pos.x){
                 if(meme.y>self_pos.y){
                    dif_y=-1;
                }
                if(meme.y<self_pos.y){
                    dif_y=1;
                }   
            }
            this.goStraightTo(meme.x + dif_x, meme.y + dif_y); */
        }
        dialog_controller.listen();
    }
}

MapObject.prototype.goStraightTo = function(x, y, callback){
    this.translate_steps(x-this.mesh.position.x, y-this.mesh.position.y, false, callback);
}

MapObject.prototype.takeMeme = function(meme_name){
    var meme = controller.getMemeByName(meme_name);
    if(meme==null){
        say("Nie wiem, co to za mem " + meme_name);
    }else{
        var distance = this.howFarIs(meme.x, meme.y);
        if(distance>2){
            say("Nie sięgam! Muszę podejść bliżej.");
            dialog_controller.listen();
        }else{
            this.goNear(meme.x, meme.y, function(){
                basket.insertMeme(meme);                
            })
        }
    }
}

MapObject.prototype.goToRouter = function(callback){
    var router = object_storage.objects.router[0];
    var router_position = router.mesh.position;
    var distance = this.howFarIs(router_position.x, router_position.y);
    if(distance<visibility){
        controller.main_hero.goNear(router_position.x, router_position.y, callback);        
        dialog_controller.listen();
        return true;
    }else{
        say("Nie widzę routera, jest za daleko. ");
        this.reportRelativeDirection(router_position.x, router_position.y, "router");
        dialog_controller.listen();
        return false;
    }
}

MapObject.prototype.dumpMemes = function(){
    var near_router = this.goToRouter(function(){
        //alert('zrzucanie');
        var s = 0;
        var last_meme;
        for(var i in meme_collection.collection){
            var meme = meme_collection.collection[i];
            console.log(meme);
            if(meme.in_basket){
                s++;    
                meme.in_basket = false;
                meme.in_router = true;
                last_meme = meme;
                basket.removeMeme(meme);
            }
        }
        if(s==0){
            say("No dobra, doszedłem do routera, ale nie mam żadnych memów w koszyku... więc nie mam memów do wrzucenia.");
        }else if(s==1){
            say("Ok, wrzuciłem mema <i>" + last_meme.acceptable_names[0] + "</i> do Internetu.");
        }else{
            say("Wporząsiu! Kolejne " + s + " memów jest już w Internecie.");
        }
        controller.report();
        if(controller.howManyMemesFree()==0){
            document.location="http://disco.fleo.se/?name=wygrales";
        }
    });
}

Router = function(){
}

Router.init = function(x, y){
    this.prototype.init(x, y, 'router');
    this.tile = 'router.png';
}

Router.prototype = new MapObject();

