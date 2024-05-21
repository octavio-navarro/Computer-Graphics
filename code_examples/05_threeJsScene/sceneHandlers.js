
// An integer value, in pixels, indicating the X coordinate at which the mouse pointer was located when the event occurred. 
let mouseDown = false, pageX = 0;

/**
 * Rotates a group based on the input from the webpage
 * @param {float} deltax How much the group is going to rotate
 * @param {THREE.Object3D} group The group that is goint to be rotated
 */
function rotateScene(deltax, group)
{
    group.rotation.y += deltax / 100;
    document.getElementById('rotation').innerHTML = "rotation: 0," + group.rotation.y.toFixed(1) + ",0";
}

/**
 * Scales a group based on the input from the webpage
 * @param {float} scale How much the group is going to be scaled
 * @param {THREE.Object3D} group The group that is goint to be scaled
 */
function scaleScene(scale, group)
{
    group.scale.set(scale, scale, scale);
    document.getElementById('scale').innerHTML = "scale: " + scale;
}

/**
 * Event handler for when the mouse moves
 * @param {event} evt The event data
 * @param {THREE.Object3D} group The group that is going to respond to the events
 */
function onMouseMove(evt, group)
{
    if (!mouseDown)
        return;
    
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    evt.preventDefault();
    
    let deltax = evt.pageX - pageX;
    pageX = evt.pageX;
    rotateScene(deltax, group);
}

/**
 * Event handler for the mouse down event. Tracks if a mouse button was pressed, and where on the page was it pressed.
 * @param {event} evt 
 */
function onMouseDown(evt)
{
    evt.preventDefault();
    
    mouseDown = true;
    pageX = evt.pageX;
}

/**
 * Event handler for the mouse up event. 
 * @param {event} evt 
 */
function onMouseUp(evt)
{
    evt.preventDefault();
    
    mouseDown = false;
}

/**
 * 
 * @param {canvas} canvas The canvas element to add the mouse handlers to
 * @param {THREE.Object3D} group The group that is going to respond to the events
 */
function addMouseHandler(canvas, group)
{
    canvas.addEventListener( 'mousemove', e => onMouseMove(e, group), false);
    canvas.addEventListener( 'mousedown', e => onMouseDown(e), false );
    canvas.addEventListener( 'mouseup',  e => onMouseUp(e), false );

    document.getElementById('slider').oninput = (e) => scaleScene(e.target.value, group);
}

export { addMouseHandler }