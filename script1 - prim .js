var gl;

function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var shaderProgram;

var vertexData = [];
var sx = 0.8;
var sy = 0.8;
var sz = 0.8;
var p = 0.7;

function creatPos(sx, sy, sz, p)
{
    vertexData = [
        -sx/2, -sy/2, -sz/2, 0.6, 0.8, 0.3, p,
        -sx/2, sy/2, -sz/2, 0.6, 1.0, 0.3, p,
        sx/2, sy/2, -sz/2, 0.9, 0.2, 0.0, p, //하늘(뒤)

        -sx/2, -sy/2, -sz/2, 0.4, 1.0, 1.0, p,
        sx/2, -sy/2, -sz/2, 0.2, 0.5, 1.0, p,
        sx/2, sy/2, -sz/2, 0.3, 0.7, 1.0, p, //하늘(뒤)

        sx/2, -sy/2, -sz/2, 0.9, 0.4, 1.0, p,
        sx/2, sy/2, sz/2, 0.8, 1.0, 1.0, p,
        sx/2, -sy/2, sz/2, 0.8, 0.5, 1.0, p, //보라(오른)

        sx/2, -sy/2, -sz/2, 0.2, 0.4, 1.0, p,
        sx/2, sy/2, sz/2, 0.1, 0.1, 1.0, p,
        sx/2, sy/2, -sz/2, 0.2, 0.4, 1.0, p, //보라(오른)
                
        -sx/2, sy/2, -sz/2, 0.2, 1.0, 0.3, p,
        -sx/2, sy/2, sz/2, 0.8, 0.2, 0.3, p,
        sx/2, sy/2, sz/2, 0.4, 0.9, 0.3, p, //노란(위)

        -sx/2, sy/2, -sz/2, 1.0, 0.0, 0.3, p,
        sx/2, sy/2, -sz/2, 1.0, 0.3, 0.3, p,
        sx/2, sy/2, sz/2, 1.0, 0.0, 0.3, p, //노란(위)

        -sx/2, -sy/2, -sz/2, 0.6, 0.3, 0.2, p,
        -sx/2, sy/2, sz/2, 0.2, 1.0, 0.1, p,
        -sx/2, -sy/2, sz/2, 0.1, 0.5, 0.9, p, //흰색(왼)

        -sx/2, -sy/2, -sz/2, 0.9, 0.3, 0.2, p,
        -sx/2, sy/2, -sz/2, 0.1, 0.7, 0.6, p,
        -sx/2, sy/2, sz/2, 0.9, 0.3, 0.3, p, //흰색(왼)

        -sx/2, -sy/2, -sz/2, 0.4, 0.1, 1.0, p,
        -sx/2, -sy/2, sz/2, 0.1, 0.3, 0.7, p,
        sx/2, -sy/2, sz/2, 0.7, 0.9, 0.1, p, //연두(아래)

        -sx/2, -sy/2, -sz/2, 0.2, 1.0, 0.7, p,
        sx/2, -sy/2, -sz/2, 0.2, 0.9, 0.7, p,
        sx/2, -sy/2, sz/2, 0.1, 1.0, 0.7, p, //연두(아래)

        -sx/2, -sy/2, sz/2, 0.7, 0.5, 0.2, p,
        -sx/2, sy/2, sz/2, 1.0, 0.0, 1.0, p,
        sx/2, sy/2, sz/2, 0.9, 0.2, 0.7, p, //핑크(앞)

        -sx/2, -sy/2, sz/2, 1.0, 0.3, 1.0, p,
        sx/2, -sy/2, sz/2, 0.8, 0.9, 1.0, p,
        sx/2, sy/2, sz/2, 0.0, 0.5, 1.0, p, //핑크(앞)*/
    ];
    
    return vertexData;
}

//var elementData = [ 0,1,2,3,4,5]; 

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(creatPos(sx, sy, sz, p)), gl.STATIC_DRAW);

	//gl.elementBuffer = gl.createBuffer(); 
	//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.elementBuffer);
	//gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementData),gl.STATIC_DRAW);

    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
			varying highp vec4 color; \
			void main(void) \
			{ \
				gl_FragColor = color; \
			}';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = '\
			attribute highp vec4 myVertex; \
			attribute highp vec4 myColor; \
			uniform mediump mat4 transformationMatrix; \
			uniform mediump mat4 virwMatrix; \
			uniform mediump mat4 projMatrix; \
			varying highp vec4 color;\
			void main(void)  \
			{ \
				gl_Position = transformationMatrix * myVertex; \
				color = myColor; \
			}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);
    console.log("myVertex Location is: ", gl.getAttribLocation(gl.programObject, "myColor"));

    return testGLError("initialiseShaders");
}

flag_animation = 0; 
function toggleAnimation()
{
	flag_animation ^= 1; 
}

var rotY = 0.0; 


function renderScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var matrixLocation = gl.getUniformLocation(gl.programObject, "transformationMatrix");
    var transformationMatrix = [
        Math.cos(rotY),	0.0, -Math.sin(rotY),	0.0,
        0.0,			1.0,  0.0,				0.0, 
        Math.sin(rotY), 0.0, Math.cos(rotY),	0.0, // For pseudo perspective View
        0.0,			0.0, 0.0,				1.0
    ];

	if ( flag_animation ){
		rotY += 0.01;
	}

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, transformationMatrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);
	// gl.vertexAttrib4f(1, Math.random(), 0.0, 1.0, 1.0);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

	// gl.lineWidth(6.0);  // It is not working at Chrome!
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT,0);
    // gl.drawArrays(gl.POINTS, 0, 6);
    //gl.drawArrays(gl.LINE_STRIP, 0, 36);
	gl.drawArrays(gl.TRIANGLES, 0, 36); 
	console.log("Enum for Primitive Assumbly", gl.TRIANGLES, gl.TRIANGLE, gl.POINTS);  
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
