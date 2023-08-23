import * as THREE from '../../libs/three.js/three.module.js'
import { OrbitControls } from '../../libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three.js/loaders/OBJLoader.js';
import { MTLLoader } from '../../libs/three.js/loaders/MTLLoader.js';
import { FBXLoader } from '../../libs/three.js/loaders/FBXLoader.js';
import { GLTFLoader } from '../../libs/three.js/loaders/GLTFLoader.js';
import { KTX2Loader } from '../../libs/three.js/loaders/KTX2Loader.js';
import { DRACOLoader } from '../../libs/three.js/loaders/DRACOLoader.js';
import { MeshoptDecoder } from '../../libs/three.js/libs/meshopt_decoder.module.js';

const MANAGER = new THREE.LoadingManager();
const DRACO_LOADER = new DRACOLoader( MANAGER ).setDecoderPath("../../libs/three.js/libs/draco/gltf");
const KTX2_LOADER = new KTX2Loader( MANAGER ).setTranscoderPath("../../libs/three.js/libs/basis/" );

let renderer = null, scene = null, camera = null, root = null, orbitControls = null, pmremGenerator  = null;
let directionalLight = null, spotLight = null, ambientLight = null;
let textureEncoding = 'sRGB';

let currentTime = Date.now();
let animation = '01_Run_Armature_0'
let gltf_animations = {}

let soldier = null, ship = null

const mapUrl = "../../images/checker_large.gif";

const objMtlModel = {
        obj : "../../models/obj/Penguin_obj/penguin.obj",
        mtl : "../../models/obj/Penguin_obj/penguin.mtl"
};

let objModel = {
    obj:'../../models/obj/cerberus/Cerberus.obj', 
    map:'../../models/obj/cerberus/Cerberus_A.jpg', 
    normalMap:'../../models/obj/cerberus/Cerberus_N.jpg', 
    specularMap: '../../models/obj/cerberus/Cerberus_M.jpg'
};

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function animate()
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    if(gltf_animations[animation])
    {
        gltf_animations[animation].getMixer().update(deltat * 0.001);
    }

    if(soldier)
    {
        soldier.position.y = Math.sin(currentTime*0.005) *4
        soldier.bbox.update()
    }
}

function setVectorValue(vector, configuration, property, initialValues)
{
    if(configuration !== undefined)
    {
        if(property in configuration)
        {
            console.log("setting:", property, "with", configuration[property]);
            vector.set(configuration[property].x, configuration[property].y, configuration[property].z);
            return;
        }
    }

    console.log("setting:", property, "with", initialValues);
    vector.set(initialValues.x, initialValues.y, initialValues.z);
}

async function loadObj(objModelUrl, configuration)
{
    try {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);
        let texture = objModelUrl.hasOwnProperty('map') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log(object);
        
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.normalMap = normalMap;
                child.material.specularMap = specularMap;
            }
        });

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));

        scene.add(object);
    }
    catch (err) {
        return onError(err);
    }
}

async function loadFBX(fbxModelUrl, configuration)
{
    try{
        let object = await new FBXLoader().loadAsync(fbxModelUrl);

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));
        
        scene.add( object );
    }
    catch(err)
    {
        console.error( err );
    }
}

async function load3dModel(objModelUrl, mtlModelUrl, configuration)
{
    try
    {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(mtlModelUrl, onProgress, onError);
        
        materials.preload();
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);

        const object = await objLoader.loadAsync(objModelUrl, onProgress, onError);
        
        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));
        
        scene.add(object);
    }
    catch(err)
    {
        console.log('Error loading 3d Model:', err);
    }
}

async function loadGLTF(gltfModelUrl, configuration)
{
    try
    {
        const gltfLoader = new GLTFLoader(MANAGER).setDRACOLoader(DRACO_LOADER).setKTX2Loader(KTX2_LOADER.detectSupport( renderer )).setMeshoptDecoder( MeshoptDecoder );

        const result = await gltfLoader.loadAsync(gltfModelUrl);

        const object = result.scenes[0].children[0];

        console.log(result)
        console.log("object:", object);

        result.animations.forEach(element => {
            gltf_animations[element.name] = new THREE.AnimationMixer( scene ).clipAction(element, object);
        });

        object.bbox = new THREE.BoxHelper(object, 0x00ff00)
        object.bbox.visible = true

        scene.add(object.bbox)

        // gltf_animations['01_Run_Armature_0'].play();
        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));
        
        object.bbox.update()
        
        updateTextureEncoding(object); 
        scene.add(object);
        return object
    }
    catch(err)
    {
        console.error(err);
    }
}

function updateTextureEncoding (object) 
{
    const encoding = textureEncoding === 'sRGB'
      ? THREE.sRGBEncoding
      : THREE.LinearEncoding;
    traverseMaterials(object, (material) => {
      if (material.map) material.map.encoding = encoding;
      if (material.emissiveMap) material.emissiveMap.encoding = encoding;
      if (material.map || material.emissiveMap) material.needsUpdate = true;
    });
}

function traverseMaterials (object, callback) {
    object.traverse((node) => {
      if (!node.isMesh) return;
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      materials.forEach(callback);
    });
  }

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Update the camera controller
    orbitControls.update();

    if(soldier && ship)
    {
        const soldierBBox = new THREE.Box3().setFromObject(soldier)
        const shipBBox = new THREE.Box3().setFromObject(ship)
        if(soldierBBox.intersectsBox(shipBBox))
            soldier.bbox.material.color = new THREE.Color('red')
        else
            soldier.bbox.material.color = new THREE.Color('green')
    }
    animate()
}

function createScene(canvas) 
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color("black");
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 5, 50);
    scene.add(camera);

    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0,0,0);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
    directionalLight.position.set(0, 5, 100);

    root.add(directionalLight);
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 8, 100);
    root.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 1);
    root.add(ambientLight);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let color = 0xffffff;

    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    root.add( mesh );
    
    scene.add( root );
}

async function loadObjects()
{
    loadObj(objModel, {position: new THREE.Vector3(-8, 0, 0), scale: new THREE.Vector3(3, 3, 3), rotation: new THREE.Vector3(0, 1.58, 0) });
    
    load3dModel(objMtlModel.obj, objMtlModel.mtl, {position: new THREE.Vector3(7, 1, 0), scale:new THREE.Vector3(0.5, 0.5, 0.5)});
    
    ship = await loadGLTF('../../models/gltf/SpaceShip/ship.glb', {position: new THREE.Vector3(-10, 10, 0), scale:new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(Math.PI/2, Math.PI, 0)  });

    soldier = await loadGLTF('../../models/gltf/Soldier.glb', {position: new THREE.Vector3(0, 0, 0), scale:new THREE.Vector3(0.05, 0.05, 0.05), rotation: new THREE.Vector3(Math.PI / 2, Math.PI, 0)  });

    loadFBX('../../models/fbx/Robot/robot_idle.fbx', {position: new THREE.Vector3(0, -4, -20), scale:new THREE.Vector3(0.05, 0.05, 0.05) })
}

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    loadObjects();

    update();
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
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);
