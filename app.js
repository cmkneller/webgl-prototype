import LocomotiveScroll from 'locomotive-scroll'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { Color, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import showTextVertexShader from './shaders/showText/vertex/showTextVertex.glsl'
import showTextFragShader from './shaders/showText/fragment/showTextFrag.glsl'
import waveyFragShader from './shaders/wavey/fragment/waveyFrag.glsl'
import standardVertexShader from './shaders/standardVertex.glsl'
import leafVertexShader from './shaders/leaf/leafVertex.glsl'
import leafFragShader from './shaders/leaf/leafFragment.glsl'

gsap.registerPlugin(ScrollTrigger)

class Main {
  constructor(scrollcontainer) {
    this.scroll
    this.ThreeJsScene
    this.container = scrollcontainer
    this.header = document.querySelector('.grassroots__Header')
    this.scrolling = false
    this.loadingDecal = document.querySelector('.loadingDecal')
    this.init()
  }
  init() {
    this.setUpScroll()
    this.setupGsap()
    this.setUpThreeJs()
    this.setUpEventListeners()
  }
  setUpScroll() {
    this.scroll = new LocomotiveScroll({
      el: this.container,
      smooth: true
    })

    this.setupScrollTrigger(this.scroll)
  }

  setupScrollTrigger(scroll) {
    ScrollTrigger.scrollerProxy(this.container, {
      scrollTop(value) {
        return arguments.length
          ? scroll.scrollTo(value, 0, 0)
          : scroll.scroll.instance.scroll.y
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      pinType: this.container.style.transform ? 'transform' : 'fixed'
    })

    ScrollTrigger.addEventListener('refresh', () => scroll.update())

    ScrollTrigger.defaults({
      scroller: this.container
    })
    ScrollTrigger.refresh()
  }

  setupGsap() {
    //Scroll triggers

    const bigTextTimeline = gsap.timeline({})

    const skincareProductsAnimation = gsap.timeline()
    const skintoolsProductsAnimation = gsap.timeline()
    const panelAnimation = gsap.timeline()

    const finishAnimation = () => {}

    // Scroll Triggers

    ScrollTrigger.create({
      trigger: '.grassroots__BigTextSection',
      start: '0% 0%',
      end: '+=2500',
      pin: true,
      scrub: true,
      scroller: this.container,
      animation: bigTextTimeline
    })

    ScrollTrigger.create({
      trigger: '.grassroots__ProductsSection.skincare',
      start: '-25% 0%',
      scroller: this.container,
      animation: skincareProductsAnimation
    })

    ScrollTrigger.create({
      trigger: '.grassroots__ProductsSection.skintools',
      start: '-25% 0%',
      scroller: this.container,
      animation: skintoolsProductsAnimation
    })

    ScrollTrigger.create({
      trigger: '.grassroots__PanelsSection.collection',
      start: '0% 0%',
      end: '+=2500',
      pin: true,
      scrub: true,
      scroller: this.container,
      animation: this.createPanelAnimation(
        '.grassroots__PanelsSection.collection',
        true
      )
    })
    ScrollTrigger.create({
      trigger: '.grassroots__PanelsSection.facial',
      start: '0% 0%',
      end: '+=2500',
      pin: true,
      scrub: true,
      scroller: this.container,
      animation: this.createPanelAnimation(
        '.grassroots__PanelsSection.facial',
        false
      )
    })
    ScrollTrigger.create({
      trigger: '.grassroots__PanelsSection.stockist',
      start: '0% 0%',
      end: '+=2500',
      pin: true,
      scrub: true,
      scroller: this.container,
      animation: this.createPanelAnimation(
        '.grassroots__PanelsSection.stockist',
        true
      )
    })

    ScrollTrigger.create({
      trigger: '.grassroots__meetTheTeam',
      start: '0% 0%',
      scroller: this.container,
      animation: this.createAnimation('.meetTheTeam__IMG', 'rise')
    })

    ScrollTrigger.create({
      trigger: '.grassroots__NewsLetterSection',
      start: '-50% 0%',
      end: '+=2500',
      // pin: true,
      scrub: true,
      scroller: this.container,
      animation: this.animateTextCurve('#curveText')
    })

    // Timeline

    // Meet the team animation

    bigTextTimeline
      .from(
        '.bigText1',
        {
          scale: 0.3,
          rotation: 45,
          autoAlpha: 0,
          ease: 'power2'
        },
        0
      )
      .from(
        '.bigTextImage2',
        {
          right: '-400px',
          scale: 0.3,
          autoAlpha: 0,
          ease: 'power2'
        },
        0.2
      )
      .from(
        '.bigTextImage1',
        {
          left: '-400px',
          scale: 0.3,
          autoAlpha: 0,
          ease: 'power2'
        },
        0
      )
      .from(
        '.bigTextImage3',
        {
          scale: 0.3,
          autoAlpha: 0,
          ease: 'power2'
        },
        0.3
      )
      .from(
        '.bigText2',
        {
          scale: 0.3,
          rotation: -45,
          autoAlpha: 0,
          ease: 'power2'
        },
        0.05
      )
      .from(
        '.bigText3',
        {
          scale: 0.3,
          rotation: 45,
          autoAlpha: 0,
          ease: 'power2',
          transformOrigin: 'left center'
        },
        0.05
      )

    skincareProductsAnimation.from('.skincare .grassRoots__Product', {
      y: 60,
      rotationY: 60,
      opacity: 0,
      stagger: {
        amount: 1
      }
    })
    skintoolsProductsAnimation.from('.skintoolProduct', {
      y: 60,
      rotationY: 60,
      opacity: 0,
      stagger: {
        amount: 1
      }
    })
  }

  setUpThreeJs() {
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onLoad = () => {
      gsap.to(this.loadingDecal.querySelector('.loadingDecalBackground'), {
        opacity: 0,
        duration: 1
      })
      gsap.to(this.loadingDecal.querySelector('.L'), {
        // opacity: 0,
        rotate: -40,
        duration: 1.5,
        delay: 0.3,
        opacity: 0
      })
      gsap.to(this.loadingDecal.querySelector('.R'), {
        // opacity: 0,
        rotate: 40,
        duration: 1.5,
        delay: 0.3,
        opacity: 0
      })
    }

    this.ThreeJsScene = new WebGlHoverEvents(loadingManager)
    this.heroScene = new HeroScene(
      document.querySelector('.heroCanvas'),
      loadingManager
    )
  }
  setUpEventListeners() {
    this.scroll.on('scroll', (args) => {
      if (args.scroll.y > 0 && this.scrolling == false) {
        this.header.classList.add('grassroots__Header__Scrolling')
        this.scrolling = true
      } else if (args.scroll.y == 0 && this.scrolling == true) {
        this.header.classList.remove('grassroots__Header__Scrolling')
        this.scrolling = false
      }
      ScrollTrigger.update()
    })
  }

  createAnimation(item, type) {
    const timeline = new gsap.timeline()

    if (type === 'rise') {
      timeline.from(item, {
        opacity: 0,
        y: '250px',
        rotate: 25,
        duration: 1
      })
    }

    return timeline
  }

  animateTextCurve(text) {
    const timeline = new gsap.timeline()

    timeline.to(text, { attr: { startOffset: '100%' } })
    return timeline
  }

  createPanelAnimation(item, right) {
    const timeline = new gsap.timeline()
    const element = document.querySelector(`${item}`)
    const bigText = element.querySelector('.grassroots__Panel__BigText')
    const textSide = element.querySelector('.grassroots__Panel__TextSide')
    const imageSide = element.querySelector('.grassroots__Panel__IMGSide')

    timeline
      .from(bigText, {
        opacity: 0,
        right: right ? '-100%' : '100%'
      })
      .from(
        imageSide,
        {
          y: '150px',
          opacity: 0,
          skewX: -30,
          duration: 0.2
        },
        0
      )
      .from(
        textSide,
        {
          y: '150px',
          opacity: 0,
          skewX: right ? -10 : 10,
          duration: 0.2
        },
        0.2
      )

    return timeline
  }
}

class WebGlHoverEvents {
  constructor(loadingManager) {
    this.textureLoader = new THREE.TextureLoader(loadingManager)
    this.init()
  }

  init() {
    const leafImage = this.textureLoader.load('images/textures/CBDLeaf.jpg')
    const bottleImage = this.textureLoader.load('images/textures/bottles.jpg')
    const aloeImage = this.textureLoader.load('images/textures/alov.jpg')
    const displacementImage = this.textureLoader.load(
      'images/textures/disp2.jpg'
    )

    const collectionImage1 = this.textureLoader.load(
      'images/textures/collection1.jpg'
    )
    const collectionImage2 = this.textureLoader.load(
      'images/textures/collection2.jpg'
    )

    const facialImage1 = this.textureLoader.load('images/textures/facial.jpg')
    const facialImage2 = this.textureLoader.load('images/textures/facial2.jpg')
    const retailImage1 = this.textureLoader.load('images/textures/retail.jpg')
    const retailImage2 = this.textureLoader.load('images/textures/retail2.jpg')

    this.CBDScene = new WebGLImage(
      document.querySelector('.CBD_Canvas'),
      leafImage,
      bottleImage,
      new THREE.Vector3(91.0, 192.0, 235.0),
      'wide',
      'displayText'
    )

    this.INGScene = new WebGLImage(
      document.querySelector('.ingredients_Canvas'),
      aloeImage,
      bottleImage,
      new THREE.Vector3(181.0, 175.0, 146.0),
      'wide',
      'displayText'
    )
    this.CollectionScene = new WebGLImage(
      document.querySelector('.webGL_Collection'),
      collectionImage1,
      collectionImage2,
      new THREE.Vector3(0, 0, 0),
      'long',
      'wavey',
      displacementImage
    )

    this.facialScene = new WebGLImage(
      document.querySelector('.webGL_Facial'),
      facialImage1,
      facialImage2,
      new THREE.Vector3(0),
      'long',
      'wavey',
      displacementImage
    )
    this.facialScene = new WebGLImage(
      document.querySelector('.webGL_Stockist'),
      retailImage1,
      retailImage2,
      new THREE.Vector3(0),
      'long',
      'wavey',
      displacementImage
    )
  }
}

class HeroScene {
  constructor(canvas) {
    this.canvas = canvas
    this.heroSection = document.querySelector('.grassroots__Hero_Wrapper')
    this.loader = new GLTFLoader()
    this.sizes = {
      width: this.heroSection.offsetWidth,
      height: this.heroSection.offsetHeight
    }

    console.log(this.sizes)
    this.textureLoader = new THREE.TextureLoader()

    this.textures = {}
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.sizes.width / this.sizes.height,
      0.1,
      50
    )
    this.cameraPosition = new THREE.Vector3(0, 0, 1.6)

    this.scene = new THREE.Scene()
    this.enviromentLoader = new THREE.CubeTextureLoader()
    this.enviromentTexture = this.enviromentLoader.load([
      'images/textures/environmentMaps/1/px.jpg',
      'images/textures/environmentMaps/1/nx.jpg',
      'images/textures/environmentMaps/1/py.jpg',
      'images/textures/environmentMaps/1/ny.jpg',
      'images/textures/environmentMaps/1/pz.jpg',
      'images/textures/environmentMaps/1/nz.jpg'
    ])

    this.scene.add(this.camera)
    this.modelGroup = new THREE.Group()
    this.retinolBottleGroup = new THREE.Group()
    this.superGlowBottleGroup = new THREE.Group()
    this.renderer = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      alpha: true
    })
    this.texures = {}

    this.materials = {}
    this.models = {}
    this.init()
  }

  init() {
    this.setUpTextures()
    this.setUpMaterials()
    this.setupModels()
    this.positionElements()
    this.setupRenderer()
    this.setUpEventListeners()
    this.setupLights()
    this.render()
    this.animation()
    this.introAnimation()
    this.setupMovingCamera()
  }

  setUpTextures() {
    this.textures.leaf = this.textureLoader.load('images/textures/bigLeaf.png')
    this.textures.floor = this.textureLoader.load('images/textures/floor2.jpg')
    this.textures.floorAlpha = this.textureLoader.load(
      'images/textures/floor2TransparentFinal.jpg'
    )
    this.textures.boxes = this.textureLoader.load('images/textures/boxes.jpg')
    this.textures.bottleMap = this.textureLoader.load(
      'images/textures/RETINOLBottle.jpg'
    )

    this.textures.refineBox = this.textureLoader.load(
      'images/textures/refineBoxTexture.jpg'
    )
    this.textures.repairBox = this.textureLoader.load(
      'images/textures/repairBoxTexture.jpg'
    )
    this.textures.superGlow = this.textureLoader.load(
      'images/textures/superGlowTexture.jpg'
    )
    this.textures.superGlowAlpha = this.textureLoader.load(
      'images/textures/superGlowAlpha.jpg'
    )

    this.textures.bottleInside = this.textureLoader.load(
      'images/textures/bottleYellowAlphaMap.jpg'
    )
  }

  setUpMaterials() {
    this.materials.leaf = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: leafVertexShader,
      fragmentShader: leafFragShader,
      uniforms: {
        uTexture: { value: this.textures.leaf },
        uTime: { value: 0.0 }
      }
    })
  }

  setupModels() {
    for (const texture in this.textures) {
      if (texture !== 'leaf') {
        this.textures[texture].flipY = false
      }
    }

    this.loader.load('models/shadowFloor.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.material = new THREE.MeshBasicMaterial({
        opacity: 0.6,
        transparent: true,
        color: 'black',
        alphaMap: this.textures.floorAlpha
      })
      this.models.floor = mesh

      this.modelGroup.add(mesh)
    })

    this.loader.load('models/retinolBottle.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.material = new THREE.MeshStandardMaterial({
        map: this.textures.bottleMap,
        roughness: 0.4
      })

      this.models.bottle = mesh
      this.retinolBottleGroup.add(mesh)
    })
    this.loader.load('models/retinolBottleMetal.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.material = new THREE.MeshStandardMaterial({
        metalness: 0.6,
        color: 'grey',
        roughness: 0.5,
        envMap: this.enviromentTexture,
        envMapIntensity: 2
      })

      this.models.bottleMetal = mesh
      this.retinolBottleGroup.add(mesh)
    })
    this.loader.load('models/retinolBottleNib.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 'white',
        roughness: 0.1,
        reflectivity: 0.5
      })

      this.models.bottleNib = mesh
      this.retinolBottleGroup.add(mesh)
    })

    this.loader.load('models/superGlowBottle.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.rotation.y = 0.9

      mesh.material = new THREE.MeshPhysicalMaterial({
        // transparent: true,

        // metalness: 0.69,
        // ior: 2,

        // map: this.textures.superGlow,
        // refractionRatio: 0.5,
        // roughness: 1,
        // clearcoat: 0.5,
        // alphaMap: this.textures.superGlowAlpha,
        // envMap: this.enviromentTexture,
        // side: THREE.DoubleSide,
        // envMapIntensity: 0.8

        color: 'white',
        metalness: 1,
        roughness: 0.8,
        ior: 0,
        alphaMap: this.textures.superGlowAlpha,
        map: this.textures.superGlow,
        envMapIntensity: 1,
        envMap: this.enviromentTexture,

        specularIntensity: 0.8,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true
      })

      this.models.superGlowBottle = mesh
      this.superGlowBottleGroup.add(mesh)
    })
    this.loader.load('models/superGlowFluid.glb', (result) => {
      const mesh = result.scene.children[0]

      const plane = new THREE.PlaneBufferGeometry(0.5, 1)

      mesh.material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.7,
        color: 'yellow',
        side: THREE.DoubleSide
      })

      this.models.superGlowFluid = mesh
      this.superGlowBottleGroup.add(mesh)
    })
    this.loader.load('models/superGlowMetal.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.material = new THREE.MeshStandardMaterial({
        metalness: 0.6,
        color: 'grey',
        roughness: 0.5,
        envMap: this.enviromentTexture,
        envMapIntensity: 2
      })

      this.models.superGlowMetal = mesh
      this.superGlowBottleGroup.add(mesh)
    })
    this.loader.load('models/superGlowNib.glb', (result) => {
      const mesh = result.scene.children[0]

      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 'white',
        roughness: 0.1,
        reflectivity: 0.5
      })

      this.models.superGlowNib = mesh
      this.superGlowBottleGroup.add(mesh)
    })
    this.loader.load('models/refineBox.glb', (result) => {
      const mesh = result.scene.children[0]
      mesh.position.x += 0.8

      mesh.material = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 1,
        envMap: this.enviromentTexture,
        map: this.textures.refineBox,
        side: THREE.DoubleSide
      })

      this.models.refineBox = mesh
      this.modelGroup.add(mesh)
    })
    this.loader.load('models/repairBox.glb', (result) => {
      const mesh = result.scene.children[0]
      mesh.position.z -= 2
      mesh.position.x -= 2

      mesh.material = new THREE.MeshStandardMaterial({
        map: this.textures.repairBox,
        envMap: this.enviromentTexture,

        side: THREE.DoubleSide
      })

      this.models.repairBox = mesh
      this.modelGroup.add(mesh)
    })

    this.loader.load('models/shadowFloor.glb', (result) => {
      const mesh = result.scene.children[0]
      mesh.material = new THREE.MeshStandardMaterial({})
    })

    this.loader.load('models/boxes.glb', (result) => {
      this.textures.boxes.flipY = false

      const mesh = result.scene.children[0]
      mesh.material = new THREE.MeshBasicMaterial({
        map: this.textures.boxes
      })
      this.models.box = mesh
      this.modelGroup.add(mesh)
    })

    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(5, 3.7, 10, 10),
      this.materials.leaf
    )

    this.scene.add(mesh)
    this.models.leaf = mesh

    mesh.position.y = 0.5
    mesh.position.z = -12
  }

  setUpEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeScreen()
    })
  }

  setupLights() {
    const pointLight = new THREE.PointLight('white', 20)
    pointLight.position.set(-8, 0, 10)

    const helper = new THREE.PointLightHelper(pointLight)
    this.scene.add(pointLight)
    const pointLight2 = new THREE.PointLight('#AFC5E5', 6)
    pointLight2.position.set(5, 2, 0)

    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#D2C2EF', 1.7)

    this.scene.add(pointLight2)
    this.scene.add(hemiLight)
  }

  positionElements() {
    this.camera.z = 8.5
    this.modelGroup.add(this.superGlowBottleGroup)
    this.modelGroup.add(this.retinolBottleGroup)
    this.retinolBottleGroup.position.y += 0.01
    this.scene.add(this.modelGroup)
    this.modelGroup.position.z = -4.1
    this.modelGroup.position.x = 0.4
    this.modelGroup.position.y = -0.3
    this.modelGroup.scale.set(0.5, 0.5, 0.5)
    this.modelGroup.rotation.y = 0.85 * (Math.PI * 2)
  }

  resizeScreen() {
    this.sizes.width = this.heroSection.offsetWidth
    this.sizes.height = this.heroSection.offsetHeight
    this.camera.aspect = this.sizes.width / this.sizes.height

    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.render()
  }

  setupRenderer() {
    this.renderer.physicallyCorrectLights = true
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  updateMaterials(time) {
    this.materials.leaf.uniforms.uTime.value = time
  }

  setupMovingCamera() {
    this.canvas.addEventListener('mousemove', (e) => {
      const position = (e.clientX / this.sizes.width - 0.5) * 0.2
      this.cameraPosition.set(position, 0, 0)
    })
  }

  //
  introAnimation() {
    gsap.from(this.camera.rotation, {
      x: 50
    })
    gsap.from(this.camera.position, {
      z: 4,
      duration: 2
    })
  }

  animation() {
    const clock = new THREE.Clock()

    const tick = () => {
      this.camera.position.lerp(this.cameraPosition, 0.05)
      this.camera.lookAt(0, 0, -5)

      this.render(this.scene, this.camera)

      this.updateMaterials(clock.getElapsedTime())

      window.requestAnimationFrame(tick)
    }

    tick()
  }
}

