// Fuente de la demo React Three Fiber. Se compila con:
//   npx esbuild fuentes/r3f-escena/app.jsx --bundle --minify --format=esm --outfile=demos/r3f-escena/app.js
// (requiere: npm i react@18 react-dom@18 three @react-three/fiber@8 @react-three/drei@9 esbuild)
import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Lightformer, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const COLORES = ['#ff5a3c', '#5b3cff', '#2ef2b4', '#ffc46b', '#f2f0ec']

// Una pieza: crece al pasar el mouse, cambia de color al hacer clic
function Pieza({ position, forma, color0 }) {
  const ref = useRef()
  const [hover, setHover] = useState(false)
  const [i, setI] = useState(color0)
  useFrame((_, dt) => {
    const s = THREE.MathUtils.damp(ref.current.scale.x, hover ? 1.25 : 1, 6, dt)
    ref.current.scale.setScalar(s)
    ref.current.rotation.y += dt * (hover ? 1.6 : 0.3)
  })
  const mat = <meshPhysicalMaterial color={COLORES[i]} roughness={0.15} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group ref={ref} position={position}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
        onClick={(e) => { e.stopPropagation(); setI((i + 1) % COLORES.length) }}>
        {forma === 'caja' && <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.22} smoothness={6}>{mat}</RoundedBox>}
        {forma === 'esfera' && <mesh><sphereGeometry args={[0.75, 64, 64]} />{mat}</mesh>}
        {forma === 'dona' && <mesh><torusGeometry args={[0.62, 0.26, 48, 120]} />{mat}</mesh>}
        {forma === 'cono' && <mesh><coneGeometry args={[0.7, 1.3, 64]} />{mat}</mesh>}
        {forma === 'capsula' && <mesh><capsuleGeometry args={[0.42, 0.8, 16, 32]} />{mat}</mesh>}
      </group>
    </Float>
  )
}

// La cámara sigue suavemente al mouse
function Camara() {
  useFrame((state, dt) => {
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 1.2, 3, dt)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.6 + state.pointer.y * 0.8, 3, dt)
    // en pantallas angostas la cámara se aleja para que entren todas las piezas
    state.camera.position.z = 7.5 / Math.min(1, state.size.width / state.size.height / 1.3)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function App() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.6, 7.5], fov: 40 }} gl={{ antialias: true }}>
      <color attach="background" args={['#f2f0ec']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <Pieza position={[-2.6, 0.4, 0]} forma="caja" color0={0} />
      <Pieza position={[-0.9, -0.3, 0.8]} forma="esfera" color0={1} />
      <Pieza position={[0.9, 0.5, -0.4]} forma="dona" color0={2} />
      <Pieza position={[2.6, -0.2, 0.3]} forma="cono" color0={3} />
      <Pieza position={[0, 1.6, -1.4]} forma="capsula" color0={4} />
      <ContactShadows position={[0, -1.7, 0]} opacity={0.45} scale={14} blur={2.6} far={4} />
      {/* Iluminación de estudio hecha con paneles de luz (no descarga HDRI) */}
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 4, -6]} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" color="#ff8a6c" intensity={3} position={[3, 3, 4]} scale={2} />
      </Environment>
      <Camara />
    </Canvas>
  )
}

createRoot(document.getElementById('root')).render(<App />)
