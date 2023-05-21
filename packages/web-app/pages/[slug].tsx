import Image from 'next/image'
import { StructuredText, renderMetaTags, useQuerySubscription } from "react-datocms";
import { request } from "common/lib/datocms";
import CanoeIcon from 'common/assets/svg/canoe-icon.svg'
import FishingIcon from "common/assets/svg/fishing-icon.svg";
import GuideIcon from "common/assets/svg/guide-icon.svg";
import HatIcon from "common/assets/svg/hat-icon.svg";
import PaddlingIcon from "common/assets/svg/paddling-icon.svg";
import ShipIcon from "common/assets/svg/ship-icon.svg";
import SpeedBoatIcon from "common/assets/svg/speedboat-icon.svg";
import ToolsIcon from "common/assets/svg/tools-icon.svg";
import BoatersListIcon from "common/assets/svg/boaterslist-icon.svg";
import Head from 'next/head';

export async function getStaticPaths() {
  let data = await request({
    query: `{
    allBlogCategories { id, slug } }` });

  const paths = data.allBlogCategories.map((category: any) => `/${category.slug}`)
  /* TODO data = await request({
    query: `{
    allBlogPosts { id, slug, category { slug } } }` })
  data.allBlogPosts.forEach((v: any) => paths.push(`/${v.category.slug}/${v.slug}`))*/

  return {
    paths: paths,
    fallback: false,
  }
}

export async function getStaticProps({ params, prediv = false }: any) {
  if (params.slug.length > 1) {
    // TODO handle Post
    console.log("PARAMS SLUG", params.slug)
  }
  const blogCategorySubscription = await getBlogCategorySubscription(params.slug, prediv)
  const postQuery = {
    query: `query BlogPostsByCategory($id: ItemId) {
      allBlogPosts(filter: { category: {eq: $id}}) {
        title
        author {
          name
          picture {
            url
            width
            height
          }
        }
        bannerImage {
          url
          width
          height
        }
        coverImage {
          url
          width
          height
        }
        excerpt
        date
        slug
      }
    }`,
    prediv,
    variables: {
      id: blogCategorySubscription.initialData.blogCategory.id,
    },
  }

  return {
    props: {
      subscription: blogCategorySubscription,
      postSubscription: prediv ? {
        ...postQuery,
        initialData: await request(postQuery),
        token: process.env.NEXT_DATOCMS_API_TOKEN,
      } : {
        enabled: false,
        initialData: await request(postQuery),
      },
    },
  };
}

async function getBlogCategorySubscription(slug: any, prediv: any) {
  const query = {
    query: `query BlogCategoryBySlug($slug: String) {
      blogCategory(filter: {slug: {eq: $slug}}) {
        id
        name
        icon {
          url
          width
          height
        }
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
        slug
        seoSettings: _seoMetaTags {
          attributes
          content
          tag
        }
      }
    }`,
    prediv,
    variables: {
      slug: slug,
    },
  }

  return prediv ? {
    ...query,
    initialData: await request(query),
    token: process.env.NEXT_DATOCMS_API_TOKEN,
  } : {
    enabled: false,
    initialData: await request(query),
  }
}

export default function Post({ subscription, postSubscription, prediv }: any) {
  const { data } = useQuerySubscription(subscription)
  const postSubResult = useQuerySubscription(postSubscription)
  return <div style={{ backgroundColor: "white" }}>
    <Head>{renderMetaTags(data.blogCategory.seoSettings)}</Head>
    <div className='boaterslistContainer pStyles'>
      <div style={{ display: "flex" }}>
        {data.blogCategory.icon ? <Image layout="fixed" src={data.blogCategory.icon.url} alt={data.blogCategory.name} width={data.blogCategory.icon.width} height={data.blogCategory.icon.height} /> : null}
        &nbsp;&nbsp;<div className='title' aria-level={1}>{data.blogCategory.title}</div>
      </div>
      <StructuredText data={data.blogCategory.content}
        renderBlock={({ record }: any) => {
          switch (record.__typename) {
            case "ImageRecord":
              return <Image layout={record.layout} src={record.image.url} alt={record.image.alt} width={record.image.width} height={record.image.height} />;
            default:
              return null;
          }
        }} />
      {postSubResult.data.allBlogPosts.map((post: any, pi: number) => (
        <div key={pi} style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ flex: "0 0 96px" }}>
            {(post.coverImage || post.bannerImage) && <Image layout="fixed" src={post.coverImage ? post.coverImage.url : post.bannerImage.url}
              width={96} height={96} />}
          </div>
          <div style={{ flex: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "top" }}>
              <div style={{ flex: "auto" }}>
                <div style={{ display: "flex", width: "100%" }}>
                  <div style={{ flex: "auto", paddingLeft: "5px" }}><a href={`/${data.blogCategory.slug}/${post.slug}`}><h2 style={{ marginTop: 0, minWidth: "10rem" }}>{post.title}</h2></a></div>
                  <div style={{ flex: "0 0 48px" }}><Image layout="fixed" src={post.author.picture.url} width={48} height={48} /></div>
                  <div style={{ flex: "0 0 8rem", paddingLeft: "5px" }}><b>{post.author.name}</b><br /><span style={{ fontSize: "12px" }}>{post.date}</span></div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ paddingLeft: "5px", flex: "auto" }}>{post.excerpt}</div>
                </div>
              </div>
            </div>
          </div>
        </div>))}
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
