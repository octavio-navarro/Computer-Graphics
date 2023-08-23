import * as THREE from '../libs/three.js/three.module.js'
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';

class BaseScene
{
    static textures =
    {
        checkerTexture: ()=>{
            const map = new THREE.TextureLoader().load('/images/checker_large.gif')
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(8,8);
            return map;
        }
    };

    static materials = 
    {
        checkerMaterial: new THREE.MeshPhongMaterial({
            map: this.textures.checkerTexture(),
            side:THREE.DoubleSide
        })
    };

    constructor(canvas)
    {
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias:true});
        this.renderer.setSize(canvas.width, canvas.height);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 1000 );

        this.camera.position.set(0, 10, 30);
        
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.target.set(0,10,0);

        this.ambientLight = new THREE.AmbientLight ( 0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.planeGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        this.planeMesh = new THREE.Mesh(this.planeGeometry, BaseScene.materials.checkerMaterial);

        this.planeMesh.rotation.x = -Math.PI / 2;
        this.scene.add( this.planeMesh );

        this.currentTime = Date.now();

        window.addEventListener('resize', function(event){
            this.resize();
        }.bind(this));
    }

    tick() 
    {
        window.requestAnimationFrame(()=>this.tick());

        const now = Date.now()
        const deltaT = now - this.currentTime;
        this.currentTime = now;

        this.update(deltaT);
        this.orbitControls.update();

        this.renderer.render(this.scene, this.camera);
    }

    resize()
    {
        const canvas = this.renderer.domElement;

        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        this.camera.aspect = canvas.width / canvas.height;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.width, canvas.height);
    }

    update(delta) 
    {    };

}

export {BaseScene}