/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer, currentCamera=camera;

var geometry, material, mesh;

var box;

function createBox(x, y, z) {
    'use strict';

    box = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.BoxGeometry(300, 50, 100);
    mesh = new THREE.Mesh(geometry, material);

    box.add(mesh);
    box.position.set(x, y, z);

    scene.add(box);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    createBox(0, 0, 0);
    createBox(10,20,30);
}

function createCamera() {
    'use strict';
    camera = new THREE.OrthographicCamera(  window.innerWidth / - 2, 
                                            window.innerWidth / 2, 
                                            window.innerHeight / 2, 
                                            window.innerHeight / - 2, 
                                            1, 
                                            1000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    camera.lookAt(scene.position);
}

function changePerspective(view){
    'use strict';
    switch(view){
        case "front":
            camera.position.set(0,0,100);
            camera.lookAt(scene.position);
            break;
        case "top":
            camera.position.set(0,100,0);
            camera.lookAt(scene.position);
            break;
        case "side":
            camera.position.set(100,0,0);
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