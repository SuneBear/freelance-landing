uniform float time;
uniform vec2 resolution;

uniform sampler2D tMap;
uniform float uAlpha;
uniform float uTransition;
uniform float uOutline;
uniform float uFlipClamp;
uniform float uInvertAnim;
uniform vec2 uClamp;
uniform vec3 uColor;

varying vec4 vScreenPos;
varying vec2 vUv;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    vec3 sub = vec3(oldValue, newMax, oldMax) - vec3(oldMin, newMin, oldMin);
    return sub.x * sub.y / sub.z + newMin;
}
vec2 range(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
    vec2 oldRange = oldMax - oldMin;
    vec2 newRange = newMax - newMin;
    vec2 val = oldValue - oldMin;
    return val * newRange / oldRange + newMin;
}
vec3 range(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
    vec3 oldRange = oldMax - oldMin;
    vec3 newRange = newMax - newMin;
    vec3 val = oldValue - oldMin;
    return val * newRange / oldRange + newMin;
}
float crange(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}
vec2 crange(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}
vec3 crange(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}
float rangeTransition(float t, float x, float padding) {
    float transition = crange(t, 0.0, 1.0, -padding, 1.0 + padding);
    return crange(x, transition - padding, transition + padding, 1.0, 0.0);
}
float getNoise(vec2 uv, float time) {
    float x = uv.x * uv.y * time * 1000.0;
    x = mod(x, 13.0) * mod(x, 123.0);
    float dx = mod(x, 0.01);
    float amount = clamp(0.1 + dx * 100.0, 0.0, 1.0);
    return amount;
}
#define sinf sin

highp float getRandom(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sinf(sn) * c);
}
float cnoise(vec3 v) {
    float t = v.z * 0.3;
    v.y *= 0.8;
    float noise = 0.0;
    float s = 0.5;
    noise += (sinf(v.x * 0.9 / s + t * 10.0) + sinf(v.x * 2.4 / s + t * 15.0) + sinf(v.x * -3.5 / s + t * 4.0) + sinf(v.x * -2.5 / s + t * 7.1)) * 0.3;
    noise += (sinf(v.y * -0.3 / s + t * 18.0) + sinf(v.y * 1.6 / s + t * 18.0) + sinf(v.y * 2.6 / s + t * 8.0) + sinf(v.y * -2.6 / s + t * 4.5)) * 0.3;
    return noise;
}
float cnoise(vec2 v) {
    float t = v.x * 0.3;
    v.y *= 0.8;
    float noise = 0.0;
    float s = 0.5;
    noise += (sinf(v.x * 0.9 / s + t * 10.0) + sinf(v.x * 2.4 / s + t * 15.0) + sinf(v.x * -3.5 / s + t * 4.0) + sinf(v.x * -2.5 / s + t * 7.1)) * 0.3;
    noise += (sinf(v.y * -0.3 / s + t * 18.0) + sinf(v.y * 1.6 / s + t * 18.0) + sinf(v.y * 2.6 / s + t * 8.0) + sinf(v.y * -2.6 / s + t * 4.5)) * 0.3;
    return noise;
}

// Fluid
uniform sampler2D tFluid;
uniform sampler2D tFluidMask;
vec2 getFluidVelocity() {
    float fluidMask = smoothstep(0.1, 0.7, texture2D(tFluidMask, vUv).r);
    return texture2D(tFluid, vUv).xy * fluidMask;
}
vec3 getFluidVelocityMask() {
    float fluidMask = smoothstep(0.1, 0.7, texture2D(tFluidMask, vUv).r);
    return vec3(texture2D(tFluid, vUv).xy * fluidMask, fluidMask);
}
float random (in float x) {
    return fract(sin(x)*1e4);
}
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))* 43758.5453123);
}
float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

#define PI 3.14159265359

void main() {
    float mixFluid = 0.0;
    vec2 fluidUV = vScreenPos.xy / vScreenPos.w * 0.5 + 0.5;

    gl_FragColor = texture2D(tFluidMask, fluidUV);
    // gl_FragColor.xy = fluidUV.xy;
    // gl_FragColor.xy = (vUv - 0.5) * (1.0) + 0.5;

    float fluidMask = smoothstep(0.0, 0.1, texture2D(tFluidMask, fluidUV).r);
    float fluidOutline = smoothstep(0.0, 0.2, fluidMask) * smoothstep(1.0, 0.2, fluidMask);
    vec2 fluid = texture2D(tFluid, vUv).xy * fluidMask;
    mixFluid = smoothstep(0.0, 0.0005, fluid.x*fluid.y);//+smoothstep(0.0, 0.002, fluid.y);

    mixFluid = mix(mixFluid, 0.0, 0.3);
    fluidMask = mix(fluidMask, 1.0, smoothstep(0.5, 0.0, uTransition));
    mixFluid = max(fluidMask, mixFluid);
    vec2 uv = vUv;
    float noise = cnoise(vUv*3.0-time*0.15);
    vec3 color = vec3(1.0);
    vec4 tex = texture2D(tMap, uv);
    float outline = tex.r; // resolution

    //outline *= 0.7 + sin(time*3.0) * 0.1 + sin(time*5.0) * 0.1 + sin(time*7.0) * 0.1;

    outline = mix(outline*mixFluid, outline, uOutline);
    float fill = tex.b;
    vec2 st = vUv;
    vec2 grid = mix(vec2(140.0, 200.0), vec2(250.0, 3000.0), uInvertAnim);
    st *= grid;
    vec2 ipos = floor(st);  // integer

    vec2 fpos = fract(st);  // fraction

    vec2 vel = vec2(((time*mix(0.1, 0.07, uInvertAnim))/2.*max(grid.x, grid.y))); // time


    vec2 horizontal = vec2(-1., 0.0) * random(1.0+ipos.y);
    vec2 vertical = vec2(0., -1.0) * random(1.0+ipos.x);
    vel *= mix(horizontal, vertical, uInvertAnim); // direction


    vec2 offset = mix(vec2(0.1, -0.5), vec2(-0.5, 0.1), uInvertAnim);
    float c = clamp(pattern(st+offset, vel, 0.7), 0., 1.);
    float a = step(.6, mix(fpos.y, fpos.x, uInvertAnim));
    outline += c * a * fill * (1.0-uOutline);
    fill = mix(fill, outline, mixFluid);
    float alpha = mix(fill, outline, uOutline);

    //float mid = 0.5;

    //alpha = smoothstep(mid-0.001, mid+0.001, alpha);

    float transition = 1.0-uTransition;
    float fade = smoothstep(transition-0.5, transition, 1.0-vUv.y) * smoothstep(0.0, 0.2, uTransition);

    //fade *= mix(1.0, getNoise(vUv, time), smoothstep(0.0, 0.5, fade) * smoothstep(1.0, 0.7, fade));

    alpha *= fade;
    alpha *= 0.85 + noise * 0.2;
    float clampAlpha = smoothstep(uClamp.x-0.001, uClamp.x+0.001, 1.0-vUv.y) * smoothstep(uClamp.y+0.001, uClamp.y-0.001, 1.0-vUv.y);
    alpha *= mix(clampAlpha, 1.0-clampAlpha, uFlipClamp);
    alpha = mix(alpha, outline*alpha, smoothstep(0.8, 0.0, alpha));
    float fluidAlpha = max(uAlpha * 1.3, 0.28);
    gl_FragColor.rgb = uColor;
    gl_FragColor.a = alpha * uAlpha;
    gl_FragColor = mix(gl_FragColor, vec4(1.0), fluidAlpha * (1.0-c)*a*fill*mixFluid*uTransition);
}
