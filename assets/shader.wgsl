@group(1) @binding(0)
var<uniform> camera_position: vec3<f32>;

fn sphere_sdf(sample_position: vec3<f32>, origin: vec3<f32>, radius: f32) -> f32 {
    return length(sample_position - origin) - radius;
}

fn scene_sdf(sample_position: vec3<f32>) -> f32 {
    return sphere_sdf(sample_position, vec3(0.0, 0.0, -5.0), 0.5);
}

fn calculate_normal(sample_position: vec3<f32>, epsilon: f32) -> vec3<f32> {
    let delta_x = vec3(epsilon, 0.0, 0.0);
    let delta_y = vec3(0.0, epsilon, 0.0);
    let delta_z = vec3(0.0, 0.0, epsilon);
    return normalize(vec3(
        scene_sdf(sample_position + delta_x) - scene_sdf(sample_position - delta_x),
        scene_sdf(sample_position + delta_y) - scene_sdf(sample_position - delta_y),
        scene_sdf(sample_position + delta_z) - scene_sdf(sample_position - delta_z)
    ));
}

@fragment
fn fragment(
    #import bevy_pbr::mesh_vertex_output
) -> @location(0) vec4<f32> {
    let fov = 60.0;
    let max_steps = 100;
    let epsilon = 0.01;

    let ambient = 0.1;
    let k_d = 0.5;
    let k_s = 0.5;
    let specular_power = 32.0;
    let light_position = vec3(2.0, 2.0, 0.0);
    let object_colour = vec3(0.0, 0.5, 0.5);
    let light_colour = vec3(1.0);

    var apsect_ratio = 1.0;
    var xy = (uv * 2.0 - 1.0) * vec2(apsect_ratio, -1.0) * tan(0.5 * radians(fov));
    var direction = normalize(vec3(xy, -1.0));
    var origin = vec3(xy, 0.0);

    var direction = normalize(world_position.xyz - camera_position);

    var depth = 0.0;
    for (var i: i32 = 0; i < max_steps; i++) {
        var position = camera_position + direction * depth;
        var distance = scene_sdf(position);
        if distance < epsilon {
            var normal = calculate_normal(position, epsilon);
            var direction_to_light = normalize(light_position - position);
            var reflected = reflect(-direction_to_light, normal);

            var diffuse = max(dot(normal, direction_to_light), 0.0);
            var specular = pow(max(dot(-direction, reflected), 0.0), specular_power);
            var colour = (ambient + k_d * diffuse + k_s * specular) * light_colour * object_colour;
            return vec4(colour, 1.0);
        }
        depth += distance;
    }

    return vec4(vec3(0.0), 1.0);
}
