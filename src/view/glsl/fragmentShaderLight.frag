precision mediump float;

struct PointLight {    
    vec3 position;
    
    // Paramters linked to the attenuation
    float constant;
    float linear;
    float quadratic;  

    //Parameters for the intensity of each part of the light
    float ambient, diffuse, specular;
}; 

varying vec2 vTexcoord;
varying vec3 vnormal;
varying vec3 vfrag_coord;

uniform sampler2D u_texture;
uniform vec3 u_view_pos;
uniform PointLight u_sun;

float CalcPointLight(PointLight light, vec3 normal, vec3 fragCoord, vec3 viewDir, float shininess)
{
    vec3 lightDir = normalize(light.position - fragCoord);
    // diffuse light
    float diff = max(dot(normal, lightDir), 0.0);
    // specular light
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    // attenuation
    float distance    = length(light.position - fragCoord);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    float ambient  = light.ambient ;
    float diffuse  = light.diffuse  * diff;
    float specular = light.specular * spec;

    return (ambient + diffuse + specular)*attenuation;
} 


void main() {
  vec3 normal = normalize(vnormal);
  vec3 view_dir = normalize(u_view_pos-vfrag_coord);
  float light_coeff = CalcPointLight(u_sun, normal, vfrag_coord, view_dir, 32.0);

  vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  gl_FragColor = vec4(texelColor.rgb*light_coeff, texelColor.a);
      
}