import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class MagneticFieldVisualizer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.container = document.getElementById('scene-container');
        this.fieldLines = [];
        this.particles = [];
        this.compass = null;

        // Current properties
        this.currentMagnitude = 10;
        this.currentDirection = new THREE.Vector3(0, 1, 0);
        
        this.setupScene();
        this.setupLights();
        this.createWire();
        this.createFieldLines();
        this.createCompass();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
        this.updateInfoDisplay();
    }

    setupScene() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x1a1a1a);
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.set(15, 15, 15);
        this.camera.lookAt(0, 0, 0);

        // Add axes helper
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);
        this.axesHelper = axesHelper;
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    createWire() {
        // Create wire geometry
        const wireGeometry = new THREE.CylinderGeometry(0.2, 0.2, 20, 32);
        const wireMaterial = new THREE.MeshPhongMaterial({ color: 0xff6d00 });
        this.wire = new THREE.Mesh(wireGeometry, wireMaterial);
        
        // Create arrow for current direction
        const arrowGeometry = new THREE.ConeGeometry(0.4, 1, 32);
        const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        this.arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrow.position.y = 10;

        // Group wire and arrow
        this.wireGroup = new THREE.Group();
        this.wireGroup.add(this.wire);
        this.wireGroup.add(this.arrow);
        this.scene.add(this.wireGroup);
    }

    createFieldLines() {
        const radius = 5;
        const segments = 64;
        const rings = 10;
        const particlesPerRing = 30;

        for (let i = -rings/2; i < rings/2; i++) {
            const curve = new THREE.EllipseCurve(
                0, 0,
                radius, radius,
                0, 2 * Math.PI,
                false,
                0
            );

            const points = curve.getPoints(segments);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x2962ff,
                transparent: true,
                opacity: 0.7
            });
            
            const ellipse = new THREE.Line(geometry, material);
            ellipse.position.y = i * 2;
            ellipse.rotation.x = Math.PI / 2;
            
            this.fieldLines.push(ellipse);
            this.scene.add(ellipse);

            // Add particles
            for (let j = 0; j < particlesPerRing; j++) {
                const angle = (j / particlesPerRing) * Math.PI * 2;
                const particle = this.createParticle();
                particle.position.set(
                    Math.cos(angle) * radius,
                    i * 2,
                    Math.sin(angle) * radius
                );
                this.particles.push(particle);
                this.scene.add(particle);
            }
        }
    }

    createParticle() {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x2962ff,
            emissive: 0x2962ff,
            emissiveIntensity: 0.5
        });
        return new THREE.Mesh(geometry, material);
    }

    createCompass() {
        const radius = 8;
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        
        this.compass = new THREE.Group();
        
        // Create compass points
        const positions = [
            [radius, 0, 0], [-radius, 0, 0], // X axis
            [0, radius, 0], [0, -radius, 0], // Y axis
            [0, 0, radius], [0, 0, -radius]  // Z axis
        ];
        
        const colors = [0xff0000, 0xff0000, 0x00ff00, 0x00ff00, 0x0000ff, 0x0000ff];
        
        positions.forEach((pos, i) => {
            const point = new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({ color: colors[i] })
            );
            point.position.set(...pos);
            this.compass.add(point);
        });

        this.scene.add(this.compass);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());

        // Current magnitude control
        document.getElementById('currentMagnitude').addEventListener('input', (e) => {
            this.currentMagnitude = parseFloat(e.target.value);
            this.updateCurrentVisualization();
        });

        // Current direction controls
        ['X', 'Y', 'Z'].forEach(axis => {
            document.getElementById(`current${axis}`).addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.currentDirection[axis.toLowerCase()] = value;
                document.getElementById(`current${axis}Value`).textContent = value.toFixed(1);
                this.updateCurrentVisualization();
            });
        });

        // Visualization toggles
        document.getElementById('showFieldLines').addEventListener('change', (e) => {
            this.fieldLines.forEach(line => line.visible = e.target.checked);
        });

        document.getElementById('showParticles').addEventListener('change', (e) => {
            this.particles.forEach(particle => particle.visible = e.target.checked);
        });

        document.getElementById('showAxes').addEventListener('change', (e) => {
            this.axesHelper.visible = e.target.checked;
        });

        document.getElementById('showCompass').addEventListener('change', (e) => {
            this.compass.visible = e.target.checked;
        });

        // Camera controls
        document.getElementById('resetCamera').addEventListener('click', () => {
            this.camera.position.set(15, 15, 15);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        });

        document.getElementById('topView').addEventListener('click', () => {
            this.camera.position.set(0, 20, 0);
            this.camera.lookAt(0, 0, 0);
            this.controls.update();
        });

        document.getElementById('sideView').addEventListener('click', () => {
            this.camera.position.set(20, 0, 0);
            this.camera.lookAt(0, 0, 0);
            this.controls.update();
        });

        // Tutorial
        document.getElementById('closeTutorial').addEventListener('click', () => {
            document.getElementById('tutorial').style.display = 'none';
        });
    }

    updateCurrentVisualization() {
        // Normalize current direction
        this.currentDirection.normalize();

        // Update wire orientation
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.currentDirection);
        this.wireGroup.setRotationFromQuaternion(quaternion);

        // Update wire and particles scale based on current magnitude
        const scale = 0.5 + (this.currentMagnitude / 20) * 0.5;
        this.wire.scale.set(scale, 1, scale);
        this.particles.forEach(particle => {
            particle.scale.setScalar(scale);
        });

        // Update field line opacity based on current magnitude
        const opacity = this.currentMagnitude / 20;
        this.fieldLines.forEach(line => {
            line.material.opacity = opacity * 0.7;
        });

        this.updateInfoDisplay();
    }

    updateInfoDisplay() {
        // Update current vector display
        const vector = this.currentDirection.clone().multiplyScalar(this.currentMagnitude);
        document.getElementById('currentVector').textContent = 
            `(${vector.x.toFixed(1)}, ${vector.y.toFixed(1)}, ${vector.z.toFixed(1)})`;

        // Update field strength display
        let strength;
        if (this.currentMagnitude < 5) strength = "Weak";
        else if (this.currentMagnitude < 10) strength = "Moderate";
        else if (this.currentMagnitude < 15) strength = "Strong";
        else strength = "Very Strong";
        document.getElementById('fieldStrength').textContent = strength;

        // Update field direction
        document.getElementById('fieldDirection').textContent = 
            this.currentDirection.y > 0 ? "Counter-Clockwise" : "Clockwise";

        // Update current magnitude display
        document.getElementById('currentValue').textContent = `${this.currentMagnitude.toFixed(1)} A`;
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate particles around the wire
        const speed = document.getElementById('animationSpeed').value / 1000;
        this.particles.forEach((particle, i) => {
            const radius = Math.sqrt(particle.position.x ** 2 + particle.position.z ** 2);
            const angle = Math.atan2(particle.position.z, particle.position.x);
            const newAngle = angle + (this.currentDirection.y > 0 ? speed : -speed);
            
            particle.position.x = radius * Math.cos(newAngle);
            particle.position.z = radius * Math.sin(newAngle);
        });

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('load', () => {
    new MagneticFieldVisualizer();
});
