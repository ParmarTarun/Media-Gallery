import { primary } from "@/lib/colors";
import { ButtonStyleProps, reactChildren } from "@/types";
import React from "react";
import { css, styled } from "styled-components";

export const ButtonStyle = css<ButtonStyleProps>`
  border: 0;
  color: #fff;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  svg {
    height: 16px;
    margin-right: 5px;
  }
  ${(props) =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}
  ${(props) =>
    props.whiteOnWhite &&
    css`
      background-color: #eee;
      color: #000;
    `}
  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}
  ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}
  ${(props) =>
    props.primary &&
    css`
      background-color: ${primary};
      color: #fff;
      border: 1px solid ${primary};
    `}
  ${(props) =>
    props.primary &&
    props.outline &&
    css`
      background-color: transparent;
      color: ${primary};
      border: 1px solid ${primary};
    `}
  ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 18px 20px;
      svg {
        height: 20px;
      }
    `}
`;

const StyledButton = styled.button<ButtonStyleProps>`
  ${ButtonStyle}
`;

const Button = ({
  children,
  ...rest
}: reactChildren &
  ButtonStyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

export default Button;
