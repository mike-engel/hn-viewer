import React from "react";
import styled from "styled-components";
import { Stylable } from "../../types/component.types";
import { ExternalLink, Text, Span } from "../atoms/typography.component";
import { grey } from "../atoms/color.component";
import { NewsItem as NewsItemShape } from "../../types/hn.types";

type Props = Stylable & NewsItemShape;

export const RawNewsItem = ({ title, url, by, time, className }: Props) => (
  <li className={className}>
    <Text>
      <ExternalLink href={url}>{title}</ExternalLink>
    </Text>
    <div>
      <Span color={grey}>{by}</Span>
      {" | "}
      <Span color={grey}>{time}</Span>
    </div>
  </li>
);

export const NewsItem = styled(RawNewsItem)``;
