import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
/* import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js"; */

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let scene, camera, renderer, controls;
let directionalLight, directionalLightEnabled = true;
let ovni;

let d, r;

let keysPressed = {};

const clock = new THREE.Clock();

const vOvni = 30, vRotOvni = 0.5;

const xMoon = 70, yMoon = 70, zMoon = -70;
const xOvni = 0, yOvni = 30, zOvni = 0;
const xCasa = 5, yCasa = 0, zCasa = 3;

const basicMaterials = {
    castanho: new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
    cinzento: new THREE.MeshStandardMaterial({ color: 0x5e6270 }),
    verde:    new THREE.MeshStandardMaterial({ color: 0x04a476 }),
    azul:     new THREE.MeshStandardMaterial({ color: 'blue'   }),
    branco:   new THREE.MeshStandardMaterial({ color: 'white'  }),
}

const lambertMaterials = {
    castanho: new THREE.MeshLambertMaterial({ color: 0x8b4513 }),
    cinzento: new THREE.MeshLambertMaterial({ color: 0x5e6270 }),
    verde:    new THREE.MeshLambertMaterial({ color: 0x04a476 }),
    azul:     new THREE.MeshLambertMaterial({ color: 'blue'   }),
    branco:   new THREE.MeshLambertMaterial({ color: 'white'  }),
}

const phongMaterials = {
    castanho: new THREE.MeshPhongMaterial({ color: 0x8b4513 }),
    cinzento: new THREE.MeshPhongMaterial({ color: 0x5e6270 }),
    verde:    new THREE.MeshPhongMaterial({ color: 0x04a476 }),
    azul:     new THREE.MeshPhongMaterial({ color: 'blue'   }),
    branco:   new THREE.MeshPhongMaterial({ color: 'white'  }),   
}

const toonMaterials = {
    castanho: new THREE.MeshToonMaterial({ color: 0x8b4513 }),
    cinzento: new THREE.MeshToonMaterial({ color: 0x5e6270 }),
    verde:    new THREE.MeshToonMaterial({ color: 0x04a476 }),
    azul:     new THREE.MeshToonMaterial({ color: 'blue'   }),
    branco:   new THREE.MeshToonMaterial({ color: 'white'  }),
}

let currentMaterial;

const posicoesSobreiros = [
    [-5, 0, -80], [-33, 0, -84], [-10, 0, -27], [-55, 0, -7.26], [-92, 0, -10],
    [-59, 0, -20], [-54, 0, -35], [-97, 0, -40], [-25, 0, -77], [-17, 0, -44], 
    [-88, 0, -83], [-81, 0, -19], [-31, 0, -56], [-46, 0, -99], [-35, 0, -85], 
    [-3, 0, -9], [-75, 0, -35], [-48, 0, -29], [-49, 0, -12], [-7.20, 0, -37]
  ];

const xA = 0, yA = 0, zA = 0, 
xB = 0.2, yB = 0.8, zB = -1.2, 
xC = 1.2, yC = 2.2, zC = -2.4,
xD = 2.7, yD = 2.8, zD = -4.8,
xE = 3.9, yE = 4.2, zE = -6,
xF = 5.2, zF = -7.2;


// Verticies da casa
let verticies = new Float32Array([
    xA, yA, zA,        // vértice  0
    xB, yA, zA,        // vértice  1
    xC , yA, zA,       // vértice  2
    xF, yA, zA,        // vértice  3
    xA, zA, zF,        // vértice  4
    xA, yD, zF,        // vértice  5
    xA, yD, zA,        // vértice  6
    xF, yD, zA,        // vértice  7
    xB, yC, zA,        // vértice  8
    xC, yC, zA,        // vértice  9
    xD, yB, zA,        // vértice 10
    xE, yB, zA,        // vértice 11
    xD, yC, zA,        // vértice 12
    xE, yC, zA,        // vértice 13
    xA, yB, zE,        // vértice 14
    xA, yB, zD,        // vértice 15
    xA, yC, zE,        // vértice 16
    xA, yC, zD,        // vértice 17
    xA, yC, zC,        // vértice 18
    xA, yC, zB,        // vértice 19
    xA, yB, zB,        // vértice 20
    xA, yB, zC,        // vértice 21
    xF, yD, zF,        // vértice 22
    xF, yA, zF,        // vértice 23
    xA, yA, zA,        // vértice 24
    xA, yD, zA,        // vértice 25
    xF, yA, zA,        // vertice 26
    xF, yD, zA,        // vértice 27
    xA, yD, zF,        // vértice 28
    xA, zA, zF,        // vértice 29
    xF, yA, zF,        // vértice 30
    xF, yD, zF,        // vértice 31
    xF, yA, zA,        // vértice 32
    xF, yB, zE,        // vértice 33
    xF, yB, zD,        // vértice 34
    xF, yC, zE,        // vértice 35
    xF, yC, zD,        // vértice 36
    xF, yC, zC,        // vértice 37
    xF, yC, zB,        // vértice 38
    xF, yB, zB,        // vértice 39
    xF, yB, zC,        // vértice 40

])

