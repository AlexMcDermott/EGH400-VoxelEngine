#version 300 es

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec2 uv;
in vec3 position;

out vec2 uvCoordinate;
out vec3 worldPostion;

void main() {
  uvCoordinate = uv;
  worldPostion = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}