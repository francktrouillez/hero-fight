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
varying vec2 vTexcoord_ripples;
varying vec3 vnormal;
varying vec3 vfrag_coord;

uniform sampler2D u_texture;
uniform sampler2D u_ripples;
uniform vec3 u_view_pos;

#define NB_LIGHTS 1
uniform PointLight u_point_ligths_list[NB_LIGHTS];
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

  vec3 normal = normalize(vnormal);
  vec3 view_dir = normalize(u_view_pos-vfrag_coord);

  vec4 texelColor_ripples = texture2D(u_ripples, vec2(vTexcoord_ripples.x, 1.0-vTexcoord_ripples.y));

  // Calculate the total offsets

  float coordTexX = vTexcoord.x + (texelColor_ripples.g/4.0) + (texelColor_ripples.r);
  float coordTexY = 1.0 - ( vTexcoord.y+ (texelColor_ripples.b/4.0) + (texelColor_ripples.r) );

  if(coordTexX > 1.0){coordTexX = 1.0;}
  if(coordTexY < 0.0){coordTexX = 0.0;}

  vec4 texelColor = texture2D(u_texture, vec2(coordTexX, coordTexY));

  for(int i=0; i<NB_LIGHTS; ++i){
    lights_vec += CalcPointLight(u_point_ligths_list[i], normal, vfrag_coord, view_dir, texelColor);
  }

  lights_vec.b += 0.15;

  // Add some effects for the ripples deplacement
  vec3 temp = 1.0*vec3(1.0,1.0,1.0);
  lights_vec.rgb += temp * texelColor_ripples.b;

  lights_vec.rgb += temp * texelColor_ripples.g;
 
  gl_FragColor = vec4(lights_vec,texelColor.a);
  //gl_FragColor = vec4(texelColor_ripples.r*127.0,0,0,0.7);


}