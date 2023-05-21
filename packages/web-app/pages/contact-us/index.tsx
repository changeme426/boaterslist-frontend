import React from "react";
import { InfoPage } from "components/Common/InfoPage";
import getStaticPropsPages from "../../lib/infoPages";

export async function getStaticProps() {
  return await getStaticPropsPages('contact-us');
}

export default function ContactUs(props: any) {
  return <InfoPage data={props.data} />
}
