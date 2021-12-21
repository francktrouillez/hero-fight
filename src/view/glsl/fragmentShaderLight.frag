precision mediump float;

struct PointLight {    
    vec3 position;
    
    // Paramters linked to the attenuation
    float constant;
    float linear;
    float quadratic;  

    //Parameters for the intensity/color of each part of the light
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
}; 

varying vec2 vTexcoord;
varying vec3 vnormal;
varying vec3 vfrag_coord;

uniform sampler2D u_texture;
uniform vec3 u_view_pos;

#define NB_POINT_LIGHTS 4
uniform PointLight u_point_ligths_list[NB_POINT_LIGHTS];

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragCoord, vec3 viewDir, float shininess, vec4 texelColor)
{
    vec3 lightDir = normalize(light.position - fragCoord);
    // diffuse light
    float diff = max(dot(normal, lightDir), 0.0);
    // specular light
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    // attenuation
    float distance   = length(light.position - fragCoord);
    float attenuation = 1.0;
    if( (light.constant != 0.0) || (light.linear != 0.0) || (light.quadratic != 0.0) ){
      attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
    }

    // combine results
    vec3 ambient  = vec3( light.ambient ); //texelColor.rgb);
    vec3 diffuse  = vec3( light.diffuse  * diff); //* texelColor.rgb) ;
    vec3 specular = vec3( light.specular * spec ); //* texelColor.rgb) ;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return (ambient + diffuse + specular);
} 


void main() {

  vec3 lights_vec;

  vec3 normal = normalize(vnormal);
  vec3 view_dir = normalize(u_view_pos-vfrag_coord);

  vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  for(int i=0; i<NB_POINT_LIGHTS; ++i){
    lights_vec += CalcPointLight(u_point_ligths_list[i], normal, vfrag_coord, view_dir, 32.0, texelColor);
  }

  //vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  //gl_FragColor = vec4(texelColor.rgb+lights_vec, texelColor.a);

  
  gl_FragColor = vec4(lights_vec,texelColor.a);
      
}