let telhadoVerticies = new Float32Array([
    xA, yD, zA,          // vértice  0
    xF, yD, zA,          // vértice  1
    xD, yE, zA,          // vértice  2
    xA, yD, zA,          // vértice  3
    xA, yD, zF,          // vértice  4
    xD, yE, zA,          // vértice  5
    xD, yE, zF,          // vértice  6
    xA, yD, zF,          // vértice  7
    xF, yD, zF,          // vértice  8
    xD, yE, zF,          // vértice  9
    xF, yD, zA,          // vértice  1
    xD, yE, zA,          // vértice  11
    xD, yE, zF,          // vértice  12
    xF, yD, zF,          // vértice  13
])


let janelasVerticies = new Float32Array([
    //vérticies da janela da frente
    xD, yB, zA,        // vértice 0
    xE, yB, zA,        // vértice 1
    xD, yC, zA,        // vértice 2
    xE, yC, zA,        // vértice 3
    //vérticies das janelas da parede esquerda
    xA, yB, zE,        // vértice 4
    xA, yB, zD,        // vértice 5
    xA, yC, zE,        // vértice 6
    xA, yC, zD,        // vértice 7
    xA, yC, zC,        // vértice 8
    xA, yC, zB,        // vértice 9
    xA, yB, zB,        // vértice 10
    xA, yB, zC,        // vértice 11
    // vérticies das janelas da parede direita
    xF, yB, zE,        // vértice 12
    xF, yB, zD,        // vértice 13
    xF, yC, zE,        // vértice 14
    xF, yC, zD,        // vértice 15
    xF, yC, zC,        // vértice 16
    xF, yC, zB,        // vértice 17
    xF, yB, zB,        // vértice 18
    xF, yB, zC,        // vértice 19
])

let portaVerticies = new Float32Array([
    xB, yA, zA,        // vértice  0
    xC , yA, zA,       // vértice  1
    xB, yC, zA,        // vértice  2
    xC, yC, zA,        // vértice  3
])

let portaIndex = [
    0, 1, 2,
    1, 3, 2,
]

let janelasIndex = [
    0, 1, 2,
    1, 3, 2,
    5, 6, 4,
    5, 7, 6,
    10, 8, 11,
    10, 9, 8,
    13, 12, 14,
    13, 14, 15,
    18, 19, 16,
    18, 16, 17,
]


let telhadoIndex = [
    0, 1, 2,
    4, 3, 5,
    4, 5, 6,
    8, 7 , 9,
    13, 11, 10,
    13, 12, 11,

]

let indexex = [
    //frente da casa
    0,1, 8,
    0, 8, 6,
    8 ,9, 6,
    6, 9, 7,
    9, 12, 7,
    12, 13, 7,
    7, 13, 11,
    7, 11, 3,
    2, 10, 9,
    2, 11, 10,
    2, 3, 11,
    9,10, 12,
    // começo de parede esquerda 
    15, 21, 17,
    20, 29, 24,
    21, 18, 17,
    25, 19, 20,
    25, 20, 24,
    5, 14, 16,
    5, 17, 18,
    5, 16, 17,
    5, 18, 19,
    5, 19, 25,
    5, 4, 14,
    4, 15, 14,
    4, 20, 21,
    4, 21, 15,
    // fim de parede esquerda
    //começo de parede trás
    23, 29, 28,
    23, 28, 22,
    //fim de parede de trás
    //começo da parede direita
    30, 33, 34,
    30, 40, 39,
    30, 34, 40,
    30, 39, 32,
    31, 37, 31,
    31, 37, 36,
    31, 36, 35,
    31, 35, 33,
    31, 33, 30,
    31, 27, 37,
    32, 39, 27,
    37, 27, 38,
    36, 37, 40,
    36, 40, 34,
    39, 38, 27,
    //fim da parede direita

]
let pivot = new THREE.Object3D();

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020d1f);
    currentMaterial = basicMaterials;

    scene.add(new THREE.AxesHelper(50));
   
    createMoon(xMoon, yMoon, zMoon);
    createOvni(xOvni, yOvni, zOvni);
    createCasa(xCasa, yCasa, zCasa);
    generateSobreiros();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(70, 100, 70);
    camera.lookAt(scene.position);
    //camera.lookAt(30, 30, -30);
    pivot.add(camera);
    scene.add(pivot);
}
  

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    createMoonLight();
    createAmbientLight();
}

function createMoonLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(xMoon, yMoon, zMoon);
    scene.add(directionalLight);
}

function createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
}


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createMoon(x, y, z) {
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x8c8686, emissive: 0x8c8686, emissiveIntensity: 1 });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}

function addBody(ovni, x, y, z) {
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = currentMaterial.cinzento;
    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.y = 0.3;

    mesh.position.set(x, y, z);
    ovni.add(mesh);
}

function addCockpit(ovni, x, y, z) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = currentMaterial.verde;
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y + 3, z);
    ovni.add(mesh);
}

function addCylinder(ovni, x, y, z) {
    const geometry = new THREE.CylinderGeometry(5, 5, 2, 32);
    const material = currentMaterial.verde;
    const mesh = new THREE.Mesh(geometry, material);

    let spotlightFocus = new THREE.Object3D();
    spotlightFocus.position.set(x, y - 50, z);
    ovni.add(spotlightFocus);

    const spotLight = new THREE.SpotLight(0x04a476, 1);
    spotLight.position.set(x, y - 3.75, z);
    spotLight.target = spotlightFocus;
    mesh.add(spotLight);

    mesh.position.set(x, y - 3.75, z);
    ovni.add(mesh);
}

function addSphere(ovni, x, y, z) {
    const geometry = new THREE.SphereGeometry(0.75, 32, 32);
    const material = currentMaterial.verde;
    const mesh = new THREE.Mesh(geometry, material);

    const pointLight = new THREE.PointLight(0x04a476, 5, 10);
    mesh.add(pointLight);

    mesh.position.set(x, y, z);
    ovni.add(mesh);
}

function createSpheres(ovni, x, y, z) {
    addSphere(ovni, x + 10, y - 4, z);
    addSphere(ovni, x - 10, y - 4, z);
    addSphere(ovni, x, y - 4, z + 10);
    addSphere(ovni, x, y - 4, z - 10);
    addSphere(ovni, x + 6.75, y - 4, z + 6.75);
    addSphere(ovni, x + 6.75, y - 4, z - 6.75);
    addSphere(ovni, x - 6.75, y - 4, z + 6.75);
    addSphere(ovni, x - 6.75, y - 4, z - 6.75);
}

function createOvni(x, y, z) {
    ovni = new THREE.Object3D();
    
    addBody(ovni, x, y, z);
    addCockpit(ovni, x, y, z);
    addCylinder(ovni, x, y, z);
    createSpheres(ovni, x, y, z);

    ovni.position.set(x, y, z);

    scene.add(ovni);
}

function addTroncoPrincipal(sobreiro, x, y, z) {
    const troncoPrinGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
    const troncoPrinMaterial = currentMaterial.castanho;
    const troncoPrinMesh = new THREE.Mesh(troncoPrinGeometry, troncoPrinMaterial);
    troncoPrinMesh.rotation.x = Math.PI / 9;

    troncoPrinMesh.position.set(x, y, z);
    sobreiro.add(troncoPrinMesh);
}

function addTroncoSecundario(sobreiro, x, y, z) {
    const troncoSecGeometry = new THREE.CylinderGeometry(0.5, 0.5, 7, 32);
    const troncoSecMaterial = currentMaterial.castanho;
    const troncoSecMesh = new THREE.Mesh(troncoSecGeometry, troncoSecMaterial);

    troncoSecMesh.position.set(x, y, z);
    troncoSecMesh.rotation.z = - (Math.PI / 6);
    sobreiro.add(troncoSecMesh);

}

function addCopa(sobreiro, x, y, z, rotY) {
    const copaGeometry = new THREE.SphereGeometry(4, 32, 16);
    copaGeometry.scale(1.75, 1, 1);
    const copaMaterial = currentMaterial.verde;
    const copaMesh = new THREE.Mesh(copaGeometry, copaMaterial);
    copaMesh.rotation.y = rotY;

    copaMesh.position.set(x, y, z);
    sobreiro.add(copaMesh);
}

function createCopa(sobreiro, x, y, z) {
    addCopa(sobreiro, x + 4, y + 2, z + 1, Math.PI / 12);
    addCopa(sobreiro, x, y + 2, z, 1, 1);
    addCopa(sobreiro, x + 1, y + 2, z + 4, - Math.PI / 12);
}

function createSobreiro(x, y, z, escala, rot) {
    const sobreiro = new THREE.Object3D();

    sobreiro.position.set(x, y, z);

    addTroncoPrincipal(sobreiro, x, y + 4, z);
    addTroncoSecundario(sobreiro, x + 2, y + 6, z);
    createCopa(sobreiro, x, y + 10, z);
    
    sobreiro.scale.set(escala, escala, escala);
    sobreiro.rotation.y = rot;

    scene.add(sobreiro);
}

