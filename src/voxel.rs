use bevy::{
    prelude::*,
    reflect::TypeUuid,
    render::render_resource::{AsBindGroup, ShaderRef},
};

#[derive(AsBindGroup, TypeUuid, Debug, Clone)]
#[uuid = "3f4fab9d-ce8e-4515-a302-6abbfe3fae4e"]
pub struct VoxelMaterial {
    #[uniform(0)]
    camera_position: Vec3,
    volume: Vec<Vec<Vec<bool>>>,
    alpha_mode: AlphaMode,
}

impl Material for VoxelMaterial {
    fn fragment_shader() -> ShaderRef {
        "shader.wgsl".into()
    }

    fn alpha_mode(&self) -> AlphaMode {
        self.alpha_mode
    }
}

#[derive(Default, Resource)]
pub struct VoxelSettings {
    material_handle: Handle<VoxelMaterial>,
}

pub struct VoxelPlugin;
impl Plugin for VoxelPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugin(MaterialPlugin::<VoxelMaterial>::default())
            .init_resource::<VoxelSettings>()
            .add_startup_system(setup_target_volume)
            .add_system(update_material_uniforms);
    }
}

fn generate_voxel_sphere(resolution: usize, radius: usize) -> Vec<Vec<Vec<bool>>> {
    let center = (resolution - 1) / 2;
    let mut volume = vec![vec![vec![false; resolution]; resolution]; resolution];
    for (i, row) in volume.iter_mut().enumerate() {
        for (j, column) in row.iter_mut().enumerate() {
            for (k, value) in column.iter_mut().enumerate() {
                let index = Vec3::from_array([i as f32, j as f32, k as f32]);
                let offset = Vec3::from_array([center as f32; 3]);
                let position = index - offset;
                *value = position.length() < radius as f32;
            }
        }
    }
    return volume;
}

fn setup_target_volume(
    mut settings: ResMut<VoxelSettings>,
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<VoxelMaterial>>,
) {
    settings.material_handle = materials.add(VoxelMaterial {
        camera_position: Vec3::ZERO,
        volume: generate_voxel_sphere(11, 5),
        alpha_mode: AlphaMode::Blend,
    });

    commands.spawn(MaterialMeshBundle {
        mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
        transform: Transform::from_xyz(0.0, 0.0, -5.0),
        material: settings.material_handle.clone(),
        ..default()
    });
}

fn update_material_uniforms(
    settings: Res<VoxelSettings>,
    mut materials: ResMut<Assets<VoxelMaterial>>,
    camera_query: Query<&mut Transform, With<Camera3d>>,
) {
    materials
        .get_mut(&settings.material_handle)
        .unwrap()
        .camera_position = camera_query.single().translation;
}
