let mouseDown = false, pageX = 0;

function rotateScene(deltax, group)
{
    group.rotation.y += deltax / 100;
    $("#rotation").html("rotation: 0," + root.rotation.y.toFixed(2) + ",0");
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
    $("#slider").slider({min: 0.5, max: 3, value: 1, step: 0.01, animate: false});
    
    $('#diffuseColor').ColorPicker({
        color: '#ffffff',
        onShow: colpkr => {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: colpkr => {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: (hsb, hex, rgb) => {
            $('#diffuseColor div').css('backgroundColor', '#' + hex);
            setMaterialDiffuse(rgb.r, rgb.g, rgb.b);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#diffuseColor div').css( "background-color", "#" + hex );
            setMaterialDiffuse(rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });

    let diffuseHex = "#ffffff";
    $('#diffuseColor').ColorPickerSetColor(diffuseHex);
    $('#diffuseColor div').css( "background-color", diffuseHex );
    
    $('#specularColor').ColorPicker({
        color: '#ffffff',
        onShow: colpkr => {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: colpkr => {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: (hsb, hex, rgb) => {
            $('#specularColor div').css('backgroundColor', '#' + hex);
            setMaterialSpecular(rgb.r, rgb.g, rgb.b);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#specularColor div').css( "background-color", "#" + hex );
            setMaterialSpecular(rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });

    let specularHex = "#111111";
    $('#specularColor').ColorPickerSetColor(specularHex);
    $('#specularColor div').css( "background-color", specularHex );
                    
    $("#textureUrl").html(normalMapUrl);
    $("#texture").css( "background-image", "url(" + normalMapUrl + ")");
    
    $("#textureCheckbox").click( () => toggleNormalMap());
}