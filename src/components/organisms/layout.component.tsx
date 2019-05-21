import React, { ReactNode, memo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "../molecules/header.component";
import { Footer } from "../molecules/footer.component";
import { fontFamily } from "../atoms/typography.component";
import { maxWidth, spacing } from "../../utils/spacing.utils";
import { Stylable } from "../../types/component.types";
import Helmet from "react-helmet";

type Props = Stylable & {
  children: ReactNode;
};

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;

    &:focus:not(:focus-visible) { outline: none }
  }

  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    position: relative;
    font-style: normal;
    font-weight: 400;
    font-family: ${fontFamily};
    font-size: 16px;
    line-height: 1.4;
  }

  @media(prefers-reduced-motion: reduce) {
    *,
    *:before,
    *:after {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export const RawLayout = memo(({ children, className }: Props) => (
  <div className={className}>
    <Helmet link={[{ rel: "manifest", href: "/manifest.json" }]} />
    <GlobalStyles />
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
));

export const Layout = styled(RawLayout)`
  main {
    width: 90vw;
    max-width: ${maxWidth}px;
    margin: ${spacing(4)}px auto;
  }
`;
