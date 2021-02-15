import { useState, useEffect } from 'react';
import MasterTest from '../MasterTest/MasterTest';
const { ipcRenderer } = window.require('electron');

function Test(){
    const [test, setTest] = useState(null)
    useEffect(()=>{
        ipcRenderer.invoke('test').then((t: any)=>{setTest(t);})
    },[])
    return <>{test? <MasterTest test={test}></MasterTest>: null}</>
}
export default Test