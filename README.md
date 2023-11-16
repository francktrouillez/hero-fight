# Hero Fight

This project has been conducted as part of the course "INFO-H502 - Virtual Reality" at the Ecole Polytechnique de Bruxelles - ULB, given from September 2021 and January 2022. The contributors are Alexandre Missenard and Franck Trouillez.
Everything has been done from scratch, using the WebGL library.

## Video presentation

You can find a video presentation of the project [here](https://youtu.be/sAnt0WD6bIo).

## How to play

Run the following command in the root directory of the project:

```bash
(python -m http.server 8000 || python3 -m http.server 8000) && google-chrome http://0.0.0.0:80
```

or more conveniently, run:
```bash
./run
```

You can then use the keyboard to move the camera:
- `→` to use next+ camera
- `←` to use previous camera
- `z` to look up
- `s` to look down
- `q` to look left
- `d` to look right
- `spacebar` to pause the camera

## Description

The game done is named Hero Fight. It is basically a very simple RPG turn-based game, where the user can play a given character fighting against monsters. It has a system of experience, leading to improvements for the stats of the character.

![Project presentation](/images/project_presentation.PNG)

## Features

### Game logic

Before talking about the features of the game, the game logic is explained, in order to understand the goal of the different features listed below and how they are used in the game. As said before, the character will fight against a monster, which is either a slime, a skeleton or a dragon. It is a turn-based game, and the player has 4 different actions every turn. It can either attack the monster, apply a buff to itself, or heal itself. After the action of the character, the monster will always attack. Every 3 fights, the scene will change, corresponding to a different time of the day. In total, there are 3 different times, with the last one corresponding to the night. Every time a monster is killed, the character will get experience points. Once it has enough experience, it will level up, which will increase its stats which are its maximum health, the amount of damage it can deal
and its defense.

![Game logic](/images/game_logic.png)

### Lights

The game includes a sun, that enlighten the whole scene. Moreover, some wisps, used as decorations, are moving around the scene during the night. All the different lights listed in the exercises sessions are implemented, which are the ambient, specular and diffuse light.

![Lights](/images/lights.png)

### Textures

Of course, since the game contains different objects, it had to implement texture management.

### Multiple models

Multiple models have been rendered on screen.

### Cubemap

Cubemaps been implemented in order to render a complete scene. It allows a dynamic behaviour, enabling to change the cubemap texture according to the time of the day.

![Cubemaps](/images/cubemaps.png)

### Bump mapping

The bump mapping has been implemented. It has been done on the floor, in order to give a 3D render even if the texture is given as a 2D image.

![Bump mapping](/images/bump_mapping.png)

### Reflection and refraction

Both these effects are also part of the project. However, it is not simply using a cubemap to reflect the texture linked to it, but it also shows the objects of the scene. In order to show both reflection and refraction, a pond is used in the game, which will use framebuffers in order to generate its texture. During the day, it is considered that the combination of the daylight and the water will allow the camera to see under the water. This will reveal a fish swimming inside of it. However, since it is in the water, refraction is implemented in order to take into account the refractive index of water. Hence, it shows the fish with a different angle than with the actual camera. During the night, it is considered that there is not enough light to see through the water. Hence, the pond will act as a mirror, allowing to reflect everything on the water, including the cubemap.

![Refraction and reflection](/images/reflection_refraction.png)

### Water effects

The water is a reflective surface at night and refractive surface the rest of the time. In order to avoid the water being a still plane surface we added some perturbations to it. Perlin noise is used in order to add an offset to the texture position taken when calculating the fragment shader of the water surface by taking into account the noise value at this point given in a texture. The texture can hold different values (4 counting the alpha channel) and some ripples effect were also created in order to generate some waves. These waves induce another offset in the coordinates of the texture position and an offset in the calculation of the light.

![Water effects](/images/water.png)

### Particles

These have been introducted in 3 places. Firstly, the fish bubbles are shown on the screen if it is the day. Moreover, the player, during its turn, can choose to buff itself, or to heal. If it chooses to buff its attack, red particles will be displayed around the character. Blue particles corresponds to a defense buff, and the heal will generate green particles. Lastly, one of the monsters that the character can fight is a dragon. For its attack, a fire’s breath is shown using particles. These particles follow a uniformly accelerated motion, in order to give a better render on screen. Moreover, it also allows to give forms to the group of particles, as shown by the fire’s breath of the dragon.

![Particles](/images/particles.png)

### Animations

The different actors of the game are animated. Indeed, the character and the monsters are animated. This gives a better experience to the user when he plays the game. However, it is not using rigging, as it was very complicated to implement by hand. Hence, an artificial way of animate the models has been done. In fact, every object has loaded multiple times the model for every frame of a given animation. This will allow to simply go from a model of a given frame to the next one, giving the feeling that the object is animated. This decision of doing it with this artificial way has been advised by the assistants, since they know that implementing rigging by hand can be very complex. Hence, we made the choice of following this idea in order to render a game where the models are animated

![Animations](/images/animation.png)

### Explosions

This game implements a dematerialization, which basically is the explosion of an object while slowly dis- appearing. Unfortunately, the geometry shaders in WebGL are not available. However, it was possible to implement such a feature with a vertex shader. In the game, it has been implemented to show when a monster is dead. It allows to have a better render than simply changing the monster without any transition.

![Explosion](/images/explosion.png)

### Shadows

In addition with the lights, shadows have also been implemented. These are shown during the 2 first times of the day. The shadows of the trees and the character can be seen on the floor.

![Shadows](/images/shadows.png)

### Other features

In addition to the virtual reality features, other functionalities have been implemented to enhance the experience:
- A loading screen
- A main menu
- Add buttons on the screen
- Show the stats of the character on the screen
- A game over screen
- Sound effects and background music

## Conclusion

To conclude, we really enjoyed this project. We really invest a lot of time in order to make a playable game. Moreover, we also set ourselves the restriction of not using any external library. Indeed, we wanted to understand everything we did, and using libraries such as THREE.js would have given us the chance to have more features, such as rigging or physics. However, this was not as rewarding as doing it ourselves. Moreover, we briefly talked with one of the teaching assistants during the exercise sessions about using external libraries, and he clearly told us that implementing features ourselves is much more appreciated than simply using a library that do everything for us. Hence, we are both very satisfied of this project and we learned a lot in the implementation of 3D environments in WebGL.
