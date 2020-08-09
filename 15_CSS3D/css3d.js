/*
CSS 3D Renderer

You need two renderers: one for the DOM elements (CSS3DRenderer), and one for the threejs objects (WebGLRenderer). You could add all the elements in the same scene, and use it to with each renderer, but I find it easier to just have two scenes with different elements.

It is important to position the css renderer behind the webgl one.

HTML elements are rendered on top of your canvas. They don’t share a common depth test with the actual 3D scene rendered via WebGL. 
*/
let renderer = null, css3dRenderer = null, camera = null, orbitControls = null, webglScene = null, cssScene = null;

// Creates a new simple div with a background and some text, and adds it to the scene.
function addDomElement()
{
    // Creates an 8x8 div dom element
    let domElement = document.createElement( 'div' );
    domElement.style.width = '8px';
    domElement.style.height = '8px';
    domElement.style.fontSize= '2px';
    domElement.style.opacity = 0.99;
    domElement.style.background = new THREE.Color(Math.random() *  0xffffff).getStyle();
    domElement.textContent = "Text";
    domElement.setAttribute('contenteditable', '');
    domElement.addEventListener('click', () => alert('Element clicked!'))

    // Using THREE.CSS3DObject, we can create a new object that can be rendered in 3d space
    let domObject = new THREE.CSS3DObject( domElement );
    
    let randomRange = () => {
        const range = 0;
        let value = (Math.random() * 100 - 50);
        if(0 <= value && value <= range) value += range;
        if(0 > value && value >= -range) value -= range;
        return value;
    }

    // We can modify its position and rotation as with any 3d object
    domObject.position.set(randomRange(), randomRange(), randomRange());
    domObject.rotation.set(Math.random(), Math.random(), Math.random());

    cssScene.add(domObject);

    // To be able to see the elements mixed with other 3D objects in the scene, we need to add a mesh that "blends", or combines, the two elements in a scene. In this case, all the planes are black, and with the NoBlending property, we tell webgl that the plane is ignored, and we can see the dom element behind it.
    let material = new THREE.MeshPhongMaterial({
        opacity	: 0,
        color: 0x000000,
        blending: THREE.NoBlending,
        side: THREE.DoubleSide
    });

    let geometry = new THREE.PlaneGeometry( 8, 8 );
    let mesh = new THREE.Mesh( geometry, material );

    mesh.position.copy( domObject.position );
    mesh.rotation.copy( domObject.rotation );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    webglScene.add(mesh);
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the webglScene
    css3dRenderer.render(cssScene, camera );
    renderer.render(webglScene, camera);

    // Update the camera controller
    orbitControls.update();
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    css3dRenderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function createScene() 
{
    // Create the CSS3D renderer and attach it to our canvas. It is important to attach this first, and then the webglrenderer, so that the canvas is on top of the 3d divs.
    css3dRenderer = new THREE.CSS3DRenderer();
    css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    css3dRenderer.domElement.style.position = 'absolute';
    document.getElementById( 'container' ).appendChild( css3dRenderer.domElement );

    renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    // Create a new Three.js webglScene
    webglScene = new THREE.Scene();
    cssScene = new THREE.Scene();

    webglScene.background = new THREE.Color( 0x111111 );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set(0, 0, -100);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects    
    let light = new THREE.PointLight( 0xffffff, 2, 0 );
    light.position.set( 0, 0, -30 );

    light.castShadow = true;
    light.shadow.bias = -0.001;

    webglScene.add( light );

    for(let i = 0; i < 100; i++)
        addDomElement();

    let geometry = new THREE.SphereGeometry( 10, 32, 32 );
    var material = new THREE.MeshPhongMaterial({color: 0x0000ff });

    sphere = new THREE.Mesh( geometry, material );
    sphere.castShadow = true;
    sphere.recieveShadow = true;

    webglScene.add( sphere );
    
    window.addEventListener( 'resize', onWindowResize);
}