/* Variávei globais */

let canvas,
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    vertexShader,
    fragmentShader,
    shaderProgram,
    firstObject,
    background,
    positionAttr,
    positionBuffer,
    width,
    height,
    aspectUniform,
    aspect,
    translationUniform,
    translation = [0, 0];

function resize(){
    if(!gl) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    gl.viewport(0, 0, width, height);
    aspect = width / height;
    aspectUniform = gl.getUniformLocation(shaderProgram, "aspect");
    gl.uniform1f(aspectUniform, aspect);
}


function getCanvas(){
    return document.querySelector("canvas");
}

function getGLContext(canvas) {
    let gl = canvas.getContext("webgl");
    return gl;
}

function compileShader(source, type, gl){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error("ERRO NA COMPILAÇÃO", gl.getShaderInfoLog(shader));
    return shader;
}

function linkProgram(vertexShader, fragmentShader, gl){
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error("ERRO NA LINKAGEM");
    return program;
}

function getFirstObject() {
    let points = [
            0.5, 0.5,
            0.5, -0.5,
            -0.5, -0.5,
            
            -0.5, -0.5,
            -0.5, 0.5,
            0.5, 0.5
        ];
    return { "points" : new Float32Array(points) };
}

function getBackground() {
    let points = [
            0.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
            
            -1.0, -1.0,
            -1.0, 1.0,
            0.0, 1.0
        ];
    return { "points" : new Float32Array(points) };
}

async function main() {
// 1 - Carregar tela de desenho
    canvas = getCanvas();

// 2 - Carregar o contexto (API) WebGL
    gl = getGLContext(canvas);

// 3 - Ler os arquivos de shader
    vertexShaderSource = await fetch("vertex.glsl").then(r => r.text());
    console.log("VERTEX", vertexShaderSource);

    fragmentShaderSource = await fetch("fragment.glsl").then(r => r.text());
    console.log("FRAGMENT", fragmentShaderSource);

// 4 - Compilar arquivos de shader
    vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
    fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);

// 5 - Linkar o programa de shader
    shaderProgram = linkProgram(vertexShader, fragmentShader, gl);
    gl.useProgram(shaderProgram);

    shaderProgram.positionAttr = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.positionAttr);

    shaderProgram.backgroundUni = gl.getUniformLocation(shaderProgram, "vIsBackground");
    gl.enableVertexAttribArray(shaderProgram.backgroundUni);

// 6 - Criar dados de parâmetro
    firstObject = getFirstObject();
    firstObject.isBackground = false;
    background = getBackground();
    background.isBackground = true;

// 7 - Transferir os dados para GPU

    sendingGPUData(shaderProgram, firstObject, 0.0,0.0,1.0,1.0);
    

// 7.1 - ASPECT UNIFORM
    resize();
    window.addEventListener("resize", resize);

// 8 - Chamar o loop de redesenho
    render();
    
}

function sendingGPUData(program, object, r, g, b, a){
    translationUniform = gl.getUniformLocation(program, 'translation');
    var fColorLocation = gl.getUniformLocation(program, "fColor");
    gl.uniform4f(fColorLocation, r, g, b, a);
    gl.uniform1i(shaderProgram.backgroundUni, object.isBackground);
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, object.points, gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.positionAttr, 2, gl.FLOAT, false, 0, 0);
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.POINTS
    // gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP
    // gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN 
    window.addEventListener('keyup', (event) => {
        if (event.keyCode == '39') {
            translation[0] = translation[0] + (1/10000);
        }
        if (event.keyCode == '38') {
            translation[1] = translation[1] +(1/10000)
        }
        if (event.keyCode == '37') {
            translation[0] = translation[0] -(1/10000)
        }
        if (event.keyCode == '40') {
            translation[1] = translation[1] -(1/10000)
        }
        gl.uniform2fv(translationUniform, translation);
    });
    sendingGPUData(shaderProgram, background, 0.0,1.0,0.0,1.0);
    gl.drawArrays(gl.TRIANGLES, 0, background.points.length / 2);
    sendingGPUData(shaderProgram, firstObject, 0.0,0.0,1.0,1.0);
    gl.drawArrays(gl.TRIANGLES, 0, firstObject.points.length / 2);
    window.requestAnimationFrame(render);
}

// keypress, keydown, keyup
window.addEventListener("load", main);