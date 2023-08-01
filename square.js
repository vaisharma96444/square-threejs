const canvas = document.getElementById('canvasId');

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#1a1a3cff');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 35);
camera.lookAt(0, 0, 0);
scene.add(camera);

const boxesGroup = new THREE.Group();
scene.add(boxesGroup);

const gridSize = 50;
const boxSize = 0.8;
const gridSpacing = 0.9;
const boxes = [];

function createBox(x, y) {
    const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2)
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.x = (x - gridSize / 2) * gridSpacing;
    box.position.y = (y - gridSize / 2) * gridSpacing;
    boxesGroup.add(box);
    boxes.push(box);
}

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        createBox(i, j);
    }
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

canvas.addEventListener('mousedown', onBoxMouseDown, false);
canvas.addEventListener('mouseup', onBoxMouseUp, false);
canvas.addEventListener('mousemove', onBoxMouseMove, false);
canvas.addEventListener('touchstart', onBoxTouchStart, false);
canvas.addEventListener('touchend', onBoxTouchEnd, false);
canvas.addEventListener('touchmove', onBoxTouchMove, false);

function onBoxMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
    };
}

function onBoxMouseUp(event) {
    isDragging = false;
}

function onBoxMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        boxesGroup.rotation.x += deltaY * 0.01;
        boxesGroup.rotation.y += deltaX * 0.01;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
        };
    }
}

function onBoxTouchStart(event) {
    if (event.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
    }
}

function onBoxTouchEnd(event) {
    isDragging = false;
}

function onBoxTouchMove(event) {
    if (isDragging && event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - previousMousePosition.x;
        const deltaY = event.touches[0].clientY - previousMousePosition.y;

        boxesGroup.rotation.x += deltaY * 0.01;
        boxesGroup.rotation.y += deltaX * 0.01;

        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
    }
}

function updateColors() {
    boxes.forEach(box => {
        box.material.color.setRGB(Math.random() * 0.9 + 0.1, Math.random() * 0.9 + 0.1, Math.random() * 0.9 + 0.1);
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateColors();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
