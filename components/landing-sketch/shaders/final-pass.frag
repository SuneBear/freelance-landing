uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float uvScale;

varying vec2 vUv;

void main()	{
  vec2 uv = vUv * 2.0 - 1.0;
  uv *= uvScale;
  uv = uv * 0.5 + 0.5;
  uv = fract(uv);

  vec4 color1 = texture2D(texture1,uv);
  vec4 color2 = texture2D(texture2,vUv);

  gl_FragColor = mix(color1, color2, color2.a);
}
