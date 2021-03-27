// import { useState, useEffect } from 'react';
import styled from 'styled-components';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

import ServerSettings from './Server';
import ChromePath from './ChromePath';

// const { ipcRenderer } = window.require('electron');

const MainDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
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

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
`;

const SectionHader = styled.h1`
  text-align: right;
  padding: 0 0 5px 0;
  border-bottom: 4px dashed #cdb4db;
`;

function Settings() {

  return (
    <MainDiv>
      <StyledSection>
        <SectionHader>Server Settings</SectionHader>
        <ServerSettings></ServerSettings>
      </StyledSection>
      <StyledSection>
        <SectionHader>Chrome Path</SectionHader>
        <ChromePath></ChromePath>
      </StyledSection>
    </MainDiv>
  );
}

export default Settings;
