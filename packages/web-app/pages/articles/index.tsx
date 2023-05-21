import React from "react";
import Image from "next/image";
import Head from "next/head";
import { StructuredText, renderMetaTags, useQuerySubscription } from "react-datocms";
import { request } from "common/lib/datocms";
import theme from "common/theme";

export async function getStaticProps({ params, preview = false }: any) {
  const query = {
    query: `{
      homepage {
        seoSettings: _seoMetaTags {
          attributes
          content
          tag
        }
      }
      allBlogCategories {
        id
        slug
        icon { url alt width height }
        title
        content {
          value
          blocks {
            __typename
            ... on ImageRecord {
              id
              image { url alt width height }
              layout
            }
          }
        }
      }}`,
    preview,
    variables: {
    },
  }

  return {
    props: {
      subscription: preview ? {
        ...query,
        initialData: await request(query),
        token: process.env.NEXT_DATOCMS_API_TOKEN,
      } : {
        enabled: false,
        initialData: await request(query),
      },
    },
  };
}

export default function Post(props: any) {
  const { data } = useQuerySubscription(props.subscription);
  return (
    <>
      <Head>{renderMetaTags(data.homepage.seoSettings)}</Head>
      <div className="boaterslistContainer pStyles">
        {(data && data.allBlogCategories.length > 0) ?
          data.allBlogCategories.map((category: any, pi: any) => (<div key={pi}>
            <h2 style={{ margin: 0, minWidth: "10rem", verticalAlign: "center", color: theme.colors.brandBlue }}>
              <a href={`/${category.slug}`}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {category.icon ? <Image layout="fixed" src={category.icon.url} width={48} height={48} /> :
                    <div style={{ display: "inline-block", width: 48, height: 48, paddingLeft: "5px" }} />}
                  <div style={{ paddingLeft: 10 }}><span style={{ fontSize: 22.5, fontWeight: 700 }}>{category.title}</span></div>
                </div>
              </a>
            </h2>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", marginBottom: "1rem" }}>
              <div style={{ flex: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "top" }}>
                  <div style={{ flex: "auto" }}>
                    <div style={{ display: "flex", width: "100%" }}>
                    </div>
                    <StructuredText data={category.content}
                      renderBlock={({ record }: any) => {
                        switch (record.__typename) {
                          case "ImageRecord":
                            return <Image layout={record.layout} src={record.image.url} alt={record.image.alt} width={record.image.width} height={record.image.height} />;
                          default:
                            return null;
                        }
                      }} />
                  </div>
                </div>
              </div>
            </div></div>))
          : null}
        <style jsx>{`
        .pStyles{
          font-family: sans-serif;
          font-size: 16px;
          line-height: 22px;
        }
      `}</style>
      </div>
    </>
  );
}
