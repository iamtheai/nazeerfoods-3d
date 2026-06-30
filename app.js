/* ============================================
   NAZEER FOODS - 3D SCROLL EXPERIENCE
   app.js - Procedural 3D & GSAP Scroll-Pinning
   ============================================ */

"use strict";

// Register GSAP ScrollTrigger
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// GLOBAL STATE
// ============================================
const STATE = {
  scrollY: 0,
  windowH: window.innerHeight,
  windowW: window.innerWidth,
  isLoaded: false,
  foodScenes: [],
  hasWebGL: false,
  heroScene: null
};

// Check WebGL support
(function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    STATE.hasWebGL = !!gl;
  } catch (e) {
    STATE.hasWebGL = false;
  }
})();

// ============================================
// FOOD DATA - All Best Seller Items
// ============================================
const FOOD_DATA = [
  {
    id: 'mutton-raan',
    name: 'Mutton Raan',
    color: '#8B0000',
    ingredients: ['ðŸ¥©', 'ðŸ§…', 'ðŸ§„', 'ðŸŒ¶ï¸', 'ðŸŒ¸', 'ðŸ¥›']
  },
  {
    id: 'nihari',
    name: 'Mutton Nihari',
    color: '#A0522D',
    ingredients: ['ðŸ¥©', 'ðŸ«š', 'ðŸ§…', 'ðŸŒ¶ï¸', 'ðŸ«š', 'ðŸ«š']
  },
  {
    id: 'lollipop',
    name: 'Chicken Lollipop',
    color: '#CD853F',
    ingredients: ['ðŸ—', 'ðŸ¥š', 'ðŸŒ¶ï¸', 'ðŸ§„', 'ðŸ«š', 'ðŸŒ¿']
  },
  {
    id: 'keema',
    name: 'Chicken Mughlai Keema',
    color: '#B22222',
    ingredients: ['ðŸ”', 'ðŸ§…', 'ðŸ…', 'ðŸŒ¶ï¸', 'ðŸŒ¿', 'ðŸ§„']
  },
  {
    id: 'biryani',
    name: 'Chicken Biryani',
    color: '#DAA520',
    ingredients: ['ðŸ—', 'ðŸš', 'ðŸ§…', 'ðŸŒ¸', 'ðŸŒ¿', 'ðŸ§„']
  },
  {
    id: 'tikka',
    name: 'Chicken Afghani Tikka',
    color: '#D2691E',
    ingredients: ['ðŸ—', 'ðŸ¥›', 'ðŸ§„', 'ðŸŒ¿', 'ðŸ«™', 'ðŸ”¥']
  },
  {
    id: 'tandoori',
    name: 'Tandoori Chicken',
    color: '#CC3300',
    ingredients: ['ðŸ”', 'ðŸ«™', 'ðŸŒ¶ï¸', 'ðŸ§„', 'ðŸŒ¿', 'ðŸ”¥']
  }
];

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
    }
    STATE.isLoaded = true;
    initAll();
  }, 1000);
});

function initAll() {
  initNavbar();
  initGlobalAnimations();
  initHeroParticles();
  initFoodScenes();
  initScrollPinning();
  initGallery();
  initHamburger();
  initCursorEffect();
  if (STATE.hasWebGL && typeof THREE !== 'undefined') {
    initBackgroundCanvas();
    initHeroCanvas();
  }
}

// ============================================
// HERO PARTICLES (CSS-only)
// ============================================
function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * -15) + 's';
    container.appendChild(p);
  }
}

