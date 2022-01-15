precision mediump float;

struct PointLight {    
    vec3 position;
    
    // Paramters linked to the attenuation
    float constant;
    float linear;
    float quadratic;  

    //Parameters for the intensity/color of each part of the light
    float ambient;
    float diffuse;
    float specular;

    vec3 color;
}; 

// Used to influence how the object react to the different component of the ligth
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
  

varying vec2 vTexcoord;
varying vec3 vfrag_coord;
varying mat3 vTBN;
varying vec4 vProjectedTexcoord;

uniform sampler2D u_texture;
uniform sampler2D u_normalMap;
uniform sampler2D u_projected_texture;
uniform vec3 u_view_pos;

#define NB_POINT_LIGHTS 1
uniform PointLight u_point_ligths_list[NB_POINT_LIGHTS];
uniform Material u_material;

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragCoord, vec3 viewDir, vec4 texelColor)
{
    vec3 lightDir = normalize(light.position - fragCoord);
    // diffuse light
    float diff = max(dot(normal, lightDir), 0.0);
    // specular light
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    // attenuation
    float distance = length(light.position - fragCoord);
    float attenuation = 1.0;
    if( (light.constant != 0.0) || (light.linear != 0.0) || (light.quadratic != 0.0) ){
      attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
    }

    // combine results
    vec3 ambient  = light.ambient * u_material.ambient * light.color;
    vec3 diffuse  = light.diffuse  * diff * u_material.diffuse * light.color ;
    vec3 specular = light.specular * spec  * u_material.specular * light.color;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return vec3( (ambient + diffuse + specular )*texelColor.rgb);
} 


void main() {

  vec3 lights_vec;

  // We need to calculate the normal from the texture in range [0,1]
  vec3 normal = texture2D(u_normalMap, vec2(vTexcoord.x, 1.0-vTexcoord.y)).rgb;
  // transform normal vector to range [-1,1]
  normal = normal * 2.0 - 1.0; 
  // Form the matrix TBN to correct the normals 
  normal = normalize(vTBN * normal);
  
  vec3 view_dir = normalize(u_view_pos-vfrag_coord);

  vec3 projectedTexcoord = vProjectedTexcoord.xyz/vProjectedTexcoord.w;
  projectedTexcoord = projectedTexcoord * 0.5 + 0.5;
  float depth = projectedTexcoord.z;
  float projected_depth = texture2D(u_projected_texture, projectedTexcoord.xy).r; // Only need the r channel for a depth texture
  float shadow_light = 0.0;
  if (projected_depth >= depth - 0.00001) { // avoid shadow acne : bias
    shadow_light = 1.0;
  }

  vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  for(int i=0; i<NB_POINT_LIGHTS; ++i){
    lights_vec += CalcPointLight(u_point_ligths_list[i], normal, vfrag_coord, view_dir, texelColor);
  }
  gl_FragColor = vec4(lights_vec * shadow_light, texelColor.a);
}