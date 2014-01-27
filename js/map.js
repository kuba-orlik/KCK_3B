Object.size = function(obj) {
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
    
    for(var i=1; i<=map_size; i++){
        for(var j=map_size; j>=1; j--){
            var square = new Square();
            square.init(i, j);
            this.addObject(square);                    
            var arr = MapModel.objectMap[i][j];
            for(var k in arr){
                var obj = new MapObject();
                obj.init(i, j, arr[k]);
                this.addObject(obj);
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
            var textureURL = "tiles/"  + this.tile;
            
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
    mesh.position.z = att;

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
    console.log('translate(', x, y, ")");
    var new_x = parseInt(this.mesh.position.x)+parseInt(x);
    var new_y = parseInt(this.mesh.position.y)+parseInt(y);
    console.log(MapModel.isObstacle(new_x, new_y));
    this.setPos(new_x, new_y);
    CameraModel.updatePosition();
    //this.mesh.position.x+=x;
    //this.mesh.position.y+=y;
}


MapObject.prototype.translate_steps = function(x, y){
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
        if(!obstacle.obstacle){
            this.translate(step_x, step_y);
            setTimeout(function(){
                self.translate_steps(x-step_x, y-step_y);
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
        if(x!=undefined){
            say('Ok, doszedłem na miejsce! Co teraz?');
            dialog_controller.listen();            
        }
    }
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
    console.log('look around');
    var current_position = this.mesh.position;
    var surroundings = MapModel.getObjects(current_position.x, current_position.y, radius);
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
                if(summary[i]){
                    var   to_say = "OMG widzę mema";                    
                }else{
                    var to_say = "OMG widzę memy";
                }
                say(to_say);
                for(var i in objects){
                    if(objects[i].type=="meme"){
                        say("W pobliżu grasuje mem '" + objects[i].acceptable_names[0] + "'");                           
                    }
                }
                break;
        }
    }
    dialog_controller.listen();
}