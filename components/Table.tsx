import { reactChildren } from "@/types";
import React from "react";
import styled from "styled-components";

const Table = (
  props: reactChildren & React.TableHTMLAttributes<HTMLTableElement>
) => {
  const StyledTable = styled.table`
    width: 100%;
    th {
      text-align: left;
      text-transform: uppercase;
      color: #aaa;
      font-weight: 500;
      font-size: 0.7rem;
    }
    td {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  `;

  return <StyledTable>{props.children}</StyledTable>;
};

export default Table;
