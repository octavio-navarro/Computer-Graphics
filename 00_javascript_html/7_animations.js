let ctx = null, canvas = null;

class ball
{
    constructor(xPos, yPos, radius, color)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;

        this.up = false;
        this.right = true;

        this.speed = 1;
    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(xMin, xMax, yMin, yMax)
    {
        if(this.xPos < (xMin + this.radius)) this.right = true;
        if(this.xPos > (xMax - this.radius)) this.right = false;

        if(this.yPos > (yMax - this.radius)) this.up = true;
        if(this.yPos < (yMin + this.radius)) this.up = false;

        if(this.right)
            this.xPos += this.speed;
        else
            this.xPos -= this.speed;

        if(this.up)
            this.yPos -= this.speed;
        else    
            this.yPos += this.speed;
    }
}

function update(spheres)
{
    requestAnimationFrame(()=>update(spheres));

    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    spheres.forEach(sphere =>{
        sphere.draw();
        sphere.update(0, canvas.width, 0, canvas.height);
    });
}

function main()
{
    canvas = document.getElementById("animationCanvas");
    ctx = canvas.getContext("2d");

    let sphere1 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');
    let sphere2 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');
    let sphere3 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');

    update([sphere1, sphere2, sphere3]);
}