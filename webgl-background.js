// WebGL Background - Adapted from DecorativeBackgrounds Demo 6
class WebGLBackground {
    constructor() {
        this.canvas = document.querySelector('#webgl-scene');
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        
        this.init();
        this.createSphere();
        this.animate();
        this.setupResize();
    }
    
    init() {
        // Initialize Three.js renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x191919, 1);
        
        // Create scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 280);
    }
    
    createSphere() {
        // Create sphere group
        this.sphere = new THREE.Group();
        this.scene.add(this.sphere);
        
        // Materials for the lines
        this.mat1 = new THREE.LineBasicMaterial({
            color: 0x4a4a4a,
            transparent: true,
            opacity: 0.6
        });
        this.mat2 = new THREE.LineBasicMaterial({
            color: 0x667eea, // Match our brand color
            transparent: true,
            opacity: 0.8
        });
        
        // Sphere parameters
        this.radius = 100;
        this.lines = 50;
        this.dots = 50;
        
        // Create animated lines
        for(let i = 0; i < this.lines; i++) {
            const geometry = new THREE.Geometry();
            const line = new THREE.Line(geometry, (Math.random() > 0.3) ? this.mat1 : this.mat2);
            
            // Line properties
            line.speed = Math.random() * 300 + 250;
            line.wave = Math.random();
            line.radius = Math.floor(this.radius + (Math.random() - 0.5) * (this.radius * 0.2));
            
            // Create line vertices
            for(let j = 0; j < this.dots; j++) {
                const x = ((j / this.dots) * line.radius * 2) - line.radius;
                const vector = new THREE.Vector3(x, 0, 0);
                geometry.vertices.push(vector);
            }
            
            // Random rotation
            line.rotation.x = Math.random() * Math.PI;
            line.rotation.y = Math.random() * Math.PI;
            line.rotation.z = Math.random() * Math.PI;
            
            this.sphere.add(line);
        }
    }
    
    updateDots(time) {
        for(let i = 0; i < this.lines; i++) {
            const line = this.sphere.children[i];
            
            for(let j = 0; j < this.dots; j++) {
                const vector = line.geometry.vertices[j];
                const ratio = 1 - ((line.radius - Math.abs(vector.x)) / line.radius);
                const y = Math.sin(time / line.speed + j * 0.15) * 12 * ratio;
                vector.y = y;
            }
            
            line.geometry.verticesNeedUpdate = true;
        }
    }
    
    animate(time = 0) {
        requestAnimationFrame((t) => this.animate(t));
        
        // Update wave animation
        this.updateDots(time);
        
        // Rotate sphere slowly
        this.sphere.rotation.y = time * 0.0001;
        this.sphere.rotation.x = -time * 0.0001;
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        // Reset canvas size
        this.canvas.style.width = '';
        this.canvas.style.height = '';
        
        // Update dimensions
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        
        // Update camera and renderer
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
    
    setupResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.onResize(), 200);
        });
    }
}

// Initialize WebGL background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Three.js to load
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            new WebGLBackground();
        } else {
            console.warn('Three.js not loaded, falling back to CSS background');
        }
    }, 100);
});
