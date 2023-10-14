#version 300 es

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;

out vec3 worldPosition;

void main() {
  worldPosition = (modelMatrix * vec4(position, 1.0f)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0f);
}