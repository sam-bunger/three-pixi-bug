import * as THREE from "three";
import * as PIXI from "pixi.js";
import image from "./image_with_alpha.png";
import { LinearSRGBColorSpace } from "three";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const initializeThree = () => {
  const threeRenderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: true,
    stencil: true,
    depth: false,
    premultipliedAlpha: false,
    alpha: false,
  });
  threeRenderer.toneMappingExposure = 1.5
  threeRenderer.localClippingEnabled = true
  threeRenderer.shadowMap.autoUpdate = false
  threeRenderer.info.autoReset = false
  threeRenderer.sortObjects = false
  threeRenderer.outputColorSpace = LinearSRGBColorSpace


  threeRenderer.setSize(WIDTH, HEIGHT);
  threeRenderer.setClearColor(0xffffff, 1);
  document.body.appendChild(threeRenderer.domElement);

  return threeRenderer;
};

const initializePixi = async (three: THREE.WebGLRenderer) => {
  const pixiRenderer = new PIXI.WebGLRenderer();

  const context = three.getContext();

  if (!context)
    throw new Error(
      "Pixi cannot be initialized, three.js rendering context not available"
    );
  else if (!(context instanceof WebGL2RenderingContext))
    throw new Error("Pixi requires a WebGL2 rendering context");

  await pixiRenderer.init({
    context,
    width: WIDTH,
    height: HEIGHT,
    clearBeforeRender: false, // Prevent PixiJS from clearing the Three.js render
  });

  return pixiRenderer;
};

const three = initializeThree();
initializePixi(three).then(async (pixi) => {
  // Set Up Three
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.z = 50;
  scene.add(camera);

  const boxGeometry1 = new THREE.BoxGeometry(10, 10, 10);
  const basicMaterial1 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });

  const cube1 = new THREE.Mesh(boxGeometry1, basicMaterial1);
  cube1.rotation.set(0.4, 0.2, 0);
  scene.add(cube1);

  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const basicMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    vertexColors: true,    
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    forceSinglePass: true,
    depthWrite: false,
  });
  const cube = new THREE.Mesh(boxGeometry, basicMaterial);
  cube.rotation.set(0.4, 0.2, 0);
  scene.add(cube);

  const graphics = new PIXI.Graphics();
  graphics.fill(0xFF3300);
  graphics.rect(50, 250, 500, 100);
  graphics.endFill();

  // Set up Pixi
  const stage = new PIXI.Container();
  stage.addChild(graphics);


  const spriteContainer = new PIXI.Container();
  stage.addChild(spriteContainer);

  // Load the texture and create a sprite
  const texture = await PIXI.Assets.load(image);
  const sprite = new PIXI.Sprite(texture);

  // Optional: adjust sprite properties as needed
  spriteContainer.x = 250;
  spriteContainer.y = 250;
  sprite.scale.set(0.5);


  spriteContainer.addChild(sprite);

  spriteContainer.mask = graphics;

    // stage.addChild(graphics);

  function render() {
    sprite.x += Math.sin(Date.now() * 0.001) * 2;
    sprite.y += Math.cos(Date.now() * 0.001) * 2;

    cube.rotation.x += Math.sin(Date.now() * 0.001) * 0.01;
    cube.rotation.y += Math.cos(Date.now() * 0.001) * 0.01;

    // Render the Three.js scene
    three.resetState();
    three.render(scene, camera);

    // Render the PixiJS stage  
    pixi.resetState();
    pixi.render(stage);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
