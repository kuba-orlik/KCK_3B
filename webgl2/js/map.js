


block_size=100;


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

    this.camera.position.x = 3*block_size;
    this.camera.position.y = 3*block_size;
    this.camera.position.z=5*block_size;
    this.camera.rotation.x = Math.round(45* 100* Math.PI/180)/100;

    this.selfUpdate = function(){
        this.camera.position.x += 0.225 * block_size/10;
        this.camera.position.y += 0.275 * block_size/10;
    }

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
            var earthmap = "http://dl.dropboxusercontent.com/u/1142760/static/html/webgl/tiles/samatrawa.png";
            break;
        case "water":
            var earthmap = "http://dl.dropboxusercontent.com/u/1142760/static/html/webgl/tiles/samawoda.png";
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
    var light = new THREE.DirectionalLight( 0xC5BC98, 2);
    light.position.set(-10, 0, 20);
    
    // Tell the framework about our object
    this.setObject3D(light);    
}


MapObject = function(){
    Sim.Object.call(this);
}

MapObject.prototype = new Sim.Object();

MapObject.prototype.init = function(x, y, type){
    switch(type){
        case "tree":
            var textureURL = "../tiles/samodrzewo.png";
            break;
        case "water":
            var textureURL = "../tiles/samawoda.png";
            break;
            
    }
    //console.log(textureURL);
    var geometry = new THREE.PlaneGeometry(1*block_size, 2*block_size);
    var texture = THREE.ImageUtils.loadTexture(textureURL);
    var material = new THREE.MeshPhongMaterial( { map: texture, transparent:true } );
    //material.depthWrite = false;

    var mesh = new THREE.Mesh( geometry, material ); 

    mesh.position.x=x*block_size;
    mesh.position.y=y*block_size;
    mesh.translateZ(1*block_size);

    mesh.rotation.x = Math.round(45 * 100 * Math.PI /180)/100;

    //mesh.renderDepth = y*block_size;
    //mesh.renderDepth = -y*1000 ;
    
    //console.log(mesh.rotation.x);

    this.setObject3D(mesh); 
}