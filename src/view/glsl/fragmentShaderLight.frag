precision mediump float;
  
varying vec2 vTexcoord;
varying vec3 vnormal;
varying vec3 vfrag_coord;

uniform sampler2D u_texture;
uniform vec3 u_light_pos;
uniform vec3 u_view_dir;

void main() {

  //Calculate the distance between the point and the light pos and the attenuation factor
  float dist = max(distance(u_light_pos,vfrag_coord),0.01);
  float attenuation = 1.0/(0.5*dist); // quadratic coeff is define the x*dist

  // Phong with interpolated normals
  vec3 L = normalize(u_light_pos - vfrag_coord);
  vec3 normal = normalize(vnormal);
  float diffusion = max(0.0, dot(normal, L));

  //Ambient coeff
  float ambient = 0.3;

  // specular
  float spec_strength = 0.8;
  vec3 view_dir = normalize(u_view_dir - vfrag_coord);
  vec3 reflect_dir = reflect(-L, normal);
  float spec = pow(max(dot(view_dir, reflect_dir), 0.0), 32.0);
  float specular = spec_strength * spec;

  vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  gl_FragColor = vec4(texelColor.rgb*((diffusion+specular)*attenuation +ambient), texelColor.a);
      
}