import React, { memo } from "react";
import Helmet, { HelmetProps } from "react-helmet";

type Props = {
  description?: string;
  lang?: string;
  meta?: HelmetProps["meta"];
  title: string;
};

export const SEO = memo(({ description = "", lang = "en", meta = [], title }: Props) => {
  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      meta={[
        {
          name: `description`,
          content: description
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: description
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: "@beardfury"
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: description
        }
      ].concat(meta as any)}
    />
  );
});
