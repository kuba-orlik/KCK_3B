
		
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
    
    // Create the Earth and add it to our sim
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
    
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);

    this.camera.position.x = 15*block_size;
    this.camera.position.y = 15*block_size;
    this.camera.position.z=30*block_size;
    this.camera.rotation.x = Math.round(45 * 100* Math.PI/180)/100;

    //console.log(this.camera.lookAt);

   // this.progression = 0;

    this.appUpdate = function(){
        this.camera.position = CameraModel.position;
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
    var reflectivity = 0;    
    switch(type){
        case "grass":
            var earthmap = "tiles/grass_4pak.png";
            break;
        case "water":
            var earthmap = "tiles/water background.png";
            reflectivity = 1;
            break;
            
    }
    //console.log(earthmap);
    var geometry = new THREE.PlaneGeometry(this.size, this.size);
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial( { map: texture, color: 0xffffff, reflectivity: reflectivity } );
    //material.depthWrite = true;
    var mesh = new THREE.Mesh( geometry, material ); 

    mesh.translateX(x*this.size);
    mesh.translateY(y*this.size);
    //mesh.rotation.x = Math.round(-45 * 100 * Math.PI /180)/100;
    //mesh.renderDepth = y*block_size;

    this.setObject3D(mesh); 
}


Square.prototype.update = function()
{
    // "I feel the Earth move..."
    //this.object3D.rotation.y += 0.1;

    //Sim.Object.prototype.update.call(this);
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
    var light = new THREE.DirectionalLight( 0xa8813b, 2);
    light.position.set(-10, 0, 20);
    


    // Tell the framework about our object
    this.setObject3D(light);    
}

MapObject = function(){
    Sim.Object.call(this);
}

MapObject.prototype = new Sim.Object();

MapObject.prototype.init = function(x, y, type){
    var register = false;
    this.type=type;
    switch(type){
        case "tree":
            var textureURL = "tiles/tree_smile.png";
            var width = 1;
            var height = 2;
            y=y+0.7;
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
            
    }
    object_storage.registerObject(this);
    width = width*block_size;
    height = height * block_size;
    //console.log(textureURL);
    var geometry = new THREE.PlaneGeometry(width, height);
    var texture = THREE.ImageUtils.loadTexture(textureURL);
    var material = new THREE.MeshPhongMaterial( { map: texture, transparent:true } );
    //material.depthWrite = false;

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

MapObject.prototype.update = function(){
    switch(this.type){
        case 'tree':
            this.mesh.position.z=0.65;
            break;
        case 'luigi':
            this.mesh.position.z = 0.3;
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
    this.setPos(this.mesh.position.x+x, this.mesh.position.y+y);
    //this.mesh.position.x+=x;
    //this.mesh.position.y+=y;
}