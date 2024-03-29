class ForestRender extends ContainerRender {

  constructor(gl, program, camera, lights_list) {
    super(gl,program, camera, lights_list)

    this.build_new_tree(1, {x: -8.0, y: 0.0, z: -16.0, rotation: Math.PI/8})
    this.build_new_tree(1, {x: 14.0, y: 0.0, z: -7.5, rotation: -Math.PI/8})
    this.build_new_tree(1, {x: 4.0, y: 0.0, z: 15.5, rotation: Math.PI/2})
    this.build_new_tree(1, {x: -14.0, y: 0.0, z: -5.5, rotation: Math.PI/4})

    this.build_new_tree(2, {x: -14.0, y: 0.0, z: 8.0, rotation: Math.PI/8})
    this.build_new_tree(2, {x: -5.0, y: 0.0, z: 14.5, rotation: -Math.PI/8})
    this.build_new_tree(2, {x: 7.0, y: 0.0, z: -12.5, rotation: Math.PI/2})
    this.build_new_tree(2, {x: 14.5, y: 0.0, z: 7.5, rotation: -3*Math.PI/8})



  }

  build_new_tree(category, space_info) {
    var tree = new TreeRender(this.gl, this.program, this.camera, this.lights_list, category);
    tree.object.setXYZ(space_info.x, space_info.y, space_info.z);
    tree.object.setAngle(space_info.rotation, 0.0, 1.0, 0.0);
    
    this.elements.push(tree)
  }
}