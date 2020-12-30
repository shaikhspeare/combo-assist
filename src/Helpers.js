import React from 'react'
import {useThree } from 'react-three-fiber';
import { CameraHelper, GridHelper } from 'three';

export default function Helpers() {
    const {camera, viewport, scene, size} = useThree()
    camera.translateX(0.1)
    console.log(camera, viewport, scene, size)
    return (
        <>
         </>
    )
}
