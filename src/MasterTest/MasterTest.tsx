import { useEffect } from 'react';
import styled from 'styled-components';

import Question from './MasterQuestion';

const { ipcRenderer } = window.require('electron');

const MainDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  margin-top: 0px;
  margin-right: 0px;
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #6930c3a0;
  }
`;

function MasterTest(props: any) {
  const test = props.test;
  useEffect(() => {
    return () => {
      ipcRenderer.invoke('leave')
      ipcRenderer.removeAllListeners('answerAdded', 'answerDeleted');
    };
  },[]);
  //TODO: This test is cleanTest() add ipc for listening new questions
  return (
    <MainDiv>
      {test.questions.map((q: any) => (
        <Question key={q.id} quest={q}></Question>
      ))}
    </MainDiv>
  );
}
export default MasterTest;
