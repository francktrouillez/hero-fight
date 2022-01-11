attribute vec3 aPosition;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

void main() {
  gl_Position = P*V*M*vec4(aPosition, 1);
}