// ============================================
// BACKGROUND CANVAS - Three.js Orbs
// ============================================
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 30;
  const orbs = [];
  const orbGeom = new THREE.SphereGeometry(1, 8, 8);
  for (let i = 0; i < 8; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xC8860A : 0x03355c,
      transparent: true, opacity: Math.random() * 0.05 + 0.02,
      wireframe: true
    });
    const mesh = new THREE.Mesh(orbGeom, mat);
    mesh.scale.setScalar(Math.random() * 4 + 2);
    mesh.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 20 - 10);
    mesh.userData = { rotSpeed: (Math.random() - 0.5) * 0.005, phase: Math.random() * Math.PI * 2 };
    scene.add(mesh); orbs.push(mesh);
  }
  let time = 0;
  (function animateBg() {
    requestAnimationFrame(animateBg);
    time += 0.01;
    orbs.forEach(orb => {
      orb.rotation.x += orb.userData.rotSpeed;
      orb.rotation.y += orb.userData.rotSpeed * 0.5;
      orb.position.y += Math.sin(time * 0.3 + orb.userData.phase) * 0.005;
    });
    camera.position.y = -window.scrollY * 0.003;
    renderer.render(scene, camera);
  })();
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// ============================================
// 3D PROCEDURAL BUILDERS
// ============================================

// Spices
function createStarAnise(THREE) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
  for (let i = 0; i < 8; i++) {
    const geom = new THREE.ConeGeometry(0.12, 0.45, 4);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.z = (i / 8) * Math.PI * 2;
    mesh.position.set(Math.cos((i/8)*Math.PI*2)*0.16, Math.sin((i/8)*Math.PI*2)*0.16, 0);
    mesh.rotation.x = Math.PI / 2;
    group.add(mesh);
  }
  return group;
}

function createCardamom(THREE) {
  const geom = new THREE.SphereGeometry(0.16, 8, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0x8FBC8F, roughness: 0.8 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.scale.set(0.65, 1.25, 0.65);
  return mesh;
}

function createCinnamon(THREE) {
  const geom = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8, 1, true);
  const mat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.9, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function createChili(THREE, colorHex = 0xCC0000) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.25, 0, 0),
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(0.25, 0.08, 0)
  );
  const geom = new THREE.TubeGeometry(curve, 12, 0.05, 6, false);
  const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
  return new THREE.Mesh(geom, mat);
}

function createOnionRing(THREE) {
  const geom = new THREE.TorusGeometry(0.35, 0.05, 6, 20);
  const mat = new THREE.MeshStandardMaterial({ color: 0xDDA0DD, roughness: 0.5 });
  const mesh = new THREE.Mesh(geom, mat);
  return mesh;
}

function createBayLeaf(THREE) {
  const geom = new THREE.SphereGeometry(0.25, 8, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0x556B2F, roughness: 0.9 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.scale.set(0.1, 1.2, 0.5);
  return mesh;
}

const globalTextureLoader = new THREE.TextureLoader();

function createRealIngredient(THREE, path, scale) {
  const texture = globalTextureLoader.load(path);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

function createRiceGrains(THREE, count, rMax, hMax) {
  const geom = new THREE.BufferGeometry();
  const pos = [];
  const color = [];
  const cArray = [new THREE.Color(0xffffff), new THREE.Color(0xF5DEB3), new THREE.Color(0xFFD700)];
  for (let i = 0; i < count; i++) {
    const r = Math.random() * rMax;
    const theta = Math.random() * Math.PI * 2;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const y = (Math.random() - 0.5) * hMax;
    pos.push(x, y, z);
    const col = cArray[Math.floor(Math.random() * cArray.length)];
    color.push(col.r, col.g, col.b);
  }
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  return new THREE.Points(geom, new THREE.PointsMaterial({ size: 0.07, vertexColors: true }));
}

// Custom Dishes
function buildMuttonRaanModel(THREE) {
  const group = new THREE.Group();
  // Leg Bone
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 });
  const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8), boneMat);
  bone.rotation.z = Math.PI / 4;
  group.add(bone);
  const boneEnd1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), boneMat);
  boneEnd1.position.set(-0.8, -0.8, 0); group.add(boneEnd1);
  const boneEnd2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), boneMat);
  boneEnd2.position.set(0.8, 0.8, 0); group.add(boneEnd2);

  // Leg Meat
  const meat = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x8B3E2F, roughness: 0.8 })
  );
  meat.scale.set(1.5, 0.7, 0.9);
  meat.rotation.z = Math.PI / 4;
  group.add(meat);
  return group;
}

