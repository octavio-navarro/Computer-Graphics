"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import {addMouseHandler} from "./sceneHandlers.js"

let renderer = null, scene = null, camera = null, cube = null, sphere = null, cone = null, sphereGroup = null, cubeGroup = null, coneGroup = null;

const duration = 5000; // ms
let currentTime = Date.now();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

    // Rotate the cube about its Y axis
    // cube.rotation.y += angle;
    cube.rotation.y += angle;

    // Rotate the sphere group about its Y axis
    sphereGroup.rotation.x -= angle / 2;
    sphere.rotation.y += angle * 2;

    // Rotate the cone about its X axis (tumble forward)
    coneGroup.rotation.x += angle;
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 20 );
    camera.position.z = 10;
    scene.add(camera);

    // Create a group to hold all the objects
    cubeGroup = new THREE.Object3D;

    console.log(cubeGroup.position);
    
    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    const textureUrl = "../images/ash_uvgrid01.jpg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const material = new THREE.MeshPhongMaterial({ map: texture });

    // Create the cube geometry
    let geometry = new THREE.BoxGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Tilt the mesh toward the viewer
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    cubeGroup.add( cube );

    cubeGroup.position.set(1, 0, -0.5);

    console.log("cube group position", cubeGroup.position);
    // Create a group for the sphere
    sphereGroup = new THREE.Object3D;
    cubeGroup.add(sphereGroup);
    
    // Move the sphere group up and back from the cube
    sphereGroup.position.set(0, 3, -4);

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(1, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    // sphere.position.set(2, 1, 1);
    console.log("sphere position", sphere.position);
    // Add the sphere mesh to our group
    sphereGroup.add( sphere );

    coneGroup = new THREE.Object3D();
    sphereGroup.add(coneGroup);
    // Create the cone geometry
    geometry = new THREE.CylinderGeometry(0, .333, .444, 20, 20);

    // coneGroup.position.set(1, 1.222, -.667);
    // And put the geometry and material together into a mesh
    cone = new THREE.Mesh(geometry, material);

    // Move the cone up and out from the sphere
    cone.position.set(0, 2.222, 0);
        
    // Add the cone mesh to our group
    coneGroup.add( cone );
    
    // Now add the group to our scene
    scene.add( cubeGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, cubeGroup);

    // This code gets the world position of the cone.
    const coneWorldPosition = new THREE.Vector3();

    // cubeGroup.updateMatrixWorld();
    // sphereGroup.updateMatrixWorld();
    // cone.updateMatrixWorld();

    console.log("Cone position:", cone.position);
    cone.getWorldPosition(coneWorldPosition);
    console.log("Cone world position", coneWorldPosition);
}

main();