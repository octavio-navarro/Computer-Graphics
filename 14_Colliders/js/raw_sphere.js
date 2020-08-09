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
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(0.5),
        this.materials.solid);
    this.ball.position.set(1, 1, 2);
    this.ballShadow = Utils.createShadow(this.ball, this.materials.shadow);
    this.ballBBox = new THREE.Sphere(this.ball.position, this.ball.geometry.boundingSphere.radius);

    // add objects to the scene
    this.scene.add(this.ball);
    this.scene.add(this.knot);
    this.scene.add(this.sphere);
    this.scene.add(this.knotBBox);

    // add fake shadows to the scene
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.sphereShadow);
    this.scene.add(this.ballShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.ball);
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

    // update the ball AABB position and shadow
    this.ballBBox.center.set(this.ball.position.x, this.ball.position.y, this.ball.position.z);
    Utils.updateShadow(this.ballShadow, this.ball);

    this.sphere.material =
        this.sphereBBox.intersectsSphere(this.ballBBox)
        ? this.materials.colliding
        : this.materials.solid;

    this.knot.material = this.ballBBox.intersectsBox(knotBox)
        ? this.materials.colliding
        : this.materials.solid;
};

Game.toggleDebug = function () {
    this.knotBBox.visible = !this.debug;
    // this.sphereBBox.visible = !this.debug;
    this.debug = !this.debug;
    console.log(this.knotBBox.visible);
};
