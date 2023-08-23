let mouseDown = false, pageX = 0;

/**
 * Rotates a group based on the value from the html web page
 * @param {float} deltax How much to rotate the group
 * @param {THREE.Object3D} group Group that is rotated
 */
function rotateScene(deltax, group)
{
    group.rotation.y += deltax / 100;
    document.querySelector("#rotation").innerHTML = "rotation: 0," + group.rotation.y.toFixed(2) + ",0";
}

/**
 * Scales the group based on the value from the html web page
 * @param {float} scale 
 * @param {THREE.Object3D} group 
 */
function scaleScene(scale, group)
{
    group.scale.set(scale, scale, scale);
    document.querySelector("#scale").innerHTML = "scale: " + scale;
}

/**
 * Event handler that rotates the scene
 * @param {*} evt 
 * @param {THREE.Object3D} group 
 */
function onMouseMove(evt, group)
{
    if (!mouseDown)
        return;

    evt.preventDefault();
    
    const deltax = evt.pageX - pageX;
    pageX = evt.pageX;
    rotateScene(deltax, group);
}

/**
 * Event handle to track if a mouse button is down
 * @param {*} evt 
 */
function onMouseDown(evt)
{
    evt.preventDefault();
    
    mouseDown = true;
    pageX = evt.pageX;
}

/**
 * Event handle to track if a mouse button is up
 * @param {*} evt 
 */
function onMouseUp(evt)
{
    evt.preventDefault();
    
    mouseDown = false;
}

/**
 * Adds the mouse events to the canvas
 * @param {canvas} canvas The canvas element to add the mouse handlers to
 * @param {THREE.Object3D} group The group that is affected by the inputs
 */
function addMouseHandler(canvas, group)
{
    canvas.addEventListener( 'mousemove', e => onMouseMove(e, group));
    canvas.addEventListener( 'mousedown', e => onMouseDown(e));
    canvas.addEventListener( 'mouseup', e => onMouseUp(e));

    document.querySelector("#slider").oninput = (e) => scaleScene(e.target.value, group);
}

/**
 * Adds the event to the radiobutton group, and loads the given function
 * * @param {function} setMaterial The function that sets the material of the mesh based on a name from the web page
 */
function changeMaterial(setMaterial)
{
    const id = document.querySelector("input[name=materialRBGroup]:checked");
    const textureOn = document.querySelector("#textureCheckbox").checked;

    if (textureOn)
        setMaterial(id.value + "-textured");
    else
        setMaterial(id.value); 
}

/**
 * The event of the checkbox group, and loads the given function
 * @param {function} setMaterial The function that sets the material of the mesh based on a name from the web page
 */
function toggleTexture(setMaterial)
{
    const textureOn = document.querySelector("#textureCheckbox").checked;
    const id = document.querySelector("input[name=materialRBGroup]:checked");

    if (!textureOn)
        setMaterial(id.value);
    else
        setMaterial(id.value + "-textured");
}

/**
 * Changes the material to/from a wireframe
 * @param {Object} materials Object that contains all the materials used in the scene
 */
function toggleWireframe(materials)
{
    materials["basic"].wireframe = !materials["basic"].wireframe;
    materials["phong"].wireframe = !materials["phong"].wireframe;
    materials["lambert"].wireframe = !materials["lambert"].wireframe;
    materials["basic-textured"].wireframe = !materials["basic-textured"].wireframe;
    materials["phong-textured"].wireframe = !materials["phong-textured"].wireframe;
    materials["lambert-textured"].wireframe = !materials["lambert-textured"].wireframe;
}

/**
 * Changes the diffuse color of the material. The material’s diffuse color specifies how much the object reflects lighting sources that cast rays in a direction — directional, point, and spotlights.
 * @param {Object} materials Object that contains all the materials used in the scene
 * @param {*} color The color to be applied to the material
 */
function setMaterialDiffuse(materials, color)
{    
    materials["basic"].color.set(color)
    materials["phong"].color.set(color)
    materials["lambert"].color.set(color)
    materials["basic-textured"].color.set(color)
    materials["phong-textured"].color.set(color)
    materials["lambert-textured"].color.set(color)
}

/**
 * Changes the diffuse color of the material. The specular color combines with scene lights to create reflected highlights from any of the object's vertices facing toward light sources.
 * @param {Object} materials Object that contains all the materials used in the scene
 * @param {*} color The color to be applied to the material
 */
function setMaterialSpecular(materials, color)
{    
    materials["phong"].specular.set(color);
    materials["phong-textured"].specular.set(color);
}

/**
 * Adds the event handlers to all the input groups
 * @param {Object} materials Object that contains all the materials used in the scene
 * @param {function} setMaterial The function that sets the material of the mesh based on a name from the web page
 */
function initControls(materials, setMaterial)
{
    document.querySelector("#wireframeCheckbox").addEventListener('change', () => toggleWireframe(materials) );

    document.querySelector('#diffuseColor').addEventListener('change', event=>{
        setMaterialDiffuse(materials, event.target.value);
    });
    document.querySelector('#diffuseColor').addEventListener('input', event=>{
        setMaterialDiffuse(materials, event.target.value);
    });
        
    document.querySelector('#specularColor').addEventListener('change', event=>{
        setMaterialSpecular(materials, event.target.value);
    });
    document.querySelector('#specularColor').addEventListener('input', event=>{
        setMaterialSpecular(materials, event.target.value);
    });
    
    document.querySelector("#textureCheckbox").addEventListener('change', () => toggleTexture(setMaterial) );

    document.querySelectorAll('input[name="materialRBGroup"').forEach(element =>{
        element.addEventListener('change', () => changeMaterial(setMaterial) );
    });
}

export {initControls, addMouseHandler};