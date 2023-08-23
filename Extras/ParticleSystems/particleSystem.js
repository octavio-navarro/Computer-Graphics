import * as THREE from '/libs/three.js/three.module.js'

function copy(x) {
    return JSON.parse( JSON.stringify(x) );
}

class Particle
{
    /*  position:       vector3
        velocity:       vector3
        acceleration:   vector3
        lifeSpan:     float / seconds
        decay:          float / seconds?
    */
    constructor(position, velocity, acceleration, lifeSpan, decay)
    {
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.acceleration = acceleration.clone();
        this.lifeSpan = lifeSpan;

        this.initialPosition = position.clone();
        this.initialVelocity = velocity.clone();
        this.initialAcceleration = acceleration.clone();
        this.initialLifeSpan = lifeSpan;
        
        this.decay = decay;
        this.alive = true;
    }

    reset()
    {
        this.position = this.initialPosition.clone();
        this.velocity = this.initialVelocity.clone();
        this.acceleration = this.initialAcceleration.clone();
        this.lifeSpan = this.initialLifeSpan;
    }

    isDead()
    {
        return this.lifeSpan < 0;
    }

    update(deltaT)
    {
        deltaT *= 0.001;
        this.velocity.add(this.acceleration.multiplyScalar(deltaT));
        this.position.add(this.velocity);
        this.lifeSpan -= this.decay * deltaT;

        if(this.isDead())
        {
            this.reset();
        }
    }
}

class ParticleSystem
{
    /* initialPositions:    Vector3 list
    */
    constructor(initialPositions, velocities, accelerations, lifeSpan, decay, spriteUrl)
    {
        this.lifeSpan = lifeSpan;
        this.geometry = new THREE.BufferGeometry();

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialPositions, 3));

        this.particleSprite = new THREE.TextureLoader().load(spriteUrl);
        this.material = new THREE.PointsMaterial({
                size:5, 
                sizeAttenuation: true, 
                map: this.particleSprite, 
                alphaTest: 0.1, 
                transparent: true
            }
        );
    
        this.particleObjects = new THREE.Points(this.geometry, this.material);
        this.particles = [];

        this.particleCount = initialPositions.length / 3;

        for(let i = 0; i< this.particleCount; i++)
        {
            const particle = new Particle(
                new THREE.Vector3(initialPositions[i*3], initialPositions[i*3+1], initialPositions[i*3+2]),
                new THREE.Vector3(velocities[i*3], velocities[i*3+1], velocities[i*3+2]),
                new THREE.Vector3(accelerations[i*3], accelerations[i*3+1], accelerations[i*3+2]),
                lifeSpan,
                decay
            )
            this.particles.push(particle);
        }
    }

    update(deltaT)
    {
        const positions = this.particleObjects.geometry.attributes.position;

        for(let i = 0; i< this.particleCount; i++)
        {
            this.particles[i].update(deltaT);
    
            const position = this.particles[i].position;

            positions.setXYZ(i, position.x, position.y, position.z);
        }
        this.material.opacity -= deltaT *0.001/ this.lifeSpan;

        if(this.material.opacity <= 0)
            this.material.opacity = 1.0;

        positions.needsUpdate = true;
    }
}

export {Particle, ParticleSystem};