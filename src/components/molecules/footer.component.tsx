import React from "react";
import styled from "styled-components";
import { Stylable } from "../../types/component.types";
import { ExternalLink, Text } from "../atoms/typography.component";
import { maxWidth, spacing } from "../../utils/spacing.utils";
import { grey } from "../atoms/color.component";

type Props = Stylable;

export const RawFooter = ({ className }: Props) => (
  <footer className={className}>
    <Text level={4}>
      ©{new Date().getFullYear()}, Built by
      {` `}
      <ExternalLink href="https://mike-engel.com">Mike Engel</ExternalLink>
    </Text>
  </footer>
);

export const Footer = styled(RawFooter)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing(2)}px 0;
  border-top: 1px solid ${grey};

  ${Text} {
    width: 100%;
    max-width: ${maxWidth}px;
  }
`;
