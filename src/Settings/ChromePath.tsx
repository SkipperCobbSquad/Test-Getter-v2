import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ChromePathDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ChromePathDropArea :any = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: ${(props: any)=> props.start? '5px dashed #8bffff':  '5px dashed #8f71ff'};
  border-radius: 10px;
  min-height: 5rem;
`;
const SubmitArea = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  display: flex;
  border: 5px solid #73ac76;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
`;

export default function ChromePath() {
  const [input, setInput] = useState('');
  const [startDropping , setStartDroping] = useState(false)
  useEffect(() => {
    const path = localStorage.getItem('chromePath');
    if (path) {
      setInput(path);
    }
  }, []);

  const savePath = (): void => {
    localStorage.setItem('chromePath', input);
  };

  return (
    <ChromePathDiv>
      <ChromePathDropArea
        onDragOver={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setStartDroping(true)
          console.log('hello');
        }}
        onDrop={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          const file: any = e.dataTransfer.files[0];
          const strArr: Array<string> = file.path.split('\\');
          console.log(strArr.join('/'));
        }}
        start={startDropping}
      ></ChromePathDropArea>
      <SubmitArea>
        <SaveButton onClick={() => {}}>
          <b>Save</b>
        </SaveButton>
      </SubmitArea>
    </ChromePathDiv>
  );
}
