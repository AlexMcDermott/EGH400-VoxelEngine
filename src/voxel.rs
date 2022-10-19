use bevy::{
    prelude::*,
    reflect::TypeUuid,
    render::render_resource::{AsBindGroup, ShaderRef},
};

#[derive(AsBindGroup, TypeUuid, Debug, Clone)]
#[uuid = "3f4fab9d-ce8e-4515-a302-6abbfe3fae4e"]
pub struct VoxelTargetMaterial {
    #[uniform(0)]
    camera_position: Vec3,
    alpha_mode: AlphaMode,
}

impl Material for VoxelTargetMaterial {
    fn fragment_shader() -> ShaderRef {
        "shader.wgsl".into()
    }

    fn alpha_mode(&self) -> AlphaMode {
        self.alpha_mode
    }
}

#[derive(Default)]
pub struct VoxelSettings {
    material_handle: Handle<VoxelTargetMaterial>,
}

pub struct VoxelPlugin;
impl Plugin for VoxelPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugin(MaterialPlugin::<VoxelTargetMaterial>::default())
            .init_resource::<VoxelSettings>()
            .add_startup_system(setup_target_volume)
            .add_system(update_material_uniforms);
    }
}

fn setup_target_volume(
    mut settings: ResMut<VoxelSettings>,
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<VoxelTargetMaterial>>,
) {
    settings.material_handle = materials.add(VoxelTargetMaterial {
        camera_position: Vec3::ZERO,
        alpha_mode: AlphaMode::Blend,
    });

    commands.spawn().insert_bundle(MaterialMeshBundle {
        mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
        transform: Transform::from_xyz(0.0, 0.0, -5.0),
        material: settings.material_handle.clone(),
        ..default()
    });
}

fn update_material_uniforms(
    settings: Res<VoxelSettings>,
    mut materials: ResMut<Assets<VoxelTargetMaterial>>,
    camera_query: Query<&mut Transform, With<Camera3d>>,
) {
    materials
        .get_mut(&settings.material_handle)
        .unwrap()
        .camera_position = camera_query.single().translation;
}
