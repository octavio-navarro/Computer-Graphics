var container;

			var camera, scene, renderer, composer, clock;

			var uniforms, mesh;

			init();
			animate();

      function init(canvas) 
      {

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.z = 4;

				scene = new THREE.Scene();

				clock = new THREE.Clock();

				var textureLoader = new THREE.TextureLoader();

				uniforms = {

					"fogDensity": { value: 0.45 },
					"fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
					"time": { value: 1.0 },
					"uvScale": { value: new THREE.Vector2( 2.0, 1 ) },
					"texture1": { value: textureLoader.load( '../images/cloud.png' ) },
					"texture2": { value: textureLoader.load( '../images/lavatile.jpg' ) }

				};

				uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
				uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

				var size = 0.65;

				var material = new THREE.ShaderMaterial( {

					uniforms: uniforms,
					vertexShader: document.getElementById( 'vertexShader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent

				} );

				mesh = new THREE.Mesh( new THREE.SphereGeometry( size, 30, 30 ), material );
				mesh.rotation.x = 0.3;
				scene.add( mesh );

				console.log(mesh);
				//

				renderer = new THREE.WebGLRenderer( { canvas:canvas, antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );

			//

				onWindowResize();

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var delta = 5 * clock.getDelta();

				uniforms[ "time" ].value += 0.2 * delta;

				renderer.render(scene, camera);
			}