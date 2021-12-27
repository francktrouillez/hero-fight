attribute vec3 aPosition;
attribute vec2 aTexcoord;

// Difference between a normal light shader is that the normal is not passed to the vertex and then the frag, it is direclty
// infer in the fragment shader from a texture contaning the normals of the object

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

varying vec2 vTexcoord;
varying vec3 vfrag_coord;

void main() {
  vec4 frag_coord = M*vec4(aPosition, 1.0);
  gl_Position = P*V*frag_coord;
  vTexcoord = aTexcoord;
  
  vfrag_coord = frag_coord.xyz;
}