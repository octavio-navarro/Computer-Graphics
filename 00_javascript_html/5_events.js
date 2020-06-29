function clicked()
{
    alert("You clicked the document");
}

function main()
{
    whichButton();
    keyEvents();
    mouseEvents();
    sliderEvent();
}

function buttonClick()
{
    document.removeEventListener("click", clicked);
    console.log("Button clicked! You removed the document event");
}

function whichButton()
{
    document.addEventListener('contextmenu', event => event.preventDefault());

    let button = document.getElementById("whichB");
    console.log(button);
    button.addEventListener("mousedown", event => 
    {
        console.log(event);
        if(event.button == 0)
            console.log("Left Button")
        else if(event.button == 1)
            console.log("Middle Button")
        else if(event.button == 2)
            console.log("Right Button")
    });
}

function keyEvents()
{
    document.addEventListener("keydown", event=>
    {
        let text = document.getElementById("textColorChange");

        if(event.key == "q")
            text.style.color = "#"+Math.floor(Math.random()*16777215).toString(16);
    });

    document.addEventListener("keyup", event=>
    {
        let text = document.getElementById("textColorChange");

        if(event.key == "q")
            text.style.color = "";
    });
}

function mouseEvents()
{
    document.addEventListener("click", clicked);
    
    document.addEventListener("mousemove", event =>{
        let mouseText = document.getElementById("mousePosition");

        mouseText.innerHTML = `Mouse position: (${event.clientX}, ${event.clientY})`;
    })
}

function sliderEvent()
{
    document.getElementById("slider").oninput = function(event) {
        document.getElementById("sliderValue").innerHTML = "Value: " + event.target.value;
    };
}