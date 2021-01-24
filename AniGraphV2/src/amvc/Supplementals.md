# Warning somewhat out of date
## Supplemental Views & Controllers

Supplemental views and controllers can be attached to regular controllers to add additional visuals or functionality. Once attached, they can be deactivated and reactivated.
Interactions are created when the controller is attached, and released when the controller detaches.
The Supplemental Controller listens to the model of the controller it is attached to, so it can respond to model updates including the addition of children. 
 
 
 - `initInteractions()` is called when the controller attaches. It should initializes interacitons.
 - `onModelUpdate()` respond to model updates
 
 If a view class is specified, it will be created 