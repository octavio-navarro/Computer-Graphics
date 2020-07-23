Game.init = function () {
    this.debug = false;

    this.knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.5, 0.1), this.materials.solid);
    this.knot.position.set(-3, 2, 1);
    this.knotBBox = new THREE.BoxHelper(this.knot, 0x00ff00);
    this.knotBBox.update();
    this.knotBBox.visible = false;

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1), this.materials.solid);
    this.sphere.position.set(2, 2, 0);
    
    this.sphere.geometry.computeBoundingSphere();

    this.sphereBBox = new THREE.Sphere(
        this.sphere.position,
        this.sphere.geometry.boundingSphere.radius);
    this.sphereShadow = Utils.createShadow(this.sphere, this.materials.shadow);

    // the object the user can control to check for collisions
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.5),
        this.materials.solid);
    this.cube.position.set(2, 2, 2);
    this.cubeShadow = Utils.createShadow(this.cube, this.materials.shadow);
    this.cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    // add objects to the scene
    this.scene.add(this.cube);
    this.scene.add(this.knot);
    this.scene.add(this.sphere);
    this.scene.add(this.knotBBox);

    // add fake shadows to the scene
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.sphereShadow);
    this.scene.add(this.cubeShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.cube);
    this.scene.add(this.controls);

    this.timestamp = 0;
};

Game.update = function (delta) {
    this.timestamp += delta;

    // rotate the knot
    this.knot.rotation.x += (Math.PI / 4) * delta;
    this.knotBBox.update();

    var knotBox = new THREE.Box3().setFromObject(this.knot);

    // change sphere size
    var scale = 0.25 + Math.abs(Math.sin(this.timestamp));
    this.sphere.scale.set(scale, scale, scale);
    // re-calculate bounding sphere
    this.sphereBBox.radius = this.sphere.geometry.boundingSphere.radius * scale;
    // update shadow size
    Utils.updateShadow(this.sphereShadow, this.sphere);

    // update the cube AABB and shadow
    this.cubeBBox.setFromObject(this.cube);
    Utils.updateShadow(this.cubeShadow, this.cube);

    this.sphere.material =
        this.sphereBBox.intersectsBox(this.cubeBBox)
        ? this.materials.colliding
        : this.materials.solid;

    this.knot.material = knotBox.intersectsBox(this.cubeBBox)
        ? this.materials.colliding
        : this.materials.solid;
};

Game.toggleDebug = function () {
    this.knotBBox.visible = !this.debug;
    this.sphereBBox.visible = !this.debug;
    this.debug = !this.debug;
};
