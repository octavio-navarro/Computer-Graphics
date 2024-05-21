// Bump maps. 
// A bump map is a bitmap used to displace the surface normal vectors of a mesh to create an apparently bumpy surface. The pixel values of the bitmap are treated as heights rather than color values. For example, a pixel value of zero can mean no displacement from the surface, and nonzero values can mean positive displacement away from the surface. Typically, single-channel black and white bitmaps are used.
"use strict"; 

import "../../css/main.css"
import "../../css/threejsbumpmap.css"

import * as THREE from "three";
import {addMouseHandler} from './sceneHandler_bump.js';

let renderer = null, scene = null, camera = null, root = null, group = null, sphere = null, sphereTextured = null;

let duration = 50000; // ms
let currentTime = Date.now();

let materials = {};
let textureMap = null;
let bumpMap = null;

const mapUrl = "../../images/moon_1024.jpg", bumpMapUrl = "../../images/moon_bump.jpg";

let materialName = "phong-textured", textureOn = true;

function main()
{
    const canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);

    // Run the update loop
    update();
}

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

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function createMaterials(mapUrl, bumpMapUrl)
{
    // Create a textre phong material for the cube
    // First, create the texture map
    textureMap = new THREE.TextureLoader().load(mapUrl);
    bumpMap = new THREE.TextureLoader().load(bumpMapUrl);

    materials["phong"] = new THREE.MeshPhongMaterial({ bumpMap: bumpMap, bumpScale: 0.01});
    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.01 });
}

function setMaterial(name)
{
    materialName = name;
    if (textureOn)
    {
        sphere.visible = false;
        sphereTextured.visible = true;
        sphereTextured.material = materials[name];
    }
    else
    {
        sphere.visible = true;
        sphereTextured.visible = false;
        sphere.material = materials[name];
    }
}

function modifyBump(scale)
{
    materials["phong"].bumpScale = scale;
    materials["phong-textured"].bumpScale = scale;
}

function toggleTexture()
{
    textureOn = !textureOn;
    let names = materialName.split("-");
    if (!textureOn)
        setMaterial(names[0]);
    else
        setMaterial(names[0] + "-textured");
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0x222222 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 400 );
    camera.position.z = 10;
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    let light = new THREE.DirectionalLight( 0xffffff, 3);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, 0, 1);
    scene.add( light );

    light = new THREE.AmbientLight ( 0x222222 );
    root.add(light);
    
    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create all the materials
    createMaterials(mapUrl, bumpMapUrl);
    
    // Create the sphere geometry
    let geometry = new THREE.SphereGeometry(2, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials["phong"]);
    sphere.visible = false;

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);

    // And put the geometry and material together into a mesh
    sphereTextured = new THREE.Mesh(geometry, materials["phong-textured"]);
    sphereTextured.visible = true;
    setMaterial("phong-textured");
    
    // Add the sphere mesh to our group
    group.add( sphere );
    group.add( sphereTextured );

    // Now add the group to our scene
    scene.add( root );

    materials["phong"].bumpScale = 0.01;
    materials["phong-textured"].bumpScale = 0.01;

    addMouseHandler(canvas, root, modifyBump, toggleTexture);
}

main();