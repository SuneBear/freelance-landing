varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vWorldPos;

void main () {
  vUv = uv;
  vScreenPos = (projectionMatrix * modelViewMatrix) * vec4(position, 1.0);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = (projectionMatrix * modelViewMatrix) * vec4(position, 1.0);
}