function buildMuttonNihariModel(THREE) {
  const group = new THREE.Group();
  // Bowl
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 0.8, 0.6, 16, 1, false),
    new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.3, roughness: 0.6 })
  );
  group.add(bowl);
  // Soup Liquid Surface
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x8B1A1A, roughness: 0.1, metalness: 0.2 })
  );
  liquid.position.y = 0.25;
  group.add(liquid);
  // Meat chunk bone
  const bone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
  );
  bone.position.set(0.2, 0.4, 0);
  bone.rotation.z = -Math.PI / 6;
  group.add(bone);
  return group;
}

function buildChickenLollipopModel(THREE) {
  const group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const lol = new THREE.Group();
    const bone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
    );
    lol.add(bone);
    const meat = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xB22222, roughness: 0.7 })
    );
    meat.position.y = 0.45;
    lol.add(meat);
    lol.rotation.z = (i - 1) * 0.4;
    lol.position.set((i - 1) * 0.6, -0.3, 0);
    group.add(lol);
  }
  return group;
}

function buildKeemaModel(THREE) {
  const group = new THREE.Group();
  // Handi Bowl
  const handi = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 0.9, 0.7, 16),
    new THREE.MeshStandardMaterial({ color: 0xCD7F32, metalness: 0.6, roughness: 0.3 })
  );
  group.add(handi);
  // Minced meat (particles)
  const keemaParticles = createRiceGrains(THREE, 180, 1.1, 0.2);
  keemaParticles.position.y = 0.28;
  group.add(keemaParticles);
  return group;
}

function buildBiryaniModel(THREE) {
  const group = new THREE.Group();
  // Platter
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.0, 0.1, 24),
    new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8, roughness: 0.2 })
  );
  plate.position.y = -0.3;
  group.add(plate);
  // Rice
  const rice = createRiceGrains(THREE, 450, 1.2, 0.35);
  rice.position.y = -0.15;
  group.add(rice);
  // Chicken Pieces
  const meat = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x8B3A3A, roughness: 0.8 })
  );
  meat.scale.set(1.4, 0.8, 0.8);
  meat.position.set(0.3, 0.05, 0.2);
  group.add(meat);
  return group;
}

function buildTikkaModel(THREE) {
  const group = new THREE.Group();
  // Skewer
  const skewer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 2.6, 8),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 })
  );
  skewer.rotation.z = Math.PI / 4;
  group.add(skewer);
  // Tikka cubes
  const tikkaMat = new THREE.MeshStandardMaterial({ color: 0xEECC99, roughness: 0.8 });
  for (let i = 0; i < 4; i++) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), tikkaMat);
    const pos = (i - 1.5) * 0.5;
    mesh.position.set(pos * Math.cos(Math.PI/4), pos * Math.sin(Math.PI/4), 0);
    mesh.rotation.y = i * 0.4;
    mesh.rotation.x = i * 0.2;
    group.add(mesh);
  }
  return group;
}

function buildTandooriModel(THREE) {
  const group = new THREE.Group();
  // Slate plate
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.1, 0.08, 20),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
  );
  plate.position.y = -0.4;
  group.add(plate);
  // Chicken leg piece
  const tandooriLeg = new THREE.Group();
  const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
  bone.position.y = -0.4;
  tandooriLeg.add(bone);
  const meat = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), new THREE.MeshStandardMaterial({ color: 0xD02010, roughness: 0.7 }));
  meat.scale.set(1, 1.4, 0.8);
  tandooriLeg.add(meat);
  tandooriLeg.rotation.z = -Math.PI / 6;
  tandooriLeg.position.y = -0.15;
  group.add(tandooriLeg);
  return group;
}

