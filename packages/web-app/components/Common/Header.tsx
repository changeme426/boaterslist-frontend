import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import theme from "../../../common/theme";
import logoHeader from "common/assets/images/boaterslist-logo-horizontal-color-white.png";
import Button from "../Buttons/Button";
import Modal from "./Modal";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { UserDetails } from "../UserDetails/UserDetails";
import { Links } from "./Links";
import { EditAccount } from "../Account/EditAccount";
import ForgotPassword from "../Authentication/ForgotPassword";
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'

export default function Header() {
  const router = useRouter()
  const { user, error, isLoading } = useUser()
  const [modalShow, setModalShow] = useState(false);
  const [authEvent, setAuthevent] = useState("");
  const [authCustom, setAuthCustom] = useState("");

  const onAuth = (event: string) => {
    setAuthevent(event);
    setModalShow(true);
  };
  const onCloseModal = () => {
    setModalShow(false);
    setAuthevent("");
  };

  const onModalShowHide = (value: boolean) => {
    setModalShow(!value);
  };

  const onAuthButtons = (event: string) => {
    setAuthCustom(event);
  };

  const onUserDetailChange = (value: string) => {
    onAuthButtons("");
    if (value !== "") {
      onAuth(value);
    }
  }

  return (
    <div className="header">
      <div className="imageContainer">
        <Link href={"/"}>
          <a className="imageLink">
            <Image
              src={logoHeader}
              alt="Logo boaterlist header"
              height={40}
              width={205}
            />
          </a>
        </Link>
        <div className="optionLink theDock">
          <Link href={"https://thedock.boaterslist.com"}>
            <a>The Dock</a>
          </Link>
        </div>
        <div className="optionLink merch">
          <Link href={"https://boaterslistmerch.com/"}>
            <a>Merchandise</a>
          </Link>
        </div>
        <div className="optionLink articles">
          {/* TODO */}
          <Link href={"/articles"}>
            <a>Articles &amp; Advice</a>
          </Link>
        </div>
      </div>
      <div className="rightSideContent">
        {user &&
          <div className="userDetailIcon">
            <div style={{ display: authCustom === "show" ? "none" : "block" }}>
              <IoMdMenu fontSize="30px" onClick={() => onAuthButtons("show")} />
            </div>
            <div style={{ display: authCustom === "show" ? "block" : "none" }}>
              <IoMdClose fontSize="30px" onClick={() => onAuthButtons("")} />
            </div>
          </div>
        }
        {!user &&
          <div className="loginMenuIcons">
            <div style={{ display: authCustom === "show" ? "none" : "block" }}>
              <IoMdMenu fontSize="30px" onClick={() => onAuthButtons("show")} />
            </div>
            <div style={{ display: authCustom === "show" ? "block" : "none" }}>
              <IoMdClose fontSize="30px" onClick={() => onAuthButtons("")} />
            </div>
          </div>
        }
        {!user &&
          <div className="buttonsContainer">
            <div className="btnAuth">
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: `${theme.colors.brandYellow}`,
                  border: `2px solid ${theme.colors.brandYellow}`
                }}
                title={"Log In"}
                onClick={() => router.push('/api/auth/login')}
              />
            </div>
            <div className="btnAuth">
              <Button
                style={{
                  backgroundColor: `${theme.colors.brandBlue}`,
                  color: `${theme.colors.brandWhite}`,
                }}
                title={"Business Sign Up"}
                onClick={() => router.push('/api/auth/signup?type=business')}
              />
            </div>
            <div className="btnAuth">
              <Button
                style={{
                  backgroundColor: `${theme.colors.brandBlue}`,
                  color: `${theme.colors.brandWhite}`,
                }}
                title={"Sign Up"}
                onClick={() => router.push('/api/auth/signup')}
              />
            </div>
          </div>
        }
      </div>
      {authCustom === "show" && (
        <div className="AuthCustomModal">
          {!user ?
            <div className="authOptions">
              <div className="menuLinks">
                <div className="boatersListEmailFormat mobileLinks">
                  <Link href={"https://thedock.boaterslist.com"}>
                    <a>The Dock</a>
                  </Link>
                </div>
                <div className="boatersListEmailFormat mobileLinks">
                  <Link href={"https://boaterslistmerch.com/"}>
                    <a>Merchandise</a>
                  </Link>
                </div>
                <div className="boatersListEmailFormat mobileLinks">
                  {/* TODO */}
                  <Link href={"/articles"}>
                    <a>Articles &amp; Advice</a>
                  </Link>
                </div>

              </div>
              <div className="btnAuthCustom">
                <Button
                  style={{
                    padding: 15,
                    backgroundColor: "transparent",
                    color: `${theme.colors.brandYellow}`,
                    border: `2px solid ${theme.colors.brandYellow}`
                  }}
                  title={"Log In"}
                  onClick={() => {
                    router.push('/api/auth/login')
                  }}
                />
              </div>
              <div className="btnAuthCustom">
                <Button
                  style={{
                    padding: 15,
                    backgroundColor: `${theme.colors.brandBlue}`,
                    color: `${theme.colors.brandWhite}`,
                  }}
                  title={"Business Sign Up"}
                  onClick={() => {
                    router.push('/api/auth/signup?type=business')
                  }}
                />
              </div>
              <div className="btnAuthCustom">
                <Button
                  style={{
                    padding: 15,
                    backgroundColor: `${theme.colors.brandBlue}`,
                    color: `${theme.colors.brandWhite}`,
                  }}
                  title={"Sign Up"}
                  onClick={() => {
                    router.push('/api/auth/signup')
                  }}
                />
              </div>
              <Links onLinkClick={onAuthButtons} />
            </div>
            : <UserDetails onUserChange={onUserDetailChange} />
          }
        </div>
      )}
      <Modal onShow={modalShow} onClose={onCloseModal}>
        {authEvent === "Edit" && <EditAccount />}
        {authEvent === "Forgot Password" && <ForgotPassword />}
        {authEvent === "" && null}
      </Modal>

      <style jsx>{`
        .header {
          display: flex;
          padding: 14px;
          background-color: ${theme.colors.brandBlueDark};
        }
        .imageContainer {
          cursor: pointer;
          display:flex;
        }
        .optionLink {
          display:flex;
          align-items: center;
          color: white;
          padding:10px;
          margin-left: 5px;
          font-size: 18px;
        }
        .theDock{
          margin-left: 20px;
        }
        .userDetailIcon {
          display: block;
          color: ${theme.colors.brandWhite};
          cursor: pointer;
        }
        .btnAuth {
          display: inline-block;
          margin: 0px 10px 0px 10px;
        }
        .btnAuthCustom {
          margin-bottom: 20px;
        }
        .rightSideContent {
          display: flex;
          align-self: center;
          flex-direction: row;
          align-content: center;
          justify-content: flex-end;
          flex: 1;
        }
        .loginMenuIcons {
          display: none;
          cursor: pointer;
        }
        .AuthCustomModal {
          position: absolute;
          top: 65px;
          z-index: 2;
          left: 0;
          right: 0;
          height: calc(100% - 70px);
        }
        .authOptions {
          background-color: white;
          height: 100%;
          padding: 25px;
        }
        .textAuth {
          margin-bottom: 20px;
        }
        .menuLinks{
          align-items: center;
          display:none;
          flex-direction: column;
          margin-bottom: 10px;
        }
        .mobileLinks{
          font-size: 20px;
          font-weight: bold;
          padding: 10px 0px;
        }
        @media screen and (max-width: 1070px) {
          .buttonsContainer {
            display: none;
          }
          .loginMenuIcons {
            display: block;
            color: ${theme.colors.brandWhite};
          }
        }
        @media screen and (max-width: 700px) {
          .optionLink {
            display: none;
          }
          .menuLinks{
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
