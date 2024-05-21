import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { BaseScene } from '../common/baseScene'

let baseScene = null

const nodes = 
[
    {
        'position': new THREE.Vector3(0, 10, 0),
        'connections': [
            new THREE.Vector3(5, 10, 0),
            new THREE.Vector3(-5, 10, 0),
            new THREE.Vector3(0, 10, 5),
            new THREE.Vector3(0, 10, -5),
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(0, 15, 0),
        ]
    },
    {
        'position': new THREE.Vector3(5, 10, 0),
        'connections':[]
    },
    {
        'position': new THREE.Vector3(-5, 10, 0),
        'connections':[]
    },
    {
        'position': new THREE.Vector3(0, 10, 5),
        'connections':[]
    },
    {
        'position': new THREE.Vector3(0, 10, -5),
        'connections':[]
    },
    {
        'position': new THREE.Vector3(0, 5, 0),
        'connections':[]
    },
    {
        'position': new THREE.Vector3(0, 15, 0),
        'connections':[]
    },
]

function createLineObjects(){
   const lineMaterial = new THREE.LineBasicMaterial({color: 0x0055ff, linewidth: 5})

   const nodeMaterial = new THREE.MeshPhongMaterial({color: 0xff0000})

   for(let node of nodes){
    const sphereGeometry = new THREE.SphereGeometry(1, 10, 16)
    const sphereMesh = new THREE.Mesh(sphereGeometry, nodeMaterial)

    sphereMesh.position.set(...node.position)

    baseScene.scene.add(sphereMesh)

    for(let connection of node.connections){

        const points = [node.position, connection]
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        
        const line = new THREE.Line(lineGeometry, lineMaterial)

        baseScene.scene.add(line)
    } 
   }   
}

function createScene(canvas){
    baseScene = new BaseScene(canvas)
    baseScene.directionalLight = new THREE.DirectionalLight(0xffffff, 3)
    baseScene.directionalLight.position.set(0, 10, 0)
    baseScene.scene.add(baseScene.directionalLight)
}

function update(){
   baseScene.tick()
}

function main(){
    const canvas = document.getElementById('webglcanvas')

    createScene(canvas)

    createLineObjects()

    update()
}

main()
