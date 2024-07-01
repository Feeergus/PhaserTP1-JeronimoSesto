precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 purpleColor = vec3(0.5, 0.0, 0.5); // Color morado

    // Aumentar el brillo modificando el rango de la función sinusoidal
    float brightness = 0.8 + 0.2 * sin(time * 2.0); // Efecto de brillo más intenso

    gl_FragColor = vec4(purpleColor * brightness, 1.0);
}