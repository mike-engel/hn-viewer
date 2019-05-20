import { HTMLProps } from "react";
import styled from "styled-components";
import { black, pSBC } from "./color.component";
import { spacing } from "../../utils/spacing.utils";
import { propOr } from "../../utils/fp.utils";

export enum FontStyle {
  Italic = "italic",
  Normal = "normal",
  Inherit = "inherit"
}

export enum FontWeight {
  Regular = "400",
  Semibold = "500",
  Inherit = "inherit"
}

type FontSize = {
  [key: string]: string;
};

type TypeProps = {
  color?: string;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  level?: 1 | 2 | 3 | 4 | 5 | "inherit";
  displayLevel?: 1 | 2 | 3 | 4 | 5 | "inherit";
};

export type HeadingProps = TypeProps & HTMLProps<HTMLDivElement>;

export type TextProps = TypeProps & HTMLProps<HTMLParagraphElement>;

export type LinkProps = TypeProps & HTMLProps<HTMLAnchorElement>;

export const fontFamily =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

// Perfect fourth
export const fontSize: FontSize = {
  level1: "2.0000rem",
  level2: "1.4375rem",
  level3: "1.0000rem",
  level4: "0.7500rem",
  level5: "10px",
  inherit: "1em"
};

export const Heading = styled("div").attrs<HeadingProps>(({ level }) => ({
  role: "heading",
  "aria-level": level || 1
}))<HeadingProps>`
  max-width: 40em;
  color: ${propOr(black, "color")};
  font-size: ${({ level, displayLevel }) => fontSize[`level${displayLevel || level || 1}`]};
  font-weight: ${propOr(FontWeight.Semibold, "fontWeight")};
  font-style: ${propOr(FontStyle.Normal, "fontStyle")};
  line-height: 1.2;
  margin: 0;

  & + * {
    margin-top: ${spacing(2)}px !important;
  }
`;

export const Text = styled("p")<TextProps>`
  max-width: 40em;
  color: ${propOr(black, "color")};
  font-size: ${({ level, displayLevel }: TextProps) =>
    fontSize[`level${displayLevel || level || 3}`]};
  font-weight: ${propOr(FontWeight.Regular, "fontWeight")};
  font-style: ${propOr(FontStyle.Normal, "fontStyle")};
  line-height: 1.4;
  margin: 0;

  & + * {
    margin-top: ${spacing(2)}px !important;
  }
`;

export const Span = styled(Text).attrs(() => ({ as: "span" }))``;

Span.defaultProps = {
  color: "inherit",
  fontWeight: FontWeight.Inherit,
  fontStyle: FontStyle.Inherit
};

export const Link = styled("a")<LinkProps>`
  display: inline-block;
  text-decoration: none;
  color: ${propOr(black, "color")};
  font-size: ${({ level, displayLevel }: LinkProps) =>
    fontSize[`level${displayLevel || level || 3}`]};
  font-weight: ${propOr(FontWeight.Regular, "fontWeight")};
  font-style: ${propOr(FontStyle.Normal, "fontStyle")};
  border-bottom: 1px solid ${black};
  line-height: 1.2;
  margin: 0;
  transition: color 150ms, border-color 150ms;

  @media (hover) {
    &:hover {
      color: ${pSBC(0.5, black)};
      border-color: ${pSBC(0.5, black)};
    }
  }
`;

Link.defaultProps = {
  fontWeight: FontWeight.Inherit,
  fontStyle: FontStyle.Inherit,
  level: "inherit"
};

export const ExternalLink = styled(Link).attrs(() => ({ target: "_blank" }))``;
