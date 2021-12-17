precision mediump float;
  
varying vec2 vTexcoord;
varying vec3 vnormal;
varying vec3 vfrag_coord;

uniform sampler2D u_texture;
uniform vec3 u_light_pos;

void main() {

  // Phong with interpolated normals
  vec3 L = normalize(u_light_pos - vfrag_coord);
  vec3 normal = normalize(vnormal);
  float diffusion = max(0.0, dot(normal, L));

  //Ambient coeff
  float ambient = 0.1;


  vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  gl_FragColor = vec4(texelColor.rgb*(diffusion+diffusion), texelColor.a);
        
}