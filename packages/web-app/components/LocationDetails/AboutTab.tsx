import { Locations } from "common/models/Locations";
import theme from "common/theme";
import Link from "next/link";
import {
  FaRegEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { ClaimBusiness } from "./ClaimBusiness";

type PropsType = {
  locationDetail: Locations;
};

export function AboutTab({ locationDetail }: PropsType) {
  const onWebsiteClick = (website: any) => {
    if (website !== "" && website !== null) {
      window.open(website, "_blank");
    }
  };

  return (
    <div className="aboutContainer">
      <div className="description">
        <div>{locationDetail.description}</div>
      </div>
      <div className="containers">
        <div className="section">WEBSITE</div>
        <a
          rel="external"
          referrerPolicy="origin"
          onClick={() => onWebsiteClick(locationDetail.website)}
          className="website"
        >
          {locationDetail.website}
        </a>
      </div>
      <div className="containers">
        <div className="section">CONTACT</div>
        <div className="contactData">{locationDetail.contactPerson}</div>
        <div className="contactData">
          {locationDetail.contactEmail && (
            <div className="iconAndInfo">
              <FaRegEnvelope />
              <Link href={`mailto:${locationDetail.contactEmail}`}>
                <a>{locationDetail.contactEmail}</a>
              </Link>
            </div>
          )}
          {(locationDetail.contactPhone || locationDetail.phoneNumber) && (
            <div className="iconAndInfo">
              <FaPhoneAlt />
              <Link
                href={`tel:${
                  locationDetail.contactPhone || locationDetail.phoneNumber
                }`}
              >
                <a>
                  {locationDetail.contactPhone || locationDetail.phoneNumber}
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="containers">
        {false /* TODO NOW */ && (
          <>
            <div className="section">SOCIALS</div>
            <div className="socialIcons">
              <FaTwitter />
              <span>@Twitter</span>
            </div>
            <div className="socialIcons">
              <FaInstagram />
              <span>@Instagram</span>
            </div>
            <div className="socialIcons">
              <FaFacebookF />
              <span>@Facebook</span>
            </div>
          </>
        )}
      </div>
      {/* (locationDetail.claimedBy2 && locationDetail.claimedBy2 !== "") &&  */}
      <ClaimBusiness locationDetail={locationDetail} />
      <style jsx>{`
        .aboutContainer {
          margin: 20px;
          font-size: 16px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .socialIcons {
          display: flex;
        }
        .socialIcons > span {
          margin-left: 10px;
          color: ${theme.colors.brandBlue};
          font-weight: ${theme.locationsDetail.contactFont};
        }
        .description {
          margin-bottom: 10px;
        }
        .iconAndInfo {
          display: flex;
          align-items: center;
        }
        .iconAndInfo > a {
          margin-left: 10px;
          color: ${theme.colors.brandBlue};
          font-weight: ${theme.locationsDetail.contactFont};
        }
        .contactData,
        .contactData > div {
          margin-bottom: 5px;
        }
        .section {
          color: grey;
          font-size: 18px;
          margin-bottom: 5px;
        }
        .containers {
          margin-bottom: 20px;
        }
        .website {
          color: ${theme.colors.brandBlue};
          font-size: ${theme.locationsDetail.contactFontSize}px;
          font-weight: ${theme.locationsDetail.contactFont};
          cursor: pointer;
          word-break: break-word;
        }
      `}</style>
    </div>
    // <View style={styles.aboutContainer}>
    //     <View style={styles.description}><Text>{locationDetail.description}</Text></View>
    //     <View>
    //         <Text style={styles.section}>WEBSITE</Text>
    //         <View><Pressable onPress={() => onWebsiteClick(locationDetail.website)}><Text style={styles.website}>{locationDetail.website?.original[0]}</Text></Pressable></View>
    //     </View>
    //     <View>
    //         <Text style={styles.section}>CONTACT</Text>
    //         <Text>{locationDetail.contactPerson}</Text>
    //         <View>
    //            {/* <View><Icon type="font-awesome" name="envelope" color="lightgray" /></View> */}
    //         </View>
    //     </View>
    // </View>
  );
}

// const styles = StyleSheet.create({
//     aboutContainer: {
//       margin: 20
//     },
//     description:{
//       marginBottom: 10
//     },
//     section:{
//         color: 'grey',
//         fontSize: 18,
//         marginBottom: 10
//     },
//     website:{
//       color: `${theme.colors.brandBlue}`,
//       fontSize: theme.locationsDetail.contactFontSize,
//       fontWeight: theme.locationsDetail.contactFont,
//       cursor: 'pointer'
//     }
// })
