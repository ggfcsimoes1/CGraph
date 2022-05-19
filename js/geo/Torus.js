/*
Simple class that handles with the creation
of torus.
*/
class Torus {
    constructor ( x,y,z, radius, tube, radSegs, tubSegs, color, xRot=0, yRot=0, zRot=0 ) {
        this.x = x; //storing these for now, might remove later on
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.tube = tube;
        this.radSegs = radSegs;
        this.tubSegs = tubSegs;
        this.color = color;
        this.xRot = xRot;
        this.yRot = yRot;
        this.zRot = zRot;
        this.material = new THREE.MeshBasicMaterial ( { color: color, wireframe: false } );
        this.geometry = new THREE.TorusGeometry ( radius, tube, radSegs, tubSegs );
        this.mesh = new THREE.Mesh ( this.geometry, this.material );
        
        torus = new THREE.Object3D ( );
        torus.position.set ( x, y, z );
        torus.rotation.set( xRot, yRot, zRot);
        torus.add ( this.mesh );

        this.obj3D = torus;
        
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
