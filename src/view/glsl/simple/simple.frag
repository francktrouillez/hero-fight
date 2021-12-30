precision mediump float;
  
varying vec2 vTexcoord;
varying vec3 vNormal;

uniform sampler2D u_texture;

void main() {
  gl_FragColor = texture2D(u_texture, vec2(vTexcoord.x, 1.0-vTexcoord.y));
}