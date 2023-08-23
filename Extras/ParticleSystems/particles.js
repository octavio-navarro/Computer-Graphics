import {BaseScene} from './../../common/baseScene.js'
import {Particle, ParticleSystem} from './particleSystem.js'
import Stats from '/libs/three.js/libs/stats.module.js'

let stats = null;
let smoke = null;

function main()
{
    const canvas = document.getElementById('webglcanvas');
    const baseScene = new BaseScene(canvas);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    const vertices = [], velocities = [], accelerations = [];

    const factor = 0.1;
    
    for(let i = 0; i < 1000; i++)
    {
        vertices.push(0, 10, 0);
        velocities.push((Math.random()*2-1) * factor, (Math.random()*2-1)*factor, (Math.random()*2-1)*factor);
        accelerations.push((Math.random()*2-1) * factor, (Math.random()*2-1)*factor, (Math.random()*2-1)*factor);
    }
        
    smoke = new ParticleSystem(vertices, velocities, accelerations, 5, 1, '/images/sprites/cloud_1_512.png');

    baseScene.scene.add(smoke.particleObjects);

    baseScene.resize();
    baseScene.tick();

    baseScene.update = (deltaT)=>
    {
        stats.update();
        smoke.update(deltaT);
    }
    
}

main();
