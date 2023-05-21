import React from "react";
import { InfoHeader } from "components/Common/InfoHeader"
import { StructuredText, renderNodeRule } from "react-datocms";
import { isLink } from 'datocms-structured-text-utils';
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import theme from "common/theme";

export const InfoPage = (props: any) => {
  const title = props.data.allInformationPages[0].title
  const content = props.data.allInformationPages[0].content;
  return (
    <div className="infoPage">
      <InfoHeader title={title} />
      <div className="boaterslistContainer infoClass">
        <StructuredText data={content}
          customNodeRules={[
            renderNodeRule(
              isLink,
              ({ adapter: { renderNode }, node, children, key }: any) => {

                const type = node?.url;
                const hasIcon = type.includes('mailto:') || type.includes('tel:');
                return (
                  <span style={{ display: hasIcon ? 'flex' : 'inline' }} key={key}>
                    {type && <span style={{ marginRight: 2 }}>
                      {(type.includes('mailto:') ?
                        <MdOutlineEmail size={20} color={`${theme.colors.brandBlue}`} /> :
                        type.includes('tel:') ? <FaPhoneAlt size={16} color={`${theme.colors.brandBlue}`} />
                          : null)}</span>}
                    {renderNode('a', { href: node.url, key, className: 'boatersListEmailFormat' }, children)}
                  </span>
                )
              },
            )
          ]}
        />
      </div>
      <style jsx>{`
        .infoClass{
          font-size: 16px;
        }
      `}</style>
    </div >

  );
};
