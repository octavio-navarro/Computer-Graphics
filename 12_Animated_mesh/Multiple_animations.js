let renderer = null, 
scene = null, 
camera = null,
root = null,
robot = null,
group = null,
orbitControls = null;

let robot_actions = {};
let deadAnimator;

let duration = 20000; // ms
let currentTime = Date.now();

let animation = "idle";

function changeAnimation(animation_text)
{
    robot_actions[animation].reset();
    
    animation = animation_text;

    if(animation =="dead")
    {
        createDeadAnimation();
    }
    else
    {
         console.log(robot_actions[animation]);
    }
}

function createDeadAnimation()
{

}

async function loadGLTF()
{
    let gltfLoader = new THREE.GLTFLoader();
    let loader = promisifyLoader(gltfLoader);

    try
    {
        // Run_L, Threaten, back, idle
        let result = await loader.load("../models/gltf/raptoid/scene.gltf");
        
        robot = result.scene.children[0];
        robot.scale.set(0.09, 0.09, 0.09);
        robot.position.y -= 3.8;
        robot.traverse(child =>{
            if(child.isMesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        console.log(robot);
        scene.add(robot);

        result.animations.forEach(element => {
            robot_actions[element.name] = new THREE.AnimationMixer( scene ).clipAction(element, robot);
            robot_actions[element.name].play();
        });
    }
    catch(err)
    {
        console.error(err);
    }
}

function animate() {

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;

    if(robot && robot_actions[animation])
    {
        robot_actions[animation].getMixer().update(deltat * 0.001);
    }

    if(animation =="dead")
    {
        KF.update();
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

let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let mapUrl = "../images/checker_large.gif";

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

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
    spotLight.position.set(-30, 15, -10);
    spotLight.target.position.set(0,0,0);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xbbbbbb );
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