// ============================================
// HERO PLATTTER - Upgraded Royal 3D Showcase
// ============================================
function initHeroCanvas() {
  const container = document.querySelector('.hero-3d-container');
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !container) return;
  const w = container.offsetWidth || 600;
  const h = container.offsetHeight || window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 5, 12);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xfff5e6, 0.6));
  const spot = new THREE.SpotLight(0xffd700, 3, 50, Math.PI / 3, 0.4, 1);
  spot.position.set(5, 12, 8); scene.add(spot);
  const dirLight1 = new THREE.DirectionalLight(0x4488ff, 0.5);
  dirLight1.position.set(-5, 4, -4);
  scene.add(dirLight1);
  const dirLight2 = new THREE.DirectionalLight(0xD4AF37, 1.0);
  dirLight2.position.set(0, -3, -5);
  scene.add(dirLight2);

  const heroWrapper = new THREE.Group();
  scene.add(heroWrapper);

  const group = new THREE.Group();
  heroWrapper.add(group);

  // Load Photorealistic Chicken Leg Image as a Sprite
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('chicken_leg_alpha.png', (texture) => {
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    // Scale it to be large ("bada sa")
    sprite.scale.set(7, 7, 1);
    
    // Place slightly higher
    sprite.position.y = 0.5;
    
    group.add(sprite);
  }, undefined, (error) => {
    console.error('Error loading sprite:', error);
  });

  const floatingItems = [];
  const ingredients = [
    createRealIngredient(THREE, 'clove_alpha.png', 2.0),
    createRealIngredient(THREE, 'clove_alpha.png', 1.8),
    createRealIngredient(THREE, 'clove_alpha.png', 2.2),
    createRealIngredient(THREE, 'tomato_alpha.png', 3.5),
    createRealIngredient(THREE, 'tomato_alpha.png', 2.8),
    createRealIngredient(THREE, 'chili_alpha.png', 3.0),
    createRealIngredient(THREE, 'chili_alpha.png', 2.6)
  ];
  
  ingredients.forEach((item, i) => {
    const radius = 2.8 + Math.random() * 0.8;
    const theta = (i / ingredients.length) * Math.PI * 2; // evenly distributed
    const phi = Math.PI / 2 + (Math.random() - 0.5) * 1.2; // mostly around the middle
    item.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi), // Y axis
      radius * Math.sin(phi) * Math.sin(theta)  // Z axis
    );
    item.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 1.0 + Math.random() * 0.5;
    item.scale.set(s, s, s);
    item.userData = {
      thetaOffset: Math.random() * Math.PI * 2,
      bobSpeed: 0.02 + Math.random() * 0.02,
      rz: (Math.random() - 0.5) * 0.02,
      baseY: item.position.y
    };
    floatingItems.push(item);
    group.add(item);
  });

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // GSAP animation for smooth scrolling rotation and parallax
  gsap.to(heroWrapper.rotation, {
    y: Math.PI * 1.5,
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });
  gsap.to(heroWrapper.position, {
    y: 1.5,
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  let time = 0;
  (function anim() {
    requestAnimationFrame(anim);
    time += 0.01;
    // Slow float
    group.position.y = Math.sin(time * 0.7) * 0.18;
    // Mouse react tilt
    group.rotation.x += (-mouseY * 0.1 - group.rotation.x + 0.3) * 0.05;
    group.rotation.y += (mouseX * 0.1 - group.rotation.y) * 0.05;

    floatingItems.forEach(item => {
      item.userData.thetaOffset += item.userData.bobSpeed;
      item.position.y = item.userData.baseY + Math.sin(item.userData.thetaOffset) * 0.4;
      if (item.material) item.material.rotation += item.userData.rz;
    });

    renderer.render(scene, camera);
  })();

  STATE.heroScene = { scene, camera, renderer, group };
  
  window.addEventListener('resize', () => {
    const nw = container.offsetWidth || 600;
    const nh = container.offsetHeight || window.innerHeight;
    renderer.setSize(nw, nh);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  });
}

// ============================================
// FOOD SCENES - Scroll Pinned Disassembly
// ============================================
function initFoodScenes() {
  FOOD_DATA.forEach((food, index) => {
    const stageEl = document.getElementById('food-stage-' + index);
    if (!stageEl) return;

    // Glow ring
    const glow = stageEl.querySelector('.food-glow-ring') || document.createElement('div');
    if (!stageEl.querySelector('.food-glow-ring')) {
      glow.className = 'food-glow-ring';
      glow.style.background = `radial-gradient(ellipse, ${food.color}60, transparent 70%)`;
      stageEl.appendChild(glow);
    }

    // Static Fallback Image from HTML
    const img = stageEl.querySelector('.food-real-img');
    const fallback = stageEl.querySelector('.food-emoji-fallback');
    
    const sceneObj = {
      index,
      food,
      img,
      fallback,
      pieces: [],
      glow,
      webgl: null,
      fallbackActive: false,
      progress: 0
    };

    if (img) {
      const handleImageError = () => {
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
        sceneObj.fallbackActive = true;
      };
      
      // Manual check if already loaded and failed
      if (img.complete && img.naturalWidth === 0) {
        handleImageError();
      } else {
        img.addEventListener('error', handleImageError);
      }
    }

    sceneObj.pieces = [];

    let webglObj = null;
    sceneObj.webgl = webglObj;

    STATE.foodScenes.push(sceneObj);
  });
}

// Set up detailed procedural 3D model inside the food item canvas
function setupFoodWebGL(food, index, stageEl) {
  const canvas = document.getElementById('food-canvas-' + index);
  if (!canvas) return null;
  
  const w = stageEl.offsetWidth || 400;
  const h = stageEl.offsetHeight || 550;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(w, h);
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 0, 7.5);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xfff0dd, 1.0);
  light.position.set(3, 4, 5);
  scene.add(light);
  
  // Custom dish mesh groups
  let mainDishGroup;
  switch (food.id) {
    case 'mutton-raan':
      mainDishGroup = buildMuttonRaanModel(THREE);
      break;
    case 'nihari':
      mainDishGroup = buildMuttonNihariModel(THREE);
      break;
    case 'lollipop':
      mainDishGroup = buildChickenLollipopModel(THREE);
      break;
    case 'keema':
      mainDishGroup = buildKeemaModel(THREE);
      break;
    case 'biryani':
      mainDishGroup = buildBiryaniModel(THREE);
      break;
    case 'tikka':
      mainDishGroup = buildTikkaModel(THREE);
      break;
    case 'tandoori':
      mainDishGroup = buildTandooriModel(THREE);
      break;
    default:
      mainDishGroup = new THREE.Mesh(new THREE.DodecahedronGeometry(1), new THREE.MeshStandardMaterial({ color: 0x8b0000 }));
  }
  scene.add(mainDishGroup);

  // Procedural 3D Ingredients
  const ingredientsGroup = new THREE.Group();
  scene.add(ingredientsGroup);

  const ingredientModels = [
    createStarAnise(THREE),
    createCardamom(THREE),
    createCinnamon(THREE),
    createChili(THREE),
    createOnionRing(THREE),
    createBayLeaf(THREE)
  ];

  const activeIngredientMeshes = [];
  food.ingredients.forEach((emoji, i) => {
    const model = (ingredientModels[i % ingredientModels.length]).clone();
    // Start at center
    model.position.set(0, 0, 0);
    model.scale.setScalar(0.001);
    
    // Assign scatter target vectors in 3D
    const theta = (i / food.ingredients.length) * Math.PI * 2;
    const phi = (Math.random() - 0.5) * 0.5;
    const speed = 2.4 + Math.random() * 0.6;
    const scatterDir = new THREE.Vector3(Math.cos(theta) * speed, Math.sin(theta) * speed, Math.sin(phi) * 1.5);
    
    model.userData = { scatterDir, baseScale: 1.0 + Math.random() * 0.2 };
    ingredientsGroup.add(model);
    activeIngredientMeshes.push(model);
  });

  let time = 0;
  function anim() {
    requestAnimationFrame(anim);
    time += 0.01;
    // Rotate dish mesh slowly
    mainDishGroup.rotation.y = time * 0.2;
    // Keep rendering
    renderer.render(scene, camera);
  }
  anim();

  return { scene, camera, renderer, mainDishGroup, activeIngredientMeshes };
}

