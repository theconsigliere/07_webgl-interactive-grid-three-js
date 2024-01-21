import * as THREE from "three"
import fragment from "./shader/fragment.glsl"
import vertex from "./shader/vertex.glsl"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gui from "lil-gui"
import gsap from "gsap"
import CubeFloor from "./cubefloor"

export default class Sketch {
  constructor(options) {
    this.backgroundColor = new THREE.Color(0x00ffff)
    this.scene = new THREE.Scene()
    this.fog = new THREE.Fog(this.backgroundColor, 10, 20)
    this.scene.fog = this.fog
    this.scene.background = this.backgroundColor

    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xeeeeee, 1)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    )

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 5, 5)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.time = 0
    this.intersects = []
    this.isPlaying = true

    this.addObjects()
    this.resize()
    this.render()
    this.setupResize()
    this.addEventListeners()

    // this.settings();
  }

  settings() {
    this.settings = {
      progress: 0,
    }
    this.gui = new dat.GUI()
  }

  addEventListeners() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this))
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this))
  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // calculate objects intersecting the picking ray
    this.intersects = this.raycaster.intersectObjects(this.scene.children, true)
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    // this.material = new THREE.ShaderMaterial({
    //   extensions: {
    //     derivatives: "#extension GL_OES_standard_derivatives : enable",
    //   },
    //   side: THREE.DoubleSide,
    //   uniforms: {
    //     time: { type: "f", value: 0 },
    //     resolution: { type: "v4", value: new THREE.Vector4() },
    //     uvRate1: {
    //       value: new THREE.Vector2(1, 1),
    //     },
    //   },
    //   // wireframe: true,
    //   // transparent: true,
    //   vertexShader: vertex,
    //   fragmentShader: fragment,
    // })

    CubeFloor.init(this.scene)
  }

  stop() {
    this.isPlaying = false
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true
    }
  }

  render() {
    if (!this.isPlaying) return
    this.time += 0.05
    // this.material.uniforms.time.value = this.time
    CubeFloor.update(this.intersects)

    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.mouse, this.camera)

    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({
  dom: document.getElementById("container"),
})
