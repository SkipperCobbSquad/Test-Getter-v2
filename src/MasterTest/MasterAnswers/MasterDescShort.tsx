import { useState } from 'react';
import styled from 'styled-components';
import { UserAnswer, QuestionType } from '../../helpers/testInterfaces';

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

const StyledShortInput = styled.input`
  background: #ffe5d9;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 5px 0;
  outline: none;
  border: none;
  &:focus {
    outline: none;
  }
`;

const SubmmitUpdateButton = styled.button`
  display: flex;
  justify-content: center;
  align-self: center;
  width: 50%;
  padding: 5px 0;
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

const UsersAnswers = styled.div`
  display: flex;
  flex 1;
  flex-direction: column;
  background: #b392ac;
  border-radius: 10px;
  padding: 5px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #6930c3a0;
  }
`;

const AnswerHolder = styled.div`
  display: flex;
  flex 1;
  padding: 5px;
  max-height: 19rem;
`;

const UserHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ecbcfd;
  padding: 5px;
  margin-right: 7px;
  border-radius: 10px;
`;

const StyledAnswerText = styled.p`
  flex: 1;
  padding: 5px 7px;
  margin: 0px;
  background: #d1b3c4;
  border-radius: 10px;
`;

function MasterDescShort(props: any) {
  const qType: QuestionType = props.qType;
  const [answered, setAnswered] = useState(false);
  const [input, setInput] = useState('');
  const answers: Array<UserAnswer> = props.UserAnswers;
  const submmitAnswer = () => {
    const uname: string = sessionStorage.getItem('connection')
      ? JSON.parse('' + sessionStorage.getItem('connection')).username
      : 'Me';
    if (input.length) {
      ipcRenderer.invoke(
        'answerAdded',
        { username: uname, answer: [input] },
        props.guestionId
      );
      setAnswered(true);
      setInput('');
    }
  };
  return (
    <>
      <UsersAnswers>
        <b>User Answers:</b>
        {answers.map((a: UserAnswer) => {
          return (
            <AnswerHolder key={a.username}>
              <UserHolder>
                <b title={a.username}>
                  {JSON.parse('' + sessionStorage.getItem('connection'))
                    .username === a.username
                    ? 'Me'
                    : a.username.slice(0, 2)}
                  :{' '}
                </b>
              </UserHolder>
              <StyledAnswerText>{a.answer}</StyledAnswerText>
            </AnswerHolder>
          );
        })}
      </UsersAnswers>
      {qType === QuestionType.SHORT_ANSWER ? (
        <StyledShortInput
          placeholder={answered ? 'Update answer' : 'Enter your answer'}
          onChange={(e: any) => {
            setInput(e.target.value);
          }}
          value={input}
        ></StyledShortInput>
      ) : (
        <StyledTextArea
          placeholder={answered ? 'Update answer' : 'Enter your answer'}
          onChange={(e: any) => {
            setInput(e.target.value);
          }}
          value={input}
        ></StyledTextArea>
      )}

      <SubmmitUpdateButton onClick={submmitAnswer}>
        {answered ? 'Update' : 'Submmit'}
      </SubmmitUpdateButton>
    </>
  );
}
export default MasterDescShort;
