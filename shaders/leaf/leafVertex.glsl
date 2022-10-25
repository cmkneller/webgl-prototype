varying vec2 vUv;
uniform float uTime;

void main(){
    vUv = uv;


    
    vec4 modelPosition = modelViewMatrix * vec4(position, 1);

    float distanceFromBottom = distance(vUv, vec2(0.5, 0.0));

   modelPosition.x += sin(modelPosition.y + (uTime *2.)) * 0.2 * distanceFromBottom / 2.;
   modelPosition.z += sin(modelPosition.y * 5. + uTime) * 0.2 * distanceFromBottom / 2.;

    gl_Position = projectionMatrix * modelPosition;

}

