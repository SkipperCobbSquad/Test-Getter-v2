import { useState, useEffect } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

const { ipcRenderer } = window.require('electron');

const MainSingleDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  width: 40%;
  background: #7251b5;
  border: 5px solid #7251b5;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  display: flex;
  flex: 1;
  padding: 8px 6px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  outline: none;
`;

function Single() {
  let { path } = useRouteMatch();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [ready, setReady] = useState(false);
  const chandleChange = (e: any) => {
    setInput(e.target.value);
  };
  useEffect(() => {
    (async () => {
      await ipcRenderer.removeAllListeners()
      await ipcRenderer.on('getter-status', (e: any, stat: string) => {
        console.log(stat);
        if (stat === 'ready') {
          setReady(true);
        } else {
          setStatus(stat);
        }
      });
    })();
  }, []);

  return (
    <MainSingleDiv>
      <h1>SinglePlayer Mode</h1>
      <InputWrapper>
        <StyledInput
          placeholder="Input URL"
          onChange={chandleChange}
          value={input}
        ></StyledInput>
        <i
          className="icofont-ui-play icofont-2x"
          onClick={() => {
            ipcRenderer.invoke('get-test', input);
          }}
        ></i>
      </InputWrapper>
      <p>{status}</p>
      {ready ? <Redirect to={`${path}/test`}></Redirect> : null}
    </MainSingleDiv>
  );
}

export default Single;
