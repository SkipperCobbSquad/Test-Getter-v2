import { useState } from 'react';
import styled from 'styled-components';

import Question from './MasterQuestion';

const MainDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  margin-top: 0px
`;

function MasterTest(props: any) {
  return <MainDiv>{props.test.questions.map((q: any) => <Question key={q.id} quest={q}></Question>)}</MainDiv>;
}
export default MasterTest;
