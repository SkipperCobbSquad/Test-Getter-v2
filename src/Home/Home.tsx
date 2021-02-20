import styled from 'styled-components';
const { shell } = window.require('electron');
const MainHomeDiv = styled.div`
    display: flex;
    flex 1;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
`;

const Description = styled.div`
  text-align: center;
`;

const CreatedBy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GitHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImgHolder = styled.div`
  width: 10%;
  margin: 2px 10px;
  cursor: pointer;
`;

const GitProfile = styled.img`
  width: 100%;
  height: auto;
`;

function Home() {
  return (
    <MainHomeDiv>
      <Description>
        <h1>Welcome to TestGetter</h1>
        <p>
          App that allow you and your friends colaborate on the same test with
          special <b>ingredients</b> &#128521;
        </p>
      </Description>
      <CreatedBy>
        <p>
          <b>Created By:</b>
        </p>
        <GitHolder>
          <StyledImgHolder
            onClick={() => {
              shell.openExternal('https://github.com/SkipperCobbSquad');
            }}
          >
            <GitProfile
              src="https://avatars.githubusercontent.com/u/46247235?s=460&u=69a23997164775b4446de1822779612593880465&v=4"
              alt="Skipper"
            ></GitProfile>
          </StyledImgHolder>
          <StyledImgHolder
            onClick={() => {
              shell.openExternal('https://github.com/lukgla');
            }}
          >
            <GitProfile
              src="https://avatars.githubusercontent.com/u/52761889?s=400&v=4"
              alt="lukgla"
            ></GitProfile>
          </StyledImgHolder>
        </GitHolder>
      </CreatedBy>
    </MainHomeDiv>
  );
}

export default Home;
