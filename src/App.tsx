import React, {useState} from 'react';
import './App.css';
import {LoginPage} from "./front/LoginPage/LoginPage";

function App() {
    const [isEntranceRemoved, setIsEntranceRemoved] = useState(false)
    if (!isEntranceRemoved) {
        return (
            <LoginPage callback={() => setIsEntranceRemoved(true)}/>
        )
    } else {
        return (
            <div>
                Test
            </div>
        );
    }
}

export default App;
