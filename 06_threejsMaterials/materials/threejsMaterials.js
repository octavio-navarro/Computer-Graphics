"use strict"; 

import * as THREE from "../../libs/three.js/three.module.js"
import {initControls, addMouseHandler} from "./sceneHandlers.js";

let renderer = null, scene = null, camera = null, group = null, sphere = null, sphereTextured = null;

const  duration = 10000; // ms
let currentTime = Date.now();

const materials = {}, mapUrl = "../../images/moon_1024.jpg";

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
    requestAnimationFrame( () => update());
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

/**
* Unlit (Basic Material) - With this material type, only the textures, colors, and transparency values are used to render the surface of the object. There is no contribution from lights in the scene.
* Phong shading - This material type implements a simple, fairly realistic-looking shading model with high performance. Phong-shaded objects will show brightly lit areas (specular reflections) where light hits directly, will light well along any edges that mostly face the light source, and will darkly shade areas where the edge of the object faces away from the light source.
* Lambertian reflectance - In Lambert shading, the apparent brightness of the surface to an observer is the same regardless of the observer’s angle of view. 

* Creates all the materials that can be assigned to the object
* @param {string} mapUrl The route of the texture to be used
*/
function createMaterials(mapUrl)
{
    // Create a textre phong material for the cube
    // First, create the texture map
    const textureMap = new THREE.TextureLoader().load(mapUrl);

    materials["basic"] = new THREE.MeshBasicMaterial();
    materials["phong"] = new THREE.MeshPhongMaterial();
    materials["lambert"] = new THREE.MeshLambertMaterial();
    materials["basic-textured"] = new THREE.MeshBasicMaterial({ map: textureMap });
    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap });
    materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
}

/*
* Changes the material of the mesh to the specified on based on its name
* @param {string} name The name of the key from the materials dictionary
*/
function setMaterial(name)
{
    const textureOn = document.querySelector("#textureCheckbox").checked;
    
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

/**
 * Creates a scene, camera, and adds lights and a sphere mesh
 * @param {canvas} canvas 
 */
function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
        
    // Create a group to hold the sphere
    group = new THREE.Object3D;

    // Add a directional light to show off the object
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Position the light out from the scene, pointing at the origin
    directionalLight.position.set(.5, 0, 1);
    scene.add( directionalLight );

    const ambientLight = new THREE.AmbientLight ( 0xaaccbb, 0.3 );
    scene.add(ambientLight);
    
    // Create all the materials
    createMaterials(mapUrl);
    
    // Create the sphere geometry
    const geometry = new THREE.SphereGeometry(2, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials["phong"]);
    sphere.visible = false;
        
    // And put the geometry and material together into a mesh
    sphereTextured = new THREE.Mesh(geometry, materials["phong-textured"]);
    sphereTextured.visible = true;
    setMaterial("phong-textured");
    
    // Add the sphere mesh to our group
    group.add( sphere );
    group.add( sphereTextured );
    
    // add mouse handling so we can rotate the elements in the scene
    addMouseHandler(canvas, group);
    
    scene.add(group);
}    

function main()
{
    let canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);

    // initialize the controls
    initControls(materials, setMaterial);
    
    // update the update loop
    update();
}

main();