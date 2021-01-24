# WARNING: Readme is partially out of date.


#Animatior Model View Controller Classes

--------
## The Data Model:
The data model represents *what* we are depicting. Think of it as all of the information you would expect to find in a saved file.
The foundation of our data model will be the `AModel` class. `AModel` is a subclass of `AObjectNode`, which means we can create trees of `AModels`.
In general, a scene will consist of one `AModel` and all of its children. We can put the content of a scene *B* into another scene, *A* by simply adding *B* as a descendant of *A*.  

-------
## The Application:
You can think of the application as something that takes data and creates visuals that the user can manipulate to interact with said data. 
Our application does not *consume* the data---it merely sits on top of it, reading and modifying it at the user's discression.
Multiple applications can sit on top of the same data, responding every time it changes without knowing about each other. 
Our applications will be encapsulated in `AComponent`s, which extend basic [React.js](https://reactjs.org/) components. This will let us will let us compose applications on a webpage like we would with regular web elements using JSX (don't worry: JSX is almost identical to writing regular HTML).
<br>
Interactions and logic for our applications will be implemented in `AController`s, and visuals will be implemented in `AView`s.The visuals for the application will be made up of different `AViews`.


----
##Overview of Classes:

- `AComponent`: Base class for our application.
- `AObject`: Each object has a unique ID and support for serialization.
- `AObjectNode`: AObject that has children and parents. This will be the base class for everything other than `AGraphicsComponent`
- `AModel`: Holds data.
- `AView`: visual representation of the model.
- `AController`: Connects model and view. Represents different modes of interaction with the data. The controller is the least intuitive of MVC here, but it will make more sense later on. 


## Detailed Class Descriptions

### ---AModel---
Models have a dictionary of `listeners` that are notified when the model changes in certain ways.<br>
Models have a dictionary of `_modelProperties` that should be accessed only through `getProperty(name)` and `setProperty(name, value)`. The model will notify all listeners whenever one of these properties changes.
####How to Subclass?
You may not even need to subclass if all of your relevant data can be passed as modelProperties:<br>
```javascript
myHatModel = new AModel({
    name: "CoolHat",
    modelProperties: {
        hatSize: 10,
        nFeathers: 10
    }
});
```
Subclassing is suggested, though, as it will help document the data model for the View and Controller classes. It also lets you define default properties. See [GraphicElement2D's constructor](@link GraphicElement2D#constructor) for an example.

-------

### ---AGraphicsComponent---
Components are sort of the top-level app. They subclass `React.Component` and own the context being used for display (in Animator2D, this is a two.js instance).<br>
The most basic job of a component is to:
- Create the graphics context.
- When models are added, create the corresponding controllers and views (more on that in a bit).
- Manage controllers 
Components map models to controllers.

#### How to Subclass
The main things you need to define are:
- `setDataModel(model)`: This function sets the root `AModel` for the application. You should create and set the root controller with `setComponentController(controller)` in this function.
- `updateGraphics()`: If you use an `AGraphicsComponent2D` subclass, this will be implemented assuming the context is a two.js context.
- Some sort of interface for adding to the model.

Optionally, you may want to define:
- (optional)`saveJSON()`: if you have any custom saving code.
- (optional) `getDefaultState()`: define the default React state that should be set. If you aren't planning on using React much, you can ignore this.


### ---AView---
Does NOT automatically maintain hierarchical structure.


Views render the data and hold a handle to its corresponding visuals. 
Views are typically created by a controller.
#### How to subclass?
Important functions to implement include:
- `initGraphics()` should initialize the graphics corresponding to this view. So, for example, initializing the polygons that will be rendered and storing their handles. 
- `hideGraphics/showGraphics()`  [tbd]
- `onModelUpdate()` update the graphics based on the model's state. Access the model through `this.getModel()`, which will access it through the controller. 

### ---AController---
Each AController takes an AModel and creates an AView, then handles all of the communication between the two. The controller also points to the component, which holds the graphics context.<br>
Graphical applications often contain multiple modes of interaction. 
For example, a graphical element may look and respond differently depending on whether you are editing it or simply viewing it.
This can be implemented by having multiple controllers with the same view.<br>
In this case, you can activate and deactivate controllers with `activate()` and `deactivate()`.

#### How to subclass?
You should overwrite:
- `createView()`: to create the corresponding view.
- `activate()`: to activate all of the controls (register ui callbacks, etc) and modify the view if necessary (e.g., displaying its control points).
- `deactivate()`: to deactivate controls and tell the view to hide and modal visuals.
- `onModelUpdate()`: different updates.

And if you are taking advantage of the hierarchical structure of models and controllers:
- `addChild()`: if you are taking advantage of `AObjectNode` trees then you may want to modify this.
- `createChildWithArgs` and the `addChild` method of the model should agree.
This will be true by default if your constructor works when the args dictionary only contains a model (e.g., `{model: modelInstance}`).


## Check out `../Graphics2D` to see how this all works in action!

