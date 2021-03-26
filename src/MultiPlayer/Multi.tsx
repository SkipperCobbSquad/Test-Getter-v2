import { useState, useEffect } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const { ipcRenderer } = window.require('electron');

const status = withReactContent(Swal);

const MainMultieDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const RefreshDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const RefreshIcon = styled.span`
  cursor: pointer;
`;

const TestsDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const SingleTestDiv: any = styled.div`
  display: flex;
  justify-content: center;
  color: #000;
  background: #ffc8dd;
  border-radius: 10px;
  margin: 7px;
  padding: 10px;
  cursor: pointer;
  border: ${(props: any) =>
    props.selected ? '5px solid #73ac76' : '5px solid #cdb4db'};
`;

const StarterDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0 0 10px 0;
`;

const CreateButton = styled.button`
  flex: 1;
  text-decoration: none;
  outline: none;
  border: 5px solid #9d4edd;
  border-radius: 7px;
  padding: 6px;
  cursor: pointer;
  margin: 0 5px;
  background: #f3c4fb;
`;

const JoinButton: any = styled.button`
  flex: 1;
  text-decoration: none;
  outline: none;
  border: 5px solid ${(props: any) => (props.ready ? '#6247aa' : '#adb5bd')};
  border-radius: 10px;
  padding: 6px 10px;
  cursor: ${(props: any) => (props.ready ? 'pointer' : 'not-allowed')};
  margin: 0 5px;
  background: ${(props: any) => (props.ready ? '#e0aaff' : '#ced4da')};
`;

function SingleAnswer(props: any) {
  const [clicked, setClicked] = useState(false);
  const chandleClick = () => {
    props.callback(props.test);
    setClicked(!clicked);
  };
  return (
    <SingleTestDiv selected={clicked} onClick={() => chandleClick()}>
      {props.test}
    </SingleTestDiv>
  );
}

function Multi() {
  const [ready, setReady] = useState(false);
  const [tests, setTests] = useState([]);
  const [joinTo, setJoinTo] = useState('');
  let { path } = useRouteMatch();
  useEffect(() => {
    ipcRenderer.invoke('tests').then((tests: any) => {
      console.log(tests);
      setTests(tests);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = () => {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2'],
    })
      .queue([
        {
          title: 'Input test name',
          inputValidator: (value) => {
            if (tests.find((t: string) => t === value)) {
              return 'This test exist!';
            } else if (value.length === 0) {
              return 'You must give name to test';
            } else return null;
          },
        },
        'Input test URL',
      ])
      .then((result: any) => {
        if (result.value) {
          status.fire({
            title: 'Getting test',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          ipcRenderer
            .invoke('registerTest', result.value[1], result.value[0])
            .then(() => {
              status.close();
              setReady(true);
            })
            .catch((err: string) => {
              status.close();
              status.fire({
                icon: 'error',
                title: 'Error',
                text: err,
              });
            });
        }
      });
  };

  const handleSelect = (testC: string) => {
    if (testC === joinTo) {
      setJoinTo('');
    } else {
      setJoinTo(testC);
    }
  };

  return (
    <MainMultieDiv>
      <RefreshDiv>
        <RefreshIcon
          className="icofont-cloud-refresh icofont-3x"
          onClick={() => {
            ipcRenderer.invoke('tests').then((tests: any) => {
              setTests(tests);
            });
          }}
        ></RefreshIcon>
      </RefreshDiv>
      <TestsDiv>
        <b>Avilable tests:</b>
        {tests.length ? (
          tests.map((test) => (
            <SingleAnswer
              key={test}
              test={test}
              callback={(test: any) => {
                console.log(joinTo);
                handleSelect(test);
              }}
            ></SingleAnswer>
          ))
        ) : (
          <SingleTestDiv>No tests!!!</SingleTestDiv>
        )}
      </TestsDiv>
      <StarterDiv>
        <CreateButton onClick={register}>Create My Own</CreateButton>
        <JoinButton
          ready={joinTo.length ? true : false}
          onClick={() => {
            if (joinTo.length) {
              ipcRenderer
                .invoke('JoinTest', joinTo)
                .then(() => {
                  setReady(true);
                })
                .catch((err: string) => {
                  status.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err,
                  });
                });
            }
          }}
        >
          Join
        </JoinButton>
      </StarterDiv>
      {ready ? <Redirect to={`${path}/test`}></Redirect> : null}
    </MainMultieDiv>
  );
}

export default Multi;
