import { useState } from 'react';
import styled from 'styled-components';

import { AnswerInterface } from '../../helpers/testInterfaces';
import { CollectingAnswers, Multi } from '../../helpers/ReactInterfaces';

import AnswerDiv from '../MasterHolders/MasterMultiAnswerHolder';

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

const SubmmitUpdateButton = styled.button`
  display: flex;
  justify-content: center;
  padding: 5px 0;
  margin-top: 7px;
  border: 5px solid #f896d8;
  font-weight: bold;
  background: #efc7e5;
  border-radius: 10px;
  outline: none;
  transition: background 0.15s ease-in-out;
  &:hover {
    background: #e18ad4;
    outline: none;
  }
`;

function MasterMulti(props: Multi) {
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
    if (answers.length) {
      ipcRenderer.invoke(
        'answerAdded',
        { username: 'Me', answer: answers },
        props.guestionId
      );
    } else {
      ipcRenderer.invoke('answerDeleted', 'Me', props.guestionId);
    }
  };

  const chandleChange = (answer: AnswerInterface) => {
    const update: any = answers;
    if (answers.length) {
      const findX = answers.findIndex((a: any) => a.id === answer.id);
      if (findX >= 0) {
        update.splice(findX, 1);
      } else {
        update.push(answer);
      }
    } else {
      update.push(answer);
    }
    setAnswers(update);
    submmitAnswer()
    console.log(update);
  };

  return (
    <>
      <AnswersHolder>
        <b>Ansewrs:</b>
        {Collection.map((a) => (
          <AnswerDiv
            answer={a}
            key={a.answer.id}
            handler={chandleChange}
            chceck={answers}
          ></AnswerDiv>
        ))}
      </AnswersHolder>
    </>
  );
}
export default MasterMulti;
//answers.findIndex((at: any) => at.id === a.answer.id) >= 0? true : false
