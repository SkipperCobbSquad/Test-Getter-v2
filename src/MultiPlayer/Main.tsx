import { useEffect, useState } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Mode } from '../helpers/testInterfaces';

import Multi from './Multi';
import Test from './Test';

const { ipcRenderer } = window.require('electron');

const error = withReactContent(Swal);

// const { ipcRenderer } = window.require('electron');
//  HashRouter as Router,
function MainMulti() {
  const [ready, setReady] = useState(false);
  const [redict, setRedict] = useState(false)
  useEffect(() => {
    if(!sessionStorage.getItem('connection')){
      error.fire({
        icon: 'error',
        title: 'You are not connected',
        text: 'Please go to settings to connect to server'
      }).then(()=>{
        setRedict(true)
      })
    }else{
      setReady(true)
      ipcRenderer.invoke('mode', Mode.MULTI);
    }
  }, []);
  let { path } = useRouteMatch();
  return (
    <>
      {ready ? (
        <Switch>
          <Route exact path={path} component={Multi}></Route>
          <Route path={`${path}/test`} component={Test}></Route>
        </Switch>
      ) : null}
      {redict? <Redirect to='/settings'></Redirect>: null}
    </>
  );
}

export default MainMulti;
