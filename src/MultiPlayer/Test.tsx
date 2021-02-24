import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import MasterTest from '../MasterTest/MasterTest';
const { ipcRenderer } = window.require('electron');

const TEST = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Holder = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Lobby = styled.button`
  display: flex;
  flex: 1;
  justify-content: center;
  background: #cdb4db;
  margin: 5px 5px 5px 5px;
  padding: 5px 15px;
  border: 5px solid #73ac76;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  &:hover {
    background: #b7e4c7;
  }
`;
const Export = styled.button`
  display: flex;
  flex: 1;
  justify-content: center;
  background: #ade8f4;
  margin: 5px 5px 5px 5px;
  padding: 5px 15px;
  border: 5px solid #0096c7;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  &:hover {
    background: #00b4d8;
  }
`;

function Test() {
  const [test, setTest] = useState(null);
  const [lobby, setLobby] = useState(false);
  useEffect(() => {
    ipcRenderer.invoke('test').then((t: any) => {
      setTest(t);
    });
  }, []);
  return (
    <>
      <TEST>
        {test ? <MasterTest test={test}></MasterTest> : null}
        {test ? (
          <Holder>
            <Lobby
              onClick={() => {
                setLobby(true);
              }}
            >
              <b>
                <span className="icofont-arrow-right icofont-rotate-180 icofont-1x"></span>{' '}
                Back To Lobby
              </b>
            </Lobby>
            <Export
              onClick={() => {
                ipcRenderer.invoke('exporTest');
              }}
            >
              <b>Export Test</b>
            </Export>
          </Holder>
        ) : null}
        {lobby ? <Redirect to="/multiplayer"></Redirect> : null}
      </TEST>
    </>
  );
}
export default Test;
