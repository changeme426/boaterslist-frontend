import Image from 'next/image'
import { StructuredText, renderMetaTags, useQuerySubscription } from "react-datocms";
import { request } from "common/lib/datocms";
import Head from 'next/head';

export async function getStaticPaths() {
  const data = await request({
    query: `{
      allBlogPosts {
        category {
          slug
        }
        slug
      }
    }`})
  const paths = data.allBlogPosts.map((post: any) => `/${post.category.slug}/${post.slug}`)
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params, preview = false }: any) {
  const blogPostSubscription = await getBlogPostSubscription(params.slug[0], params.slug[1], preview)
  return {
    props: {
      subscription: blogPostSubscription,
    },
  }
}

async function getBlogPostSubscription(category: string, slug: string, preview: any) {
  const query = {
    query: `query BlogCategoryBySlug($slug: String) {
      blogPost(filter: {slug: {eq: $slug}}) {
        id
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
        seoSettings: _seoMetaTags {
          attributes
          content
          tag
        }
        category {
          icon {
            url
            width
            height
          }
          name
        }
      }
    }`,
    preview,
    variables: {
      slug: slug,
    },
  }
  return preview ? {
    ...query,
    initialData: await request(query),
    token: process.env.NEXT_DATOCMS_API_TOKEN,
  } : {
    enabled: false,
    initialData: await request(query),
  }
}

export default function Post({ subscription, preview }: any) {
  const { data } = useQuerySubscription(subscription)
  return <div style={{ backgroundColor: "white" }}>
    <Head>{renderMetaTags(data.blogPost.seoSettings)}</Head>
    <div className='boaterslistContainer pStyles'>
      <div style={{ display: "flex" }}>
        {data.blogPost.category.icon ? <Image layout="fixed" src={data.blogPost.category.icon.url} alt={data.blogPost.category.name} width={data.blogPost.category.icon.width} height={data.blogPost.category.icon.height} /> : null}
        &nbsp;&nbsp;<div className='title' aria-level={1}>{data.blogPost.title}</div>
      </div>
      <StructuredText data={data.blogPost.content}
        renderBlock={({ record }: any) => {
          switch (record.__typename) {
            case "ImageRecord":
              return <Image layout={record.layout} src={record.image.url} alt={record.image.alt} width={record.image.width} height={record.image.height} />;
            default:
              return null;
          }
        }} />
    </div>
    <style jsx>{`
  .pStyles{
    font-family: sans-serif;
    font-size: 16px;
    line-height: 22px;
  }
  .title{
    font-size: 36px;
    font-weight: 400;
    margin-bottom: 20px;
    margin-top: 15px;
    line-height: normal;
  }
`}</style>
  </div>
}
