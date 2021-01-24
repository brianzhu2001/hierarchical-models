import React from "react";
import AGUIComponent from "./AGUIComponent";
import SortableTree from "react-sortable-tree";
import 'react-sortable-tree/style.css';
import {Checkbox} from "rsuite";

export default class ASceneGraphDragTable extends AGUIComponent{
    constructor(props) {
        super(props);
    }

    getDefaultState() {
        return Object.assign(super.getDefaultState(), {
            treeData: []
        });
    }

    initAppState() {
        super.initAppState();
        const self=this;
        this.addAppStateListener('selectedModelControllers', function(selectedModelControllers){
            const selectedModel = selectedModelControllers && selectedModelControllers.length? selectedModelControllers[0].getModel() : undefined;
            self.setState({selectedModel: selectedModel});
        });
        this.addAppEventListener('graphChanged', this.updateSceneGraph);
    }

    onTreeChange(treeData){
        // Nothing by default at the moment
    }

    onVisibilityToggle(args){
        args.node.model.setAttribute('collapsedInTreeView', !args.expanded);
        this.updateSceneGraph();
    }

    changeSelected(node, args){
        console.log(node);
        console.log(args);
    }

    bindMethods() {
        super.bindMethods();
        this.updateSceneGraph = this.updateSceneGraph.bind(this);
        this.onTreeChange = this.onTreeChange.bind(this);
        this.onMoveNode = this.onMoveNode.bind(this);
        this.onVisibilityToggle = this.onVisibilityToggle.bind(this);
        this._canDragNode = this._canDragNode.bind(this);
        this._canDropNode = this._canDropNode.bind(this);
    }

    _canDragNode(args) {
        return (args.node.controller !== this.getRootModelController());
    }

    _canDropNode(args){
        if(args.prevPath.indexOf('root')>=0 && args.nextPath.indexOf('root')<0){
            return false;
        }
        if(args.nextParent===null){
            return false;
        }
        return true;
    }


    selectShape(args){
        this.getMainComponent().selectShape(args);
    }


    setSelectedModelControllers(value){
        this.setAppState('selectedModelControllers', value);
    }
    getSelectedModelControllers(){
        return this.getAppState('selectedModelControllers');
    }

    setSelectedModelController(value){
        this.setSelectedModelControllers(value? [value] : []);
    }
    getSelectedModelController(){
        const selection = this.getSelectedModelControllers();
        return (selection && selection.length>0)? selection[0] : undefined;
    }

    getSelectedModel(){
        const controller = this.getSelectedModelController();
        return controller? controller.getModel() : undefined;
    }

    getMainComponent(){
        return this.getAppState('mainComponent');
    }

    getSelectedModels(){
        const controllers = this.getSelectedModelControllers();
        const rval = controllers && controllers.length? controllers.map(c=>{return c.getModel();}) : [];
        return rval;
    }

    getTreeEntryForModelController(controller){
        const model = controller.getModel();
        const sgtable = this;
        const selection = this.getSelectedModelControllers();
        const isSelected = selection? selection.includes(controller) : false;
        const rval =  {
            name: model.name? model.name : model.constructor.name,
            model: model,
            controller: controller,
            expanded: !model.getAttribute('collapsedInTreeView'),
            id: model.getUID(),
            isSelected: isSelected,
            onSelectionToggle: (args)=>{
                if(!(sgtable.getSelectedModels().includes(model))){
                    sgtable.selectShape({model: model, controller: controller});
                }else{
                    sgtable.selectShape();
                }
            }
        }
        const foundController = this.getMainComponent()._getMainControllerForModel(model);
        console.assert(foundController.getUID()===controller.getUID(), {msg:"Failed controller check!", model: model, controller: controller});
        return rval;
    }

    getTreeDataForModelController(controller){
        const treeEntry = this.getTreeEntryForModelController(controller);
        const children = controller.getChildrenList();
        if(children.length>0){
            treeEntry.children = [];
            for(let c of children){
                treeEntry.children.push(this.getTreeDataForModelController(c));
            }
        }
        return treeEntry;
    }

    getRootModelController(){
        return this.getMainComponent().componentController;
    }

    updateSceneGraph(){
        const rootController = this.getRootModelController();
        const treeData = rootController && rootController.getChildrenList()? [this.getTreeDataForModelController(rootController)] : [];
        treeData[0].id = 'root';
        this.setState({treeData: treeData});
    }

    onMoveNode(args){
        const nextParentNode = args.nextParentNode;
        const nextParentModel = nextParentNode.model;
        const nextParentChildrenOrder = nextParentNode.children.map(n=>{return n.model;});
        nextParentModel.reorderChildren(nextParentChildrenOrder);
        this.getMainComponent().reselectSelectedShape();
        // this.updateSceneGraph();
    }


    render(){
        const getNodeKey = ({ treeIndex }) => treeIndex;
        return (
            <SortableTree
                treeData={this.state.treeData}
                onChange={this.onTreeChange}
                onVisibilityToggle={this.onVisibilityToggle}
                onMoveNode={this.onMoveNode}
                canDrag={this._canDragNode}
                canDrop={this._canDropNode}
                scaffoldBlockPxWidth={25}
                generateNodeProps={({node, path}) => ({
                    title: (
                        <div>
                            {node.model.isModelGroup ? "Group: " : "Model: "}
                            <input
                                style={{
                                    fontSize: '0.8rem',
                                    margin: '1px'
                                }}
                                value={node.name}
                                onChange={event => {
                                    const name = event.target.value;
                                    node.model.name = name;
                                    this.updateSceneGraph();
                                }}
                            />
                        </div>
                    ),
                    buttons: [(
                        <Checkbox
                            checked={node.isSelected}
                            onChange={(args) => {
                                node.onSelectionToggle(args);
                            }}
                        />
                    )],
                    style: {
                        border: (!node.model.isModelGroup ? `solid ${node.model.getAttribute('fill')}` : `outset`),
                        boxShadow: (!node.model.isModelGroup ? `2px 2px 2px 2px ${node.model.getAttribute('stroke')}`: 'none')
                        // opacity: (!node.model.isModelGroup ? 1 : 0.7)
                    }
                })}
            />
        )
    }

}




//
// const App = () => {
//     const [treeData, setTreeData] = useState(data);
//     return (
//         <Tree
//             data={treeData}
//             draggable
//             defaultExpandAll
//             onDrop={({ createUpdateDataFunction }, event) =>
//                 setTreeData(createUpdateDataFunction(treeData))
//             }
//         />
//     );
// };
// ReactDOM.render(<App />);
//
//
// /**
//  * import data from
//  * https://github.com/rsuite/rsuite/blob/master/docs/public/data/en/city-simplified.json
//  */
//
// const instance = (
//     <CheckTree
//         data={data}
//         renderTreeNode={nodeData => {
//             return (
//                 <span>
//           <Icon icon="map-marker" /> {nodeData.label}
//         </span>
//             );
//         }}
//     />
// );
// ReactDOM.render(instance);