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

//We need to load in the touchgestures module to be able to detect touch events.
const TouchGestures = require('TouchGestures');

/*
The following code finds the base_jnt object in the scene and stores it in a variable which we will use later to animate.

const base = Scene.root.find('base_jnt');

This is an opportunity to improve the performance of the script. In accessing the three objects in our scene we are calling Scene.root three times. If we store Scene.root in a variable we only have to call it once, and can use the variable as many times as we need it.
*/
const sceneRoot = Scene.root;

const base = sceneRoot.find('base_jnt');

//As with the base we need to access the speakers within the script, this time we want the speaker_left_jnt and speaker_right_jnt objects from the Scene Panel.
const speakerLeft = sceneRoot.find('speaker_left_jnt');
const speakerRight = sceneRoot.find('speaker_right_jnt');


//To move the boombox we're going to update the location of the plane tracker on which the boombox sits so we first need to access it in our script.
const planeTracker = sceneRoot.find('planeTracker0');


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

//for speaker animation
const speakerDriverParameters = {
    durationMilliseconds: 200,
    loopCount: Infinity,
    mirror: true
};


/*
The parameters are then used to create a time driver using the timeDriver() method of the Animation Module.

The time driver also needs to be instructed to start.
*/
const baseDriver = Animation.timeDriver(baseDriverParameters); // Existing code
baseDriver.start();

//also for speaker animation
const speakerDriver = Animation.timeDriver(speakerDriverParameters);
speakerDriver.start();


/*
The sampler allows you to specify the beginning and end values of the animation as well as the easing function applied to it, altering the rate of change.

The samplers property of the animation module gives us access to the SamplerFactory class, which we use to set the easing function via the easeInQuint() method. We pass in 0.9 and 1 to the method to specify the start and end values of the animation.
*/
const baseSampler = Animation.samplers.easeInQuint(0.9,1);


/*
For the sampler we'll be using a different easing function and values.

The values are smaller than the ones we used for the base because the speakers themselves are smaller objects. An ease out function means the animation will start fast but end slower.
*/
const speakerSampler = Animation.samplers.easeOutElastic(0.7,0.85);



/*
The animation is created by combining the driver and sampler.
The animate() method of the animation module returns a ScalarSignal that is changing between 0.9 and 1 every 0.4 seconds according to the easing function used.
*/
const baseAnimation = Animation.animate(baseDriver,baseSampler);


//With the driver and sampler created we can now create the animation.
const speakerAnimation = Animation.animate(speakerDriver,speakerSampler);


//To access the scale of the base we need to first access the transform. The transform represents the object's transformation (position, scale and rotation) in it's local coordinate system.
const baseTransform = base.transform;


//The scaleX/Y/Z() methods of the TransformSignal allows us to bind the baseAnimation ScalarSignal being output by the animation to the scale of the base object.
baseTransform.scaleX = baseAnimation;
baseTransform.scaleY = baseAnimation;
baseTransform.scaleZ = baseAnimation;


/*
We can now apply the new animation to both of the speaker objects, the animation will be used to change their scale.

The transforms of the speakers are accessed before using the scale methods to bind the speakerAnimation signal to them. This means both speakers will animate in the same way.
*/
const speakerLeftTransform = speakerLeft.transform;

speakerLeftTransform.scaleX = speakerAnimation;
speakerLeftTransform.scaleY = speakerAnimation;
speakerLeftTransform.scaleZ = speakerAnimation;

const speakerRightTransform = speakerRight.transform;

speakerRightTransform.scaleX = speakerAnimation;
speakerRightTransform.scaleY = speakerAnimation;
speakerRightTransform.scaleZ = speakerAnimation;


//------------------------------------
//Moving the boombox with pan gestures
//------------------------------------


/*
The onPan() method returns an EventSource that we then subscribe to with a callback function that will run everytime a pan gesture is detected.

We also pass the gesture as an argument to the callback function which we will use when moving the plane tracker. The gesture passed when subscribing to the onPan() EventSource is a PanGesture.
*/
TouchGestures.onPan().subscribe(function(gesture) {
	/*
	The trackPoint() method of the PlaneTracker class triggers new plane detection, updating the position of the planetracker.

	We use the location and state of the pan gesture as the position that the plane tracker should be updated to, meaning that the planetracker moves to where the gesture is detected.
	*/
    planeTracker.trackPoint(gesture.location, gesture.state);
});