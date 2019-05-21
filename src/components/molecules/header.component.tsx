import React, { ReactNode, memo } from "react";
import styled from "styled-components";
import { Heading } from "../atoms/typography.component";
import { Stylable } from "../../types/component.types";
import { spacing, maxWidth } from "../../utils/spacing.utils";
import { white, black } from "../atoms/color.component";

type Props = Stylable & {
  children?: ReactNode;
};

export const RawHeader = memo(({ children = "HN Viewer", className }: Props) => (
  <header className={className}>
    <Heading displayLevel={2} color={white}>
      {children}
    </Heading>
  </header>
));

export const Header = styled(RawHeader)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing(3)}px 0;
  background: ${black};

  ${Heading} {
    width: 90vw;
    max-width: ${maxWidth}px;
  }
`;
