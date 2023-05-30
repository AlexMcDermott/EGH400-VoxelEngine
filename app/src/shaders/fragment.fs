#version 300 es

precision highp float;
precision highp sampler3D;

uniform vec3 cameraPosition;

uniform int resolution;
uniform int maxSteps;
uniform float stepSize;
uniform float voxelSize;
uniform sampler3D voxels;

in vec3 worldPostion;

out vec4 fragColor;

const float INF = 1.0 / 0.0;

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct RaycastResult {
  vec3 hitPosition;
  float depth;
};

bool isInRange(vec3 v, float lower, float upper) {
  vec3 vClamped = clamp(v, vec3(lower), vec3(upper));
  return all(equal(v, vClamped));
}

vec3 findNearestVoxelIndex(vec3 position) {
  vec3 normalise = position + vec3(0.5);
  vec3 quantize = floor(normalise / vec3(voxelSize));
  vec3 offset = quantize + vec3(0.5 * voxelSize);
  vec3 voxelIndex = offset / vec3(resolution);
  return voxelIndex;
}

float lookupVoxel(vec3 position) {
  vec3 voxelIndex = findNearestVoxelIndex(position);
  if (!isInRange(voxelIndex, 0.0, 1.0)) { return INF; }
  float voxel = texture(voxels, voxelIndex).r;
  return voxel;
}

float normaliseDepth(RaycastResult result) {
  float halfDiagonal = length(vec3(0.5));
  float cameraDistance = length(cameraPosition);
  float minDepth = cameraDistance - halfDiagonal;
  float maxDepth = cameraDistance + halfDiagonal;
  float normalisedDepth = (result.depth - minDepth) / (maxDepth - minDepth);
  return normalisedDepth;
}

RaycastResult rayCast(Ray ray) {
  for (int i = 0; i < maxSteps; i++) {
    vec3 testPosition = worldPostion + ray.direction * stepSize * float(i);
    float voxel = lookupVoxel(testPosition);
    if (!isinf(voxel) && bool(voxel)) {
      return RaycastResult(testPosition, length(testPosition - ray.origin));
    }
  }

  return RaycastResult(vec3(INF), INF);
}

void main() {
  Ray ray = Ray(cameraPosition, normalize(worldPostion - cameraPosition));
  RaycastResult result = rayCast(ray);
  if (all(isinf(result.hitPosition))) {
    fragColor = vec4(0.0);
    return;
  }

  // fragColor = vec4(vec3(normaliseDepth(result)), 1.0);
  fragColor = vec4(findNearestVoxelIndex(result.hitPosition), 1.0);
}