use bevy::prelude::*;
use bevy_flycam::{FlyCam, NoCameraPlayerPlugin};
mod voxel;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugin(NoCameraPlayerPlugin)
        .add_plugin(voxel::VoxelPlugin)
        .add_startup_system(setup)
        .run();
}

fn setup(mut commands: Commands) {
    commands
        .spawn_bundle(Camera3dBundle {
            transform: Transform::from_xyz(0.0, 0.0, 0.0).looking_at(Vec3::NEG_Z, Vec3::Y),
            ..default()
        })
        .insert(FlyCam);
}
