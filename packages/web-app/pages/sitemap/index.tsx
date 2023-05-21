import type { GetStaticProps } from "next";
import * as opensearch from "web-app/lib/opensearch";
const fs = require("fs");

const c = opensearch.newClient();
const sitemap_size = 5000;
let host = "http://localhost:3000"
if (process.env.VERCEL){
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
        host = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        host = "https://www.boaterslist.com"
    }
}

function addPage(page: any) {
  return `  <url>
        <loc>${`${host}/location/${page[0]}`}</loc>
        <changefreq>daily</changefreq>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>`;
}

function addSitemap(sitemap: string) {
  return `    <sitemap>
    <loc>${`${host}/${sitemap}`}</loc>
</sitemap>`;
}

async function generateSitemap() {
  const results = await getLocationIds();

  const pages = [...results];
  const sitemaps = [];

  const batch_size = Math.ceil(pages.length / sitemap_size);

  for (let i = 0; i < batch_size; i++) {
    const name = `sitemap-${i}.xml`;
    const subPages = pages.slice(i * sitemap_size, (i + 1) * sitemap_size - 1);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${subPages.map(addPage).join("\n")}
      </urlset>`;
    fs.writeFileSync(`public/${name}`, sitemap);

    sitemaps.push(name);
  }

  const indexedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps.map(addSitemap).join("\n")}
</sitemapindex>`;
  fs.writeFileSync(`public/sitemap.xml`, indexedSitemap);

  console.log("sitemap generated");
}

async function getLocationIds(
  result: Array<any> = [],
  cursor: string = ""
): Promise<any> {
  // console.log(cursor)
  let r: any;
  if (cursor == "") {
    let query;
    query = "SELECT locationId FROM locations WHERE locationId IS NOT NULL";
    r = await opensearch.search(c, {
      index: "locations",
      sql: query,
      fetch_size: 10000,
    });
  } else {
    r = await opensearch.search(c, {
      index: "locations",
      cursor: cursor,
    });
  }

  const datas = r.body?.datarows;
  if (!datas) {
    return [];
  }
  // console.log("Data", datas)
  result = result.concat(datas);
  if (r.body?.cursor) {
    return await getLocationIds(result, r.body?.cursor);
  } else {
    return result;
  }
}

export const getStaticProps: GetStaticProps = async (context) => {

  await generateSitemap();

  return {
    props: {

    },
    revalidate: 24 * 60 * 60, // In a day
  };
};

function Sitemap() {
  return null;
}

export default Sitemap;
