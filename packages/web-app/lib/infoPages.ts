
import { request } from "common/lib/datocms";
async function getStaticPropsPages(slug: any): Promise<any> {

  const query = `query MyQuery {
    allInformationPages(filter: {slug: {eq: "${slug}"}}) {
      id
      slug
      title
      content {
        value
      }
    }
  }`

  const data = await request({
    query: query,
    variables: { limit: 10 }
  });
  return { props: { data } }
}

export default getStaticPropsPages

