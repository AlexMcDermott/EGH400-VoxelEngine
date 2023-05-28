#version 300 es

precision highp float;
precision highp sampler3D;

uniform vec3 cameraPosition;

uniform int resolution;
uniform int maxSteps;
uniform float stepSize;
uniform float voxelSize;
uniform sampler3D voxels;

in vec2 uvCoordinate;
in vec3 worldPostion;

out vec4 fragColor;

const float INF = 1.0 / 0.0;

struct Ray {
  vec3 origin;
  vec3 direction;
};

bool isInRange(vec3 v, float lower, float upper) {
  vec3 vClamped = clamp(v, vec3(lower), vec3(upper));
  return all(equal(v, vClamped));
}

bool isPositionFilled(vec3 position) {
    float scaleFactor = 1.0 / (float(resolution) / float(resolution - 1));
    vec3 samplePosition = position * scaleFactor + vec3(0.5 + 0.5 * voxelSize);
    if (!isInRange(samplePosition, 0.0, 1.0)) { return false; }
    bool isFilled = bool(texture(voxels, samplePosition).r);
    return isFilled;
}

vec3 rayCast(Ray ray) {
  for (int i = 0; i < maxSteps; i++) {
    vec3 testPosition = ray.origin + ray.direction * stepSize * float(i);
    bool isFilled = isPositionFilled(testPosition);
    if (isFilled) {
      return testPosition;
    }
  }

  return vec3(INF);
}

void main() {
  Ray ray = Ray(worldPostion, normalize(worldPostion - cameraPosition));
  vec3 hitPosition = rayCast(ray);
  fragColor = all(isinf(hitPosition)) ? vec4(0.0) : vec4(hitPosition, 1.0);
}