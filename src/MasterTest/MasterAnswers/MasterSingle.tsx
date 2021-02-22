import { useState } from 'react';
import styled from 'styled-components';

import { AnswerInterface } from '../../helpers/testInterfaces';
import { CollectingAnswers, SingleMulti } from '../../helpers/ReactInterfaces';

const { ipcRenderer } = window.require('electron');

const AnswersHolder = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #b392ac;
  border-radius: 10px;
  padding: 5px;
  overflow: auto;
`;

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

function MasterSingle(props: SingleMulti) {
  const [answers, setAnswers] = useState([]);
  const Collection: Array<CollectingAnswers> = [];

  for (const answer of props.answers) {
    const users: Array<string> = [];
    props.UserAnswers.forEach((UA) => {
      //I know this is bad but now this is only option <=> a refers to string | AnswerInterface so ts don not let me use a.id
      if (UA.answer.find((a: any) => a.id === answer.id)) {
        users.push(UA.username);
      }
    });
    Collection.push({ answer, users });
  }

  const submmitAnswer = () => {
    const uname: string = sessionStorage.getItem('connection')
      ? JSON.parse('' + sessionStorage.getItem('connection')).username
      : 'Me';
    if (answers.length) {
      ipcRenderer.invoke(
        'answerAdded',
        { username: uname, answer: answers },
        props.guestionId
      );
    } else {
      ipcRenderer.invoke('answerDeleted', uname, props.guestionId);
    }
  };

  const chandleChange = (answer: AnswerInterface) => {
    const update: any = answers;
    if (answers.length) {
      const findX = answers.findIndex((a: any) => a.id === answer.id);
      if (findX >= 0) {
        update.splice(0, 1);
      } else {
        update.splice(0, 1, answer);
      }
    } else {
      update.push(answer);
    }
    setAnswers(update);
    submmitAnswer();
    console.log(update);
  };
  return (
    <AnswersHolder>
      {Collection.map((a) => (
        <AnswerDiv
          key={a.answer.id}
          selected={answers.findIndex((an: any) => an.id === a.answer.id) === 0}
          onClick={() => {
            chandleChange(a.answer);
          }}
        >
          <AnswerPHolder>{a.answer.description}</AnswerPHolder>
          <UserHolder>{a.users.length}</UserHolder>
        </AnswerDiv>
      ))}
    </AnswersHolder>
  );
}
export default MasterSingle;
