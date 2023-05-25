varying vec2 uvCoordinate;
varying vec3 worldPostion;

void main() {
  uvCoordinate = uv;
  worldPostion = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}