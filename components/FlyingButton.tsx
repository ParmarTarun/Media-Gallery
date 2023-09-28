// @ts-nocheck

import styled, { css } from "styled-components";
import { ButtonStyle } from "./Button";
import { primary } from "@/lib/colors";
import FB from "react-flying-item";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const FlyingButtonsWrapper = styled.div`
  button {
    ${ButtonStyle};
    ${(props) =>
      props.main
        ? `
        color: white;
        background-color: ${primary};  
      `
        : `
        color: ${primary};
        border: 1px solid ${primary};
        background-color: transparent;    
      `}
    ${(props) =>
      props.white &&
      `
        border: 1px solid white;
        background-color: white;  
        color:#000
      `}
  }
`;

const FlyingButton = (props) => {
  const { addProductToCart } = useContext(CartContext);
  const { id } = props;
  return (
    <FlyingButtonsWrapper
      main={props.main}
      white={props.white}
      onClick={() => addProductToCart(id as ObjectId)}
    >
      <FB
        {...props}
        targetTop={"5%"}
        targetLeft={"95%"}
        flyingItemStyling={{
          height: "auto",
          width: "auto",
          maxHeight: "50px",
          maxWidth: "50px",
          borderRadius: 0,
        }}
      >
        {props.children}
      </FB>
    </FlyingButtonsWrapper>
  );
};

export default FlyingButton;
