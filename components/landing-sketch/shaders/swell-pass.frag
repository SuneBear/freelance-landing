uniform sampler2D tDiffuse;
uniform float u_progress;
varying vec2 v_uv;

void main() {
  vec2 u = v_uv * 2.0 - 1.0;
  float dist = distance(v_uv, vec2(0.5));
  dist = 1.0 - dist;
	vec2 offset = u * dist * vec2(0.35, 0.35) * u_progress;
  vec2 uv = v_uv - offset;
  vec4 tex = texture2D(tDiffuse, uv);

  gl_FragColor = tex;
}
