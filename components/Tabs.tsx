import React from "react";
import styled from "styled-components";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (p: string) => void;
}

const StyledTabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const StyleTab = styled.span<any>`
  font-size: 1.5rem;
  cursor: pointer;
  ${(props) =>
    props.active
      ? `
    border-bottom: 2px solid black;
  `
      : `
    color:#999
  `}
`;

const Tabs = ({ tabs, activeTab, onTabClick }: TabsProps) => {
  return (
    <StyledTabs>
      {tabs.map((tabName, i) => (
        <StyleTab
          key={i}
          active={activeTab === tabName}
          onClick={() => onTabClick(tabName)}
        >
          {tabName}
        </StyleTab>
      ))}
    </StyledTabs>
  );
};

export default Tabs;
