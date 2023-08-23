"use strict"; 

import * as THREE from '../../libs/three.js/three.module.js'
import { OrbitControls } from '../../libs/three.js/controls/OrbitControls.js'

let renderer = null, scene = null, camera = null, root = null, orbitControls = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let directionalLight = null, spotLight = null, ambientLight = null;

const mapUrl = "../../images/checker_large.gif";

function update() 
{
    requestAnimationFrame(function() { update(); });
    renderer.render( scene, camera );
    orbitControls.update();
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 400 );
    camera.position.set(0, 15, 125);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0,0,0);
        
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 1);
    directionalLight.position.set(0, 5, 100);

    root = new THREE.Object3D();

    scene.add(directionalLight);
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 8, 100);
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    scene.add(ambientLight);

    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    let floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    scene.add(floor);

    console.log(scene,root);
    
    raycaster = new THREE.Raycaster();

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    scene.add( root );
}

function onDocumentPointerMove( event ) 
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( root.children);

    if ( intersects.length > 0 ) 
    {
        console.log(intersects);

        if ( intersected != intersects[ 0 ].object ) 
        {
            if ( intersected )
                intersected.material.emissive.set( intersected.currentHex );

            intersected = intersects[ 0 ].object;
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.set( 0xff0000 );
        }
    } 
    else 
    {
        if ( intersected ) 
            intersected.material.emissive.set( intersected.currentHex );

        intersected = null;
    }
}

function onDocumentPointerDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( root.children );

    if ( intersects.length > 0 ) 
    {
        clicked = intersects[ 0 ].object;
        clicked.material.emissive.set( 0x00ff00 );
    } 
    else 
    {
        if ( clicked ) 
            clicked.material.emissive.set( clicked.currentHex );

        clicked = null;
    }
}

function addBoxes()
{
    const geometry = new THREE.BoxGeometry( 5, 5, 5 );
    
    for ( let i = 0; i < 10; i ++ ) 
    {
        const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        
        object.name = 'Cube' + i;
        object.position.set(Math.random() * 40 - 20, Math.random() * 40 , Math.random() * 40 - 20);
            
        root.add( object );
    }
    console.log(root);
}

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    addBoxes();

    update();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.addEventListener('resize', resize, false);

main();
resize(); 

