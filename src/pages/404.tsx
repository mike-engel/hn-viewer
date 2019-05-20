import React from "react";
import { Layout } from "../components/organisms/layout.component";
import { SEO } from "../components/atoms/seo.component";
import { Heading, Text } from "../components/atoms/typography.component";

const NotFound = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Heading>NOT FOUND</Heading>
    <Text>You just hit a route that doesn’t exist...the sadness.</Text>
  </Layout>
);

export default NotFound;