// ============================================
// GSAP SCROLL-PINNING INITIALIZATION
// ============================================
function initScrollPinning() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initScrollListenerFallback(); // Fallback if GSAP fails
    return;
  }

  STATE.foodScenes.forEach((scene, index) => {
    const sceneEl = document.querySelector(`.food-scene[data-item="${index}"]`);
    if (!sceneEl) return;

    if (window.innerWidth <= 768) {
      // Mobile: Disable scroll pinning, auto animate disassembly in a loop
      gsap.to(scene, {
        progress: 1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: () => {
          updateDisassemblyProgress(scene, scene.progress);
        }
      });
    } else {
      // Desktop: Scroll tied disassembly with pinning
      gsap.timeline({
        scrollTrigger: {
          trigger: sceneEl,
          start: "top top",
          end: "+=160%",  // Pin height - locks scroll during disassembly
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            updateDisassemblyProgress(scene, self.progress);
          }
        }
      });
    }
  });
}

function updateDisassemblyProgress(scene, progress) {
  scene.progress = progress;
  
  // 1. Text & Layout animations (smooth opacity of details)
  const chips = document.querySelectorAll(`.food-scene[data-item="${scene.index}"] .ingredient-chip`);
  chips.forEach((chip, i) => {
    const threshold = i / chips.length * 0.6;
    if (progress > threshold) {
      chip.classList.add('visible');
    } else {
      chip.classList.remove('visible');
    }
  });

  // 2. WebGL 3D Disassembly
  if (scene.webgl) {
    // Hide fallback flat image & fallback emoji
    if (scene.img) scene.img.style.opacity = '0';
    if (scene.fallback) scene.fallback.style.opacity = '0';
    
    // Scale and rotate main dish
    const mainScale = 1 - progress * 0.25;
    scene.webgl.mainDishGroup.scale.setScalar(mainScale);
    scene.webgl.mainDishGroup.rotation.x = progress * 1.5;
    scene.webgl.mainDishGroup.rotation.z = progress * 0.8;
    
    // Disassemble ingredients
    scene.webgl.activeIngredientMeshes.forEach(mesh => {
      const dir = mesh.userData.scatterDir;
      // Fly out
      mesh.position.copy(dir).multiplyScalar(progress);
      // Scale up from 0 to normal size, then float
      const scale = progress < 0.15 ? (progress / 0.15) : 1;
      mesh.scale.setScalar(scale * mesh.userData.baseScale);
      // Spin
      mesh.rotation.x = progress * 4;
      mesh.rotation.y = progress * 6;
    });
  } else {
    // 3. CSS/DOM Parallax - Real image stays, emojis fly out in 3D-like parallax
    const targetElement = scene.fallbackActive ? scene.fallback : scene.img;
    const oppositeElement = scene.fallbackActive ? scene.img : scene.fallback;

    if (oppositeElement) oppositeElement.style.display = 'none';

    if (targetElement) {
      targetElement.style.display = 'block';
      targetElement.style.opacity = '1';
      // Give it a smooth 3D-like float effect as we scroll
      targetElement.style.transform = `translate(-50%, calc(-50% - ${progress * 30}px)) scale(${1 - progress * 0.1}) rotate(${progress * 8}deg)`;
      // Add dynamic shadow
      targetElement.style.filter = `drop-shadow(0 ${10 + progress*15}px ${20 + progress*20}px rgba(0,0,0,0.5))`;
    }

    // (Ingredients pieces loop removed to avoid corrupted characters)
  }

  // Glow ring scale/opacity mapping
  if (scene.glow) {
    const scaleFactor = 0.5 + progress * 1.5;
    scene.glow.style.opacity = (1 - progress) * 0.7;
    scene.glow.style.transform = `translateX(-50%) scaleX(${scaleFactor})`;
  }
}

