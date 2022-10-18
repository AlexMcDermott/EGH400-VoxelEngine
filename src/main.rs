use bevy::{
    prelude::*,
    reflect::TypeUuid,
    render::render_resource::{AsBindGroup, ShaderRef},
};
use bevy_flycam::{FlyCam, NoCameraPlayerPlugin};

#[derive(AsBindGroup, TypeUuid, Debug, Clone)]
#[uuid = "f690fdae-d598-45ab-8225-97e2a3f056e0"]
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

pub struct VoxelPlugin;
impl Plugin for VoxelPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugin(MaterialPlugin::<VoxelTargetMaterial>::default())
            .add_startup_system(setup_target_mesh)
            .add_system(update_material_uniforms);
    }
}

fn setup_target_mesh(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<VoxelTargetMaterial>>,
) {
    commands.spawn().insert_bundle(MaterialMeshBundle {
        mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
        transform: Transform::from_xyz(0.0, 0.0, -5.0),
        material: materials.add(VoxelTargetMaterial {
            camera_position: Vec3::new(0.0, 0.0, 0.0),
            alpha_mode: AlphaMode::Blend,
        }),
        ..default()
    });
}

fn update_material_uniforms(
    mut materials: ResMut<Assets<VoxelTargetMaterial>>,
    camera_query: Query<&mut Transform, With<FlyCam>>,
) {
    let transform = camera_query.single();
    for material in materials.iter_mut() {
        material.1.camera_position = transform.translation;
    }
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugin(NoCameraPlayerPlugin)
        .add_plugin(VoxelPlugin)
        .add_startup_system(setup)
        .run();
}

fn setup(mut commands: Commands) {
    commands
        .spawn_bundle(Camera3dBundle {
            transform: Transform::from_xyz(0.0, 0.0, 0.0)
                .looking_at(Vec3::new(0.0, 0.0, -1.0), Vec3::Y),
            ..default()
        })
        .insert(FlyCam);
}
