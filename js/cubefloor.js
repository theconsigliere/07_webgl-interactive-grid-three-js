import * as THREE from "three"
import { gsap } from "gsap"
import matCap from "../textures/shinyBall.jpg"

class CubeFloor {
  constructor(parameters) {
    // constructor body
    this.bind()

    this.cubeGroup = new THREE.Group()
    this.textureLoader = new THREE.TextureLoader()
    this.matCapMap = this.textureLoader.load(matCap)

    this.params = {
      xNum: 50,
      zNum: 50,
      wInsensity: 0,
      wStartHeight: 0.1,
    }
  }
  // methods
  init(scene) {
    this.scene = scene
    this.intersects = []
    this.wOrigin = new THREE.Vector3(0, 0, 0)

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshMatcapMaterial({
        matcap: this.matCapMap,
        //   wireframe: true,
      })
    )

    for (let x = 0; x < this.params.xNum; x++) {
      for (let z = 0; z < this.params.zNum; z++) {
        const clone = cube.clone()
        // create big cube
        //cube.position.set(x, 0, z)
        // create big cube that is center alligned
        clone.position.set(
          x - this.params.xNum / 2,
          0,
          z - this.params.zNum / 2
        )

        this.cubeGroup.add(clone)
      }
    }

    this.scene.add(this.cubeGroup)
    window.addEventListener("mousedown", this.onMouseDown.bind(this))
  }

  onMouseDown() {
    // update if something is in intersect
    if (this.intersects.length >= 1) {
      this.wOrigin = this.intersects[0].object.position
    }

    this.params.wInsensity = 3

    // click update intensity then ease it down back to wStartHeight
    this.anim = gsap.to(this.params, {
      duration: 1,
      wInsensity: 0,
    })
  }

  update(intersects) {
    this.intersects = intersects

    // while are more optimizing for render loops than floor loops
    let i = 0
    while (i < this.cubeGroup.children.length) {
      // this goes between -1 & 1
      // this.cubeGroup.children[i].scale.y = Math.sin(Date.now() * 0.01)
      // this goes between 0 & 2
      //   this.cubeGroup.children[i].scale.y =
      //     (Math.sin(Date.now() * 0.01 + i) + 1) * 0.5

      // Now we need to pass the distance from the center point
      //   const distance = new THREE.Vector3(0, 0, 0).distanceTo(
      //     this.cubeGroup.children[i].position
      //   )
      // using raycaster
      const distance = this.wOrigin.distanceTo(
        this.cubeGroup.children[i].position
      )

      // center in
      //   this.cubeGroup.children[i].scale.y =
      //     (Math.sin(Date.now() * 0.01 + distance) + 1) * 0.5

      // center out
      //   this.cubeGroup.children[i].scale.y =
      //     (Math.sin(Date.now() * 0.01 - distance) + 1) * 0.5

      // multiply by intensity
      this.cubeGroup.children[i].scale.y =
        (Math.cos(Date.now() * 0.01 - distance) + 1) *
          0.5 *
          this.params.wInsensity +
        this.params.wStartHeight

      i++
    }
  }

  bind() {}
}

const _instance = new CubeFloor()
export default _instance
