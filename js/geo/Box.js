/*
Simple class that handles with the creation
of boxes.
*/

class Box {
    constructor ( x,y,z, width, length, height, color, xRot=0, yRot=0, zRot=0 ) {
        this.x = x; //storing these for now, might remove later on
        this.y = y;
        this.z = z;
        this.width = width;
        this.length = length;
        this.height = height;
        this.color = color;
        this.xRot = xRot;
        this.yRot = yRot;
        this.zRot = zRot;
        this.material = new THREE.MeshBasicMaterial ( { color: color, wireframe: false } );
        this.geometry = new THREE.BoxGeometry ( width, length, height );
        this.mesh = new THREE.Mesh ( this.geometry, this.material );
        
        box = new THREE.Object3D ( );
        box.position.set ( x, y, z );
        box.rotation.set( xRot, yRot, zRot);
        box.add ( this.mesh );

        this.obj3D = box;
        
    }
    //returns the created mesh
    getMesh() {
        return this.mesh;
    }
    //returns the Object3D instance
    getObj3D() {
        return this.obj3D;
    }
    //returns the object's color
    getColor() {
        return this.color;
    }
}
