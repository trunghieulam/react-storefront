import { ApolloQueryResult } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Custom404 from "pages/404";
import { ReactElement } from "react";

import { Layout, RichText } from "@/components";
import apolloClient from "@/lib/graphql";
import { pagePaths } from "@/lib/ssr/page";
import { PageDocument, PageQuery, PageQueryVariables } from "@/saleor/api";

const PagePage = ({ page }: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!page?.id) {
    return <Custom404 />;
  }

  return (
    <main className="max-w-7xl mx-auto pt-8 px-8">
      {!!page.content && <RichText jsonStringData={page.content} />}
    </main>
  );
};

export default PagePage;

export interface pathParams {
  channel: string;
  locale: string;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await pagePaths();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const pageSlug = context.params?.slug?.toString() as string;
  const locale = context.params?.locale?.toString() as string;
  const response: ApolloQueryResult<PageQuery> = await apolloClient.query<
    PageQuery,
    PageQueryVariables
  >({
    query: PageDocument,
    variables: {
      slug: pageSlug,
    },
  });
  return {
    props: {
      page: response.data.page,
    },
  };
};
