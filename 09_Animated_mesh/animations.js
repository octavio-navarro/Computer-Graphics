import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';

let renderer = null, scene = null, camera = null, root = null, group = null, orbitControls = null;

let objects = [];

let currentTime = Date.now();

let spotLight = null, ambientLight = null;
let mapUrl = "../images/checker_large.gif";

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

let modelUrls = ["../models/gltf/Horse.glb", "../models/gltf/Parrot.glb", "../models/gltf/Stork.glb", "../models/gltf/Flamingo.glb"];

function main() 
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}

async function loadGLTF()
{
    const gltfLoader = new GLTFLoader();

    const modelsPromises = modelUrls.map(url =>{
        return gltfLoader.loadAsync(url);
    });

    try
    {
        const results = await Promise.all(modelsPromises);

        results.forEach( (result, index) =>
        {
            console.log(result);

            const object = result.scene.children[0];

            object.scale.set( 0.05, 0.05, 0.05 );
            object.position.x = index > 0 ?  - Math.random() * 16: 0;
            object.position.y = index == 0 ?  - 4 :  8;
            object.position.z = -50 - Math.random() * 50;

            object.castShadow = true;
            object. receiveShadow = true;

            object.mixer = new THREE.AnimationMixer( scene );
            object.action = object.mixer.clipAction( result.animations[0], object).setDuration( 1.0 );

            object.action.play();
            
            objects.push(object);           

            scene.add(object);
        });        
    }
    catch(err)
    {
        console.error(err);
    }
}

async function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    for(const object of objects)
    {
        object.position.z += 0.03 * deltat;

        if(object.position.z > 30)
            object.position.z = -50 - Math.random() * 50;

        if(object.mixer)
            object.mixer.update(deltat*0.001);
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    animate();

    orbitControls.update();
}

function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-15, 6, 30);
    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    root = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(-30, 8, -10);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    loadGLTF();

    group = new THREE.Object3D;
    root.add(group);

    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    const planeGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.02;
    
    group.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;
    
    scene.add( root );
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main()
    resize(); 
};

window.addEventListener('resize', resize, false);