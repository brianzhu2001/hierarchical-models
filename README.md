#### IMPORTANT: You should fork the code for this repo to make it easy for us to distribute test cases and practice problems for this assignment. Directions on how to fork the repo can be found in [`./forking.md`](./forking.md).
----


# CS 4620 Assignment 2



In Assignment 1 you implemented controllers for manipulating a single object in a 2D drawing.  In this assignment, we will take it up a notch by extending our drawing application to support hierarchical 2D models. These hierarchical models will become the basis for 2D animations later on.

The idea of transformation hierarchies is to factor objects and scenes into parts and subparts that can all be edited and moved in an organized way. 
In principle, extending the models we used in A1 to support hierarchies is straightforward&mdash;in fact, the `AModel` base class already supports basic child-parent relationships. However, to give these relationships meaning, we need to ensure that each node inherits the effects of transformations applied to its ancestors. This brings us to the core of Assignment 2, which has two parts:
 - First, we will extend the model class we built in Assignment 1 to handle transformations in a hierarchical manner.
 - Second, we will extend the tools we offer users to make manipulating transformation hierarchies (i.e., a scene graph) easier. This will involve writing new controllers and support for simple scene graph operations.

 
## Background

As you know from the hierarchy lectures (maybe review those now...), transformation hierarchies offer a powerful way define spatial relationships between related objects and their parts. For example, if we place various objects on a table, we can expect those objects to move when the table moves. In a graphics system, we can represent this dependency by making each object a child of the table's node in our scene graph.
 
Transformation hierarchies play an even more critical role when it comes to animating articulated objects&mdash;for example, the joints of a human body or mechanical device. Take the human arm, which we can approximate as a hierarchy of bones and joints. Intuitively, the location of a person's hand and fingers will change if they bend their elbow. However, the reverse dependency does not typically apply: one can easily bend their wrist without moving their elbow or bicep. We can code these asymmetric dependencies in a transformation hierarchy, represented as a directed graph.
 
So here's a question: if our hierarchical representation of the arm makes the hand a child of the forearm, and the forearm the child of the bicep, then how are the wrist and elbow defined? Are they represented explicitly, or merely implied by the structure of our graph? It's tempting to say that joints correspond to the edges of our graph, but that's not the whole story. A joint is a geometric concept; it has a particular location in space&mdash;typically, the origin of whatever transformation that joint permits. The elbow, for example, is the origin of rotations that the forearm is permitted to make around the bicep.  We call this point the ***anchor*** of the forearm. Note that this need not be the origin of our forearm's object coordinates&mdash;the `A` in our `PRSA` representation of matrices stands for "Anchor Shift", which represents translation between the anchor and the object's origin. 
 
  ![image](imgs/ArmHierarchy.jpg)
 



<!---
In Section this week, we showed you the `thdemo` (transformation hierarchy demo), which
 
a transformation hierarchy, we need these to relathere are some interesting design decisions in how to use this hierarchy, and the hierarchy has implications that make the design of user interactions a lot more interesting.
-->



## Specifications

In this assignment, you’ll start with an editor that looks fairly similar to what we used in assignment 1.  The user can create models in the same way as in A1, and can manipulate them using controllers like the ones in A1 that allow moving the position or anchor point of an model, scaling the object by dragging selection box handles, and rotating with a slider control.  Models are initially children of the root model.

One additional feature of the starter code is a scene graph editor that appears to the left of the drawing area, which provides a list of the objects in the scene and allows for renaming and reordering them (controlling which appears in front of which in the drawing).

In this assignment we ask you to add additional functionality for editing the scene graph:

