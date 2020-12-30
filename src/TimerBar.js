import React, { useMemo, useCallback, useRef, useState } from 'react'
import { BufferGeometry, Color } from 'three';
import * as THREE from 'three'
import { Canvas, extend, useThree, useResource ,useFrame } from 'react-three-fiber'
import { DragControls } from 'three/examples/jsm/controls/DragControls'


extend({ DragControls })

export default function TimerBar(props) {
    const { camera, gl } = useThree()
    const [ref, object] = useResource()
    const [currTime, setTime] = useState(0)
    const points = useMemo(() => [new THREE.Vector3(-7, 0, 0), new THREE.Vector3(currTime, 0, 0)], [currTime])
    const onUpdate = useCallback(self => self.setFromPoints(points), [points])
    const lineRef = useRef()
    useFrame((frame, delta) => {
      setTime(delta)
    })
  return (
    <>
    <line ref={lineRef} position={[0, -2, 0]} ref={ref}>
      <bufferGeometry attach="geometry" onUpdate={onUpdate} />
      <lineBasicMaterial attach="material" color="#9c88ff" linewidth={10}  />
      
    </line>
    <dragControls args={[[object], camera, gl.domElement]} />
  </>
  );
}
