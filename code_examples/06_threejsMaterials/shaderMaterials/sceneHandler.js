let mouseDown = false, pageX = 0;

function rotateScene(deltax, group)
{
    group.rotation.y += deltax / 100;
    document.querySelector("#rotation").innerHTML = "rotation: 0," + group.rotation.y.toFixed(2) + ",0";
}

function scaleScene(scale, group)
{
    group.scale.set(scale, scale, scale);
    document.querySelector("#scale").innerHTML = "scale: " + scale;
}
    
function onMouseMove(evt, group)
{
    if (!mouseDown)
        return;

    evt.preventDefault();
    
    let deltax = evt.pageX - pageX;
    pageX = evt.pageX;
    rotateScene(deltax, group);
}

function onMouseDown(evt)
{
    evt.preventDefault();
    
    mouseDown = true;
    pageX = evt.pageX;
}

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
    canvas.addEventListener( 'mousemove', e => onMouseMove(e, group), false );
    canvas.addEventListener( 'mousedown', e => onMouseDown(e), false );
    canvas.addEventListener( 'mouseup', e => onMouseUp(e), false );

    document.querySelector("#slider").oninput = (e) => scaleScene(e.target.value, group);
}

export {addMouseHandler};
