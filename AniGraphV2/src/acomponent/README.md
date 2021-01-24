# AComponent

### Initialization:
Constructor does relatively little of the initialization. `initComponent` and `initAppState` get called in `componentDidMount`.
`AGraphicsComponent`'s call `initGraphicsContext` before `initComponent` and `initAppState` inside of `componentDidMount`.
The reason for this is to ensure that a valid graphics context exists when most of the componentn initialization is done. 

### Classes:
- `AComponent` Base class mostly deals with interactions with AppState.
- `AMVCComponent` 
  - has a model that represents the root of the app's model tree.
  - has controllers. initializes default controllers in `_initDefaultControllers`.
    - One of the default controllers is the component controller, set with `setComponentController(this._createNewComponentController())`
    - for each of `this.supplementalControllerClasses`, creates a supplemental controller and sets it with `setController(name, controller)`.
  - `startControllers(args)`:  starts the controllers specified in `this.constructor.SupplementalControllerClasses`. These are the controllers that should be activated by default (so not ones that are activated in response to a state change, like selecting selection mode from a dropdown...). Alternatively, subclasses can implement their own `startControllers` to selectively activate controllers. 
- `AGraphicsComponent`
    - Has a graphics context, initialized in `initGraphicsContext()`.
    - Has a root graphics group. `this.getRootGraphicsGroup()`.
- `AGraphicsComponent2D`
    - Version of `AGraphicsComponent` where the graphics context renders 2d graphics (right now, svg with two.js).
- `A2DShapeEditorComponent`
    - Component for creating and editing 2D vector shapes (svg). 

- `constructor(props)`
  - `setAppStateObject(props.appState)`: sets the app state object, if given as a prop.
  - `bindMethods()`: binds methods that need binding.
- `componentDidMount`: called once component has mounted, meaning we can interact with DOM.
  - `initGraphicsContext`: initializes the graphics context.
  - `initComponent`: component-specific initialization.
    - sets the model and listens
  - `initAppState`: initialize app state and listeners
  

### AppState
By default, `setAppState` will set a variable in both the AppState object and the React component state.

