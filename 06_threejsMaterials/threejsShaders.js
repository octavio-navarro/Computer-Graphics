// https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial

let renderer = null, 
scene = null, 
camera = null,
cubeGroup = null,
cube = null,
sphereGroup = null,
sphere = null,
cone = null,
uniforms = null;

let duration = 5000; // ms
let currentTime = Date.now();

function animate()
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // Rotate the cube about its Y axis
    // cube.rotation.y += angle;

    // // Rotate the sphere group about its Y axis
    // sphereGroup.rotation.y -= angle / 2;

    // // Rotate the cone about its X axis (tumble forward)
    // cone.rotation.x += angle;

    uniforms.time.value += fract;
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();            
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0.5, 0.5, 0.5);
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);
    
    // Add a directional light to show off the object
    let light = new THREE.DirectionalLight( 0xffffff, 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, .2, 1);
    scene.add( light );

    cubeGroup = new THREE.Object3D;
    
    let GLOWMAP = new THREE.TextureLoader().load("../images/water_texture_2.jpg");
    // let NOISEMAP = new THREE.TextureLoader().load("../images/cloud.png");
    let NOISEMAP = new THREE.TextureLoader().load("../images/noisy-texture.png");

    uniforms = 
    {
        time: { type: "f", value: 0.2 },
        noiseTexture: { type: "t", value: NOISEMAP },
        glowTexture: { type: "t", value: GLOWMAP }
    };

    uniforms.noiseTexture.value.wrapS = uniforms.noiseTexture.value.wrapT = THREE.RepeatWrapping;
    uniforms.glowTexture.value.wrapS = uniforms.glowTexture.value.wrapT = THREE.RepeatWrapping;

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        transparent: true,
    } );
    
    // Create the cube geometry
    let geometry = new THREE.CubeGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Tilt the mesh toward the viewer
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    cubeGroup.add( cube );

    // Create a group for the sphere
    sphereGroup = new THREE.Object3D;
    cubeGroup.add(sphereGroup);
    
    // Move the sphere group up and back from the cube
    sphereGroup.position.set(0, 3, -4);

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(1, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    // Add the sphere mesh to our group
    sphereGroup.add( sphere );

    // Create the cone geometry
    geometry = new THREE.CylinderGeometry(0, .333, .444, 20, 5);

    // And put the geometry and material together into a mesh
    cone = new THREE.Mesh(geometry, material);

    // Move the cone up and out from the sphere
    cone.position.set(1, 1, -.667);
        
    // Add the cone mesh to our group
    sphereGroup.add( cone );
    
    // Now add the group to our scene
    scene.add( cubeGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, cubeGroup);
}