// Global scroll listener for animations
function initGlobalAnimations() {
  window.addEventListener('scroll', () => {
    STATE.scrollY = window.scrollY;
    triggerAnimateElements();
  }, { passive: true });
  // Initial check
  setTimeout(triggerAnimateElements, 100);
}

// Fallback scroll listener if GSAP/ScrollTrigger fails to load
function initScrollListenerFallback() {
  window.addEventListener('scroll', () => {
    // Fallback progress calculate based on visibility
    STATE.foodScenes.forEach(scene => {
      const stage = document.getElementById('food-stage-' + scene.index);
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const vh = window.innerHeight;
      
      let progress = 0;
      if (centerY < vh && centerY > 0) {
        progress = 1 - (centerY / vh);
      } else if (centerY <= 0) {
        progress = 1;
      }
      
      updateDisassemblyProgress(scene, progress);
    });
  }, { passive: true });
}

// ============================================
// NAVBAR ACTIVE STATE & ANIMATIONS
// ============================================
function initNavbar() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const sections = ['home', 'about', 'menu', 'experience', 'contact'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 140) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }, { passive: true });
}

function triggerAnimateElements() {
  document.querySelectorAll('[data-animate]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
      el.classList.add('animated');
    }
  });
}

// ============================================
// OTHER FEATURES
// ============================================

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('open');
  });
}

