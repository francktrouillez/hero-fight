attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexcoord;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform vec2 u_aspect_ratio;

varying vec2 vTexcoord;

varying vec3 vNormal;

void main() {
  vec4 temp_position = P*V*M*vec4(aPosition, 1);
  gl_Position = vec4(u_aspect_ratio.x*temp_position.x, u_aspect_ratio.y*temp_position.y, temp_position.z, temp_position.w);
  vTexcoord = aTexcoord;
  vNormal = aNormal;
}