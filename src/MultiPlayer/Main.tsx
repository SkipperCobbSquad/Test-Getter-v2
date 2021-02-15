import { useEffect, useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Multi from './Multi';
import Test from './Test';

const connecting = withReactContent(Swal);
const setUpUsername = withReactContent(Swal);

const { ipcRenderer } = window.require('electron');
//  HashRouter as Router,
function MainMulti() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      connecting.fire({
        icon: 'info',
        title: 'Connecting to world',
        showCancelButton: true,
        allowOutsideClick: false,
        didOpen: () => {
          connecting.showLoading()
        }
      })
      ipcRenderer.invoke('multi', 'http://localhost:4000').then(() => {
        connecting.close()
        setUpUsername.fire({
          title: 'Setup you username',
          input: 'text',
          showCancelButton: false,
          allowOutsideClick: false,
        }).then(res=>{
          ipcRenderer.invoke('setUsername', res.value).then((result: any) => {
            console.log(result);
            setReady(true);
          });
        })
      });
    })();
    return () => {
      ipcRenderer.invoke('leave');
    };
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
    </>
  );
}

export default MainMulti;
