function dot_product(u, v) {
  return u.x * v.x + u.y * v.y + u.z * v.z
}

function get_theta(u, v) {
  const product = dot_product(u, v);
  const norm_u = norm(u);
  const norm_v = norm(v);
  const cos_theta = product/(norm_u*norm_v);
  const theta = Math.acos(cos_theta);
  return Math.abs(theta);
}

function norm(u) {
  return Math.pow(u.x*u.x + u.y*u.y + u.z*u.z, 0.5);
}

function cross_product(u, v) {
  return {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x
  }
}

function get_perpendicular_vector(u, v) {
  const vector = cross_product(u, v);
  const norm_vector = norm(vector);
  return {
    x: vector.x/norm_vector,
    y: vector.y/norm_vector,
    z: vector.z/norm_vector
  }
}

function normalize(u) {
  const norm_vector = norm(u);
  return {
    x: u.x/norm_vector,
    y: u.y/norm_vector,
    z: u.z/norm_vector
  }
}