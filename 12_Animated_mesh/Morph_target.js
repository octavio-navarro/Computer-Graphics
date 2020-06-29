let renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
orbitControls = null,
mixer = null;

let horse_base = null;

let morphs = [];

let duration = 20000; // ms
let currentTime = Date.now();

let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let mapUrl = "../images/checker_large.gif";

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

const modelUrls = ["../models/gltf/Horse.glb"];
// const modelUrls = ["../models/gltf/Horse.glb", "../models/gltf/Parrot.glb", "../models/gltf/Stork.glb", "../models/gltf/Flamingo.glb"];

async function loadGLTF()
{
    // mixer = new THREE.AnimationMixer( scene );

    let modelsPromises = modelUrls.map(url =>{
        return promisifyLoader(new THREE.GLTFLoader()).load(url);
    });

    try
    {
        let results = await Promise.all(modelsPromises);

        results.forEach( (result, index) =>
        {
            let object = result.scene.children[0];
            object.scale.set( 0.05, 0.05, 0.05 );
            object.position.x = index > 0 ?  - Math.random() * 8: 0;
            object.position.y = index == 0 ?  - 4 :  8;
            object.position.z = -50 - Math.random() * 50;
            object.castShadow = true;
            object. receiveShadow = true;

            console.log(result);

            
            // morphs.push(object);           

            horse_base = object;

            setInterval(() => { 
                if(morphs.length < 10)
                {
                    let clone = horse_base.clone();
                    clone.position.x = Math.random() * 25;
                    clone.mixer = new THREE.AnimationMixer( scene );
                    clone.mixer.clipAction( result.animations[ 0 ], clone).setDuration( 2.0 ).play();
                    clone.state = "running"; 
                    
                    scene.add(clone);
                    morphs.push(clone);
                }
            }, 1000);
        });        
    }
    catch(err)
    {
        console.error(err);
    }
}

async function sleep(target, time)
{
    setTimeout(()=>{target.state="dead";}, time);
}

async function animate() {

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;

    for(let morph of morphs)
    {
        if(morph.state === "running")
            morph.position.z += 0.03 * deltat;

        if(morph.state==="running" && morph.position.z > 10)
        {
            morph.mixer.stopAllAction();
            morph.state = "dying";
            await sleep(morph, 500);
        }           

        if(morph.state === "dead")    
        {
            scene.remove(morph);
            morphs.splice(morphs.indexOf(morph), 1);
        }

        if(morph.mixer)
            morph.mixer.update(deltat*0.001);
    }
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();

    // Update the camera controller
    orbitControls.update();
}

function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-15, 6, 30);
    scene.add(camera);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        
    // Create a group to hold all the objects
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
    
    // Create the objects
    loadGLTF();



    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    
    // Now add the group to our scene
    scene.add( root );
}