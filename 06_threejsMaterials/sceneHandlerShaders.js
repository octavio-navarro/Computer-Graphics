let mouseDown = false,
pageX = 0;

function rotateScene(deltax, group)
{
    group.rotation.y += deltax / 100;
    $("#rotation").html("rotation: 0," + cubeGroup.rotation.y.toFixed(2) + ",0");
}

function scaleScene(scale, group)
{
    group.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
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

function addMouseHandler(canvas, group)
{
    canvas.addEventListener( 'mousemove', e => onMouseMove(e, group), false );
    canvas.addEventListener( 'mousedown', e => onMouseDown(e), false );
    canvas.addEventListener( 'mouseup', e => onMouseUp(e), false );

    $("#slider").on("slide", (e, u) => scaleScene(u.value, group));
}

function initControls()
{
    $("#slider").slider({min: 0.5, max: 2, value: 1, step: 0.01, animate: false});
}