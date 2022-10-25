uniform sampler2D uTexture;
      uniform sampler2D uTexture2;
      uniform float uHoverState;
      uniform vec3 uColor;
      varying float elevation;
      varying vec2 vUv;
      void main(){
        float newElevation = clamp(elevation, 0.00, 0.06);
        vec2 nUv = vUv;
        float X = smoothstep(3.,4., (uHoverState * 4. + nUv.y + nUv.x));
        vec4 Color = vec4((uColor / 255.00) - newElevation, 1.0);
        vec4 colorMix = mix(texture2D(uTexture2, (nUv.xy + ((1. - X) * nUv.x))), Color, 0.9);
        vec4 textureColor = mix(texture2D(uTexture, (nUv.xy + (X * nUv.x))), colorMix, X);
        gl_FragColor = textureColor;
      }