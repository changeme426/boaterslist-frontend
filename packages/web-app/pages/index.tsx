import type { GetStaticProps, NextPage } from 'next'
import Home from '../components/Home/Home'
import { request } from "common/lib/datocms";

export const getStaticProps: GetStaticProps = async(context) => {
  // @ts-ignore
  const data = await request({
    query: `query Homepage {
      homepage {
        seoSettings: _seoMetaTags {
          attributes
          content
          tag
        }
      }
    }`,
  });
  return {
    props: {
      data: data,
    }
  };
}

const App: NextPage = (props: any) => {
  return (
    <div >
     <Home data={props.data}/>
    </div>
  )
}

export default App
