varying vec2 uvCoordinate;
varying vec3 worldPostion;

void main() {
  gl_FragColor = vec4(uvCoordinate, 0.0, 1.0);
}