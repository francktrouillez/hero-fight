attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexcoord;

uniform mat4 M;
uniform mat4 itM; //used to transform the normal of the vertex correclty
uniform mat4 V;
uniform mat4 P;
uniform vec2 u_aspect_ratio;


varying vec4 vColor;
varying vec2 vTexcoord;
varying vec3 vnormal;
varying vec3 vfrag_coord;

void main() {
  vnormal = vec3(itM * vec4(aNormal, 1.0));

  vec4 frag_coord = M*vec4(aPosition, 1.0);
  vec4 temp_position = P*V*frag_coord;
  gl_Position = vec4(u_aspect_ratio.x*temp_position.x, u_aspect_ratio.y*temp_position.y, temp_position.z, temp_position.w);
  vTexcoord = aTexcoord;
  
  vfrag_coord = frag_coord.xyz;
}