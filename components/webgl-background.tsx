'use client';

import { useEffect, useRef } from 'react';

export function WebglBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    window.addEventListener('resize', syncSize);
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    
    const glContext = gl as WebGLRenderingContext;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          
          vec3 color1 = vec3(0.086, 0.365, 1.0); 
          vec3 color2 = vec3(0.976, 0.980, 0.984); 
          
          float noise = sin(uv.x * 3.0 + u_time * 0.2) * cos(uv.y * 2.0 - u_time * 0.3);
          noise += sin(uv.y * 4.0 + u_time * 0.4) * 0.5;
          
          vec3 finalColor = mix(color2, color1, clamp(noise * 0.05, 0.0, 0.05));
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(type: number, src: string) {
      if (!glContext) return null;
      const s = glContext.createShader(type);
      if (!s) return null;
      glContext.shaderSource(s, src);
      glContext.compileShader(s);
      return s;
    }

    const prog = glContext.createProgram();
    if (!prog) return;

    const vertexShader = createShader(glContext.VERTEX_SHADER, vs);
    const fragmentShader = createShader(glContext.FRAGMENT_SHADER, fs);

    if (vertexShader) glContext.attachShader(prog, vertexShader);
    if (fragmentShader) glContext.attachShader(prog, fragmentShader);
    
    glContext.linkProgram(prog);
    glContext.useProgram(prog);

    const buf = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buf);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glContext.STATIC_DRAW
    );

    const pos = glContext.getAttribLocation(prog, 'a_position');
    glContext.enableVertexAttribArray(pos);
    glContext.vertexAttribPointer(pos, 2, glContext.FLOAT, false, 0, 0);

    const uTime = glContext.getUniformLocation(prog, 'u_time');
    const uRes = glContext.getUniformLocation(prog, 'u_resolution');

    let animationFrameId: number;

    function render(t: number) {
      if (!canvas || !glContext) return;
      syncSize();
      glContext.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) glContext.uniform1f(uTime, t * 0.001);
      if (uRes) glContext.uniform2f(uRes, canvas.width, canvas.height);
      glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    
    render(0);

    return () => {
      window.removeEventListener('resize', syncSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
