// purpleGlow.frag
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main() {
    vec4 color = texture2D(uMainSampler, outTexCoord);
    
    // Apply a purple tint
    color.r *= 1.2;
    color.g *= 0.2;
    color.b *= 1.2;

    // Apply a simple glow effect
    float glow = sin(time * 5.0) * 0.5 + 0.5;
    color.rgb += glow * vec3(0.5, 0.0, 0.5);

    gl_FragColor = color;
}
