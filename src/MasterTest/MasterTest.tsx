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
  const [test, setTest] = useState(props.test)
  useEffect(() => {
    (async ()=>{
      await ipcRenderer.on('questionAdded', (e:any, quest: any)=>{
         const update = test.questions.push(quest)
         setTest(update)
      })
    })()
    return () => {
      ipcRenderer.invoke('leave')
      ipcRenderer.removeAllListeners('answerAdded', 'answerDeleted');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
