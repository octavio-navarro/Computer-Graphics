
let easingFunctions = {
    none : TWEEN.Easing.Linear.None,
    quadratic : TWEEN.Easing.Quadratic.InOut,
    cubic : TWEEN.Easing.Cubic.InOut,
    quartic : TWEEN.Easing.Quartic.InOut,
    quintic : TWEEN.Easing.Quintic.InOut,
    sinusoidal : TWEEN.Easing.Sinusoidal.InOut,
    exponential : TWEEN.Easing.Exponential.InOut,
    circular : TWEEN.Easing.Circular.InOut,
    elastic : TWEEN.Easing.Elastic.InOut,
    back : TWEEN.Easing.Back.InOut,
    bounce : TWEEN.Easing.Bounce.InOut,
};

function initControls()
{
    $("#delaySlider").slider({min: 0, max: 1, value: delayTime, step: 0.05, animate: false});
    $("#delaySlider").on("slide", (e, u) => {
            delayTime = u.value;
            $("#delayValue").html(delayTime + "s");
            
        });

    $("#delaySlider").on("slidechange", (e, u) => {
            delayTime = u.value;
            playAnimations();
    });

    $("#durationSlider").slider({min: 0.2, max: 5, value: duration, step: 0.1, animate: false});
    $("#durationSlider").on("slide", (e, u) => {
            duration = u.value;
            $("#durationValue").html(duration + "s");				
        });

    $("#durationSlider").on("slidechange", (e, u) => {
            duration = u.value;
            playAnimations();
    });

    $("#tweenPositionCheckbox").click(() => { 
                tweenPosition = !tweenPosition;
                playAnimations();
            }
        );

    $("#tweenRotationCheckbox").click(() => {
                tweenRotation = !tweenRotation;
                playAnimations();
            }
        );

    $("#tweenColorCheckbox").click(() => {
                tweenColor = !tweenColor;
                playAnimations();
            }
        );

    $("#tweenOpacityCheckbox").click(() => {
                tweenOpacity = !tweenOpacity;
                playAnimations();
                }
        );

    $("#loopCheckbox").click(() => {
                repeatCount = isFinite(repeatCount) ? Infinity : 0;
                playAnimations();
                }
        );


    $("input[name=easingRBGroup]").click(() => {
                let id = $("input[name=easingRBGroup]:checked").attr('value');
                easingFunction = easingFunctions[id];
                playAnimations();
            }
        );
}