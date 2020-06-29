var camera, root, scene, renderer, renderer2, windowHalfX, windowHalfY;
var mouseX = 0, mouseY = 0;
var sphere;
var light
var lightMovementAmplitude = 200

function init() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 4000
    );
    camera.position.set( 0, 0, 500 );

    scene = new THREE.Scene()
    root = new THREE.Object3D()
    root.position.y = 10
    root.rotation.y = Math.PI / 3
    scene.add(root)
    
    const background = makeElementObject('div', 200, 200)
    
    background.css3dObject.element.style.background = new THREE.Color(
        Math.random() * 0.21568627451 + 0.462745098039,
        Math.random() * 0.21568627451 + 0.462745098039,
        Math.random() * 0.21568627451 + 0.462745098039,
    ).getStyle();
    background.css3dObject.element.textContent = "I am a <div> element! Edit me!"
    background.css3dObject.element.setAttribute('contenteditable', '');
    
    background.css3dObject.element.style.transform = 'scale(1.0)';
    root.add( background );
    
    const button = makeElementObject('button', 75, 20)
    
    button.css3dObject.element.style.background = new THREE.Color(
        Math.random() * 0.21568627451 + 0.462745098039,
        Math.random() * 0.21568627451 + 0.462745098039,
        Math.random() * 0.21568627451 + 0.462745098039,
    ).getStyle();
    button.css3dObject.element.style.border = '1px solid orange'
    button.css3dObject.element.textContent = "Click me!"
    button.css3dObject.element.addEventListener('click', () => alert('Button clicked!'))
    button.position.y = 10
    button.position.z = 10
    background.add(button)

    // make a geometry to see if we can clip it with the DOM elememt.
    ~function() {
        var material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x000000,
            specular: 0x111111,
            side: THREE.FrontSide,
            flatShading: false,
            shininess: 30,
        })
        var geometry = new THREE.SphereGeometry( 70, 32, 32 );
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = 20;
        sphere.position.y = -100;
        sphere.castShadow = true;
        sphere.receiveShadow = false;
        root.add( sphere );
    }()

    // light
    ~function() {
        var ambientLight = new THREE.AmbientLight( 0x353535 );
        root.add( ambientLight );

        light = new THREE.PointLight( 0xffffff, 1, 0 );
        light.castShadow = true;
        light.position.z = 150;
        light.shadow.mapSize.width = 256;  // default
        light.shadow.mapSize.height = 256; // default
        light.shadow.camera.near = 1;       // default
        light.shadow.camera.far = 2000;      // default
        light.shadow.bias = -0.001;
        
        scene.add( new THREE.PointLightHelper( light, 10 ) )

        root.add( light );
    }()

    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.getElementById( 'css' ).appendChild( renderer2.domElement );

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.getElementById('webgl').appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function animate(time) {
    
    light.position.x = 20 * Math.sin(time * 0.003);
    light.position.y = 40 * Math.cos(time * 0.002) - 80;

    scene.updateMatrixWorld()

    renderer.render( scene, camera );
    renderer2.render( scene, camera );

    requestAnimationFrame( animate );
}

function makeElementObject(type, width, height) {
    const obj = new THREE.Object3D

    const element = document.createElement( type );
    element.style.width = width+'px';
    element.style.height = height+'px';
    element.style.opacity = 0.999;

    var css3dObject = new THREE.CSS3DObject( element );
    obj.css3dObject = css3dObject
    obj.add(css3dObject)

    // make an invisible plane for the DOM element to chop
    // clip a WebGL geometry with it.
    var material = new THREE.MeshPhongMaterial({
        opacity	: 0,
        color	: new THREE.Color( 0x111111 ),
        blending: THREE.NoBlending,
        side	: THREE.DoubleSide,
    });
    var geometry = new THREE.BoxGeometry( width, height, 0.1 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    obj.lightShadowMesh = mesh
    obj.add( mesh );

    return obj
}