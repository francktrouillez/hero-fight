attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexcoord;
attribute vec2 aTexcoord_ripples;

uniform mat4 M;
uniform mat4 itM; //used to transform the normal of the vertex correclty
uniform mat4 V;
uniform mat4 P;

varying vec2 vTexcoord;
varying vec2 vTexcoord_ripples;
varying vec3 vnormal;
varying vec3 vfrag_coord;

void main() {
  vnormal = vec3(itM * vec4(aNormal, 1.0));

  vec4 frag_coord = M*vec4(aPosition, 1.0);
  gl_Position = P*V*frag_coord;
  vTexcoord = aTexcoord;
  vTexcoord_ripples = aTexcoord_ripples;
  
  vfrag_coord = frag_coord.xyz;
  
}