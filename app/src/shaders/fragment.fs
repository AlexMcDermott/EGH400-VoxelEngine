#version 300 es

precision highp float;
precision highp sampler3D;

uniform vec3 cameraPosition;

in vec2 uvCoordinate;
in vec3 worldPostion;

uniform sampler3D voxels;

out vec4 fragColor;

bool isInRange(vec3 v, float lower, float upper) {
  vec3 vClamped = clamp(v, vec3(lower), vec3(upper));
  return all(equal(v, vClamped));
}

float getPositionOpacity(vec3 position) {
    vec3 samplePosition = position + vec3(0.5);
    if (!isInRange(samplePosition, 0.0, 1.0)) { return 0.0; }
    float opacity = texture(voxels, samplePosition).r;
    return opacity;
}

void main() {
  float stepSize = 0.01;

  float opacity = getPositionOpacity(worldPostion);
  fragColor = vec4(worldPostion, opacity);

  vec3 rayOrigin = worldPostion;
  vec3 rayDirection = normalize(worldPostion - cameraPosition);

  bool didHit = false;
  for (int i = 0; i < 1000; i++) {
    vec3 testPosition = rayOrigin + rayDirection * stepSize * float(i);
    float opacity = getPositionOpacity(testPosition);
    if (opacity > 0.0) {
      didHit = true;
      break;
    }
  }

  fragColor = vec4(worldPostion, float(didHit));
}