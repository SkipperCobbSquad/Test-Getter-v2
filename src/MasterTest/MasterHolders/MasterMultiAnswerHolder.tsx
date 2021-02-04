import { useState } from 'react';
import styled from 'styled-components';

const AnswerDiv: any = styled.div`
  display: flex;
  background: #ffc8dd;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  margin: 7px;
  cursor: pointer;
  border: ${(props: any) =>
    props.selected ? '5px solid #73ac76' : '5px solid #cdb4db'};
`;
const AnswerPHolder = styled.p`
  margin: 5px;
`;
const UserHolder = styled.p`
  margin: 5px;
`;

function MasterAnswerHolder(props: any) {
  const [clicked, setClicked] = useState(false);
  return (
    <AnswerDiv
      selected={clicked}
      onClick={() => {
        setClicked(!clicked);
        props.handler(props.answer.answer);
      }}
    >
      <AnswerPHolder>{props.answer.answer.description}</AnswerPHolder>
      <UserHolder>{props.answer.users.length}</UserHolder>
    </AnswerDiv>
  );
}

export default MasterAnswerHolder;
