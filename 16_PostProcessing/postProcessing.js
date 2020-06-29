/**
 * Basic postprocessing using Threejs
 * 
 * Post processing allows us to apply specific effects to an already rendered scene. 
 * 
 * three.js provides a complete post-processing solution via EffectComposer to implement such a workflow. More info at: https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing
 */

let scene = null, camera = null, renderer = null;

// The EffectComposer, the effect that we will add, and the gui element
let composer = null, bloomPass = null, gui = null;

// Parameters for the GUI element that controls the scene
let params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomRadius: 0
};

function createScene(canvas)
{
    // A simple scene with boxes placed randomly
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    
    let geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );
    
    for ( let i = 0; i < 10; i ++ ) 
    {
        const cubeColor = Math.random() * 0xffffff;
        let object = new THREE.Mesh( geometry, 
            // Each box will have a lambert material that has the emissive property, which means that it will emit light. There will be no other light source in the scene.
            new THREE.MeshLambertMaterial( 
                { 
                    color: cubeColor, 
                    emissive: cubeColor, 
                    emissiveIntensity: 1
                } ) );
        
        object.name = 'Cube' + i;
        object.position.set(Math.random() * 15 - 7, Math.random() * 15 - 7, -15);
        object.rotation.set(Math.random(), Math.random(), Math.random());
        
        scene.add( object );
    }
        
    window.addEventListener( 'resize', onWindowResize);

    addEffects();

    createGUI();
}

function update()
{
    requestAnimationFrame(update);
    render();
}

function createGUI()
{
    gui = new dat.GUI();

    gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
        renderer.toneMappingExposure = Math.pow( value, 2.0 );
    } );

    gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
        bloomPass.strength = Number( value );
    } );

    gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        bloomPass.radius = Number( value );
    } );
}

function addEffects()
{
    // First, we need to create an effect composer: instead of rendering to the WebGLRenderer, we render using the composer.
    composer = new THREE.EffectComposer(renderer);

    // The effect composer works as a chain of post-processing passes. These are responsible for applying all the visual effects to a scene. They are processed in order of their addition. The first pass is usually a Render pass, so that the first element of the chain is the rendered scene.
    const renderPass = new THREE.RenderPass(scene, camera);

    // There are several passes available. Here we are using the UnrealBloomPass.
    bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.5, 0.2, 1 );
    bloomPass.threshold = 0;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    renderer.toneMappingExposure = Math.pow( params.exposure, 1.0 );
    
    // After the passes are configured, we add them in the order we want them.
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
}

function render()
{
    // Traditional render: take a scene and a camera and render to the canvas
    // renderer.render(scene, camera);

    // Rendering using an effect composer
    composer.render();
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}