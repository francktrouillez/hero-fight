precision mediump float;
  
varying vec3 vTexcoord;

// Not a simple texture anymore but a samplercube
uniform samplerCube u_cubemap;

void main() {
  gl_FragColor = textureCube(u_cubemap, vTexcoord);
}