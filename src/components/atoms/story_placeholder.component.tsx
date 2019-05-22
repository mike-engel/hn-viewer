import React, { memo } from "react";
import styled from "styled-components";
import { Stylable } from "../../types/component.types";
import { spacing } from "../../utils/spacing.utils";

type Props = Stylable;

export const RawStoryPlaceholder = memo(({ className }: Props) => (
  <li className={className}>
    <svg width={269} height={37} fill="none">
      <g clipPath="url(#a)">
        <rect y={25} width={135} height={12} rx={2} fill="url(#c)" />
        <rect width={270} height={16} rx={2} fill="url(#b)" />
      </g>
      <defs>
        <linearGradient id="b" x1="0%" y1="0%" x2="200%" y2="0%">
          <stop offset="0%" stopColor="#C2C7CC" />
          <stop offset="0%" stopColor="#DAE0E6">
            <animate attributeName="offset" from="0%" to="200%" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="200%" stopColor="#C2C7CC" />
        </linearGradient>
        <linearGradient id="c" x1="0%" y1="0%" x2="200%" y2="0%">
          <stop offset="0%" stopColor="#C2C7CC" />
          <stop offset="0%" stopColor="#DAE0E6">
            <animate attributeName="offset" from="0%" to="400%" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="200%" stopColor="#C2C7CC" />
        </linearGradient>
        <clipPath id="a">
          <rect width={269} height={37} fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  </li>
));

export const StoryPlaceholder = styled(RawStoryPlaceholder)`
  padding-top: ${spacing(0.5)}px;
`;
