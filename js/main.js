/*global THREE, requestAnimationFrame, console*/

var cameras = [];

//Clock creation
var clock = new THREE.Clock();

var scene, renderer, currentCamera;

var geometry, material, mesh;

var box, pyramid, cone, sphere, torus;

/*Colors that will be used in the materials
Respectively, blue, cyan, magenta, yellow, green*/
var colors = [0x0000FF,0x00FFFF,0xFF00FF,0xFFFF00, 0x00FF00];

var articulateObj;

var articulateObjCoords;

var axis = [];

//auxiliary object that holds the pressed 
//status of every key used in the program
let keys = {
    Q : false,
    W : false,
    A : false,
    S : false,
    Z : false,
    X : false,
    C : false,
    D : false,
    leftArrow : false,
    rightArrow : false,
    upArrow : false,
    downArrow : false
}

/*Creates four cubes and a sphere*/
function createObject0( x, y, z, size ) {
    'use strict';

    const group = new THREE.Group ( );
    
    //For cycle, which creates four cubes varying the x and y coordinates
    for ( var i = 0; i < 5; i++ ) {
        var xAux = 0, yAux = 0;

        switch ( i ){
            case 0:
                xAux = ( size+10 );
                break;
            case 1:
                yAux = -( size+10 );
                break;
            case 2:
                break;
            case 3:
                yAux = ( size+10 );
                break;
            case 4:
                xAux = -( size+10 );
                break;
        }
        
        box = new Box(xAux, yAux, 0, size, size, size, colors[i]);
        group.add ( box.getObj3D() );
        
    }

    sphere = new Sphere ( -(size*3/2 + 10), -size/2, size/2, size/4, 20, 7, colors[1] );
    group.add ( sphere.getObj3D() );

    group.position.set ( x, y, z );

    scene.add(group);    
}

/* Creates a pyramid, cone and sphere, they are added in the articulated object */
function createObject1( x, y, z, radius, height, segs ) {
    'use strict';
    
    articulateObj = new THREE.Group ( );

    pyramid = new Cone( 0, 125, 0, radius/2, height/4, 4, colors[2] );
    articulateObj.add ( pyramid.getObj3D() );

    cone = new Cone( 0, 0, 0, radius, height, segs, colors[0] );
    articulateObj.add ( cone.getObj3D() );
    
    sphere = new Sphere ( 0, - ( height - 30 ), 0,radius, segs, segs, colors[1] );
    articulateObj.add ( sphere.getObj3D() )
    

    createObject2(300, 0, 0, 50, 20);

    articulateObj.position.set ( x, y, z );
    articulateObj.rotateZ(THREE.MathUtils.degToRad(160));

    scene.add ( articulateObj );

    //Add a new axis acording to the coordinates of the articulated object
    axis.push(new THREE.Vector3(articulateObj.position.x, articulateObj.position.y, articulateObj.position.z));
}

/*Creates two cones, sphere and a parallelpiped, added in the articulated object*/
function createObject2(x, y, z, radius, segs ) {
    'use strict';

    const group = new THREE.Group ( );

    sphere = new Sphere ( 0, 0, 0,radius, segs, segs, colors[3] );
    group.add ( sphere.getObj3D() );

    box = new Box ( 0, 0, 0, 3/2 * radius, 3.5 * radius, 20, colors[1], 0.5, 0, 0 );
    group.add( box.getObj3D() );

    pyramid = new Cone( 100, 0, 0, radius/3, radius/2, 4, colors[2] );
    group.add ( pyramid.getObj3D() );

    pyramid = new Cone( -100, 0, 0, radius/3, -radius/2, 4, colors[2] );
    group.add ( pyramid.getObj3D() );

    group.position.set ( x, y, z );
    articulateObj.add ( group );
}

