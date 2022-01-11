attribute vec3 aPosition;

uniform mat4 V;
uniform mat4 P;
uniform vec3 u_offset;
uniform float u_scale;


void main() {
    gl_Position = P*V*vec4((aPosition * u_scale) + u_offset, 1.0);
}