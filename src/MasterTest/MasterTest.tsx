import { useEffect, useState } from 'react';
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
  // const test = props.test;
  // const questions = props.test.questions;
  const [test, setTest] = useState(props.test)
  useEffect(() => {
    (async () => {
      await ipcRenderer.on('questionAdded', (e: any, t: any) => {
        setTest(t)
      });
    })();
    return () => {
      ipcRenderer.invoke('leave');
      ipcRenderer.removeAllListeners('answerAdded', 'answerDeleted','questionAdded');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MainDiv>
      {test.questions.map((q: any) => (
        <Question key={q.id} quest={q}></Question>
      ))}
    </MainDiv>
  );
}
export default MasterTest;