/*Create a pyramid and two torus*/
function createObject3(x, y, z, radius, segs, height) {
    'use strict';

    const group = new THREE.Group ( );

    pyramid = new Cone( 0, 0, 0, height/13, height, 4, colors[2], THREE.MathUtils.degToRad(45), 0, THREE.MathUtils.degToRad(-90) );
    group.add ( pyramid.getObj3D() );

    torus = new Torus( 40, 0, 0, radius*1.5, radius/5, segs, segs, colors[3], 0, THREE.MathUtils.degToRad(-90), 0 );
    group.add ( torus.getObj3D() );

    torus = new Torus( 110, 0, 0, radius, radius/5, segs, segs, colors[0], 0, THREE.MathUtils.degToRad(-90), 0 );
    group.add ( torus.getObj3D() );


    box = new Box ( -height/2, height/13, 0, height/15, height/15, height/15, colors[1], 0, 0, THREE.MathUtils.degToRad(45) );
    group.add( box.getObj3D() );

    group.position.set ( x, y, z );

    scene.add ( group );
}

/*Function responsible for rotating objects of the group*/
function rotateObjects(group, clock_delta, reverseDirection=false, articulate = false, isPyramid = false){
    var value;
    var i=0;
    value =  reverseDirection ? -70 * clock_delta : 70 * clock_delta;
    
    if ( !articulate ){
        if ( isPyramid ) {
            group.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    if (i==2 || i == 3){ //getting the pyramid meshes
                        node.rotateZ( THREE.MathUtils.degToRad( value ) );
                    }
                    i++;
                }
            });
        } else {
            group.rotateX( THREE.MathUtils.degToRad( value ) );
            group.rotateY( THREE.MathUtils.degToRad( value ) );
        }
    } else {  
        group.rotateY( THREE.MathUtils.degToRad( value ) );
    }

    
}

/*Function responsible for translation movements*/
function moveObjects(node,direction){
    'use strict'
    switch ( direction ) {
        case "up":
            node.position.y += 10;
            break;
        case "down":
            node.position.y -= 10;
            break;
        case "left":
            node.position.x -= 10;
            break;
        case "right":
            node.position.x += 10;
            break;
        case "forward":
            node.position.z += 10;
            break;
        case "backward":
            node.position.z -= 10;
            break;
    } 
}

/*Function responsible for create all the objects and scene*/
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    
    createObject0( 300, 50, 25, 50 );
    createObject1( 100, 100, -200, 35, 200, 20 );
    createObject3(-300, -250, 100, 50, 30, 450);

}

/*Function responsible for changing the position of the camera*/
function createCamera() {
    'use strict';

    for ( var i = 0; i < 3; i++ ) {
        var camera = new THREE.OrthographicCamera(  window.innerWidth / - 2, 
                                                    window.innerWidth / 2, 
                                                    window.innerHeight / 2, 
                                                    window.innerHeight / - 2, 
                                                    1, 
                                                    10000 );
        
        switch( i ){
            case 0:
                //Frontal camera
                camera.position.set( 0, 0, 1000 );
                break;
            case 1:
                //Top camera
                camera.position.set( 0, 1000, 0 );
                break;
            case 2: 
                //Side camera
                camera.position.set( 1000, 0, 0);
                break;
        }
        camera.lookAt( scene.position );
        cameras.push( camera );
        currentCamera = cameras[0];
    }
    
}

/*Function that handles the change of the camera*/
function changePerspective(view){
    'use strict';
    switch(view){
        case "front":
            currentCamera = cameras[0];
            currentCamera.lookAt(scene.position);
            break;
        case "top":
            currentCamera = cameras[1];
            currentCamera.lookAt(scene.position);
            break;
        case "side":
            currentCamera = cameras[2];
            currentCamera.lookAt(scene.position);
            break;
    }

}

/*Function responsible for toggle the wireframe*/
function toggleWireframe(){
    'use strict'
    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
}

/*Event occurs when the browser window has been resized*/
function onResize() {
    'use strict';
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        currentCamera.left = window.innerWidth / -2;
        currentCamera.right = window.innerWidth / 2;
        currentCamera.top = window.innerHeight / 2;
        currentCamera.bottom = window.innerHeight / -2;
        currentCamera.updateProjectionMatrix();
    }
}

