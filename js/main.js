/*global THREE, requestAnimationFrame, console*/

var cameras = [];

var scene, renderer, currentCamera;

var geometry, material, mesh;

var box, pyramid, cone, sphere, torus;

var colors = [0x0000FF,0x00FFFF,0xFF00FF,0xFFFF00, 0x00FF00];

var articulateObj;

var articulateObjCoords;

var axis = [];

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

function createBoxes( x, y, z, size ) {
    'use strict';

    const group = new THREE.Group();
    
    const sphereMaterial = new THREE.MeshBasicMaterial ( {color: colors[1], wireframe: false} );

    for( var i = 0; i < 5; i++ ){
        var xAux = 0, yAux = 0;

        material = new THREE.MeshBasicMaterial({ color: colors[i], wireframe: false });
        box = new THREE.Object3D();
        geometry = new THREE.BoxGeometry( size, size, size );
        mesh = new THREE.Mesh( geometry, material );

        switch(i){
            case 0:
                xAux = (size+10);
                break;
            case 1:
                yAux = -(size+10);
                break;
            case 2:
                break;
            case 3:
                yAux = (size+10)
                break;
            case 4:
                xAux = -(size+10);
                break;
        }
        
        box.position.set( xAux, yAux, 0 );
        box.add( mesh );
        group.add(box);
        
    }

    sphere = new THREE.Object3D ( );
    geometry = new THREE.SphereGeometry ( size/4, 20, 7 );
    mesh = new THREE.Mesh ( geometry, sphereMaterial );
    sphere.position.set ( -(size*3/2 + 10), -size/2, size/2 );
    sphere.add ( mesh );
    group.add ( sphere );

    group.position.set ( x, y, z );
    //group.rotation.set(-10,-10,0);

    const axesHelper = new THREE.AxesHelper( 100 );

    group.add( axesHelper );
    scene.add(group);    
}

function createCones( x, y, z, radius, height, segs ) {
    'use strict';
    
    articulateObj = new THREE.Group ( );
    const coneMaterial = new THREE.MeshBasicMaterial ( {color: colors[0], wireframe: false} );
    const sphereMaterial = new THREE.MeshBasicMaterial ( {color: colors[1], wireframe: false} );
    const pyramidMaterial = new THREE.MeshBasicMaterial ( {color: colors[2], wireframe: false} );

    pyramid = new THREE.Object3D ( );
    geometry = new THREE.ConeGeometry ( radius/2, height/4, 4 );
    mesh = new THREE.Mesh ( geometry, pyramidMaterial );
    pyramid.position.set ( 0, 125, 0 );
    pyramid.add ( mesh );
    articulateObj.add ( pyramid );
   
    cone = new THREE.Object3D ( );
    geometry = new THREE.ConeGeometry ( radius, height, segs );
    mesh = new THREE.Mesh ( geometry, coneMaterial );
    cone.position.set(0, 0, 0)
    cone.add ( mesh );
    articulateObj.add ( cone );
    
    sphere = new THREE.Object3D ( );
    geometry = new THREE.SphereGeometry ( radius, segs, segs );
    mesh = new THREE.Mesh ( geometry, sphereMaterial );
    sphere.position.set ( 0, -(height-30), 0 );
    sphere.add ( mesh );
    articulateObj.add ( sphere );

    createSphere(300, 0, 0, 50, 20);

    articulateObj.position.set ( x, y, z );
    articulateObj.rotateZ(THREE.MathUtils.degToRad(160));

    const axesHelper = new THREE.AxesHelper( 100 );
    
    articulateObj.add( axesHelper );
    scene.add ( articulateObj );
    axis.push(new THREE.Vector3(articulateObj.position.x, articulateObj.position.y, articulateObj.position.z));
}

function createSphere(x, y, z, radius, segs ) {
    'use strict';

    const group = new THREE.Group ( );

    const sphereMaterial = new THREE.MeshBasicMaterial ( {color: colors[3], wireframe: false} );
    const rectangleMaterial = new THREE.MeshBasicMaterial ( {color: colors[1], wireframe: false} );
    const pyramid1Material = new THREE.MeshBasicMaterial ( {color: colors[2], wireframe: false} );
    const pyramid2Material = new THREE.MeshBasicMaterial ( {color: colors[2], wireframe: false} );

    sphere = new THREE.Object3D ( );
    geometry = new THREE.SphereGeometry ( radius, segs, segs );
    mesh = new THREE.Mesh ( geometry, sphereMaterial );
    sphere.position.set ( 0, 0, 0 );
    sphere.add ( mesh );
    group.add ( sphere );

    box = new THREE.Object3D();
    geometry = new THREE.BoxGeometry( 3/2 * radius, 3.5 * radius, 20);
    mesh = new THREE.Mesh( geometry, rectangleMaterial);
    box.position.set(0, 0, 0);
    box.rotation.set(0.5, 0, 0);
    box.add( mesh );
    group.add( box );

    pyramid = new THREE.Object3D ( );
    geometry = new THREE.ConeGeometry ( radius/3, radius/2, 4 );
    mesh = new THREE.Mesh ( geometry, pyramid1Material );
    pyramid.position.set ( 100, 0, 0 );
    pyramid.add ( mesh );
    group.add ( pyramid );

    pyramid = new THREE.Object3D ( );
    geometry = new THREE.ConeGeometry ( radius/3, -radius/2, 4 );
    mesh = new THREE.Mesh ( geometry, pyramid2Material );
    pyramid.position.set ( -100, 0, 0 );
    pyramid.add ( mesh );
    group.add ( pyramid );

    group.position.set ( x, y, z );

    const axesHelper = new THREE.AxesHelper( 100 );
    
    group.add( axesHelper );
    articulateObj.add ( group );
}

