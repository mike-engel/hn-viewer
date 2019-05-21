import React, { memo } from "react";
import styled from "styled-components";
import { Stylable } from "../../types/component.types";
import { spacing } from "../../utils/spacing.utils";

type Props = Stylable;

export const RawStoryPlaceholder = memo(({ className }: Props) => (
  <li className={className}>
    <svg width={269} height={37} fill="none">
      <g clipPath="url(#a)">
        <rect y={25} width={130} height={12} rx={2} fill="url(#b)" />
        <rect width={269} height={16} rx={2} fill="url(#c)" />
      </g>
      <defs>
        <linearGradient
          id="b"
          x1="18.8476"
          y1="20.5"
          x2="22.8379"
          y2="41.4369"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DAE0E6" />
          <stop offset={1} stopColor="#C2C7CC" />
        </linearGradient>
        <linearGradient id="c" x1={39} y1={-6} x2="42.5" y2="22.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAE0E6" />
          <stop offset={1} stopColor="#C2C7CC" />
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
