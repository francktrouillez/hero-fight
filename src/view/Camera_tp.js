var make_camera = function(info) {
    var position = glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z);
    var front = glMatrix.vec3.fromValues(info.center.x, info.center.y, info.center.z);
    var up = glMatrix.vec3.fromValues(info.up.x, info.up.y, info.up.z);
    var right = glMatrix.vec3.create();
    var world_up = up;

    // Euler angles
    var yaw = 90.0;
    var pitch = 0.0;
    var fov = info.fov;
    var aspect = info.aspect;
    var near = info.near;
    var far = info.far;

    update_camera_vectors();


    function get_view_matrix() {
        center = glMatrix.vec3.create();
        center = glMatrix.vec3.add(center, position, front);
        View = glMatrix.mat4.create();
        View = glMatrix.mat4.lookAt(View, position, center, up);
        return View;
    }

    function get_projection() {
        var projection = glMatrix.mat4.create();
        // You can try the zoom in radians instead of fov if you activate the zoom
        projection = glMatrix.mat4.perspective(projection, fov, aspect, near, far);
        return projection;
    }

    function deg2rad(deg) {
        var PI = Math.PI;
        var rad = deg * (PI / 180.0);
        return rad;
    }

    function update_camera_vectors() {
        yawr = deg2rad(yaw)
        pitchr = deg2rad(pitch)

        fx = Math.cos(yawr) * Math.cos(pitchr);
        fy = Math.sin(pitchr);
        fz = Math.sin(yawr) * Math.cos(pitchr);

        front = glMatrix.vec3.fromValues(fx, fy, fz);
        front = glMatrix.vec3.normalize(front, front);

        // recompute right, up
        right = glMatrix.vec3.cross(right, front, world_up);
        right = glMatrix.vec3.normalize(right, right);

        up = glMatrix.vec3.cross(up, right, front);
        up = glMatrix.vec3.normalize(up, up);
    }
    
    function get_position() {
        return position;
    }
    
    function show_view_html(tag, view) {
        show_mat(tag, 'View', view);
    }
      
    
    function show_projection_html(tag, projection) {
      show_mat(tag, 'Proj', projection);
    }
    
    // print a float with fixed decimals
    function fl(x) {
      return Number.parseFloat(x).toFixed(3);
    }
    
    function show_mat(tag, name, m) {
      // WARNING: rounded fixed floating points using fl(x)
      var txt = name + ':<br />'
      txt += fl(m[0]) + ' ' + fl(m[4]) + ' ' + fl(m[ 8]) + ' ' + fl(m[12]) + '<br />'
      txt += fl(m[1]) + ' ' + fl(m[5]) + ' ' + fl(m[ 9]) + ' ' + fl(m[13]) + '<br />'
      txt += fl(m[2]) + ' ' + fl(m[6]) + ' ' + fl(m[10]) + ' ' + fl(m[14]) + '<br />'
      txt += fl(m[3]) + ' ' + fl(m[7]) + ' ' + fl(m[11]) + ' ' + fl(m[15]) + '<br />'
      tag.innerHTML = txt;
    }

    return {
        get_view_matrix: get_view_matrix,
        get_projection: get_projection,
        get_position: get_position,
        show_projection_html: show_projection_html,
        show_view_html: show_view_html,
    }
}