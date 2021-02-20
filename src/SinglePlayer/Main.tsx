import { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Mode } from '../helpers/testInterfaces';
import Single from './Single';
import Test from './Test';

const { ipcRenderer } = window.require('electron');
//  HashRouter as Router,
function MainSingle() {
  let { path } = useRouteMatch();
  useEffect(() => {
    ipcRenderer.invoke('mode', Mode.SINGLE);
  });
  return (
    <>
      <Switch>
        <Route exact path={path} component={Single}></Route>
        <Route path={`${path}/test`} component={Test}></Route>
      </Switch>
    </>
  );
}

export default MainSingle;
