#version 300 es

precision highp float;
precision highp sampler3D;

uniform vec3 cameraPosition;

uniform int resolution;
uniform int maxSteps;
uniform float stepSize;
uniform float voxelSize;
uniform sampler3D voxels;

in vec3 worldPosition;

out vec4 fragColor;

const float INF = 1.0f / 0.0f;

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

vec3 findNearestVoxelCentre(vec3 position) {
  vec3 normalise = position + vec3(0.5f);
  vec3 quantize = floor(normalise / vec3(voxelSize));
  vec3 offset = quantize + vec3(0.5f * voxelSize);
  vec3 voxelIndex = offset / vec3(resolution);
  return voxelIndex;
}

float lookupVoxel(vec3 position) {
  vec3 voxelIndex = findNearestVoxelCentre(position);
  if(!isInRange(voxelIndex, 0.0f, 1.0f)) {
    return INF;
  }
  float voxel = texture(voxels, voxelIndex).r;
  return voxel;
}

float normaliseDepth(RaycastResult result) {
  float halfDiagonal = length(vec3(0.5f));
  float cameraDistance = length(cameraPosition);
  float minDepth = cameraDistance - halfDiagonal;
  float maxDepth = cameraDistance + halfDiagonal;
  float normalisedDepth = (result.depth - minDepth) / (maxDepth - minDepth);
  return normalisedDepth;
}

RaycastResult rayCast(Ray ray) {
  for(int i = 0; i < maxSteps; i++) {
    vec3 testPosition = worldPosition + ray.direction * stepSize * float(i);
    float voxel = lookupVoxel(testPosition);
    if(!isinf(voxel) && bool(voxel)) {
      return RaycastResult(testPosition, length(testPosition - ray.origin));
    }
  }

  return RaycastResult(vec3(INF), INF);
}

void main() {
  Ray ray = Ray(cameraPosition, normalize(worldPosition - cameraPosition));
  RaycastResult result = rayCast(ray);
  if(all(isinf(result.hitPosition))) {
    fragColor = vec4(0.0f);
    return;
  }

  // fragColor = vec4(vec3(normaliseDepth(result)), 1.0);
  fragColor = vec4(findNearestVoxelCentre(result.hitPosition), 1.0f);
}