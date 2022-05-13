/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer, currentCamera=camera;

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
        box.add(mesh);
        group.add(box);
    }
    scene.add(group);
    group.rotation.set(-10,-10,0);

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    createBoxes(0, 0, 0, 100);
}

function createCamera() {
    'use strict';
    camera = new THREE.OrthographicCamera(  window.innerWidth / - 2, 
                                            window.innerWidth / 2, 
                                            window.innerHeight / 2, 
                                            window.innerHeight / - 2, 
                                            1, 
                                            10000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;
    camera.lookAt(scene.position);
}

function changePerspective(view){
    'use strict';
    switch(view){
        case "front":
            camera.position.set(0,0,1000);
            camera.lookAt(scene.position);
            break;
        case "top":
            camera.position.set(0,1000,0);
            camera.lookAt(scene.position);
            break;
        case "side":
            camera.position.set(1000,0,0);
            camera.lookAt(scene.position);
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
        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.updateProjectionMatrix();
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
    renderer.render(scene, camera);
} animate();