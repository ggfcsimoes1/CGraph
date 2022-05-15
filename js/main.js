/*global THREE, requestAnimationFrame, console*/

var cameras = [];

var scene, renderer, currentCamera;

var geometry, material, mesh;

var box;

var colors = [0x0000FF,0x00FFFF,0xFF00FF,0xFFFF00, 0x00FF00];


function createBoxes( x, y, z, size ) {
    'use strict';

    const group = new THREE.Group();
    

    for( var i = 0; i < 5; i++ ){
        var xAux = x, yAux = y;

        material = new THREE.MeshBasicMaterial({ color: colors[i], wireframe: false });
        box = new THREE.Object3D();
        geometry = new THREE.BoxGeometry( size, size, size );
        mesh = new THREE.Mesh( geometry, material );

        switch(i){
            case 0:
                xAux = x+(size+10);
                break;
            case 1:
                yAux = y+(size+10);
                break;
            case 2:
                break;
            case 3:
                yAux = y-(size+10)
                break;
            case 4:
                xAux = x-(size+10);
                break;
        }
        
        box.position.set( xAux, yAux, z );
        box.add( mesh );
        group.add(box);
    }
    scene.add(group);
    group.rotation.set(-10,-10,0);

}

function createCones( x, y, z, radius, height, segs ) {
    
    const group = new THREE.Group ( );

    const coneMaterial = new THREE.MeshBasicMaterial ( {color: colors[0], wireframe: false} );
    const sphereMaterial = new THREE.MeshBasicMaterial ( {color: colors[1], wireframe: false} );
    const pyramidMaterial = new THREE.MeshBasicMaterial ( {color: colors[2], wireframe: false} );

    pyramid = new THREE.Object3D ( );
    pyramidGeo = new THREE.ConeGeometry ( radius/2, height/4, 4 );
    pyramidMesh = new THREE.Mesh ( pyramidGeo, pyramidMaterial );
    pyramid.position.set ( 0, 125, 0 );
    pyramid.add ( pyramidMesh );
    group.add ( pyramid );
   
    cone = new THREE.Object3D ( );
    coneGeo = new THREE.ConeGeometry ( radius, height, segs );
    coneMesh = new THREE.Mesh ( coneGeo, coneMaterial );
    cone.add ( coneMesh );
    group.add ( cone );
    
    sphere = new THREE.Object3D ( );
    sphereGeo = new THREE.SphereGeometry ( radius, segs, segs );
    sphereMesh = new THREE.Mesh ( sphereGeo, sphereMaterial );
    sphere.position.set ( 0, -(height-30), 0 );
    sphere.add ( sphereMesh );
    group.add ( sphere );

    group.position.set ( x, y, z );
    group.rotation.set ( 3.8, 0.40 , 0.35 );
    scene.add ( group );
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    
    createBoxes( -400, -300, 0, 50 );
    createCones( 100, 100, 0, 35, 200, 30 );
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
    }
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

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    requestAnimationFrame( animate );    
    renderer.render(scene, currentCamera);
} animate();