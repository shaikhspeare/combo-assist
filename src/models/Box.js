import ReactDOM from 'react-dom';
import React, { useRef, useState, useEffect, useMemo} from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { Clock, ArrowHelper, Mesh, TextureLoader } from 'three';
import circle from '../images/circle.svg'

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Rotate mesh every frame, this is outside of React without overhead
  const texture = useMemo(() => new TextureLoader().load(circle), [circle])

  return (
    <mesh
      ref={mesh}
      scale={[1, 1, 1]}

    >
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <meshLambertMaterial attach="material" transparent opacity={1}>
        <primitive attach="map" object={texture} />
      </meshLambertMaterial>
    </mesh>      
      
  );
}

export default Box;
