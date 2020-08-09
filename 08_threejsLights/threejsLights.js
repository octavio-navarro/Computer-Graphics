let renderer = null, 
scene = null, 
camera = null,
group = null,
orbitControls = null;

let duration = 20000; // ms
let currentTime = Date.now();

let directionalLight = null, directionalHelper = null;
let spotLight = null, spotlightHelper = null;
let pointLight = null, pointLightHelper = null;
let ambientLight = null;
let mapUrl = "../images/ash_uvgrid01.jpg";

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    group.rotation.y += angle;
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    // animate();

    // Update the camera controller
    orbitControls.update();
}

function setLightColor(light, r, g, b, lightHelper = null)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    light.color.setRGB(r, g, b);

    if(lightHelper)
        lightHelper.update();
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);
    
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControls.target = new THREE.Vector3(0, 5, 0);    

    // Create a group to hold all the objects
    let root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    directionalHelper = new THREE.DirectionalLightHelper(directionalLight);

    scene.add(directionalHelper);

    // Create and add all the lights
    directionalLight.position.set(-15, 0, -10);
    directionalLight.rotation.x = Math.PI/2;
    directionalLight.rotation.z = 135 * Math.PI / 180;
    
    root.add(directionalLight);

    pointLight = new THREE.PointLight (0xffffff, 1, 40, 2);
    pointLight.position.set(5, 10, -10);
    root.add(pointLight);
    pointLightHelper = new THREE.PointLightHelper( pointLight, 1);

    scene.add( pointLightHelper );

    spotLight = new THREE.SpotLight (0xffffff, 1, 50, Math.PI/4, 0.5, 2);
    spotLight.position.set(2, 2, 15);
    spotLight.target.position.set(2, 5, 4);
    root.add(spotLight);

    spotlightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotlightHelper);
    
    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.5 );
    root.add(ambientLight);

    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map    
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 2);

    let color = 0xffffff;

    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:color, map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    group.add( mesh );
    
    // Create the cube 
    geometry = new THREE.CubeGeometry(2, 2, 2);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
    mesh.position.y = 3;
    group.add( mesh );

    // Create the sphere 
    geometry = new THREE.SphereGeometry(Math.sqrt(2), 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
    mesh.position.y = 0;
    group.add( mesh );

    // Create the cylinder 
    geometry = new THREE.CylinderGeometry(1, 2, 2, 50, 10);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
    mesh.position.y = -3;
    group.add( mesh );
    
    // Now add the group to our scene
    scene.add( root );
}