/*Detect if the following keys are down*/
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 49: //user pressed key 1, toggling normal view
        changePerspective("front");  
        console.log("front view");  
        break;
    case 50: //user pressed key 2
        changePerspective("top");
        console.log("top view");
        break;
    case 51:
        changePerspective("side");
        console.log("side view");
        break;
    case 52:
        toggleWireframe();
        console.log("wireframe view");
        break;
    case 81: //Q
        keys.Q = true
        console.log("Q key press");
        break;
    case 87: //W
        keys.W = true
        console.log("W key press");
        break;
    case 65: //A
        keys.A = true
        console.log("A key press");
        break;
    case 83: //S
        keys.S = true
        console.log("S key press");
        break;
    case 90: //Z
        keys.Z = true
        console.log("Z key press");
        break;
    case 88: //X
        keys.X = true
        console.log("X key press");
        break;
    case 37: //left arrow
        keys.leftArrow = true
        console.log("Left arrow key press"); 
        break;
    case 38: //up arrow
        keys.upArrow = true
        console.log("Up arrow key press"); 
        break;
    case 39: //right arrow
        keys.rightArrow = true
        console.log("Right arrow key press"); 
        break;
    case 40: //down arrow
        keys.downArrow = true
        console.log("Down arrow key press"); 
        break;  
    case 68: //d
        keys.D = true 
        console.log("D key press"); 
        break;
    case 67: //c
        keys.C = true
        console.log("C key press"); 
        break;
    }
}

/*Detect if the following keys are up*/
function onKeyUp(e) {
    'use strict';

    switch (e.keyCode) {
    case 81: //Q
        keys.Q = false;
        break;
    case 87: //W
        keys.W = false;
        break;
    case 65: //A
        keys.A = false;
        break;
    case 83: //S
        keys.S = false;
        break;
    case 90: //Z
        keys.Z = false;
        break;
    case 88: //X
        keys.X = false;
        break;
    case 37: //left arrow
        keys.leftArrow = false;
        break;
    case 38: //up arrow
        keys.upArrow = false;
        break;
    case 39: //right arrow
        keys.rightArrow = false;
        break;
    case 40: //down arrow
        keys.downArrow = false;
        break;  
    case 68: //d
        keys.D = false; 
        break;
    case 67: //c
        keys.C = false;
        break;
    }
}

/*Function responsible for managing the movements*/
function checkForMovements() {
    'use strict';

    //Get current time
    var delta = clock.getDelta();

    var groupList = [];
    scene.traverse(function (node) {
        if (node instanceof THREE.Group) {
            groupList.push(node);
        }
    });

    if ( keys.Q )
        rotateObjects( articulateObj, delta, false, true );
    if ( keys.W )
        rotateObjects( articulateObj, delta, true, true );
    if ( keys.A )
        rotateObjects( groupList[2], delta );
    if ( keys.S )
        rotateObjects( groupList[2], delta , true );
    if ( keys.Z )
        rotateObjects( groupList[2], delta , false, false, true );
    if ( keys.X )
        rotateObjects( groupList[2], delta , true, false, true );
    if ( keys.leftArrow )
        moveObjects( articulateObj,"left" );
    if ( keys.rightArrow )
        moveObjects( articulateObj,"right" );
    if ( keys.upArrow )
        moveObjects( articulateObj,"up" );
    if ( keys.downArrow )
        moveObjects( articulateObj,"down" );
    if ( keys.D )
        moveObjects( articulateObj,"forward" );
    if ( keys.C )
        moveObjects( articulateObj,"backward" );

}

/*Shows the output in the browser according to the camera*/
function render() {
    'use strict';
    renderer.render(scene, currentCamera);
}

/*Main program*/
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/*Function responsible for animation effects*/
function animate() {
    requestAnimationFrame( animate );    
    render();
    checkForMovements();
}