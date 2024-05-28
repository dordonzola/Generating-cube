const vertexShaderTxt = `
    precision mediump float;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProjection;
    
    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
    }
`;
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;
const mat4 = glMatrix.mat4;

const GenerateCube = function (loc_x, loc_y, loc_z, size) {
  const canvas = document.getElementById("main-canvas");
  const gl = canvas.getContext("webgl");
  let canvasColor = [0.2, 0.5, 0.8];

  checkGl(gl);

  gl.clearColor(...canvasColor, 1.0); // Ustawienie koloru czyszczenia tła (R, G, B, A)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST); // Włączenie testu głębokości
  gl.enable(gl.CULL_FACE); // Włączenie cullingu, aby nie rysować tylnej strony ścian

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderTxt);
  gl.shaderSource(fragmentShader, fragmentShaderTxt);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  checkShaderCompile(gl, vertexShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);

  gl.validateProgram(program);

  const boxVertices = [
    // X, Y, Z
    // Górna ściana
    loc_x - size / 2,
    loc_y + size / 2,
    loc_z - size / 2,
    loc_x - size / 2,
    loc_y + size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y + size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y + size / 2,
    loc_z - size / 2,

    // Lewa ściana
    loc_x - size / 2,
    loc_y + size / 2,
    loc_z + size / 2,
    loc_x - size / 2,
    loc_y - size / 2,
    loc_z + size / 2,
    loc_x - size / 2,
    loc_y - size / 2,
    loc_z - size / 2,
    loc_x - size / 2,
    loc_y + size / 2,
    loc_z - size / 2,

    // Prawa ściana
    loc_x + size / 2,
    loc_y + size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y - size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y - size / 2,
    loc_z - size / 2,
    loc_x + size / 2,
    loc_y + size / 2,
    loc_z - size / 2,

    // Przednia ściana
    loc_x + size / 2,
    loc_y + size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y - size / 2,
    loc_z + size / 2,
    loc_x - size / 2,
    loc_y - size / 2,
    loc_z + size / 2,
    loc_x - size / 2,
    loc_y + size / 2,
    loc_z + size / 2,

    // Tylna ściana
    loc_x + size / 2,
    loc_y + size / 2,
    loc_z - size / 2,
    loc_x + size / 2,
    loc_y - size / 2,
    loc_z - size / 2,
    loc_x - size / 2,
    loc_y - size / 2,
    loc_z - size / 2,
    loc_x - size / 2,
    loc_y + size / 2,
    loc_z - size / 2,

    // Dolna ściana
    loc_x - size / 2,
    loc_y - size / 2,
    loc_z - size / 2,
    loc_x - size / 2,
    loc_y - size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y - size / 2,
    loc_z + size / 2,
    loc_x + size / 2,
    loc_y - size / 2,
    loc_z - size / 2,
  ];

  const boxIndices = [
    // Górna ściana
    0, 1, 2, 0, 2, 3,

    // Lewa ściana
    5, 4, 6, 6, 4, 7,

    // Prawa ściana
    8, 9, 10, 8, 10, 11,

    // Przednia ściana
    13, 12, 14, 15, 14, 12,

    // Tylna ściana
    16, 17, 18, 16, 18, 19,

    // Dolna ściana
    21, 20, 22, 22, 20, 23,
  ];

  let colors = [
    // Kolory dla każdego wierzchołka
    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 1.0, 0.5, 1.0, 0.0,

    0.8, 0.0, 0.2, 0.0, 1.0, 1.0, 0.0, 0.2, 1.0, 0.5, 1.0, 0.0,

    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 1.0, 0.5, 1.0, 0.0,

    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 1.0, 0.5, 1.0, 0.0,

    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 1.0, 0.5, 1.0, 0.0,

    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 1.0, 0.5, 1.0, 0.0,
  ];

  const boxVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  const boxIndicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndicesBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(boxIndices),
    gl.STATIC_DRAW
  );

  const posAttribLocation = gl.getAttribLocation(program, "vertPosition");
  gl.vertexAttribPointer(
    posAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    3 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(posAttribLocation);

  const triangleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    3 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(colorAttribLocation);

  // render time

  gl.useProgram(program);

  const worldMatLoc = gl.getUniformLocation(program, "mWorld");
  const viewMatLoc = gl.getUniformLocation(program, "mView");
  const projectionMatLoc = gl.getUniformLocation(program, "mProjection");

  const worldMatrix = mat4.create();
  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [0, 0, -4], [0, 0, 0], [0, 1, 0]); // Ustawienie macierzy widoku
  const projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    glMatrix.glMatrix.toRadian(60),
    canvas.width / canvas.height,
    1,
    10
  ); // Ustawienie macierzy projekcji

  gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(viewMatLoc, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(projectionMatLoc, gl.FALSE, projectionMatrix);

  const identityMat = mat4.create();
  let angle = 0;

  //Funkcja będąca pętlą renderującą
  const loop = function () {
    angle = (performance.now() / 1000 / 60) * 2 * Math.PI;
    mat4.rotate(worldMatrix, identityMat, angle, [1, 1, -0.5]);
    gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);

    gl.clearColor(...canvasColor, 1.0); // Czyszczenie kolorem tła (R, G, B, A)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Renderowanie sześcianu za pomocą indeksów
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop); // Powtórzenie pętli renderującej
  };

  requestAnimationFrame(loop); // Rozpoczęcie pętli renderującej
};

// Funkcja sprawdzająca dostępność WebGL
function checkGl(gl) {
  if (!gl) {
    console.log("WebGL not supported, use another browser");
  }
}

// Funkcja sprawdzająca kompilację shaderów
function checkShaderCompile(gl, shader) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader not compiled", gl.getShaderInfoLog(shader));
  }
}

// Funkcja sprawdzająca linkowanie programu
function checkLink(gl, program) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Linking error", gl.getProgramInfoLog(program));
  }
}

function submitForm() {
  // Pobierz wartość z pola tekstowego
  const x_loc = document.getElementById("x_loc").value;
  const y_loc = document.getElementById("y_loc").value;
  const z_loc = document.getElementById("z_loc").value;
  const cubeSize = document.getElementById("cubeSize").value;
  GenerateCube(x_loc, y_loc, z_loc, cubeSize);
}
