
function initControls()
{
    $('#directional').ColorPicker({
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
            $('#directional div').css('backgroundColor', '#' + hex);
            setLightColor(directionalLight, rgb.r, rgb.g, rgb.b, directionalHelper);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#directional div').css( "background-color", "#" + hex );
            setLightColor(directionalLight, rgb.r, rgb.g, rgb.b, directionalHelper);
            $(el).ColorPickerHide();
        },
    });

    let directionalHex = "#ffffff";
    $('#directional').ColorPickerSetColor(directionalHex);
    $('#directional div').css( "background-color", directionalHex );
    
    $('#point').ColorPicker({
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
            $('#point div').css('backgroundColor', '#' + hex);
            setLightColor(pointLight, rgb.r, rgb.g, rgb.b, pointLightHelper);
            // pointLightHelper.color.setRGB(rgb.r/255, rgb.g/255, rgb.b/255);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#point div').css( "background-color", "#" + hex );
            setLightColor(pointLight, rgb.r, rgb.g, rgb.b, pointLightHelper);
            $(el).ColorPickerHide();
        },
    });

    pointHex = "#ffffff";
    $('#point').ColorPickerSetColor(pointHex);
    $('#point div').css( "background-color", pointHex );
    
    $('#spot').ColorPicker({
        color: '#ffffff',
        onShow: (colpkr) => {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: (colpkr) => {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: (hsb, hex, rgb) => {
            $('#spot div').css('backgroundColor', '#' + hex);
            setLightColor(spotLight, rgb.r, rgb.g, rgb.b, spotlightHelper);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#spot div').css( "background-color", "#" + hex );
            setLightColor(spotLight, rgb.r, rgb.g, rgb.b, spotlightHelper);
            $(el).ColorPickerHide();
        },
    });

    pointHex = "#ffffff";
    $('#spot').ColorPickerSetColor(pointHex);
    $('#spot div').css( "background-color", pointHex );

    
    $('#ambient').ColorPicker({
        color: '#ffffff',
        onShow: (colpkr) => {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: (colpkr) => {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: (hsb, hex, rgb) => {
            $('#ambient div').css('backgroundColor', '#' + hex);
            setLightColor(ambientLight, rgb.r, rgb.g, rgb.b);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#ambient div').css( "background-color", "#" + hex );
            setLightColor(ambientLight, rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });

    let ambientHex = "#ffffff";
    $('#ambient').ColorPickerSetColor(ambientHex);
    $('#ambient div').css( "background-color", ambientHex );

    $("#textureUrl").html(mapUrl);
    $("#texture").css( "background-image", "url(" + mapUrl + ")");

    $("#textureCheckbox").click(() => toggleTexture());
}