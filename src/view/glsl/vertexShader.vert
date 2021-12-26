attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexcoord;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

varying vec4 vColor;
varying vec2 vTexcoord;

void main() {
  gl_Position = P*V*M*vec4(aPosition, 1);
  vTexcoord = aTexcoord;
}