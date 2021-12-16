attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexcoord;

uniform mat4 M;
uniform mat4 itM; //used to transform the normal of the vertex correclty
uniform mat4 V;
uniform mat4 P;
uniform vec2 u_aspect_ratio;
uniform vec3 u_light_pos;

varying vec4 vColor;
varying vec2 vTexcoord;
varying vec3 vdiffuse;

void main() {
  vec3 normal = vec3(itM * vec4(aNormal, 1.0));

  vec4 frag_coord = M*vec4(aPosition, 1.0);
  vec4 temp_position = P*V*frag_coord;
  gl_Position = vec4(u_aspect_ratio.x*temp_position.x, u_aspect_ratio.y*temp_position.y, temp_position.z, temp_position.w);
  vTexcoord = aTexcoord;
        
  // Diffuse light calculated and pass to the fragment shader
  vec3 L = normalize(u_light_pos - frag_coord.xyz);
  float diffusion = max(0.0, dot(normal, L));
  vdiffuse = vec3(diffusion);
}