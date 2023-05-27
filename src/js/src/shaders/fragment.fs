#version 300 es

precision highp float;

uniform vec3 cameraPosition;

in vec2 uvCoordinate;
in vec3 worldPostion;

struct Voxel {
  vec3 position;
  float size;
  bool isFilled;
};

uniform Voxel data[64];

out vec4 fragColor;

void main() {
  // fragColor = vec4(worldPostion + vec3(0.5), 1.0);
  // return;

  float voxelSize = data[0].size;
  int volumeSizeInVoxels = 3;
  float stepSize = voxelSize / 10.0;

  vec3 origin = vec3(0.0);
  vec3 rayDirection = normalize(worldPostion - cameraPosition);

  bool didHit = false;
  for (int i = 0; i < 10000; i++) {
    vec3 testPosition = origin + rayDirection * stepSize * float(i);
    vec3 testPositionNormalised = testPosition / (worldPostion + vec3(0.5));
    ivec3 indexVolume = ivec3(floor(testPositionNormalised / voxelSize));
    int indexLinear = indexVolume.x + volumeSizeInVoxels * (indexVolume.y + volumeSizeInVoxels * indexVolume.z);
    if (data[indexLinear].isFilled) {
      didHit = true;
      break;
    }
  }

  fragColor = vec4(worldPostion, float(didHit));
}