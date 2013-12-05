    // Constructor
MapApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
MapApp.prototype = new Sim.App();

// Our custom initializer
var MapModel = new function(){
    this.floorMap = floorMap;
    this.objectMap = objectMap;
}

var height = 800

MapApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create the Earth and add it to our sim
    for(var i=1; i<=80; i++){
        for(var j=1; j<=80; j++){
            var square = new Square();
            square.init(i, j);
            this.addObject(square);            
            for(var k in MapModel.objectMap[i][j]){
                var temp_obj = new MapObject();
                temp_obj.init(i,j, MapModel.objectMap[i][j][k]);
                this.addObject(temp_obj);
            }
        }
    }
    

    this.camera.position.x=5,
    this.camera.position.y=5;
    this.camera.position.z=6;
    this.camera.rotation.x=0.7;
    console.log(this.camera.rotation);
    console.log(this.camera.position);
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);
    this.selfUpdate = function(){
        //console.log('update');
        this.camera.position.x+=0.0125;
        this.camera.position.y+=0.0025;
    }
}


// Custom Earth class
Square = function()
{
	Sim.Object.call(this);
}

Square.prototype = new Sim.Object();

Square.prototype.init = function(x, y)
{
    // Create our Earth with nice texture
    var geometry = new THREE.PlaneGeometry(1, 1);
    var type=MapModel.floorMap[x][y];
    switch(type){
        case "grass":
            var earthmap = "../tiles/samatrawa.png";
            break;
        case 'water':
            var earthmap = "../tiles/samawoda.png";
            break;
    }    
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial( { map: texture } );
    //material.depthWrite=false;
    var mesh = new THREE.Mesh( geometry, material ); 

    // Let's work in the tilt
    //mesh.rotation.x = Square.TILT;
    mesh.translateX(x);
    mesh.translateY(y);
    //mesh.renderDepth = 1;
    
    // Tell the framework about our object
    this.order = 1;
    this.setObject3D(mesh);    
}

Square.prototype.update = function()
{
	// "I feel the Earth move..."
	//this.object3D.rotation.y -= Square.ROTATION_Y;
    //this.object3D.scale -= 0.1;
}

Square.ROTATION_Y = 0.0325;
Square.TILT = 0.41;

// Custom Sun class
Sun = function()
{
	Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function()
{
    // Create a point light to show off the earth - set the light out back and to left a bit
	var light = new THREE.DirectionalLight( 0xDFCF9C, 2);
	light.position.set(-10, 0, 20);
    
    // Tell the framework about our object
    this.setObject3D(light);    
}

MapObject = function()
{
    Sim.Object.call(this);
}

MapObject.prototype = new Sim.Object();

MapObject.prototype.init = function(x, y, type){
    //console.log(type);
    // Create our Earth with nice texture
    var geometry = new THREE.PlaneGeometry(1, 2);
    //var type=MapModel.objectMap[x][y];
    switch(type){
        case "tree":
            var earthmap = "../tiles/samodrzewo.png";
            break;
        case 'water':
            var earthmap = "../tiles/samawoda.png";
            break;
    }    
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial( { map: texture } );
    //material.depthWrite=false;
    var mesh = new THREE.Mesh( geometry, material ); 
    mesh.rotation.x = 0.7;

    // Let's work in the tilt
    //mesh.rotation.x = Square.TILT;
    mesh.translateX(x);
    mesh.translateY(y);
    mesh.translateZ(1);
    //mesh.renderDepth = 2;
    //console.log(mesh.position);
    // Tell the framework about our object
    this.order = 2;
    this.setObject3D(mesh);    
}