function initGallery() {
  const track = document.getElementById('gallery-track');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }
}

function initCursorEffect() {
  if (window.innerWidth <= 768) return;
  
  // Hide default cursor globally for a true custom feel
  document.body.style.cursor = 'none';
  const style = document.createElement('style');
  style.innerHTML = `* { cursor: none !important; }`;
  document.head.appendChild(style);

  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  // Custom SVG Clove (Laung)
  dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));">
    <path fill="#8B4513" d="M11 5 L9 2 L12 0 L15 2 L13 5 L14 22 C14 23.1 13.1 24 12 24 C10.9 24 10 23.1 10 22 L11 5 Z" />
    <circle fill="#3E2723" cx="12" cy="1" r="1.5" />
    <circle fill="#3E2723" cx="9" cy="3" r="1.5" />
    <circle fill="#3E2723" cx="15" cy="3" r="1.5" />
  </svg>`;
  dot.style.cssText = `
    position:fixed; width:28px; height:28px; 
    pointer-events:none; z-index:10000; transform:translate(-50%,-50%) rotate(45deg);
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position:fixed; width:44px; height:44px; border-radius:50%;
    border: 2px solid rgba(212,175,55,0.7); pointer-events:none;
    z-index:9998; transform:translate(-50%,-50%); 
    transition: transform 0.2s ease, background-color 0.2s ease;
  `;
  
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  
  let dotX = window.innerWidth / 2;
  let dotY = window.innerHeight / 2;
  let rx = dotX, ry = dotY;
  
  document.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
  });

  // Snappy animation loop for the circle to run fast
  const updateCursor = () => {
    rx += (dotX - rx) * 0.35; // Increased speed (was 0.18)
    ry += (dotY - ry) * 0.35;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);

  document.querySelectorAll('a, button, .food-3d-stage, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) rotate(225deg) scale(1.3)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.2)';
      ring.style.backgroundColor = 'rgba(212,175,55,0.15)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.backgroundColor = 'transparent';
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
  });
});

console.log('%cðŸ› Nazeer Foods 3D Engine Initiated! WebGL: ' + STATE.hasWebGL,
  'background:#C8860A;color:#fff;padding:5px 12px;border-radius:4px;font-size:13px;font-weight:bold;');
