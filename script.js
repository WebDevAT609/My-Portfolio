const cursor = document.querySelector(".cursor");
const smokeContainer = document.getElementById("smoke-container");

window.addEventListener("mousemove",(e)=>{

    gsap.to(cursor,{
        x:e.clientX,
        y:e.clientY,
        duration:0.08,
        ease:"power2.out"
    });

    createSmoke(e.clientX,e.clientY);

});

function createSmoke(x,y){

    const smoke=document.createElement("div");

    smoke.classList.add("smoke");

    smoke.style.left=x+"px";
    smoke.style.top=y+"px";

    smokeContainer.appendChild(smoke);

    const randomX=(Math.random()-0.5)*50;
    const randomY=(Math.random()-0.5)*50;

    gsap.fromTo(smoke,
    {
        scale:.3,
        opacity:.5
    },
    {
        x:randomX,
        y:randomY,
        scale:2.8,
        opacity:0,
        duration:1.3,
        ease:"power2.out",
        onComplete(){
            smoke.remove();
        }
    });

}
 
 /* ====================================================
         1. EMAILJS INITIALIZATION & FORM HANDLING
      ==================================================== */
      (function() {
        //  Replace with your actual EmailJS Public Key
         emailjs.init('M5SDJQnNUiZdynJr3');
      })();

      const contactForm = document.getElementById('contact-form');
      const submitBtn = document.getElementById('submit-btn');
      const formStatus = document.getElementById('form-status');

      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        //  Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID
         emailjs.sendForm('service_cg4gvaa', 'template_l7mbg7n', this)
           .then(() => {
             submitBtn.innerText = "Send Message";
             submitBtn.disabled = false;
             formStatus.style.color = "var(--accent)";
             formStatus.innerText = "Message sent successfully!";
             contactForm.reset();
           }, (error) => {
             submitBtn.innerText = "Send Message";
             submitBtn.disabled = false;
             formStatus.style.color = "#ef4444";
      formStatus.innerText = "Failed to send message. Please try again.";
           console.error("EmailJS Error:", error);
           });

        // Temporary success state for testing without keys
        // setTimeout(()=>{
        //     submitBtn.innerText = "Send Message";
        //     submitBtn.disabled = false;
        //     formStatus.style.color = "var(--accent)";
        //     formStatus.innerText = "Message sent successfully! (Test Mode)";
        //     contactForm.reset();
        // }, 1000)
      });

      /* ====================================================
         2. LENIS SMOOTH SCROLL & GSAP ScrollTrigger SETUP
      ==================================================== */
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Sync Lenis with GSAP ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      /* ====================================================
         3. GSAP REVEAL ANIMATIONS
      ==================================================== */
      gsap.utils.toArray('.animate-gsap').forEach((element) => {
        gsap.from(element, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      /* ====================================================
         4. THREE.JS BACKGROUND (Interactive Particle Field)
      ==================================================== */
      const canvas = document.getElementById('webgl-canvas');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Particle Geometry
      const particlesCount = 700;
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Particle Material
      const particlesMaterial = new THREE.PointsMaterial({
        /* --- COLOR CHANGE: GREEN PARTICLES TO RED PARTICLES --- */
        color: 0xef4444, /* Using same accent color as hex for Three.js */
        size: 0.035,
        transparent: true,
        opacity: 0.6
      });

      const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleMesh);

      camera.position.z = 5;

      // Mouse Parallax Interaction
      let mouseX = 0;
      let mouseY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
      });

      // Animation Loop
      const clock = new THREE.Clock();

      function animateThree() {
        const elapsedTime = clock.getElapsedTime();

        // Slow rotation
        particleMesh.rotation.y = elapsedTime * 0.05;
        particleMesh.rotation.x = -mouseY * 0.3;
        particleMesh.rotation.y += mouseX * 0.3;

        renderer.render(scene, camera);
        requestAnimationFrame(animateThree);
      }
      animateThree();

      // Window Resize Handler
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });