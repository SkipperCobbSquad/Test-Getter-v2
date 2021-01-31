import { useState } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Home from '../Home/Home';
import Single from '../SinglePlayer/Main';
import Multi from '../MultiPlayer/Multi';
import Settings from '../Settings/Settings';

import styled from 'styled-components';

import './App.css';
import '../icofont/icofont.min.css';

const SwalBackToMenu = withReactContent(Swal);

const MainDiv = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  background: #7251b5;
`;

const MenuDiv = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  height: auto;
  border: solid 7px #7251b5;
  border-radius: 6px;
`;

const BarDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 5rem;
  background: #815ac0;
  padding: 0 5px;
  border: 10px solid #6247aa;
  border-radius: 20px;
  margin-right: 10px;
`;

const BarItem = styled.div`
  display: flex;
  justify-content: center;
  color: #d2b7e5;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 2px solid #d2b7e5;
  border-radius: 10px;
  transition: color 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out;
  &:hover {
    color: #fefefe;
    border-color: #fefefe;
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  outline: none;
`;

const ContentDiv = styled.div`
  display: flex;
  flex 1;
  padding: 10px;
  background: #fefefe;
  border: 10px solid #6247aa;
  border-radius: 20px;
`;

const BackToMenu = styled.div`
  display: flex;
  position: fixed;
  z-index: 10000;
  cursor: pointer;
`;

function App() {
  const [location, setLocation] = useState(false);

  const backToHome = ()=>{
    SwalBackToMenu.fire({
      icon: 'warning',
      title: 'Are you sure to exit?',
      showCancelButton: true,
      confirmButtonText: 'Go to Home!',
    }).then(result =>{
      if (result.isConfirmed){
        window.location.href= '/#/';
        setLocation(false)
      }
    })
  }

  return (
    <MainDiv>
      <MenuDiv>
        <Router>
          <BarDiv style={{ display: location ? 'none' : 'flex' }}>
            <BarItem title="Home">
              <StyledLink to="/">
                <i className="icofont-ui-home  icofont-3x"></i>
              </StyledLink>
            </BarItem>
            <BarItem title="SinglePlayer Mode">
              <StyledLink to="/singleplayer">
                <i
                  className="icofont-ui-user icofont-3x"
                  onClick={(e) => {
                    setLocation(true);
                  }}
                ></i>
              </StyledLink>
            </BarItem>
            <BarItem title="MultiPlayer Mode">
              <StyledLink to="/multiplayer">
                <i
                  className="icofont-globe icofont-3x"
                  onClick={(e) => {
                    setLocation(true);
                  }}
                ></i>
              </StyledLink>
            </BarItem>
            <BarItem title="Settings">
              <StyledLink to="/settings">
                <i className="icofont-settings-alt icofont-3x"></i>
              </StyledLink>
            </BarItem>
          </BarDiv>
          <ContentDiv>
            <BackToMenu title="Back To Home" style={{display: location? 'flex' : 'none'}} onClick={backToHome}>
              <i className="icofont-arrow-right icofont-rotate-180 icofont-2x"></i>
            </BackToMenu>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route path="/singleplayer" component={Single}></Route>
              <Route path="/multiplayer" component={Multi}></Route>
              <Route path="/settings" component={Settings}></Route>
            </Switch>
          </ContentDiv>
        </Router>
      </MenuDiv>
    </MainDiv>
  );
}

export default App;
