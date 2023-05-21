import React from "react"
import { InfoPage } from "components/Common/InfoPage";
import getStaticPropsPages from "../../lib/infoPages";

export async function getStaticProps() {
  return await getStaticPropsPages('about-us');
}

export default function AboutUs(props: any) {
  return <InfoPage data={props.data} />
}
