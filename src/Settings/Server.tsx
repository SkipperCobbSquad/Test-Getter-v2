import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const { ipcRenderer } = window.require('electron');

const Connection = withReactContent(Swal);
const LoginSwal = withReactContent(Swal);

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
  width: 12rem;
  flex-direction: column;
  color: #000;
  background: #adb5bd;
  border: 7px solid #495057;
  border-radius: 10px;
  margin: 0 20px 0 0;
`;

const PSatus = styled.p`
  padding: 0;
  margin: 5px;
`;

const ServerWraper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 6px 0 6px;
`;

const LastServersDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  color: #000;
  background: #ffc8dd;
  border: 7px solid #7251b5;
  border-radius: 10px;
  min-height: 5.3rem;
  max-height: 5.3rem;
  overflow-y: auto;
`;

const LastServerP = styled.p`
  background: #ffc8dd;
  border: 3px solid #cdb4db;
  border-radius: 10px;
  text-align: center;
  padding: 1px 0;
  margin: 2px 5px;
  cursor: pointer;
  user-select: none;
  &:hover{
    border-color: #7251b5;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #6930c3a0;
  }
`;

export default function Server() {
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');
  const [lastServers, setLastServers] = useState(['']);

  useEffect(() => {
    const conn = JSON.parse('' + sessionStorage.getItem('connection'));
    if (conn?.connected) {
      setInput(conn.url);
      setMode(conn.mode);
      setUser(conn.username);
    }
    const servers = JSON.parse('' + localStorage.getItem('lastServers'));
    if (servers) {
      setLastServers(() => {
        const lastS = [...servers];
        return lastS;
      });
    } else {
      setLastServers((last) => {
        const lastS: Array<string> = [];
        return lastS;
      });
    }
  }, []);

  const addServer = (url: string) => {
    setLastServers((last) => {
      const lastS = [...last];
      if (!lastS.find((urlIn) => urlIn === url)) {
        lastS.length < 5 ? lastS.push(url) : lastS.splice(0, 1, url);
        localStorage.setItem('lastServers', JSON.stringify(lastS));
      }
      return lastS;
    });
  };

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
                  addServer(input);
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
    <>
      <StyledInput
        placeholder="Input server URL"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
      ></StyledInput>
      <PlaceHolder>
        <ServerWraper>
          <LastServersDiv>
            <b>
              Last Five Servers:{' '}
              <i className="icofont-arrow-right icofont-rotate-90"></i>
            </b>
            {lastServers.length
              ? lastServers.map((server, idx) => (
                  <LastServerP key={idx} onClick={() => setInput(server)}>
                    {server}
                  </LastServerP>
                ))
              : null}
          </LastServersDiv>
        </ServerWraper>
        <StatusDiv>
          <PSatus>Status: {mode ? 'online' : 'offline'}</PSatus>
          <PSatus>Server Mode: {mode} </PSatus>
          <PSatus>User : {user}</PSatus>
        </StatusDiv>
        <ConnButton onClick={registerConnect}>
          <b> {mode ? 'Re Connect' : 'Connect'}</b>
        </ConnButton>
      </PlaceHolder>
    </>
  );
}
//TODO: LastServers -> backend
