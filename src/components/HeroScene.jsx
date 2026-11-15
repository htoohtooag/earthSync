import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

/**
 * Decorative sky: a floating farm island with drifting clouds.
 * Loaded in its own chunk after the first paint of the page shell.
 */
export default function HeroScene() {
  const hostRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    let frameId = 0;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      console.warn('3D sky disabled:', error);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xdcecf7, 12, 34);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);

    scene.add(new THREE.HemisphereLight(0xe8f3fb, 0x8aa87e, 1.15));
    const sun = new THREE.DirectionalLight(0xfff2dc, 1.4);
    sun.position.set(6, 9, 4);
    scene.add(sun);

    /* ---- floating farm island ---- */
    function hashJitter(geometry, amount) {
      const position = geometry.attributes.position;
      const hash = (x, y, z) => {
        const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
        return s - Math.floor(s);
      };
      for (let i = 0; i < position.count; i += 1) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        position.setXYZ(
          i,
          x + (hash(x, y, z) - 0.5) * amount,
          y + (hash(y, z, x) - 0.5) * amount * 0.7,
          z + (hash(z, x, y) - 0.5) * amount,
        );
      }
      geometry.computeVertexNormals();
      return geometry;
    }

    const mat = (color) =>
      new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.95, metalness: 0 });

    const island = new THREE.Group();
    island.add(
      new THREE.Mesh(hashJitter(new THREE.CylinderGeometry(1.5, 1.62, 0.55, 9, 1), 0.18), mat(0x4e8f5c)),
    );
    const soil = new THREE.Mesh(hashJitter(new THREE.CylinderGeometry(1.58, 1.02, 1.5, 9, 2), 0.22), mat(0x7a5a40));
    soil.position.y = -1.0;
    island.add(soil);
    const keel = new THREE.Mesh(hashJitter(new THREE.ConeGeometry(1.02, 1.35, 7, 1), 0.2), mat(0x5e4531));
    keel.rotation.x = Math.PI;
    keel.position.y = -2.25;
    island.add(keel);

    /* crop rows */
    const crops = new THREE.InstancedMesh(
      new THREE.ConeGeometry(0.045, 0.36, 4),
      new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.9 }),
      84,
    );
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    let cropCount = 0;
    for (let row = -3; row <= 3; row += 1) {
      for (let k = 0; k < 12; k += 1) {
        const x = row * 0.36 + (Math.random() - 0.5) * 0.1;
        const z = (k - 5.5) * 0.22 + (Math.random() - 0.5) * 0.12;
        if (Math.hypot(x + 0.55, z - 0.45) < 0.62) continue;
        euler.set((Math.random() - 0.5) * 0.35, Math.random() * Math.PI, (Math.random() - 0.5) * 0.35);
        quaternion.setFromEuler(euler);
        const s = 0.7 + Math.random() * 0.55;
        scale.set(s, s, s);
        matrix.compose(new THREE.Vector3(x, 0.44, z), quaternion, scale);
        crops.setMatrixAt(cropCount, matrix);
        color.setHSL(0.36 + Math.random() * 0.05, 0.45 + Math.random() * 0.15, 0.3 + Math.random() * 0.16);
        crops.setColorAt(cropCount, color);
        cropCount += 1;
      }
    }
    crops.count = cropCount;
    island.add(crops);

    const pond = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.09, 10), mat(0x8fc3dd));
    pond.position.set(-0.55, 0.3, 0.45);
    island.add(pond);

    function tree(x, z, s) {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.34, 5), mat(0x6b4f35));
      trunk.position.y = 0.17;
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.42, 6), mat(0x2e6b44));
      crown.position.y = 0.46;
      group.add(trunk);
      group.add(crown);
      group.position.set(x, 0.28, z);
      group.scale.setScalar(s);
      return group;
    }
    island.add(tree(0.75, -0.7, 1.0));
    island.add(tree(1.0, 0.35, 0.75));

    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), mat(0x8a8f88));
    rock.position.set(0.25, 0.3, -0.85);
    island.add(rock);
    const rock2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 0), mat(0x9aa096));
    rock2.position.set(-1.05, 0.28, -0.35);
    island.add(rock2);
    scene.add(island);

    /* ---- clouds ---- */
    const clouds = [];
    for (let i = 0; i < 3; i += 1) {
      const group = new THREE.Group();
      for (let k = 0; k < 4; k += 1) {
        const s = 0.5 + Math.random() * 0.7;
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(s, 7, 6),
          new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 }),
        );
        puff.position.set(k * 0.9 - 1.4, (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.5);
        puff.scale.y = 0.6;
        group.add(puff);
      }
      group.position.set(-8 + i * 8, 4.6 + Math.random() * 1.6, -9 - i * 2.5);
      group.userData.v = 0.004 + Math.random() * 0.004;
      scene.add(group);
      clouds.push(group);
    }

    /* ---- sizing ---- */
    function resize() {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const mobile = width < 700;
      camera.fov = mobile ? 55 : 42;
      camera.position.set(0, mobile ? 2.7 : 2.0, mobile ? 9.8 : 7.4);
      camera.lookAt(0, mobile ? 1.0 : 1.15, -1);
      camera.updateProjectionMatrix();
      island.position.set(mobile ? 1.5 : 5.4, mobile ? 4.05 : 3.9, -6);
      island.userData.by = mobile ? 4.05 : 3.9;
      island.scale.setScalar(mobile ? 0.58 : 0.62);
    }

    /* ---- cursor: island tilt + photo band parallax ---- */
    const cursor = { x: 0, y: 0 };
    const cursorTarget = { x: 0, y: 0 };
    let lastInput = 0;

    function setFromEvent(clientX, clientY) {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      cursorTarget.x = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
      cursorTarget.y = Math.max(-1, Math.min(1, -(((clientY - rect.top) / rect.height) * 2 - 1)));
      lastInput = performance.now();
    }

    const onPointerMove = (event) => setFromEvent(event.clientX, event.clientY);
    const onTouchMove = (event) => {
      if (event.touches && event.touches[0]) setFromEvent(event.touches[0].clientX, event.touches[0].clientY);
    };
    const onResize = () => {
      resize();
      if (reduced) renderOnce();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onResize);

    resize();

    const band = host.closest('.hero')?.querySelector('.field-photo img');
    const clock = new THREE.Clock();
    let visible = true;

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
      });
      observer.observe(host);
    }

    function updateWorld(time) {
      if (performance.now() - lastInput > 3800) {
        /* idle drift so the scene stays alive */
        cursorTarget.x = Math.sin(time * 0.21) * 0.45;
        cursorTarget.y = -0.3 + Math.sin(time * 0.13) * 0.15;
      }
      cursor.x += (cursorTarget.x - cursor.x) * 0.06;
      cursor.y += (cursorTarget.y - cursor.y) * 0.06;
      if (band) {
        band.style.transform =
          'translate3d(' +
          (cursor.x * 16).toFixed(1) +
          'px,' +
          (-cursor.y * 9).toFixed(1) +
          'px,0) scale(1.07)';
      }
      island.rotation.x += (cursor.y * 0.1 - island.rotation.x) * 0.04;
      island.rotation.z += (-cursor.x * 0.1 - island.rotation.z) * 0.04;
      island.rotation.y += 0.0016;
      island.position.y = island.userData.by + Math.sin(time * 0.9) * 0.16;
      for (let i = 0; i < clouds.length; i += 1) {
        const cloud = clouds[i];
        cloud.position.x += cloud.userData.v;
        if (cloud.position.x > 14) cloud.position.x = -14;
      }
    }

    function renderOnce() {
      updateWorld(clock.getElapsedTime());
      renderer.render(scene, camera);
    }

    function frame() {
      frameId = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      clock.getDelta();
      updateWorld(clock.elapsedTime);
      renderer.render(scene, camera);
    }

    renderOnce();
    if (!reduced) frame();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      if (observer) observer.disconnect();
      if (band) band.style.transform = '';

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (!object.material) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value && value.isTexture) value.dispose();
          });
          material.dispose();
        });
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [reduced]);

  return <div className="gl" id="gl" aria-hidden="true" ref={hostRef} />;
}
