import React from "react";
import { Layout } from "../components/organisms/layout.component";
import { SEO } from "../components/atoms/seo.component";
import { Heading } from "../components/atoms/typography.component";
import { NewsItems } from "../components/organisms/news_items.component";

const Index = () => (
  <Layout>
    <SEO title="Home" />
    <Heading>Top stories</Heading>
    <NewsItems />
  </Layout>
);

export default Index;
