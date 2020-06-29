

function initControls()
{
    $('#directional').ColorPicker({
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
            $('#directional div').css('backgroundColor', '#' + hex);
            setLightColor(directionalLight, rgb.r, rgb.g, rgb.b);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#directional div').css( "background-color", "#" + hex );
            setLightColor(directionalLight, rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });
    
    var directionalHex = "#000000";
    $('#directional').ColorPickerSetColor(directionalHex);
    $('#directional div').css( "background-color", directionalHex );
    
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
            setLightColor(spotLight, rgb.r, rgb.g, rgb.b);
        },
        onSubmit: (hsb, hex, rgb, el) => {
            $(el).val(hex);
            $('#spot div').css( "background-color", "#" + hex );
            setLightColor(spotLight, rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });
    var spotHex = "#000000";
    $('#spot').ColorPickerSetColor(spotHex);
    $('#spot div').css( "background-color", spotHex );
    
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
    var ambientHex = "#ffffff";
    $('#ambient').ColorPickerSetColor(ambientHex);
    $('#ambient div').css( "background-color", ambientHex );
}