// Three js documentation
// https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene

let renderer = null,    // Object in charge of drawing a scene
scene = null,           // Top-level object in the Three.js graphics hierarchy. Three js contains all
                        // graphical objects in a parent-child hierarchy
camera = null,
cube = null,
cube2 = null;

let duration = 10000; // ms
let currentTime = Date.now();

function main() 
{
    scene_setup();
    create_cube();
    // Run the run loop
    run();
}

function animate() {		
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    cube.rotation.y += angle;
    cube.rotation.x += angle;

    cube2.rotation.y -= angle;
    cube2.rotation.x -= angle;
}

function run() {
    requestAnimationFrame(() => run() );
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function scene_setup()
{
    const canvas = document.getElementById("webglcanvas");

    // Create the Three.js renderer and attach it to our canvas. Different renderes can be used, for example to a 2D canvas.
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size.
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene.
    scene = new THREE.Scene();
    
    // Adds a color to the background
    scene.background = new THREE.Color("rgb(50,50,50)");

    // Add  a camera so we can view the scene. Three js uses these values to create a projection matrix.
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40 );

    scene.add(camera);
}

function create_cube()
{
    // Create a texture-mapped cube and add it to the scene

    // Create the texture 
    const textureUrl = "../images/companionCube.png";
    const texture = new THREE.TextureLoader().load(textureUrl);
    
    // Create a Basic material; pass in the texture. Simple material with no lighting effects.
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Create the cube geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Move the mesh back from the camera and tilt it toward the viewer
    cube.position.z = -8;
    cube.position.x -= 2.5;

    // Rotation in radians
    cube.rotation.x = Math.PI / 8;
    cube.rotation.y = Math.PI / 5;

    // Finally, add the mesh to our scene
    scene.add( cube );

    const colors = [];

    for(let i = 0; i < 6; i++)
    {
        const red = Math.random();
        const green = Math.random();
        const blue = Math.random();

        for (let j = 0; j< 4; j++)
        {
            colors.push(red, green, blue);
        }
    }

    const colorsAttr = new THREE.Float32BufferAttribute(colors, 3);

    geometry.setAttribute('color', colorsAttr);

    const material2 = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

    cube2 = new THREE.Mesh(geometry, material2);

    cube2.position.z = -8;
    cube2.position.x += 2.5;
    
    scene.add( cube2 );
}