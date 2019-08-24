//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//==============================================================================

// How to load in modules
//const Diagnostics = require('Diagnostics');
const Scene = require('Scene');
const Animation = require('Animation');

const base = Scene.root.find('base_jnt');

/*
durationMilliseconds: The animation will last 0.4 seconds.
loopCount: The animation will loop indefinitely.
mirror: The animation will have returned to it's starting value by the time it has finished a loop.
*/
const baseDriverParameters = {
    durationMilliseconds: 400,
    loopCount: Infinity,
    mirror: true
};


/*
The parameters are then used to create a time driver using the timeDriver() method of the Animation Module.

The time driver also needs to be instructed to start.
*/
const baseDriver = Animation.timeDriver(baseDriverParameters); // Existing code
baseDriver.start();


/*
The sampler allows you to specify the beginning and end values of the animation as well as the easing function applied to it, altering the rate of change.

The samplers property of the animation module gives us access to the SamplerFactory class, which we use to set the easing function via the easeInQuint() method. We pass in 0.9 and 1 to the method to specify the start and end values of the animation.
*/
const baseSampler = Animation.samplers.easeInQuint(0.9,1);


/*
The animation is created by combining the driver and sampler.
The animate() method of the animation module returns a ScalarSignal that is changing between 0.9 and 1 every 0.4 seconds according to the easing function used.
*/
const baseAnimation = Animation.animate(baseDriver,baseSampler);


//To access the scale of the base we need to first access the transform. The transform represents the object's transformation (position, scale and rotation) in it's local coordinate system.
const baseTransform = base.transform;


//The scaleX/Y/Z() methods of the TransformSignal allows us to bind the baseAnimation ScalarSignal being output by the animation to the scale of the base object.
baseTransform.scaleX = baseAnimation;
baseTransform.scaleY = baseAnimation;
baseTransform.scaleZ = baseAnimation;