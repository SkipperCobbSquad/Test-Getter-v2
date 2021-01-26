import styled from 'styled-components';

const MainSinleDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  width: 40%;
  background: #7251b5;
  border: 5px solid #7251b5;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  display: flex;
  flex: 1;
  padding: 8px 6px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  outline: none;
`;

function Single() {
  return (
    <MainSinleDiv>
        <h1>SinglePlayer Mode</h1>
      <InputWrapper>
        <StyledInput placeholder="Input URL"></StyledInput>
        <i className="icofont-ui-play icofont-2x"></i>
      </InputWrapper>
    </MainSinleDiv>
  );
}

export default Single;
