import * as THREE from "three";

export function applyHardTerminator(
  material: THREE.MeshStandardMaterial,
  cacheKey: string,
  lightDirection: THREE.Vector3,
  uniformName: "uMoonLightDir" | "uMarsLightDir"
) {
  material.customProgramCacheKey = () => cacheKey;

  material.onBeforeCompile = (shader) => {
    shader.uniforms[uniformName] = { value: lightDirection.clone() };

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vMoonWorldNormal;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <beginnormal_vertex>",
      `#include <beginnormal_vertex>
      vMoonWorldNormal = normalize(normalMatrix * objectNormal);`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vMoonWorldNormal;
      uniform vec3 ${uniformName};`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <output_fragment>",
      `float moonFacing = dot(normalize(vMoonWorldNormal), normalize(${uniformName}));
      if (moonFacing < 0.018) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      } else {
        #include <output_fragment>
        float moonLum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        float terminatorBand = smoothstep(0.95, 0.02, moonFacing);
        float caMask = terminatorBand * smoothstep(0.22, 0.88, moonLum);
        float ca = caMask * 0.32;
        gl_FragColor.r = min(gl_FragColor.r + ca * 1.75, 1.0);
        gl_FragColor.g = gl_FragColor.g + ca * 0.04;
        gl_FragColor.b = max(gl_FragColor.b - ca * 1.55, 0.0);
      }`
    );

    material.userData.shader = shader;
    material.userData.lightUniform = uniformName;
  };
}