function createPyramid(x, y, z, radius, segs, height) {
    'use strict';

    const group = new THREE.Group ( );

    const torus1Material = new THREE.MeshBasicMaterial ( {color: colors[3], wireframe: false} );
    const torus2Material = new THREE.MeshBasicMaterial ( {color: colors[0], wireframe: false} );
    const rectangleMaterial = new THREE.MeshBasicMaterial ( {color: colors[1], wireframe: false} );
    const pyramidMaterial = new THREE.MeshBasicMaterial ( {color: colors[2], wireframe: false} );

    pyramid = new THREE.Object3D ( );
    geometry = new THREE.ConeGeometry ( height/13, height, 4 );
    mesh = new THREE.Mesh ( geometry, pyramidMaterial );
    pyramid.position.set ( 0, 0, 0 );
    pyramid.rotation.set( Math.PI/4, 0, -Math.PI/2 );
    pyramid.add ( mesh );
    group.add ( pyramid );

    torus = new THREE.Object3D ( );
    geometry = new THREE.TorusGeometry ( radius*1.5, radius/5, segs, segs );
    mesh = new THREE.Mesh ( geometry, torus1Material );
    torus.position.set ( 40, 0, 0 );
    torus.rotation.set( 0, -Math.PI/2, 0);
    torus.add ( mesh );
    group.add ( torus );

    torus = new THREE.Object3D ( );
    geometry = new THREE.TorusGeometry ( radius, radius/5, segs, segs );
    mesh = new THREE.Mesh ( geometry, torus2Material );
    torus.position.set ( 110, 0, 0 );
    torus.rotation.set( 0, -Math.PI/2, 0);
    torus.add ( mesh );
    group.add ( torus );

    box = new THREE.Object3D();
    geometry = new THREE.BoxGeometry( height/15, height/15, height/15);
    mesh = new THREE.Mesh( geometry, rectangleMaterial);
    box.position.set(-height/2, height/13 , 0);
    box.rotation.set(0 , 0, Math.PI/4);
    box.add( mesh );
    group.add( box );


    group.position.set ( x, y, z );

    const axesHelper = new THREE.AxesHelper( 100 );
    
    group.add( axesHelper );
    scene.add ( group );
}

function rotateObjects(group, reverseDirection=false, articulate = false, isPyramid = false){
    var neg;
    var i=0;
    reverseDirection ? neg = -1 : neg = 1;
    
    if ( !articulate ){
        if ( isPyramid ) {
            group.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    if (i==2 || i == 3){ //getting the pyramid meshes
                        node.rotateX( THREE.MathUtils.degToRad( neg * 10 ) );
                        node.rotateZ( THREE.MathUtils.degToRad( neg * 10 ) );
                    }
                    i++;
                }
            });
        } else {
            group.rotateX( THREE.MathUtils.degToRad( neg * 10 ) );
            group.rotateY( THREE.MathUtils.degToRad( neg* 10 ) );
        }
    } else {  
        group.rotateY( THREE.MathUtils.degToRad( neg* 10 ) );              
    }

    
}

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


function createScene() {
    'use strict';

    scene = new THREE.Scene();
    
    createBoxes( 300, 50, 25, 50 );
    createCones( 100, 100, -200, 35, 200, 20 );
    createPyramid(-300, -250, 100, 50, 30, 450);

}

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
                camera.position.set( 0, 0, 1000 );
                break;
            case 1:
                camera.position.set( 0, 1000, 0 );
                break;
            case 2: 
                camera.position.set( 1000, 0, 0);
                break;
        }
        camera.lookAt( scene.position );
        cameras.push( camera );
        currentCamera = cameras[0];
    }
    
}

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

function toggleWireframe(){
    'use strict'
    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
}

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

function checkForMovements() {
    'use strict';

    var groupList = [];
    scene.traverse(function (node) {
        if (node instanceof THREE.Group) {
            groupList.push(node);
        }
    });

    if (keys.Q)
        rotateObjects( articulateObj,false, true );
    if(keys.W)
        rotateObjects( articulateObj,true, true );
    if ( keys.A )
        rotateObjects( groupList[2] );
    if ( keys.S )
        rotateObjects( groupList[2], true );
    if ( keys.Z )
        rotateObjects( groupList[2], false, false, true );
    if ( keys.X )
        rotateObjects( groupList[2], true, false, true );
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

function render() {
    'use strict';
    renderer.render(scene, currentCamera);
}

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

    const axesHelper = new THREE.AxesHelper( 200 );
    scene.add( axesHelper );

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    requestAnimationFrame( animate );    
    render();
    checkForMovements();
} 

//animate();