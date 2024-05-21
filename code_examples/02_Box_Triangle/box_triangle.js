"use strict";

import * as shaderUtils from '../common/shaderUtils.js';
const mat4 = glMatrix.mat4;

// ModelView Matrix: defines where the square is positioned in the 3D coordinate system relative to the camera
// Projection Matrix: required by the shader to convert the 3D space into the 2D space of the viewport. 
let projectionMatrix, modelViewMatrix;

let shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These are constant during a rendering cycle, such as lights position.
// Varyings: Used for passing data from the vertex shader to the fragment shader.
const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        out vec4 fragColor;

        void main(void) {
        // Return the pixel color: always output white
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`;

function main() 
{
    let canvas = document.getElementById("webglcanvas");
    
    let gl = initWebGL(canvas);
    initGL(gl, canvas);
    initViewport(gl, canvas);

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);

    let square = createSquare(gl);
    let triangle = createTriangle(gl);

    mat4.identity(modelViewMatrix);
    
    mat4.translate(modelViewMatrix, modelViewMatrix, [-1.0, 0.0, -3.333]);

    bindShaderAttributes(gl, shaderProgram);
    draw(gl, shaderProgram, square);
    
    mat4.identity(modelViewMatrix);
    
    mat4.translate(modelViewMatrix, modelViewMatrix, [1, 0.0, -3.333]);

    bindShaderAttributes(gl, shaderProgram);
    draw(gl, shaderProgram, triangle);
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("webgl2");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        throw new Error(msg);
    }

    return gl;        
}

// The viewport is the rectangular bounds of where to draw. 
// In this case, the viewport will take up the entire contents of the canvas' display area.
function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas)
{
    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clears the color buffer; the area in GPU memory used to render the bits on screen.
    // There are several buffers, including the color, and depth buffers.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create a model view matrix with object at 0, 0, -3.333
    modelViewMatrix = mat4.create();
    // translate(out, a, v) → {mat4}
    // out	mat4	the receiving matrix
    // a	mat4	the matrix to translate
    // v	vec3	vector to translate by
    mat4.identity(modelViewMatrix);

    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    // perspective(out, fovy, aspect, near, far) → {mat4}
    // out	    mat4	mat4 frustum matrix will be written into
    // fovy	    number	Vertical field of view in radians
    // aspect	number	Aspect ratio. typically viewport width/height
    // near	    number	Near bound of the frustum
    // far	    number	Far bound of the frustum
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
}

function bindShaderAttributes(gl, shaderProgram)
{
    // Obtain handles to each of the variables defined in the GLSL shader code so that they can be initialized
    // gl.getAttribLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the attribute variable whose location to get
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);
    
    // gl.getUniformLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the uniform variable whose location to get
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, obj) 
{
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    // draw the object
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

// Create the vertex data for a square to be drawn.
// WebGL drawing is done with primitives — different types of objects to draw. WebGL primitive types include triangles, points, and lines. 
// Triangles, the most commonly used primitive, are actually accessible in two different forms: as triangle sets (arrays of triangles) and triangle strips (described shortly). 
// Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.
function createSquare(gl) 
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let verts = [
        .5,  .5,  0.0,
        -.5, .5,  0.0,
        .5,  -.5,  0.0,
        -.5, -.5,  0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let square = {buffer:vertexBuffer, vertSize:3, nVerts:4, primtype:gl.TRIANGLE_STRIP};

    return square;
}

function createTriangle(gl)
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let verts = [
        0.0, 0.5, 0.0,
        .5, -.5,  0.0,
        -.5, -.5,  0.0
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    
    let triangle = {buffer:vertexBuffer, vertSize:3, nVerts:3, primtype:gl.TRIANGLES};
    return triangle;
}  

main();