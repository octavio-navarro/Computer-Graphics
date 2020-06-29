let renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
cube = null,
directionalLight = null;

let duration = 2, // sec
delayTime = .25, // sec
positionTween = null,
rotationTween = null,
colorTween = null,
opacityTween = null,
tweenPosition = true,
tweenRotation = true,
tweenColor = true,
tweenOpacity = true,
repeatCount = 0,
interpolationType = TWEEN.Interpolation.Linear,
easingFunction = TWEEN.Easing.Quadratic.InOut;

function playAnimations()
{
    // position tween
    if (positionTween)
        positionTween.stop();

    group.position.set(0, 0, 0);

    if (tweenPosition)
    {
        positionTween = 

            new TWEEN.Tween( group.position ).to( { x: 2, y: 2, z:-3 }, duration * 1000)
				.interpolation(interpolationType)
				.delay( delayTime * 1000 )
				.easing(easingFunction)
				.repeat(repeatCount)
            .start();
        }
    
    // rotation tween
    if (rotationTween)
        rotationTween.stop();

    group.rotation.set(0, 0, 0);

    if (tweenRotation)
    {
        rotationTween = 

            new TWEEN.Tween( group.rotation ).to( { y: Math.PI * 2 }, duration * 1000)
            .interpolation(interpolationType)
            .delay( delayTime * 1000 )
            .easing(easingFunction)
            .repeat(repeatCount)
            .start();
    }
    
    // color tween
    if (colorTween)
        colorTween.stop();

    cube.material.color.setRGB(1, 1, 1);

    if (tweenColor)
    {
        colorTween = 

            new TWEEN.Tween( cube.material.color ).to( { r:1, g:0, b:0 }, duration * 1000)
            .interpolation(interpolationType)
            .delay( delayTime * 1000 )
            .easing(easingFunction)
            .repeat(repeatCount)
            .start();
    }
                
    // opacity tween
    if (opacityTween)
        opacityTween.stop();
    
    cube.material.opacity = 1;	

    if (tweenOpacity)
    {
        opacityTween = 
                    
            new TWEEN.Tween( cube.material ).to( { opacity:0.8 }, duration * 1000)
            .interpolation(interpolationType)
            .delay( delayTime * 1000 )
            .easing(easingFunction)
            .repeat(repeatCount)
            .start();
    }		
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Update the animations
    TWEEN.update();

    // Update the camera controller
    orbitControls.update();
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
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 4, 10);
    scene.add(camera);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load("../images/floor15.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(16, 16);
    
    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff,  map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    root.add( mesh );

    // Create the cube geometry
    map = new THREE.TextureLoader().load("../images/wooden_crate_1.jpg");
    geometry = new THREE.CubeGeometry(4, 4, 4);
    
    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, transparent:true}));
    
    // Add the mesh to our group
    group.add( cube );
    
    // Now add the group to our scene
    scene.add( root );
}