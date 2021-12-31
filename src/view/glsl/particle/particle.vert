attribute vec3 aPosition;

uniform mat4 V;
uniform mat4 P;
uniform vec3 u_offset;
uniform vec4 u_color;
uniform float u_scale;

varying vec4 vParticleColor;

void main() {
    vParticleColor = u_color;
    gl_Position = P*V*vec4((aPosition * u_scale) + u_offset, 1.0);
}