precision highp float;

attribute vec2 vPosition;

varying vec2 vertexPos;

uniform bool vIsBackground;

uniform float aspect;

uniform vec2 translation;

void main() {
    if (vIsBackground){
        vertexPos = vPosition;
    } else {
        vertexPos = vPosition + translation;
    }
    gl_Position = vec4((vertexPos.x)/ aspect, vertexPos.y, 0.0, 1.0);
}