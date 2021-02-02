import { useState } from 'react';
import styled from 'styled-components';
import { UserAnswer } from '../../helpers/testInterfaces';

const { ipcRenderer } = window.require('electron');

const StyledTextArea = styled.textarea`
  height: 5rem;
  background: #ffe5d9;
  border-radius: 10px;
  padding: 5px;
  margin: 5px 0;
  outline: none;
  resize: none;
  overflow: auto;
  &:focus {
    outline: none;
  }
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

function MasterDesc(props: any) {
  const [input, setInput] = useState('');
  const answers: Array<UserAnswer> = props.answers;
  const submmitAnswer = () => {
    if (input.length) {
      ipcRenderer.invoke(
        'answerAdded',
        { username: 'Me', answer: [input] },
        props.guestionId
      );
    }
  };
  return (
    <>
      {answers.map((a: UserAnswer) => {
        return (
          <p key={a.username}>
            <b>{a.username}: </b>
            {a.answer}
          </p>
        );
      })}
      <StyledTextArea
        placeholder="Enter your answer"
        onChange={(e: any) => {
          setInput(e.target.value);
        }}
        value={input}
      ></StyledTextArea>
      <button onClick={submmitAnswer}>Submmit</button>
    </>
  );
}
export default MasterDesc;
