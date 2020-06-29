let renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
cube = null,
waves = null,
directionalLight = null;

let duration = 10, // sec
crateAnimator = null,
waveAnimator = null,
lightAnimator = null,
waterAnimator = null,
animateCrate = true,
animateWaves = true,
animateLight = true,
animateWater = true,
loopAnimation = false;

let waterMapUrl = "../images/water_texture.jpg";
let createMapUrl = "../images/wooden_crate_1.jpg";

function run()
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Update the animations
    KF.update();

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
    camera.position.set(0, 2, 8);
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
    let waterMap = new THREE.TextureLoader().load(waterMapUrl);
    waterMap.wrapS = waterMap.wrapT = THREE.RepeatWrapping;
    waterMap.repeat.set(4, 4);
    
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    waves = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x22aafa, map:waterMap, side:THREE.DoubleSide}));
    waves.rotation.x = -Math.PI / 2;
    waves.position.y = -1.02;
    
    // Add the waves to our group
    root.add( waves );

    // Create the cube geometry
    map = new THREE.TextureLoader().load(createMapUrl);
    geometry = new THREE.CubeGeometry(2, 2, 2);
    
    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff, 
        map:map,
        transparent:true}));
    
    // Add the mesh to our group
    group.add( cube );
    
    // Now add the group to our scene
    scene.add( root );
}

function playAnimations()
{
    // position animation
    if (crateAnimator)
        crateAnimator.stop();
    
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    if (animateCrate)
    {
        crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, .2, .25, .375, .5, .9, 1], 
                        values:[
                                { x : 0, y:0, z: 0 },
                                { x : .5, y:0, z: .5 },
                                { x : 0, y:0, z: 0 },
                                { x : .5, y:-.25, z: .5 },
                                { x : 0, y:0, z: 0 },
                                { x : .5, y:-.25, z: .5 },
                                { x : 0, y:0, z: 0 },
                                ],
                        target:group.position
                    },
                    { 
                        keys:[0, .25, .5, .75, 1], 
                        values:[
                                { x : 0, z : 0 },
                                { x : Math.PI / 12, z : Math.PI / 12 },
                                { x : 0, z : Math.PI / 12 },
                                { x : -Math.PI / 12, z : -Math.PI / 12 },
                                { x : 0, z : 0 },
                                ],
                        target:group.rotation
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000,
            easing:TWEEN.Easing.Bounce.InOut,

        });
        crateAnimator.start();
        
    }
    
    // rotation animation
    if (waveAnimator)
        waveAnimator.stop();

    waves.rotation.set(-Math.PI / 2, 0, 0);

    if (animateWaves)
    {
        waveAnimator = new KF.KeyFrameAnimator;
        waveAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, .5, 1], 
                        values:[
                                { x : -Math.PI / 2, y : 0 },
                                { x : -Math.PI / 2.2, y : 0 },
                                { x : -Math.PI / 2, y: 0 },
                                ],
                        target:waves.rotation
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000,
        });
        waveAnimator.start();
    }
    
    // color animation
    if (lightAnimator)
        lightAnimator.stop();

    directionalLight.color.setRGB(1, 1, 1);

    if (animateLight)
    {
        lightAnimator = new KF.KeyFrameAnimator;
        lightAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, .4, .6, .7, .8, 1], 
                        values:[
                                { r: 1, g : 1, b: 1 },
                                { r: 0.66, g : 0.66, b: 0.66 },
                                { r: .333, g : .333, b: .333 },
                                { r: 0, g : 0, b: 0 },
                                { r: .667, g : .667, b: .667 },
                                { r: 1, g : 1, b: 1 },
                                ],
                        target:directionalLight.color
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000,
        });
        lightAnimator.start();
    }
                
    // opacity animation
    if (waterAnimator)
        waterAnimator.stop();
    
    cube.material.opacity = 1;	

    if (animateWater)
    {
        waterAnimator = new KF.KeyFrameAnimator;
        waterAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, 1], 
                        values:[
                                { x : 0, y : 0 },
                                { x : 1, y : 0 },
                                ],
                        target:waves.material.map.offset
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000,
            easing:TWEEN.Easing.Sinusoidal.In,
        });
        waterAnimator.start();
    }

}