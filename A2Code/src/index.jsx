import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom";
import {
    AppState,
    ASceneGraphEditor
} from "AniGraph"

import {A2ModelGroup} from "./models/A2Model";
import A2ToolPanel from "./components/A2ToolPanel";
import A2GraphicsComponent from "./components/A2GraphicsComponent";

export default function Assignment2Core() {
    const appState = new AppState({model: new A2ModelGroup({name:'rootModel'})});
    const app = (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                <A2ToolPanel appState={appState}/>
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-6"}>
                    <ASceneGraphEditor appState={appState}/>
                </div>
                <div className={"col-6"}>
                    <A2GraphicsComponent appState={appState}/>
                </div>
            </div>
        </div>
    );
    ReactDOM.render(app,
        document.querySelector('#main')
    );
}
Assignment2Core();
