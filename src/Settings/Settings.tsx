import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const { ipcRenderer } = window.require('electron');

const Connection = withReactContent(Swal);
const LoginSwal = withReactContent(Swal);

const MainDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionHader = styled.h1`
  text-align: right;
  padding: 0 0 5px 0;
  border-bottom: 4px solid #cdb4db;
`;

const StyledInput = styled.input`
  display: flex;
  flex: 1;
  padding: 8px 6px;
  margin: 0 0 5px 0;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  outline: none;
`;

const PlaceHolder = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 5px 0 0 0;
`;

const ConnButton = styled.button`
  display: flex;
  background: #d8f3dc;
  padding: 5px 7px;
  border: 5px solid #73ac76;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  &:hover {
    background: #b7e4c7;
  }
`;

const StatusDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  background: #adb5bd;
  border: 7px solid #495057;
  border-radius: 10px;
`;

const PSatus = styled.p`
  padding: 0;
  margin: 5px;
`;

function Settings() {
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const conn = JSON.parse('' + sessionStorage.getItem('connection'));
    if (conn?.connected) {
      setInput(conn.url);
      setMode(conn.mode);
      setUser(conn.username);
    }
  }, []);

  const loginProcedure = () => {
    ipcRenderer.once('socketStatus', (e: any, stat: any) => {
      if (Connection.isVisible() && stat.status === 'Ok') {
        Connection.close();
        setMode(stat.mode);
        LoginSwal.fire({
          title: 'Enter your credentials',
          text: `Your server operating in ${stat.mode} mode`,
          input: 'text',
          showCancelButton: false,
          allowOutsideClick: false,
          inputValidator: (value) => {
            return new Promise((res, rej) => {
              ipcRenderer
                .invoke('login', value)
                .then((result: any) => {
                  console.log(result);
                  setUser(result);
                  sessionStorage.setItem(
                    'connection',
                    JSON.stringify({
                      url: input,
                      mode: stat.mode,
                      username: result,
                      connected: true,
                    })
                  );
                  res(null);
                })
                .catch((err: string) => {
                  res(err);
                });
            });
          },
        });
      } else if (Connection.isVisible()) {
        Connection.close();
      }
    });
  };

  const registerConnect = () => {
    if (input) {
      ipcRenderer.invoke('connectSocket', input);
      Connection.fire({
        icon: 'info',
        title: 'Connecting...',
        showCancelButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Connection.showLoading();
        },
      });
      loginProcedure();
    }
  };

  return (
    <MainDiv>
      <StyledSection>
        <SectionHader>Server Settings</SectionHader>
        <StyledInput
          placeholder="Input server URL"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        ></StyledInput>
        <PlaceHolder>
          <StatusDiv>
            <PSatus>Status: {mode ? 'online' : 'offline'}</PSatus>
            <PSatus>Server Mode: {mode} </PSatus>
            <PSatus>User : {user}</PSatus>
          </StatusDiv>
          <ConnButton onClick={registerConnect}>
            <b> {mode ? 'Re Connect' : 'Connect'}</b>
          </ConnButton>
        </PlaceHolder>
      </StyledSection>
    </MainDiv>
  );
}

export default Settings;
