attribute vec3 aPosition;
attribute vec2 aTexcoord;
attribute vec3 aNormal;
attribute vec3 aTangent;
attribute vec3 aBitangent; 


uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

varying vec2 vTexcoord;
varying vec3 vfrag_coord;
varying mat3 vTBN;

void main() {

  // Calculate the TBN matrix
  vec3 T = normalize(vec3(M * vec4(aTangent,   0.0)));
  vec3 B = normalize(vec3(M * vec4(aBitangent, 0.0)));
  vec3 N = normalize(vec3(M * vec4(aNormal,    0.0)));
  vTBN = mat3(T, B, N);

  vec4 frag_coord = M*vec4(aPosition, 1.0);
  gl_Position = P*V*frag_coord;
  vTexcoord = aTexcoord;
  
  vfrag_coord = frag_coord.xyz;
}