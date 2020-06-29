let container;
let camera, scene, raycaster, renderer;

let mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
let radius = 100, theta = 0;

let floorUrl = "../images/checker_large.gif";

let animator = null,
duration = 2, // sec
loopAnimation = false;

function initAnimations() 
{
    animator = new KF.KeyFrameAnimator;
    animator.init({ 
        interps:
            [
                { 
                    keys:[0, .5, 1], 
                    values:[
                            { y : 0 },
                            { y : Math.PI  },
                            { y : Math.PI * 2 },
                            ],
                },
            ],
        loop: loopAnimation,
        duration:duration * 1000,
    });
}

function playAnimations()
{
    animator.start();
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

    // camera.rotation.set(Math.PI / 6, 0, 0);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    
    // floor

    let map = new THREE.TextureLoader().load(floorUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;
    scene.add( floor );

    let geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    
    for ( let i = 0; i < 10; i ++ ) 
    {
        let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        
        object.name = 'Cube' + i;
        object.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, -200);
            
        scene.add( object );
    }
    
    raycaster = new THREE.Raycaster();
        
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mousedown', onDocumentMouseDown);
    
    window.addEventListener( 'resize', onWindowResize);

    initAnimations();
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) 
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );
    
    if ( intersects.length > 0 ) 
    {
        let closer = intersects.length - 1;

        if ( INTERSECTED != intersects[ closer ].object ) 
        {
            console.log(INTERSECTED);
            if ( INTERSECTED )
                INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ closer ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
    } 
    else 
    {
        if ( INTERSECTED ) 
            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;
    }
}

function onDocumentMouseDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );

    console.log("intersects", intersects);
    if ( intersects.length > 0 ) 
    {
        CLICKED = intersects[ intersects.length - 1 ].object;
        CLICKED.material.emissive.setHex( 0x00ff00 );
        console.log(CLICKED);
        if(!animator.running)
        {
            for(let i = 0; i<= animator.interps.length -1; i++)
            {
                animator.interps[i].target = CLICKED.rotation;
            }
            playAnimations();
        }
    } 
    else 
    {
        if ( CLICKED ) 
            CLICKED.material.emissive.setHex( CLICKED.currentHex );

        CLICKED = null;
    }
}
//
function run() 
{
    requestAnimationFrame( run );
    KF.update();
    render();
}

function render() 
{
    renderer.render( scene, camera );
}