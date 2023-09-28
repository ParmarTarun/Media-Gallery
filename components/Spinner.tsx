import React from "react";
import { MoonLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;

const Spinner = () => {
  return (
    <Wrapper>
      <MoonLoader color="#555" />
    </Wrapper>
  );
};

export default Spinner;
