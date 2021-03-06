import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { QuestionInterface, QuestionType } from '../helpers/testInterfaces';

import DescShrot from './MasterAnswers/MasterDescShort';
import Multi from './MasterAnswers/MasterMulti';
import Single from './MasterAnswers/MasterSingle';

const Latex: any = require('react-latex');
const ipcRenderer = window.require('electron').ipcRenderer.setMaxListeners(0);

const QuestDiv = styled.div`
  display: flex;
  flex-direction: column;
  background: #815ac0;
  padding: 5px;
  margin: 10px;
  border: 10px solid #6247aa;
  border-radius: 20px;
`;
const QuestTop = styled.div`
  flex: 1;
  flex-direction: column;
`;

const QuestPTop: any = styled.p`
  background: ${(props: any) => (props.qType ? '#b298dc' : '#e0aaff')};
  padding: 5px;
  border-radius: 10px;
  margin: 7px 0px;
`;

function MasterQuestion(props: any) {
  const qR: QuestionInterface = props.quest;
  const MasterQest = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(qR);
  useEffect(() => {
    (async () => {
      await ipcRenderer.on(
        'answerAdded',
        (e: any, question: QuestionInterface) => {
          if (question.id === q.id) {
            setQ(question);
          }
        }
      );
      await ipcRenderer.on(
        'answerDeleted',
        (e: any, question: QuestionInterface) => {
          if (question.id === q.id) {
            setQ(question);
          }
        }
      );

      await ipcRenderer.on('focus', (e: any, id: number) => {
        if (q.id === id) {
          MasterQest?.current?.scrollIntoView();
        }
      });
    })();
    // return ()=>{ipcRenderer.removeAllListeners('answerAdded', 'answerDeleted'); console.log('Here1');}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answerPicker = (type: QuestionType) => {
    if (
      type === QuestionType.DESCRIPTIVE ||
      type === QuestionType.SHORT_ANSWER
    ) {
      return (
        <DescShrot
          qType={type}
          guestionId={q.id}
          UserAnswers={q.UsersAnswers}
        ></DescShrot>
      );
    } else if (type === QuestionType.MULTI_ANSWER) {
      return (
        <Multi
          guestionId={q.id}
          answers={q.answers}
          UserAnswers={q.UsersAnswers}
          latex={q.hasLatex}
        ></Multi>
      );
    } else {
      return (
        <Single
          guestionId={q.id}
          answers={q.answers}
          UserAnswers={q.UsersAnswers}
          latex={q.hasLatex}
        ></Single>
      );
    }
  };

  return (
    <QuestDiv ref={MasterQest}>
      <QuestTop>
        <QuestPTop>
          {q.hasLatex ? <Latex>{q.question}</Latex> : q.question}
        </QuestPTop>
        <QuestPTop qType>Question type: {q.type}</QuestPTop>
      </QuestTop>
      {answerPicker(q.type)}
    </QuestDiv>
  );
}
export default MasterQuestion;
