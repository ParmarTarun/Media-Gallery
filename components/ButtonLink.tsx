import Link from "next/link";
import { styled } from "styled-components";
import { ButtonStyle } from "./Button";
import { ButtonStyleProps } from "@/types";
import { ReactHTML } from "react";

const StyledLink = styled(Link)<ButtonStyleProps>`
  ${ButtonStyle}
`;

const ButtonLink = (props: any) => {
  return <StyledLink {...props} />;
};

export default ButtonLink;
