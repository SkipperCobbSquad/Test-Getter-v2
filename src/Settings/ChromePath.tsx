import { useState, useEffect } from 'react';
import styled from 'styled-components';

const { ipcRenderer } = window.require('electron');

const ChromePathDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ChromePathDropArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  text-align: center;
  background: #ffc8dd0f;
  border: 5px dashed #8f71ff;
  border-radius: 10px;
  min-height: 7rem;
`;
//  border: ${(props: any)=> props.start? '5px dashed #8bffff':  '5px dashed #8f71ff'};

const DropAreaPWrapper = styled.div`
  flex: 1;
  text-align: center;
`;

const DropAreaP = styled.p`
  flex: 1;
  color: #ffffffbf;
  user-select: none;
`;

const SubmitArea = styled.div`
  display: flex;
  flex: 1;
  margin: 8px 0 0 0;
`;

const SaveButton = styled.button`
  flex: 1;
  align-content: center;
  text-align: center;
  background: #4da8da;
  border: 5px solid #007cc7;
  border-radius: 10px;
  padding: 3px 0;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  &:hover {
    color: #fff;
  }
`;

export default function ChromePath() {
  const [input, setInput] = useState('');
  const [info, setInfo] = useState('');
  const [startDropping, setStartDroping] = useState('');
  useEffect(() => {
    const path = localStorage.getItem('chromePath');
    if (path) {
      setInput(path);
    } else {
      localStorage.setItem('chromePath', '');
    }
  }, []);

  const savePath = (path: Array<string>): void => {
    if (path[path.length - 1] !== 'chrome.exe') {
      setInfo('Error: No chrome binary found');
      clearInfo();
    } else {
      const finalPath: string = path.join('/');
      //TODO: Backend here
      ipcRenderer
        .invoke('customChromePath', finalPath)
        .then(() => {
          localStorage.setItem('chromePath', finalPath);
          setInput(finalPath);
          setInfo('Successful change path');
          clearInfo();
        })
        .catch((err: string) => {
          setInfo(err);
          clearInfo();
        });
    }
  };

  const clearInfo = () =>
    setTimeout(() => {
      setInfo('');
    }, 3000);

  return (
    <ChromePathDiv>
      <ChromePathDropArea
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // setStartDroping('true')
          // console.log('hello');
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('hello');
        }}
        onDrop={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          const file: any = e.dataTransfer.files[0];
          const strArr: Array<string> = file.path.split('\\');
          savePath(strArr);
          console.log(strArr.join('/'));
        }}
        // start={startDropping}
      >
        <DropAreaPWrapper>
          <DropAreaP>Path is set to: {input ? input : 'Default'}</DropAreaP>
          {info ? <DropAreaP>{info}</DropAreaP> : null}
        </DropAreaPWrapper>
      </ChromePathDropArea>
      <SubmitArea>
        <SaveButton
          onClick={() => {
            if (input !== '') {
              //TODO: Backend here
              ipcRenderer
                .invoke(
                  'customChromePath',
                  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
                )
                .then(() => {
                  localStorage.setItem('chromePath', '');
                  setInput('');
                  setInfo('Successful chanage to Default');
                  clearInfo();
                })
                .catch((err: string) => {
                  setInfo(err);
                  clearInfo();
                });
            }
          }}
        >
          <b>Set To Default</b>
        </SaveButton>
      </SubmitArea>
    </ChromePathDiv>
  );
}
