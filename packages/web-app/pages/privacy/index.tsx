import React from "react";
import { InfoPage } from "components/Common/InfoPage";
import getStaticPropsPages from "../../lib/infoPages";

export async function getStaticProps() {
  return await getStaticPropsPages('privacy');
}

export default function privacy(props: any) {
  return <InfoPage data={props.data} />
}
