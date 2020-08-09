let renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
objectList = [],
orbitControls = null;

let objLoader = null, mtlLoader = null;

let duration = 20000; // ms
let currentTime = Date.now();

let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let pointLight = null;
let mapUrl = "../images/checker_large.gif";

// let objModelUrl = "../models/obj/Sonic/son_M.obj";
// let mtlModelUrl = "../models/obj/Sonic/son_M.mtl";
let objModelUrl = "../models/obj/Penguin_obj/penguin.obj";
let mtlModelUrl = "../models/obj/Penguin_obj/penguin.mtl";

function promisifyLoader ( loader, onProgress ) 
{
    function promiseLoader ( url ) {
  
      return new Promise( ( resolve, reject ) => {
  
        loader.load( url, resolve, onProgress, reject );
  
      } );
    }
  
    return {
      originalLoader: loader,
      load: promiseLoader,
    };
}

const onError = ( ( err ) => { console.error( err ); } );

async function loadObj(objModelUrl, objectList)
{
    const objPromiseLoader = promisifyLoader(new THREE.OBJLoader());

    try {
        const object = await objPromiseLoader.load(objModelUrl.obj);
        
        // object.traverse(function (child) {
        //     if (child instanceof THREE.Mesh) {
        //         child.castShadow = true;
        //         child.receiveShadow = true;
        //         child.material.map = texture;
        //         child.material.normalMap = normalMap;
        //         child.material.specularMap = specularMap;
        //     }
        // });

        object.scale.set(3, 3, 3);
        object.position.z = -3;
        object.position.x = -1.5;
        object.rotation.y = -3;
        object.name = "Pinguino";
        objectList.push(object);
        scene.add(object);
    }
    catch (err) {
        return onError(err);
    }
}

async function loadFBX()
{
    let loader = promisifyLoader(new THREE.FBXLoader());

    try{
        let object = await loader.load( '../models/fbx/pyramid/pyramid.fbx');

        let texture = new THREE.TextureLoader().load('../models/fbx/pyramid/pyramid_base_color.png');
        let normalMap = new THREE.TextureLoader().load('../models/fbx/pyramid/pyramid_normal.png');
        // let specularMap = new THREE.TextureLoader().load('../models/fbx/pyramid/pyramid_AO.png');

        const scale = 0.003;
        object.scale.set(scale, scale, scale);
        object.position.y -= 4;
        
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material.map = texture;
                child.material.normalMap = normalMap;
            }
        } );
        scene.add( object );
    }
    catch(err)
    {
        console.error( err );
    }
}

function load3dModel(objModelUrl, mtlModelUrl)
{
    mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(mtlModelUrl, materials =>{
        
        materials.preload();
        console.log(materials);

        objLoader = new THREE.OBJLoader();
        
        objLoader.setMaterials(materials);

        objLoader.load(objModelUrl, object=>{
            objectList.push(object);
            object.position.y -= 3;
            object.scale.set(0.5, 0.5, 0.5);
            scene.add(object);
        });
    });
}

async function loadGLTF(objModelUrl)
{
    let gltfLoader = new promisifyLoader(new THREE.GLTFLoader());

    try
    {
        const result = await gltfLoader.load(objModelUrl);

        let object = result.scene.children[0];
        // object.scale.set( 0.5, 0.5, 0.5 );
        object.position.set(0,0,0);
        console.log(result);
        scene.add(object);
    }
    catch(err)
    {
        console.error(err);
    }
}

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    for(object of objectList)
        if(object)
            object.rotation.y += angle / 2;
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Update the camera controller
    orbitControls.update();
}

function createScene(canvas) 
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0x000000, 1);
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    root.add(ambientLight);
    
    // Create the objects
    // loadObj(objModelUrl, objectList);
    // load3dModel(objModelUrl, mtlModelUrl);
    // loadFBX();
    loadGLTF("../models/gltf/phoenix/scene_fixed.gltf");

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let color = 0xffffff;

    // let asteroid = new THREE.Object3D();
    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add( mesh );
    
    scene.add( root );
}