function generateSobreiros() {
    for (let i = 0; i < 2; i++) {
        const [x, y, z] = posicoesSobreiros[i];
        const escala = (Math.random() * 1.1) + 0.9;
        const rot = (Math.random() * (2 * Math.PI));
        console.log(`Sobreiro ${i}: x=${Math.round(x)}, y=${0}, z=${Math.round(z)}`);
        createSobreiro(x, y, z, escala, rot);
    }
}

function createJanelas(obj, x,y,z){
    const geometry = new   THREE.BufferGeometry();
    geometry.setIndex(janelasIndex);
    geometry.setAttribute('position', new THREE.BufferAttribute(janelasVerticies, 3));
    geometry.computeVertexNormals();
    const material = currentMaterial.branco;
    const janelas = new THREE.Mesh(geometry, material);
    janelas.position.set(x, y, z);
    obj.add(janelas);
}

function createTelhado(obj, x,y,z){
    const geometry = new   THREE.BufferGeometry();
    geometry.setIndex(telhadoIndex);
    geometry.setAttribute('position', new THREE.BufferAttribute(telhadoVerticies, 3));
    geometry.computeVertexNormals();
    const material = currentMaterial.cinzento;
    const telhado = new THREE.Mesh(geometry, material);
    telhado.position.set(x, y, z);
    //telhado.scale.set(10, 10, 10);
    obj.add(telhado);
}

function createPorta(obj, x,y,z){
    const geometry = new   THREE.BufferGeometry();
    geometry.setIndex(portaIndex);
    geometry.setAttribute('position', new THREE.BufferAttribute(portaVerticies, 3));
    geometry.computeVertexNormals();
    const material = currentMaterial.castanho;
    const porta = new THREE.Mesh(geometry, material);
    porta.position.set(x, y, z);
    obj.add(porta);
}


function createCasa(x, y, z) {
    const geometry = new    THREE.BufferGeometry();
    geometry.setIndex(indexex);
    geometry.setAttribute('position', new THREE.BufferAttribute(verticies, 3));
    geometry.computeVertexNormals();
    const material = currentMaterial.azul;
    const casa = new THREE.Mesh(geometry, material);
    createTelhado(casa, 0, 0, 0);
    createJanelas(casa, 0, 0, 0);
    createPorta(casa, 0, 0, 0);
    casa.position.set(x, y, z);
    casa.scale.set(7, 7, 7);    

    const hitboxCsasa = new THREE.Box3().setFromObject(casa);
    console.log(`xmin: ${hitboxCsasa.min.x}  xmax: ${hitboxCsasa.max.x}`);
    console.log(`zmin: ${hitboxCsasa.min.z}  zmax: ${hitboxCsasa.max.z}`)
    scene.add(casa);
}




//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {}

////////////
/* UPDATE */
////////////
function update() {
    controls.update();

    directionalLight.visible = directionalLightEnabled;

    let delta = clock.getDelta();
    moverOvni(delta);
    rodarOvni(delta);
}

function rodarOvni(delta) {
    r = vRotOvni * delta;
    ovni.rotation.y += r;
}

function moverOvni(delta) {
    d = vOvni * delta;
  
    if (keysPressed[37]) ovni.position.x -= d; // Seta esquerda
    if (keysPressed[38]) ovni.position.z += d; // Seta cima
    if (keysPressed[39]) ovni.position.x += d; // Seta direita
    if (keysPressed[40]) ovni.position.z -= d; // Seta baixo
  }

/////////////
/* DISPLAY */
/////////////
function render() {
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    
    createScene();
    createCamera();
    createLights();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    requestAnimationFrame(animate);

    update();
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////

function setMaterial(material){

}

function onKeyDown(e) {
    switch(e.keyCode) {
        case 68: // D
        case 100: // d
            directionalLightEnabled = !directionalLightEnabled;
            break;

        case 88: // Seta esquerda
            pivot.rotation.y += Math.PI / 18; // 10 graus
            break;
        case 90: // Seta cima
            pivot.rotation.y -= Math.PI / 18; // 10 graus
            break;
        case 86:
            pivot.rotation.z += Math.PI / 18;
            break;
        case 67:
            pivot.rotation.z -= Math.PI / 18;
            break;
        case 81:
        case 113:
            currentMaterial = lambertMaterials;
            break;
        case 87:
        case 120:
            currentMaterial = phongMaterials;
            break;
        case 69:
        case 101:
            currentMaterial = toonMaterials;
            console.log("mudei de material");
            break;
        case 82:
        case 114:
            currentMaterial = basicMaterials;
            break;
        default:
            keysPressed[e.keyCode] = true;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  keysPressed[e.keyCode] = false;
}

init();
animate();