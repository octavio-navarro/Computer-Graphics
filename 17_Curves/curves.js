/**
 * Curves using Threejs
 * 
 */

let scene = null, camera = null, renderer = null;
let orbitControls = null;
let mapUrl = "../images/checker_large.gif";

function createScene(canvas)
{
    // A simple scene with boxes placed randomly
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x333333 );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set(0, 0, -5);

    scene.add(camera);
            
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener( 'resize', onWindowResize);
    
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let color = 0xffffff;

    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    scene.add( mesh );

    addCurves();
}

function addCurves()
{
    var curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( -10, 0, 10 ),
        new THREE.Vector3( -5, 5, 5 ),
        new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( 5, -5, 5 ),
        new THREE.Vector3( 10, 0, 10 )
    ] );
    
    var points = curve.getPoints( 50 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    var material = new THREE.LineBasicMaterial( { color : 0xffffff } );
    
    // Create the final object to add to the scene
    var curveObject = new THREE.Line( geometry, material );

    console.log(points);
    scene.add(curveObject);
}

function update()
{
    requestAnimationFrame(update);
    
    renderer.render(scene, camera);
    orbitControls.update();
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}