#version 300 es

precision highp float;
precision highp sampler3D;

uniform vec3 cameraPosition;

in vec2 uvCoordinate;
in vec3 worldPostion;

uniform int resolution;
uniform int maxSteps;
uniform float stepSize;
uniform float voxelSize;
uniform sampler3D voxels;

out vec4 fragColor;

bool isInRange(vec3 v, float lower, float upper) {
  vec3 vClamped = clamp(v, vec3(lower), vec3(upper));
  return all(equal(v, vClamped));
}

bool isPositionFilled(vec3 position) {
    vec3 samplePosition = position + vec3(0.5);
    if (!isInRange(samplePosition, 0.0, 1.0)) { return false; }
    bool isFilled = bool(texture(voxels, samplePosition).r);
    return isFilled;
}

void main() {
  vec3 rayOrigin = worldPostion;
  vec3 rayDirection = normalize(worldPostion - cameraPosition);

  bool didHit = false;
  for (int i = 0; i < maxSteps; i++) {
    vec3 testPosition = rayOrigin + rayDirection * stepSize * float(i);
    bool isFilled = isPositionFilled(testPosition);
    if (isFilled) {
      didHit = true;
      break;
    }
  }

  fragColor = vec4(worldPostion, float(didHit));
}