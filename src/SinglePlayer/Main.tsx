import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Single from './Single';
import Test from './Test';
//  HashRouter as Router,
function MainSingle() {
  let { path } = useRouteMatch();
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