class WebGLImage {
  constructor(canvas, image, image2, color, aspect, mode, displacementImage) {
    this.mode = mode
    this.aspect = aspect
    this.image = image
    this.color = color
    this.image2 = image2
    this.displacementImage = displacementImage
    this.canvas = canvas
    this.container = canvas.parentElement
    this.title = this.container.querySelector(
      '.grassRoots__webGL__title__Wrapper'
    )
    this.description = this.container.querySelector('.grassRoots__webGL__back')
    this.textureLoader = new THREE.TextureLoader()
    this.mesh
    this.time = new THREE.Clock(false)
    this.sizes = {
      width: this.canvas.parentElement.offsetWidth,
      height: this.canvas.parentElement.offsetHeight
    }
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.sizes.width / this.sizes.height,
      0.1,
      50
    )
    this.scene = new THREE.Scene()

    this.planeGeo =
      this.aspect == 'wide'
        ? new THREE.PlaneBufferGeometry(1, 0.75, 10, 10)
        : new THREE.PlaneBufferGeometry(0.8, 1, 10, 10)

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uHoverState: { value: 0 },
        uTexture: { value: this.image },
        uTexture2: { value: this.image2 },
        uTime: { value: this.time.getElapsedTime() },
        uColor: { value: this.color },
        uDisplacement: {
          value: this.displacementImage ? this.displacementImage : 0.0
        },
        uResolution: {
          value: new THREE.Vector4(
            this.sizes.width,
            this.sizes.height,
            1.0,
            1.0
          )
        }
      },
      vertexShader:
        this.mode == 'displayText'
          ? showTextVertexShader
          : standardVertexShader,
      fragmentShader:
        this.mode == 'displayText' ? showTextFragShader : waveyFragShader
    })

    this.renderer = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      alpha: true
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.addModel()
    this.setUpHoverListener()
    this.animate()
  }

  addModel() {
    const loader = new THREE.TextureLoader()

    this.mesh = new THREE.Mesh(this.planeGeo, this.material)

    this.scene.add(this.mesh)

    this.camera.position.z = 1.5
  }

  setUpHoverListener() {
    this.canvas.parentElement.addEventListener('mouseenter', () => {
      this.time.start()
      gsap.to(this.material.uniforms.uHoverState, {
        duration: 1,
        value: 1,
        ease: 'none'
      })

      gsap.to(this.title, {
        opacity: 0,
        duration: 0.5
      })

      gsap.to(this.description, {
        opacity: 1,
        duration: 1,
        delay: 0.5
      })
    })
    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.time.stop()
      gsap.to(this.material.uniforms.uHoverState, {
        duration: 1,
        value: 0,
        ease: 'none'
      })
      gsap.to(this.title, {
        opacity: 1,
        duration: 1,
        delay: 0.6
      })

      gsap.to(this.description, {
        opacity: 0,
        duration: 0.5
      })
    })
  }

  updateMaterials(elapsedTime) {
    this.material.uniforms.uTime.value = elapsedTime
    this.material.needsUpdate = true
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  animate() {
    const tick = () => {
      this.updateMaterials(this.time.getElapsedTime())
      this.render()
      window.requestAnimationFrame(tick)
    }
    tick()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scrollcontainer = document.querySelector('[data-scroll-container]')
  new Main(scrollcontainer)
})
