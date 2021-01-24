# Hierarchical model drawing

This is my implementation of a hierarchical model drawing, built with the AniGraphV2 library by Abe Davis. It contains a web application UI you can use to create, play with, save, and load models and their hierarchies. 

Model code can be found in [./A2Code/src/models/A2Model.js](./A2Code/src/models/A2Model.js) and the code describing how it is interacted with by the user through the web application can be found in [./A2Code/src/interactions/SceneGraphElementInteractions.js](./A2Code/src/interactions/SceneGraphElementInteractions.js).

## Running the code
Run `npm run start` in this folder.

## Dependencies
AnigraphV2 is included in this repo. This also requires node.js. All other dependencies can be found in [./package.json](./package.json) and installed by running `npm install` in this folder with node.js installed.
