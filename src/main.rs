use bevy::{
    prelude::*,
    reflect::TypeUuid,
    render::render_resource::{AsBindGroup, ShaderRef},
};
use bevy_flycam::{FlyCam, NoCameraPlayerPlugin};

#[derive(AsBindGroup, TypeUuid, Debug, Clone)]
#[uuid = "f690fdae-d598-45ab-8225-97e2a3f056e0"]
pub struct CustomMaterial {
    #[uniform(0)]
    camera_position: Vec3,
    alpha_mode: AlphaMode,
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugin(NoCameraPlayerPlugin)
        .add_plugin(MaterialPlugin::<CustomMaterial>::default())
        .add_startup_system(setup)
        .add_system(update_material_uniforms)
        .run();
}

fn update_material_uniforms(
    mut materials: ResMut<Assets<CustomMaterial>>,
    query: Query<&mut Transform, With<FlyCam>>,
) {
    let transform = query.single();
    for material in materials.iter_mut() {
        material.1.camera_position = transform.translation;
    }
}

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<CustomMaterial>>,
) {
    commands.spawn().insert_bundle(MaterialMeshBundle {
        mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
        transform: Transform::from_xyz(0.0, 0.0, -5.0),
        material: materials.add(CustomMaterial {
            camera_position: Vec3::new(0.0, 0.0, 0.0),
            alpha_mode: AlphaMode::Blend,
        }),
        ..default()
    });

    commands
        .spawn_bundle(Camera3dBundle {
            transform: Transform::from_xyz(0.0, 0.0, 0.0)
                .looking_at(Vec3::new(0.0, 0.0, -1.0), Vec3::Y),
            ..default()
        })
        .insert(FlyCam);
}

impl Material for CustomMaterial {
    fn fragment_shader() -> ShaderRef {
        "shader.wgsl".into()
    }

    fn alpha_mode(&self) -> AlphaMode {
        self.alpha_mode
    }
}
