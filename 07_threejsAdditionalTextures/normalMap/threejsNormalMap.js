// Normal maps. 
// Normal maps provide a way to get even more surface detail than bump maps, still without using extra polygons. Normal maps tend to be larger and require more processing power than bump maps. Normal maps work by encoding actual vertex normal vector values into bitmaps as RGB data, typically at a much higher resolution than the associated mesh vertex data. The shader incorporates the normal information into its lighting calculations (along with current camera and light source values) to provide apparent surface detail. 

// Specular maps.
// Specular maps determine the intensity of specularity for each pixel. 

"use strict"; 

import * as THREE from '../../libs/three.js/three.module.js'
import {addMouseHandler} from './sceneHandler_normalmap.js'

let renderer = null, scene = null, camera = null, root = null, group = null, sphere = null, sphereNormalMapped = null;

let materials = {};

let mapUrl = "../../images/earth_atmos_2048.jpg";
let normalMapUrl = "../../images/earth_normal_2048.jpg";
let specularMapUrl = "../../images/earth_specular_spec_1k.jpg";

let materialName = "phong-normal";	
let normalMapOn = true;

let duration = 10000; // ms
let currentTime = Date.now();
let animating = true;

function main()
{
    let canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);
    
    // run the update loop
    update();
}

function animate() {

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    if(animating)
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

function createMaterials()
{
    // Create a textre phong material for the cube
    // First, create the texture map
    const texture = new THREE.TextureLoader().load(mapUrl);
    const normalMap = new THREE.TextureLoader().load(normalMapUrl);
    const specularMap = new THREE.TextureLoader().load(specularMapUrl);

    materials["phong"] = new THREE.MeshPhongMaterial({ map: texture });
    materials["phong-normal"] = new THREE.MeshPhongMaterial({ map: texture, normalMap: normalMap, specularMap: specularMap });
}

function setMaterial(name)
{
    materialName = name;
    if (normalMapOn)
    {
        sphere.visible = false;
        sphereNormalMapped.visible = true;
        sphereNormalMapped.material = materials[name];
    }
    else
    {
        sphere.visible = true;
        sphereNormalMapped.visible = false;
        sphere.material = materials[name];
    }
}

function toggleNormalMap()
{
    normalMapOn = !normalMapOn;
    let names = materialName.split("-");
    if (!normalMapOn)
    {
        setMaterial(names[0]);
    }
    else
    {
        setMaterial(names[0] + "-normal");
    }
}

function onKeyDown ( event )
{
    switch ( event.keyCode ) {

        case 32:
            animating = !animating;
            break;
    }

}

function createScene(canvas) 
{    
    document.addEventListener( 'keydown', onKeyDown, false );

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
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    let light = new THREE.DirectionalLight( 0xffffff, 2);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, 0, 1);
    root.add( light );

    light = new THREE.AmbientLight ( 0xffffff );
    root.add(light);
    
    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create all the materials
    createMaterials();
    
    // Create the sphere geometry
    let geometry = new THREE.SphereGeometry(2, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials["phong"]);
    sphere.visible = false;

    // And put the geometry and material together into a mesh
    sphereNormalMapped = new THREE.Mesh(geometry, materials["phong-normal"]);
    sphereNormalMapped.visible = true;
    setMaterial("phong-normal");
    
    // Add the sphere mesh to our group
    group.add( sphere );
    group.add( sphereNormalMapped );

    // Now add the group to our scene
    scene.add( root );

    addMouseHandler(canvas, root, toggleNormalMap);
}

main();