function drawRect(ctx, color, x,y,width,height)
{
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
}

function drawFace(ctx, x_center, y_center)
{
    ctx.beginPath();
    ctx.arc(x_center, y_center, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(x_center + 35, y_center);
    ctx.arc(x_center, y_center, 35, 0, Math.PI, false);  // Mouth (clockwise)
    ctx.moveTo(x_center - 10, y_center -10);
    ctx.arc(x_center - 15, y_center -10, 5, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(x_center + 20, y_center - 10);
    ctx.arc(x_center + 15, y_center - 10, 5, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke()
}

function main()
{
    // To draw something on a <canvas>, you must first retrieve the <canvas> element from the HTML file
    let canvas = document.getElementById("htmlCanvas");

    // If the canvas is not null, the element was retrieved successfully.
    if(!canvas)
    {
        console.log("Failed to load the canvas element.")
        return;
    }

    // Because the <canvas> is designed to be flexible and supports both 2D and 3D, it does not provide drawing methods directly and instead provides a mechanism called a context, which supports the actual drawing features.
    let ctx = canvas.getContext("2d");

    // Drawing rectangles
    drawRect(ctx, 'rgba(0, 0, 200, 1.0)', 120, 10, 150, 150)
    drawRect(ctx, 'rgba(150, 0, 200, 0.5)', 195, 85, 150, 150)

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(25, 250, 100, 100);
    ctx.clearRect(45, 275, 60, 60);
    ctx.strokeRect(50, 280, 50, 50);

    // Paths - A path is a list of points, connected by segments of lines that can be of different shapes, curved or not, of different width and of different color. A path, or even a subpath, can be closed.
    ctx.fillStyle = 'rgba(200, 50, 100, 1.0)';
    ctx.beginPath(); // Creates a new path. Once created, future drawing commands are directed into the path and used to build the path up.
    ctx.moveTo(500, 50); // Moves the pen to the coordinates specified by x and y.
    ctx.lineTo(600, 75);
    ctx.lineTo(600, 25);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(120, 255, 0, 1.0)';
    ctx.arc(650, 200, 75, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();

    drawFace(ctx, 500, 300);
}