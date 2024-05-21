import * as THREE from '../../libs/three.js/three.module.js'
import {GUI} from '../../libs/three.js/libs/dat.gui.module.js'
import {EffectComposer} from '../../libs/three.js/postProcessing/EffectComposer.js'
import {RenderPass} from '../../libs/three.js/postProcessing/RenderPass.js'
import {UnrealBloomPass} from '../../libs/three.js/postProcessing/UnrealBloomPass.js'
import {ShaderPass} from '../../libs/three.js/postProcessing/ShaderPass.js'
import {OrbitControls} from '../../libs/three.js/controls/OrbitControls.js'

/**
 * Basic postprocessing using Threejs
 *
 * Post processing allows us to apply specific effects to an already rendered scene.
 *
 * three.js provides a complete post-processing solution via EffectComposer to implement such a workflow. More info at: https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing
 * 
 * Code used as base for this example: https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
 * 
 * For the selective bloom, layers are used: https://threejs.org/docs/index.html?q=layers#api/en/core/Layers
 */

let scene = null, camera = null, renderer = null, orbitControls = null;

// The EffectComposer, the effect that we will add, and the gui element
let composer = null, finalComposer = null, bloomPass = null, gui = null, bloomLayer = null;

let raycaster = null, mouse = null;

const BLOOM_SCENE = 1;

// Parameters for the GUI element that controls the scene
const params =
{
    exposure: 1.0,
    bloomStrength: 1.5,
    bloomThreshold: 0.0,
    bloomRadius: 0.0,
    scene: 'Scene with Bloom'
};

const darkMaterial = new THREE.MeshPhongMaterial( { color: "white" } );
const materials = {};

function createScene(canvas)
{
    // A simple scene with boxes placed randomly
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target = new THREE.Vector3(0,0,-16);

    const geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );

    for ( let i = 0; i < 10; i ++ )
    {
        const cubeColor = Math.random() * 0xffffff;
        const object = new THREE.Mesh( geometry,
            // Each box will have a lambert material that has the emissive property, which means that it will emit light. There will be no other light source in the scene.
            new THREE.MeshLambertMaterial(
                {
                    color: cubeColor,
                    emissive: cubeColor,
                    emissiveIntensity: 1
                } ) );

        object.name = 'Cube' + i;
        object.position.set(Math.random() * 16 - 8, Math.random() * 16 - 8, - (Math.random() * 16 + 8) );
        object.rotation.set(Math.random(), Math.random(), Math.random());

        if ( Math.random() < 0.25 ) object.layers.enable( BLOOM_SCENE );

        scene.add( object );
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener( 'pointerdown', onPointerDown );

    addEffects();

    createGUI();
}

function update()
{
    requestAnimationFrame(()=>update());
    render();
    orbitControls.update();
}

function createGUI()
{
    gui = new GUI();

    gui.add( params, 'scene', [ 'Scene with Bloom', 'Selective Bloom' ] ).onChange( function ( value ) {

        switch ( value ) 	{

            case 'Scene with Bloom':
                composer.renderToScreen = true;
                break;
            case 'Selective Bloom':
                composer.renderToScreen = false;
                break;
        }
    } );

    gui.add( params, 'exposure', 0.1, 2.0 ).onChange( function ( value ) {
        renderer.toneMappingExposure = Math.pow( value, 4.0 );
    } );


    gui.add( params, 'bloomThreshold', 0.0, 1.0 ).step(0.01).onChange( function ( value ) {
        bloomPass.threshold = Number( value );
    } );

    gui.add( params, 'bloomStrength', 0.0, 10.0 ).onChange( function ( value ) {
        bloomPass.strength = Number( value );
    } );

    gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        bloomPass.radius = Number( value );
    } );
}

function onPointerDown( event ) 
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) 
    {
        const object = intersects[ 0 ].object;
        object.layers.toggle( BLOOM_SCENE );
        render();
    }

}

function addEffects()
{
    // First, we need to create an effect composer: instead of rendering to the WebGLRenderer, we render using the composer.
    composer = new EffectComposer(renderer);
    composer.renderToScreen = true;

    // The effect composer works as a chain of post-processing passes. These are responsible for applying all the visual effects to a scene. They are processed in order of their addition. The first pass is usually a Render pass, so that the first element of the chain is the rendered scene.
    const renderPass = new RenderPass(scene, camera);

    // There are several passes available. Here we are using the UnrealBloomPass.
    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 1.0 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    // After the passes are configured, we add them in the order we want them.
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // Additionally, using layers we can add a selective bloom to a specific object in the scene.
    // This requires and additional render pass.
    bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const finalPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: composer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        } ), "baseTexture"
    );
    finalPass.needsSwap = true;

    finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderPass );
    finalComposer.addPass( finalPass );
}

function darkenNonBloomed( obj ) 
{
    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false )
    {
        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;
    }
}

function restoreMaterial( obj ) 
{
    if ( materials[ obj.uuid ] ) 
    {
        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];
    }
}

function render()
{
    // Traditional render: take a scene and a camera and render to the canvas
    // renderer.render(scene, camera);

    // Rendering using an effect composer
    switch(params.scene)
    {
        // Render using the bloom composer
        case 'Scene with Bloom':
            composer.render();
            break;
        case 'Selective Bloom':
            // Selective rendering with another shaderpass
            scene.traverse( darkenNonBloomed );
            composer.render();
            scene.traverse( restoreMaterial );
            finalComposer.render();
            break;
    }    
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.onload = () =>
{
    const canvas = document.getElementById("webGLCanvas");

    createScene(canvas);

    update();
}

window.addEventListener( 'resize', onWindowResize);