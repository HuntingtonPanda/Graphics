import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mod } from 'three/tsl';


const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});


// Start here.

const l = 0.5
const positions = new Float32Array([
    // Every three elements in this array are the x, y, z coordinates of a new vertex.
    // We use line breaks and comments for readability, but note that this is a 1D array.
    // Front face
    -l, -l,  l, // 0
     l, -l,  l, // 1
     l,  l,  l, // 2
    -l,  l,  l, // 3

    // Left face
    -l, -l, -l, // 4
    -l, -l,  l, // 5
    -l,  l,  l, // 6 
    -l,  l, -l, // 7
  
    // Top face
    -l, l, -l, // 8
    -l, l, l, // 9
    l, l, l, // 10
    l, l, -l, // 11

    // Bottom face
    -l, -l, -l, // 12
    l, -l, -l, // 13
    l, -l, l, // 14
    -l, -l, l, // 15

    // Right face
    l, -l, -l, // 16
    l, l, -l, // 17
    l, l, l, // 18
    l, -l, l, // 19

     // Back face
    -l, -l, -l, // 20
    -l, l, -l, // 21
    l, l, -l, // 22
    l, -l, -l, // 23
  ]);
  
  const indices = [
    // Every three numbers in this array are the indices of the vertices that form a triangle.  
    // This is also a 1D array and we use line breaks and comments for readability.
    // Front face.
    0, 1, 2,
    0, 2, 3,
  
    // Left face
    4, 5, 6,
    4, 6, 7,
  
    // Top face
    8, 9, 10,
    8, 10, 11,

    // Bottom face
    12, 13, 14,
    12, 14, 15,
  
    // Right face
    16, 17, 18,
    16, 18, 19,

    // Back face
    20, 21, 22,
    20, 22, 23,
  ];
  
  // Compute normals
  const normals = new Float32Array([
    // Front face
    // Every three elements in this array are the x, y, z components of the normal vector for the front face.
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
  
    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // Bottom face
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
scene.add(cube);

// TODO: Implement wireframe geometry


function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
// TODO: Implement the other transformation functions.
function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta), 0, 0,
    Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
	);
}

function scalingMatrix(sx, sy, sz) {
  return new THREE.Matrix4().set(
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1
  );
}

let cubes = [];
for (let i = 0; i < 7; i++) {
	let cube = new THREE.Mesh(custom_cube_geometry, phong_material);
	cube.matrixAutoUpdate = false;
	cubes.push(cube);
	scene.add(cube);
}

// Translate the cubes.
const translation = translationMatrix(0, 3*l, 0); // Translate 2l units in the y direction

//Rotate the cubes
const translationYup = translationMatrix(0, 1.5*l, 0); // Translate l units in the y direction
const translationYdown = translationMatrix(0, 1.5*-l, 0); // Translate -l units in the y direction
const translationXup = translationMatrix(l, 0, 0); // Translate l units in the x direction
const translationXdown = translationMatrix(-l, 0, 0); // Translate -l units in the x direction
//const rotation = rotationMatrixZ(Math.PI/18); // Rotate 10 degrees around the z-axis(10 degrees = PI/18 radians)

//Scale the cubes
const scaling = scalingMatrix(1, 1.5, 1); // Scale the cube by a factor of 1.5 in the y direction

// let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update
// model_transformation.multiplyMatrices(scaling, model_transformation);
// for (let i = 0; i < cubes.length; i++) {
// 	cubes[i].matrix.copy(model_transformation);
//     //For rotation in respect of the last cube
//     model_transformation.multiplyMatrices(translationYup, model_transformation);
//     model_transformation.multiplyMatrices(translationXup, model_transformation);
//     model_transformation.multiplyMatrices(rotation, model_transformation);
//     model_transformation.multiplyMatrices(translationYdown, model_transformation);
//     model_transformation.multiplyMatrices(translationXdown, model_transformation);
    
//     //For translation in respect of the last cube
//     model_transformation.multiplyMatrices(translation, model_transformation);
// }

// TODO: Transform cubes
let animation_time = 0;
let delta_animation_time;
let rotation_angle;
const clock = new THREE.Clock();

const MAX_ANGLE = 10 * 2*Math.PI/360 // 10 degrees converted to radians
const T = 3 // oscilation persiod in seconds

function animate() {
    
	renderer.render( scene, camera );
    controls.update();

    delta_animation_time = clock.getDelta();
    animation_time += delta_animation_time; 
    // ...
    // feel free to add other auxiliary variables if needed.
    rotation_angle = MAX_ANGLE * Math.abs(Math.sin(2 * Math.PI * animation_time / (2*T)));

    const rotation = rotationMatrixZ(rotation_angle);
    let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update
    model_transformation.multiplyMatrices(scaling, model_transformation);
    for (let i = 0; i < cubes.length; i++) {
      cubes[i].matrix.copy(model_transformation);
        //For rotation in respect of the last cube
        model_transformation.multiplyMatrices(translationYup, model_transformation);
        model_transformation.multiplyMatrices(translationXup, model_transformation);
        model_transformation.multiplyMatrices(rotation, model_transformation);
        model_transformation.multiplyMatrices(translationYdown, model_transformation);
        model_transformation.multiplyMatrices(translationXdown, model_transformation);
        
        //For translation in respect of the last cube
        model_transformation.multiplyMatrices(translation, model_transformation);
    }

}
renderer.setAnimationLoop( animate );

// TODO: Add event listener