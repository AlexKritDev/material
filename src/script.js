import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import * as dat from 'dat.gui'

const gui = new dat.GUI();


//texture

// const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader
    .setPath('/textures/environmentMaps/3/')
    .load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg',
    ])


const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png');
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png');
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png');
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png');
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png');
const gradientTexture3 = textureLoader.load('/textures/gradients/3.jpg');
const gradientTexture5 = textureLoader.load('/textures/gradients/5.jpg');
const alpaDoorTexture = textureLoader.load('/textures/door/alpha.jpg');
const ambientOcclusionDoorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const colorDoorTexture = textureLoader.load('/textures/door/color.jpg');
const heightDoorTexture = textureLoader.load('/textures/door/height.jpg');
const metalnessDoorTexture = textureLoader.load('/textures/door/metalness.jpg');
const normalDoorTexture = textureLoader.load('/textures/door/normal.jpg');
const roughnessDoorTexture = textureLoader.load('/textures/door/roughness.jpg');

// const material = new THREE.MeshBasicMaterial();
// material.map = matcapTexture1
// material.color = new THREE.Color('pink')
// material.color.set('#ff00ff')
// material.color.set('lightgreen')
// material.wireframe = true;
// material.opacity = .5;
// material.transparent = true;

// material.transparent = true;
// material.alphaMap = alpaDoorTexture;

// material.side= THREE.DoubleSide;


// const material = new THREE.MeshNormalMaterial()
// material.flatShading= true;


// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture5;

// элементы дальше от камеры темнее
// const material = new THREE.MeshDepthMaterial()

//
// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000;
// material.specular = new THREE.Color('green')

// const material = new THREE.MeshToonMaterial();
// gradientTexture3.minFilter = THREE.NearestFilter;
// gradientTexture3.magFilter = THREE.NearestFilter;
// material.gradientMap = gradientTexture5;
// gradientTexture5.minFilter = THREE.NearestFilter;
// gradientTexture5.magFilter = THREE.NearestFilter;
// gradientTexture5.generateMipmaps = false;


// const material = new THREE.MeshStandardMaterial()
// material.metalness = .45;
// material.roughness = .15;
//
// material.map = colorDoorTexture;
// material.aoMap = ambientOcclusionDoorTexture;
// material.aoMapIntensity = 1
// material.displacementMap = heightDoorTexture;
// // material.wireframe = true;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessDoorTexture;
// material.roughnessMap = roughnessDoorTexture;
//
// material.normalMap = normalDoorTexture
//
// material.normalScale.set(.5, .5);
//
// material.transparent = true;
// material.alphaMap = alpaDoorTexture;

const material = new THREE.MeshStandardMaterial()
material.metalness = .7;
material.roughness = .0;
material.envMap = environmentMapTexture;

gui.add(material, 'metalness', 0, 1, 0.0001)
gui.add(material, 'roughness', 0, 1, 0.0001)
gui.add(material, 'aoMapIntensity', 0, 15, 0.1)
gui.add(material, 'displacementScale', 0, 1, 0.001)
gui.add(material, 'wireframe')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = environmentMapTexture
// object
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), material)
sphere.position.set(-1.5, 0);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 20, 20), material)

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(.5, .2, 64, 128), material)
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

torus.position.set(1.5, 0);
scene.add(sphere, plane, torus)
//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, .5)
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update objects

    sphere.rotation.y = .1 * elapsedTime;
    torus.rotation.y = .1 * elapsedTime;
    plane.rotation.y = .1 * elapsedTime;
    sphere.rotation.x = .2 * elapsedTime;
    torus.rotation.x = .2 * elapsedTime;
    plane.rotation.x = .2 * elapsedTime;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()