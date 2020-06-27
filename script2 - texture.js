var gl;

function testGLError(functionLastCalled) {
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

    var sx = 1.0;
    var sy = 1.0;
    var sz = 1.0
    var p = 1.0;
function createPos(sx, sy, sz, p)
   { var vertexData = [
		
        -sx/2, -sy/2, -sz/2, 0.4, 1.0, 1.0, p,  0.0,  0.0,  
        sx/2,  sy/2, -sz/2, 0.2, 0.5, 1.0, p,  1.0,  1.0, 
         sx/2, -sy/2, -sz/2, 0.3, 0.7, 1.0, p,  1.0, -0.0,
        -sx/2, -sy/2, -sz/2, 0.6, 0.8, 0.3, p, -0.0, -0.0, 
        -sx/2,  sy/2, -sz/2, 0.9, 0.2, 0.0, p, -0.0,  1.0, 
         sx/2,  sy/2, -sz/2, 0.6, 1.0, 0.3, p,  1.0,  1.0,  //하늘(뒤)
      
        -sx/2, -sy/2,  sz/2, 0.7, 0.5, 0.2, p, -0.0, -0.0, 
         sx/2,  sy/2,  sz/2, 1.0, 0.0, 1.0, p, 1.0,  1.0, 
         sx/2, -sy/2,  sz/2, 0.9, 0.2, 0.7, p, 1.0, -0.0, 
        -sx/2, -sy/2,  sz/2, 1.0, 0.3, 1.0, p, -0.0, -0.0, 
        -sx/2,  sy/2,  sz/2, 0.8, 0.9, 1.0, p, -0.0,  1.0, 
         sx/2,  sy/2,  sz/2, 0.0, 0.5, 1.0, p, 1.0,  1.0,  //핑크(앞)  
   
        -sx/2, -sy/2, -sz/2, 0.6, 0.3, 0.2, p, -0.0, -0.0, 
        -sx/2,  sy/2,  sz/2, 0.2, 1.0, 0.1, p, 1.0,  1.0, 
        -sx/2,  sy/2, -sz/2, 0.1, 0.5, 0.9, p, 1.0,  0.0, 
        -sx/2, -sy/2, -sz/2, 0.1, 0.7, 0.6, p, -0.0, -0.0, 
        -sx/2, -sy/2,  sz/2, 0.9, 0.3, 0.3, p, -0.0,  1.0, 
        -sx/2,  sy/2,  sz/2, 0.9, 0.3, 0.2, p, 1.0,  1.0,  //흰색(왼)
		   
         sx/2, -sy/2, -sz/2, 0.9, 0.4, 1.0, p, -0.0, -0.0, 
         sx/2,  sy/2,  sz/2, 0.8, 1.0, 1.0, p, 1.0,  1.0, 
         sx/2,  sy/2, -sz/2, 0.8, 0.5, 1.0, p, 1.0,  0.0, 
         sx/2, -sy/2, -sz/2, 0.2, 0.5, 1.0, p, -0.0, -0.0, 
         sx/2, -sy/2,  sz/2, 0.2, 0.4, 1.0, p, -0.0,  1.0, 
         sx/2,  sy/2,  sz/2, 0.1, 0.1, 1.0, p, 1.0,  1.0,  //보라(오른)
		 
        -sx/2, -sy/2, -sz/2, 0.1, 0.1, 1.0, p, -0.0, -0.0, 
         sx/2, -sy/2,  sz/2, 1.0, 0.0, 0.3, p, 1.0,  1.0, 
         sx/2, -sy/2, -sz/2, 1.0, 0.3, 0.3, p, 1.0,  0.0, 
        -sx/2, -sy/2, -sz/2, 0.2, 1.0, 0.3, p, -0.0, -0.0, 
        -sx/2, -sy/2,  sz/2, 0.8, 0.2, 0.3, p, -0.0,  1.0, 
         sx/2, -sy/2,  sz/2, 0.4, 0.9, 0.3, p, 1.0,  1.0, //노랑(위) 
		   
        -sx/2,  sy/2, -sz/2, 0.4, 0.1, 1.0, p, -0.0, -0.0, 
         sx/2,  sy/2,  sz/2, 0.1, 0.3, 0.7, p, 1.0,  1.0, 
         sx/2,  sy/2, -sz/2, 0.7, 0.9, 0.1, p, 1.0,  0.0, 
        -sx/2,  sy/2, -sz/2, 0.2, 1.0, 0.7, p, -0.0, -0.0, 
        -sx/2,  sy/2,  sz/2, 0.2, 0.9, 0.7, p, -0.0,  1.0, 
         sx/2,  sy/2,  sz/2, 0.1, 1.0, 0.7, p, 1.0,  1.0 //연두(아래)
];
return vertexData;
   }

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(createPos(sx,sy,sz,p)), gl.STATIC_DRAW);

	var texture = gl.createTexture(); 
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 red pixel.
	const texData = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData); 
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST); // It is default
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	// Asynchronously load an image
	
	var image = new Image();
	image.src = "mapp.png";
	image.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		});
	
    return testGLError("initialiseBuffers and texture initialize");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
			varying highp vec4 color; \
			varying mediump vec2 texCoord;\
			uniform sampler2D sampler2d;\
			void main(void) \
			{ \
				gl_FragColor = 0.0 * color + 1.0 * texture2D(sampler2d, texCoord); \
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
			attribute highp vec2 myUV; \
			uniform mediump mat4 mMat; \
			uniform mediump mat4 vMat; \
			uniform mediump mat4 pMat; \
			varying  highp vec4 color;\
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
				gl_Position = pMat * vMat * mMat * myVertex; \
				gl_PointSize = 8.0; \
				color = myColor; \
				texCoord = myUV; \
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
    gl.bindAttribLocation(gl.programObject, 2, "myUV");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);
    // console.log("myVertex Location is: ", gl.getAttribLocation(gl.programObject, "myColor"));

    return testGLError("initialiseShaders");
}

flag_animation = 0; 
function toggleAnimation()
{
	flag_animation ^= 1; 
}

rotY = 0.0;

function renderScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);										// Added for depth Test 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// Added for depth Test 
	gl.enable(gl.DEPTH_TEST);								// Added for depth Test 

    var mMatLocation = gl.getUniformLocation(gl.programObject, "mMat");
    var vMatLocation = gl.getUniformLocation(gl.programObject, "vMat");
    var pMatLocation = gl.getUniformLocation(gl.programObject, "pMat");
    var mMat = []; 
	mat4.translate(mMat, mMat, [0.5, 0.0, 0.0]); 
	mat4.fromYRotation(mMat, rotY); 
	if ( flag_animation ){
		rotY += 0.01;
	}
	var vMat = [];
	mat4.lookAt(vMat, [0.0, 0.0, 2.0], [0.0,0.0,0.0], [0.0, 1.0, 0.0]);
	var pMat = [];
	mat4.identity(pMat); 
	mat4.perspective(pMat, 3.14/2.0, 800.0/600.0, 0.5, 5);

    gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat );
    gl.uniformMatrix4fv(vMatLocation, gl.FALSE, vMat );
    gl.uniformMatrix4fv(pMatLocation, gl.FALSE, pMat );

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }
	//vertexData[0] += 0.01; 

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);
	//gl.vertexAttrib4f(1, 1.0, 0.0, 1.0, 1.0);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

	gl.drawArrays(gl.TRIANGLES, 0, 36); 
	// gl.drawArrays(gl.LINE_STRIP, 0, 36); 
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

	// renderScene();
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