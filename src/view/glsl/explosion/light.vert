attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexcoord;

uniform mat4 M;
uniform mat4 itM; //used to transform the normal of the vertex correclty
uniform mat4 V;
uniform mat4 P;

uniform float u_t;
uniform vec3 u_a;
uniform float u_v0;

varying vec2 vTexcoord;
varying vec3 vnormal;
varying vec3 vfrag_coord;
varying float t;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float rand_around_0(vec2 co, float d) {
  return 2.0 * d * (rand(co) - 0.5);
}

void main() {
  vnormal = vec3(itM * vec4(aNormal, 1.0));
  // MRUA
  vec3 randomized_normal = vec3(aNormal.x + rand_around_0(aNormal.yz, 0.2), aNormal.y + rand_around_0(aNormal.xz, 0.2), aNormal.z + rand_around_0(aNormal.xy, 0.2));
  vec3 updated_position = aPosition + randomized_normal * u_v0 * u_t + u_a * u_t * u_t / 2.0;

  vec4 frag_coord = M*vec4(updated_position, 1.0);
  gl_Position = P*V*frag_coord;
  vTexcoord = aTexcoord;
  
  vfrag_coord = frag_coord.xyz;
  t = u_t;
}