function dot_product(u, v) {
  return u.x * v.x + u.y * v.y + u.z * v.z
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function get_theta(u, v) {
  const product = dot_product(u, v);
  const norm_u = norm(u);
  const norm_v = norm(v);
  const cos_theta = product/(norm_u*norm_v);
  const theta = Math.acos(clamp(cos_theta, -1, 1));
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

function projected_point(point, normal, point_plane) {
  const t = (dot_product(normal, point_plane) - dot_product(normal, point))/dot_product(normal, normal)
  return {
    x: point.x + t * normal.x,
    y: point.y + t * normal.y,
    z: point.z + t * normal.z
  }
}

function matrix_vector_product(matrix, vector) {
  return {
    x: matrix[0] * vector.x + matrix[4] * vector.y + matrix[8] * vector.z + matrix[12] * 1,
    y: matrix[1] * vector.x + matrix[5] * vector.y + matrix[9] * vector.z + matrix[13] * 1,
    z: matrix[2] * vector.x + matrix[6] * vector.y + matrix[10] * vector.z + matrix[14] * 1,
  }
}