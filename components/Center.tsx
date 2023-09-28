import { reactChildren } from "@/types";
import { styled } from "styled-components";

const StyledDiv = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Center = ({ children }: reactChildren) => {
  return <StyledDiv>{children}</StyledDiv>;
};

export default Center;
