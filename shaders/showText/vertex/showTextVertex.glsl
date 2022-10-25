uniform float uHoverState;
      uniform float uTime;
      varying vec2 vUv;
      varying float elevation;
      
      void main(){
       float animationAmount = uTime * uHoverState;
        vUv = uv;
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        modelViewPosition.z += sin(uHoverState * (((modelViewPosition.x + modelViewPosition.y) * 8.) + animationAmount)) * 0.1;
        elevation = sin(uHoverState * (modelViewPosition.x + modelViewPosition.y + modelViewPosition.z) + animationAmount);
        gl_Position = projectionMatrix * modelViewPosition;
      }