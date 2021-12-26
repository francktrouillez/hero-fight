attribute vec3 aPosition;
attribute vec2 aTexcoord;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

varying vec3 vTexcoord;


void main() {
  mat3 Vrotation = mat3(V);
  vec4 frag_coord = vec4(aPosition, 1.0);
  gl_Position = (P*mat4(Vrotation)*frag_coord).xyww; // Careful with the depth 
  vTexcoord = frag_coord.xyz;
}