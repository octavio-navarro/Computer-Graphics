// https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial

"use strict";

import * as THREE from "../../libs/three.js/three.module.js";
import { addMouseHandler} from "./sceneHandler.js";

let renderer = null, scene = null, camera = null, cubeGroup = null, cube = null, sphereGroup = null, sphere = null, cone = null, uniforms = null;

let duration = 5000; // ms
let currentTime = Date.now();

function main()
{
    const canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);
    // Run the run loop
    update();
}

function animate()
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;

    uniforms.time.value += fract;
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();            
}

function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setSize(canvas.width, canvas.height);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);
    
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    
    let light = new THREE.DirectionalLight( 0xffffff, 1.5);
    light.position.set(.5, .2, 1);
    scene.add( light );

    cubeGroup = new THREE.Object3D;
    
    // We are going to need two textures for the shader material
    // ColorMap defines the base color for the objects, while NoiseMap is used to deform the color map and generate a "random" translation
    const COLORMAP = new THREE.TextureLoader().load("../../images/water_texture_2.jpg");
    const NOISEMAP = new THREE.TextureLoader().load("../../images/cloud.png");
    
    // Uniforms used for the shader material. We can modify them in the update loop to update the shader
    uniforms = 
    {
        time: { type: "f", value: 0.2 },
        noiseTexture: { type: "t", value: NOISEMAP },
        glowTexture: { type: "t", value: COLORMAP }
    };

    // Wraps the texture around itself. This is needed because we are moiving the texture coordinates in the shader.
    uniforms.noiseTexture.value.wrapS = uniforms.noiseTexture.value.wrapT = THREE.RepeatWrapping;
    uniforms.glowTexture.value.wrapS = uniforms.glowTexture.value.wrapT = THREE.RepeatWrapping;

    // For the shader material definition, we need the shader code, either from the html or from a string, and the uniforms.
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        transparent: true,
    } );
    
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    cube = new THREE.Mesh(geometry, material);

    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    cubeGroup.add( cube );

    sphereGroup = new THREE.Object3D;
    cubeGroup.add(sphereGroup);
    
    sphereGroup.position.set(0, 3, -4);

    geometry = new THREE.SphereGeometry(1, 20, 20);
    sphere = new THREE.Mesh(geometry, material);
    
    sphereGroup.add( sphere );

    geometry = new THREE.CylinderGeometry(0, .333, .444, 20, 5);
    cone = new THREE.Mesh(geometry, material);
    cone.position.set(1, 1, -.667);
    
    sphereGroup.add( cone );
    
    scene.add( cubeGroup );

    addMouseHandler(canvas, cubeGroup);
}

main();

