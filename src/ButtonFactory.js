import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three'

import { Canvas, useLoader, useFrame, useUpdate, useThree } from 'react-three-fiber'

import { Clock, ArrowHelper, Mesh, TextureLoader } from 'three';
import square from './images/square.svg';
import circle from './images/circle.svg';
import bold from './bold.blob'

function Text({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {
    const font = useLoader(THREE.FontLoader, bold)
    const config = useMemo(
      () => ({
        font,
        size: 40,
        height: 30,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 6,
        bevelSize: 2.5,
        bevelOffset: 0,
        bevelSegments: 8,
      }),
      [font]
    )
    const mesh = useUpdate(
      (self) => {
        const size = new THREE.Vector3()
        self.geometry.computeBoundingBox()
        self.geometry.boundingBox.getSize(size)
        self.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
        self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
      },
      [children]
    )
    return (
      <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
        <mesh ref={mesh}>
          <textGeometry attach="geometry" args={[children, config]} />
          <meshNormalMaterial attach="material" />
        </mesh>
      </group>
    )
  }

function Button(props) {
  const { time, texture } = props;
  const {camera, viewport, scene, size} = useThree()
  
  
  const mesh = useRef();
  const calculatePosition = () => {
      const xDisplacement = (time/window.innerWidth)/10
      console.log(time)
    return [xDisplacement, 0, 0];
  };

  const setCenter = (position) => {
    camera.position.setX(position.x)
  }
  if (mesh.current && mesh.current.position) {
    setCenter(mesh.current.position)

  }
  return (
    <mesh  ref={mesh} scale={[0.3, 0.3, 0.3]} position={calculatePosition(time)}>
      <planeBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" transparent opacity={1}>
        <primitive attach="map" object={texture} />
        <Suspense fallback={null}>
            <Text hAlign="left" position={[0, 4.2, 0]} children="REACT" />
        </Suspense>
      </meshLambertMaterial>
    </mesh>
  );
}

function SquareButton(props) {
  const { time } = props;

  const texture = useMemo(() => new TextureLoader().load(square), [square]);

  return <Button time={time} texture={texture} />;
}

function CircleButton(props) {
    const { time } = props;
  
    const texture = useMemo(() => new TextureLoader().load(circle), [circle]);
  
    return <Button time={time} texture={texture}  />;
  }

function buttonFactory() {
  this.size = 0;

  this.create = ({ button, start, time, position }) => {
    this.size += 1;
    switch (button) {
      case 'X':
        return <SquareButton time={time} />;
      case 'Y':
        return 'TriangeButton';
      case 'B':
        return <CircleButton time={time} />;
      case 'A':
        return 'CrossButton';
      default:
        return <SquareButton time={time} />;
    }
  };
}

export default buttonFactory;
