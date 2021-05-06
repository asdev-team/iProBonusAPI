import './App.css'

import React, {Fragment} from "react";
import Header from "@/components/Header/Header";
import ClientBonus from "@/components/ClientBonus/ClientBonus";

const authData = {
    ClientID: '2c44d8c2-c89a-472e-aab3-9a8a29142315',
    DeviceID: '7db72635-fd0a-46b9-813b-1627e3aa02ea'
}

const App = () => {
    return (
        <Fragment>
            <Header/>
            <ClientBonus ClientID={authData.ClientID} DeviceID={authData.DeviceID}/>
        </Fragment>
    )
}
export default App