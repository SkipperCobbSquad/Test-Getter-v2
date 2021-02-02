import styled from 'styled-components';

import Question from './MasterQuestion';


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

  return (
    <MainDiv>
      {test.questions.map((q: any) => (
        <Question key={q.id} quest={q}></Question>
      ))}
    </MainDiv>
  );
}
export default MasterTest;
