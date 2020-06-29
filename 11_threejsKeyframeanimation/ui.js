function initControls()
{
    $("#durationSlider").slider({min: 2, max: 10, value: duration, step: 0.1, animate: false});
    $("#durationSlider").on("slide", (e, u) =>{
            duration = u.value;
            $("#durationValue").html(duration + "s");				
        });
    $("#durationSlider").on("slidechange", (e, u) => {
            duration = u.value;
            playAnimations();
    });
    
    $("#animateCrateCheckbox").click(()=> { 
                animateCrate = !animateCrate;
                playAnimations();
            }
        );

    $("#animateWavesCheckbox").click(() =>{
                animateWaves = !animateWaves;
                playAnimations();
            }
        );

    $("#animateLightCheckbox").click(() =>{
                animateLight = !animateLight;
                playAnimations();
            }
        );

    $("#animateWaterCheckbox").click(() =>{
                animateWater = !animateWater;
                playAnimations();
                }
        );

    $("#loopCheckbox").click(() =>{
                loopAnimation = !loopAnimation;
                playAnimations();
                }
        );		
}