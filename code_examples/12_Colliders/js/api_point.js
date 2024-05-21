import * as THREE from '../../libs/three.js/three.module.js'
import {TransformControls} from '../../libs/three.js/controls/TransformControls.js'
import {Game, Utils} from './common.js';

function loadGame()
{
    const game = new Game();

    game.init = function()
    {
        this.debug = false;
    
        const dotGeo = new THREE.SphereGeometry(0.05);
    
        this.knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.1), Game.materials.solid);
        this.knot.position.x = -3;
        this.knot.position.z = 1;
        this.knot.position.y = 2;

        this.knotBBox = new THREE.BoxHelper(this.knot, 0x00ff00);
        this.knotBBox.update();
        this.knotBBox.visible = false;
    
        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1), Game.materials.solid);
        this.sphere.position.x = 2;
        this.sphere.position.y = 2;
        this.sphereBBox = new THREE.BoxHelper(this.sphere, 0x00ff00);
        this.sphereBBox.update();
        this.sphereBBox.visible = false;
    
        this.point = new THREE.Mesh(dotGeo, Game.materials.dot);
        this.point.position.x = 0.5;
        this.point.position.z = 2;
        this.point.position.y = 1;
        this.pointShadow = Utils.createShadow(this.point, Game.materials.shadow);
    
        this.scene.add(this.point);
        this.scene.add(this.knot);
        this.scene.add(this.knotBBox);
        this.scene.add(this.sphere);
        this.scene.add(this.sphereBBox);
        
        this.scene.add(Utils.createShadow(this.sphere, Game.materials.shadow));
        this.scene.add(Utils.createShadow(this.knot, Game.materials.shadow));
        this.scene.add(this.pointShadow);
    
        this.controls = new TransformControls(this.camera, this.renderer.domElement);
        this.controls.space = 'world';
        this.controls.attach(this.point);
        this.scene.add(this.controls);
    };

    game.update = function(delta)
    {    
        this.knot.rotation.x += (Math.PI / 4) * delta;
        this.knotBBox.update();
    
        Utils.updateShadow(this.pointShadow, this.point);
    
        let sphereBox = new THREE.Box3().setFromObject(this.sphere);
        
        this.sphere.material =
            sphereBox.containsPoint(this.point.position)
            ? Game.materials.colliding
            : Game.materials.solid;
    
        let knotBox = new THREE.Box3().setFromObject(this.knot);
        this.knot.material = knotBox.containsPoint(this.point.position)
            ? Game.materials.colliding
            : Game.materials.solid;
    };

    game.toggleDebug = function () {
        this.knotBBox.visible = !this.debug;
        this.sphereBBox.visible = !this.debug;
    
        this.debug = !this.debug;
    };
    
    game.init();
    game.tick();
}

window.onload = function () 
{
    loadGame();
};