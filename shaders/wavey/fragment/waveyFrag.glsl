uniform float uHoverState;
uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform sampler2D uDisplacement;
uniform vec4 uResolution;
varying vec2 vUv;

mat2 getRotM(float angle) {
		    float s = sin(angle);
		    float c = cos(angle);
		    return mat2(c, -s, s, c);
		}
		const float PI = 3.1415;
		const float angle1 = PI *0.25;
		const float angle2 = -PI *0.75;


		void main()	{
			vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5);

			vec4 disp = texture2D(uDisplacement, newUV);
			vec2 dispVec = vec2(disp.r, disp.g);

			vec2 distortedPosition1 = newUV + getRotM(angle1) * dispVec * 1. * uHoverState;
			vec4 t1 = texture2D(uTexture, distortedPosition1);

			vec2 distortedPosition2 = newUV + getRotM(angle2) * dispVec * 1. * (1.0 - uHoverState);
			vec4 t2 = texture2D(uTexture2, distortedPosition2);

			gl_FragColor = mix(t1, t2, uHoverState);

		}