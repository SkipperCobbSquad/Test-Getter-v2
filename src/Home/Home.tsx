import styled from 'styled-components';
const { shell } = window.require('electron')
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

const StyledA = styled.a`
  width: 10%;
  margin: 2px 10px;
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
        <p onClick={()=>{shell.openExternal("https://github.com/lukgla")}}>
          <b>Created By:</b>
        </p>
        <GitHolder>
          <StyledA
            href="https://github.com/SzymonFaligowski"
            target="_blank"
            rel="noreferrer"
          >
            <GitProfile
              src="https://avatars.githubusercontent.com/u/46247235?s=460&u=69a23997164775b4446de1822779612593880465&v=4"
              alt="Skipper"
            ></GitProfile>
          </StyledA>
          <StyledA
            href="https://github.com/lukgla"
            target="_blank"
            rel="noreferrer"
          >
            <GitProfile
              src="https://avatars.githubusercontent.com/u/52761889?s=400&v=4"
              alt="lukgla"
            ></GitProfile>
          </StyledA>
        </GitHolder>
      </CreatedBy>
    </MainHomeDiv>
  );
}

export default Home;