- The user can rearrange the structure of the scene graph by dragging and dropping nodes in the graph editor to change which node is the parent of the dragged node.
- The user can use the *GroupChildren* command to create a new group that contains the children of the selected node.  This means creating an empty group node, moving all children of the selected node to become children of the group, and making the group a child of the selected node. The anchor of this newly created node should be placed at the center of a bounding box that contains all of its children (or at the same location as the parent's anchor, if there are no children with geometry).
- The user can select a node with children and use the *UngroupChildren* command to turn those children into siblings of the selected node. If UngroupChildren is used on a group node then that node is deleted once its children have been moved.

#### A Guiding Principle for Scene Graph Edits

In all these scene graph operations, your code should attempt to follow the Golden Rule:

> Whenever possible, edits to the scene graph should not change the scene geometry or location of anchor points.

This means that before and after a change to the structure of our scene graph (e.g., a reparenting, grouping, or ungrouping operation), the following two properties should hold:
 - The object-to-world matrices of all objects should remain unchanged.
 - The graph edit should not change the location of the anchor point in world space. 


There is an acception to these criteria, though; it is the reason why our rule contains the phrase "whenever possible." Recall that the matrices we use are mapped to a set of properties: position, rotation, scale, and anchor shift. These properties provide fewer degrees of freedom than an arbitrary matrix---and, importantly, fewer degrees of freedom in a single transformation than one can achieve by chaining multiple transformations together. In other words, there are matrices we can represent as the product of PRSA transformations that cannot be represented in one such transformation alone. In such cases, it may be impossible to preserve the geometry of a model when reducing the number of ancestors it has in our scene graph. In particular, this happens when you have nonuniform scales above rotations in the hierarchy, which can cause the first two columns of the matrix not to be orthogonal vectors.  In that case it is fine to let updateMatrixProperties do its thing, which may create an abrupt change in geometry.  \[Side note: for this reason, most animation software does not permit changing a node's parent mid-animation.\]

#### Controlling Hierarchies

You will also improve the functionality of controllers to permit editing transformations in a hierarchy:

- When models (whether objects or groups) are selected, the user should be able to manipulate them using the same controls that were available at the end of Assignment 1. However, models should inherit transformations applied to ther ancestors in the scene graph. In other words, transforming a node of the scene graph should effectively result in the same transformation being applied to the world coordinates of every descendant in the graph. 

## Software

As with Assignment 1, you will implement this assignment as a web application using the `AniGraph` library (now `AniGraphV2`).  The starter code is in [this repository](https://github.coecis.cornell.edu/CS4620-F2020/assignment2).  You'll recall that `AniGraph` is a Model-View-Controller system, meaning that each shape element on the screen is produced by a model, which keeps track of its state; a related view, which manages the on-screen representation of the model; and a controller, which facilitates communication between the model and view by way of user interaction.

The main visual difference you will notice in the interface for Assignment 2 is the addition of the scene graph editor on the left:


![image](imgs/SGEditorView.jpg)

#### Running the Code:
To run the code in A2, first fork the repository (see directions in [forking.md](forking.md)). Then run the following commands in the root directory (the directory with [package.json](package.json)) to download dependencies:
```
npm install
git submodule update --init
```
To start the development server and run the code, use the command:
```
npm run start
```
 
#### Overview of Files
 
The entry point for the core portion of the assignment is [`./ACode/src/index.jsx`](./ACode/src/index.jsx), which instantiates three top-level components: 
* an `A2ToolPanel`, which has all buttons and other GUI elements you see at the top of the screen. These work much the same as they did in A1.
* an `ASceneGraphEditor` which displays the hierarchy and lets the user manipulate it; and
* an `A2GraphicsComponent` which is responsible for displaying the model.

You don't actually have to manipulate the code for these components. However, you are welcome to override parts of their implementation in the subclasses provided in [`./ACode/src/creative/`](./ACode/src/creative/) for the creative portion of the assignment.

The `A2GraphicsComponent` manages a hierarchy of `A2Model`'s, which are connected to `AView2D` instances by way of `A2DShapeController`s. The `A2Model` that you will be modifying inherits from `AModel2D`, which now contains the features you implemented in Assignment 1.
  
  As you recall from Assignment 1, controllers assign `AInteraction`s to different views, with each `AInteraction` providing a different way to interact with the scene. In AniGraph V2, we define these each interaction in its own subclass so that we can reuse these definitions in multiple controllers. You will implement a few of these interactions in [`SceneGraphElementInteractions.js`](./ACode/src/interactions/SceneGraphElementInteractions.js). We have provided reference implementations of the interactions from A1 in the file [`ReferenceA1InteractionImplementations.js`](./ACode/src/creative/ReferenceA1InteractionImplementations.js), which are also used to give the starter code for A2 the same functionality you had at the end of A1. You can switch between these A1 controllers and the controllers you implement in A2 using the "EditMode" drowdown menu in the web application. You can change the default edit mode by editing the following lines from [A2GraphicsComponent.jsx](./A2Code/src/components/A2GraphicsComponent.jsx):
  ```javascript
        // Change which line is commented out below to change the default editing mode
        this.switchToEditMode('A1Transform');
        // this.switchToEditMode('Transform');
```
 
 The core portion of this assignment will involve implementing parts of `A2Model.js` and `SceneGraphElementInteractions.js`.

### Model

The model is really the central class in this assignment.  It's probably worth studying the code in `A2Model` and its superclasses if you still feel confused about how models fit into the design of our application application (it's not much code, really).

An important thing to realize about the design of this application is that (as in most scene graphs) the `AModel` class (really, its superclass `AObjectNode`) supports all nodes having a parent and children. The `AModel2D` class extends this to support defining a 2D shape (represented as lists of vertices).  But these classes only keep track of individual node transformations and parent/child relationships; they don't know anything about transformation hierarchies.  In this assignment you will extend `AModel2D` further to support transformation hierarchies in the `A2Model` class. 

In addition to `A2Model`s, which represent nodes in our scene graph, we can represent "grouping" operations like you may be familiar with from applications like Powerpoint by making a group of models children of a new parent model that contains no geometry. In other words, you can think of groups as simply being additional parent nodes in our scene graph that don't have vertices. In practice, we implement this by making an `A2ModelGroup` class that extends `A2Model`. You do not have to edit the `A2ModelGroup` class, but it is provided in `A2Model.js` for your reference.

The operations provided by the model class for operating on the tree are pretty standard. The key tools are the methods of `AObjectNode`: `getParent`, `getChildrenList`, and `mapOverChildren` for traversing the hierarchy and `setParent`, `addChild`, and `removeChild` for editing it. Your main task with regards to graph editing operations will be to implement the functions `removeFromParent` and `attachToNewParent` in `A2Model.js`.

The key things that `A2Model` does that are different from what you saw in Assignment 1 are:

* It overrides the various `get...Matrix` methods, `getVertices`, `get/setPosition`, and `getWorldSpaceBBoxCorners` so that they account for the transformations of their ancestor nodes.  Most of these are provided, but you need to implement `getObjectToWorldMatrix` and `get/setWorldPosition`; you should study the provided implementations of related functions to understand how the tree operates.
* It overrides `removeFromParent` and `attachToNewParent` so that transformations are managed correctly when moving from one parent to another.  *You will need to implement these*.
* It provides the callbacks `groupChildren` and `ungroupChildren`, which are called by the UI and are implemented in terms of `removeFromParent` and `attachToNewParent`.
* It provide a new method `getChildTreeObjectSpaceBoundingBox` that generalizes the notion of "object space corners" to return a box that encloses all the descendants of a given model.

What you implement in A2Model includes three kinds of functions:

* Functions that deal with transformations between object and world space:
  - The override `getObjectToWorldMatrix` that replaces the original version that just returns the object's matrix (which now is only a transformation from a node's object space to its parent's object space).
  - The overrides `getWorldPosition` and `setWorldPosition` that replace the superclass versions that simply get and set the `position` property, as `getPostition` and `setPosition` did in A1.
* Functions that deal with bounding boxes:
  - The method `getChildTreeObjectSpaceBoundingBox`, which initially just returns the `objectSpaceCorners` array that you'll remember from A1.  For a node without children this is correct, but for a node with children, the bounding box needs to be enlarged to also bound the bounding boxes of each descendant, which can be computed recursively.
  - The method `recenterAnchorInSubtree` which is used to compute a convenient initial location for the anchor in newly created groups.
* Functions for editing the scene graph:
  - `removeFromParent`, which removes a child node from its parent. The basic graph operation is already implemented, but you will need to update any object matrices necessary to adhere to our 'golden rule'. Here, assume that having no parent is equivalent to having the root node as a parent (assuming the root node has the Identity as its matrix). 
  - `attachToNewParent`, which sets the parent of a parent-less node and updates any matrices necessary to adhere to our `golden rule` (i.e., the geometry and anchor points of our shape should not change).

More details and implementation hints can be found in the comments in the source file.


### Interactions

The controllers we are using delegate the handling of interaction to `AInteraction` subclassesclasses. The ones you are writing can be found in `SceneGraphElementInteractions.js` and are active when you switch to the "Transform" edit mode using the "EditMode" dropdown menu in that application (see note above about how to make this the default mode once you are finished with the `A2Model` portion of the assignment).  There are three interactions for you to finish implementing. Their basic form should be familiar to you from Assignment 1, though some details will be a little different:

* `DragToScaleAroundWorldPointInteraction` is the drag interaction responsible for mouse input on the bounding box selection handles.  It works very much like the A1 scale interactions, with `dragStart`, `dragMove`, and `dragEnd` callbacks.  You should model your implementation on the provided reference implementation of the A1 behavior (in `ReferenceA1InteractionImplementations.js`), taking care to account for hierarchical transformations. See our demos for reference (for now, the demos from section; we'll try to release a shorter separate video later this week for convenience).

* `AIDragToMovePosition` and `AIDragToMoveAnchorPoint` are the interactions responsible for moving objects (changing their positions) and moving anchor points.  Again study the A1 reference implementations first, then construct a version that works on hierarchies.  Note that the implementations of these classes can be very short if you have implemented `A2Model` correctly.



## Creative portion

There are two ways to go with the creative portion.  One is to use your completed tool to build an interesting articulated character or scene.  It should be at least as complex as a simple humanoid figure with joints at the shoulders/hips, elbows/knees, wrists/ankles, and neck, etc.  But it doesn’t have to be humanoid.  Cats? Dogs?  These have similar skeletal structure but rather different proportions.  Birds? Fish? Cephalopods? These might need different sets of joints.  Weird robots and monsters?  Who knows.  Show us how your character or creature moves, and how this relates to the structure of your transformation hierarchy.

Another option is to add a new feature to the program.  Maybe you can control rotations with a more direct interface than the slider?  Maybe you don’t like the scaling interface with bounding boxes (though you still need to support those for the specified part) and want to provide an alternative scaling mode.  Maybe you’d like to make an interface that works nicely on a touchscreen device and uses multi-touch gestures to control transformations in a really intuitive way.  There is a lot of running room here once you have a controller attached to a model.

Finally, for practicum and other more advanced students, we will cover some additional short topics in the next few days, which you can implement as more advanced features. Mode details on this will follow.  

In addition to including the implementation in your zip file handin, you’ll turn in either a short 1-minute video with a demo and explanation, or a 2-page report with screenshots and explanation. As with Assignment 1, if your implementation is especially complex, you may include the video as well as assitional details in a report (in this case, mention it in the video so we know to look at the report).
