import React, { memo } from "react";
import styled from "styled-components";
import { Stylable } from "../../types/component.types";
import { ExternalLink, Text, Span } from "../atoms/typography.component";
import { darkGrey } from "../atoms/color.component";
import { NewsItem as NewsItemShape } from "../../types/hn.types";
import { formatDate } from "../../utils/date.utils";
import { spacing } from "../../utils/spacing.utils";

type Props = Stylable & NewsItemShape;

export const RawNewsItem = memo(({ title, url, by, time, className }: Props) => (
  <li className={className}>
    <Text>
      <ExternalLink href={url}>{title}</ExternalLink>
    </Text>
    <Span color={darkGrey} level={4}>
      {by} :: {formatDate(time)}
    </Span>
  </li>
));

export const NewsItem = styled(RawNewsItem)`
  ${Text} + ${Span} {
    margin-top: 0 !important;
  }

  & + &,
  & + svg {
    margin-top: ${spacing(2)}px;
  }
`;
