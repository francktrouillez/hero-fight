precision mediump float;
  
varying vec2 vTexcoord;
varying vec3 vdiffuse;

uniform sampler2D u_texture;

void main() {
  vec4 texelColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
  gl_FragColor = vec4(texelColor.rgb * vdiffuse, texelColor.a);
}