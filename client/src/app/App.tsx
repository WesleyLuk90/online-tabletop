import "normalize.css/normalize.css";
import React from "react";
import "./App.css";
import { Counter } from "./Counter";
import { SomeText } from "./Foo";

export function App() {
    return (
        <div>
            <Counter />
            <SomeText />
        </div>

        //    <ModalContainer>
        //         <FollowContainer>
        //         <Router>
        //             <Navigation />
        //             <Route path="/" exact component={Dashboard} />
        //             {/* <Route
        //                     path={Routes.createCampaign()}
        //                     exact
        //                     component={EditCampaignPage}
        //                 />
        //                 <Route
        //                     path={Routes.editCampaign(":id")}
        //                     exact
        //                     component={EditCampaignPage}
        //                 /> */}
        //             {/* <Route
        //                     path={Routes.playGame(":id")}
        //                     exact
        //                     component={PlayPage}
        //                 /> */}
        //         </Router>
        //     </FollowContainer>
        // </ModalContainer>
    );
}
