import { useState } from "react"
import { Locations } from "common/models/Locations"
import { useRouter } from "next/router"
import { useUser } from '@auth0/nextjs-auth0'
import theme from "common/theme"
import Modal from "../Common/Modal"
import Button from "../Buttons/Button"

type PropsType = {
  locationDetail: Locations;
  onClaim?: (val: boolean) => void;
}

export function ClaimBusiness({ locationDetail, onClaim }: PropsType) {
  const router = useRouter()
  const { user } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [modalType, setmodalType] = useState("")
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const modalBody = () => {
    const defaultBtnStyle = {
      backgroundColor: `${theme.colors.brandBlue}`,
      color: `${theme.colors.brandWhite}`,
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 5,
      paddingBottom: 5,
      width: 80
    };

    const postClaim = async () => {
      setErrorMessage('')
      const response = await fetch(`/api/location/${locationDetail.locationId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const jsonData = await response.json()
      if (response.status === 200) {
        router.push(`/claim/${jsonData.locationId}`)
      } else {
        if (jsonData?.error && jsonData.error !== "") {
          setErrorMessage(jsonData.error)
        }
        setIsError(true)
        setShowModal(true)
      }

    }

    const onClaimConfirm = () => {
      setShowModal(false);
      if (onClaim) {
        onClaim(true)
      }
      postClaim();
    }

    let buttonLeft = 'No'
    let buttonRight = 'Yes'
    if (modalType !== '') {
      buttonLeft = 'Cancel'
      buttonRight = 'Edit'
    }

    const messageDisplay = () => {
      if (isError) {
        if (modalType !== "") {
          return errorMessage !== "" ? errorMessage : 'Error trying to edit business';
        } else {
          return errorMessage !== "" ? errorMessage : 'Error trying to claim business'
        }
      } else {
        if (modalType !== "") {
          return 'Do you want to Edit this business?';
        } else {
          return 'Are you sure you want to claim this business?'
        }
      }
    }

    return (
      <div className="modalBody">
        <div className="title">{messageDisplay()}</div>
        {!isError && <div className="buttons">
          <Button
            style={defaultBtnStyle}
            title={buttonLeft}
            type="button"
            onClick={() => setShowModal(false)}
          />
          <Button
            style={defaultBtnStyle}
            title={buttonRight}
            type="button"
            onClick={onClaimConfirm}
          />
        </div>}
        <style jsx>{`
          .modalBody{
            padding: 30px;
            padding-top: 0;
          }
          .title{
            margin-bottom: 10px;
          }
          .buttons{
            display: flex;
            justify-content: space-between;
          }
      `}</style>
      </div>
    )
  }

  const shouldLoginBody = () => {
    return <div className="shouldLoginBody">
      <div>
        <span onClick={() => router.push('/api/auth/login')} className="boatersListEmailFormat">Log In</span> or <span onClick={() => router.push('/api/auth/signup')} className="boatersListEmailFormat">Sign up</span> to claim a business
      </div>
      <style jsx>{`
          .shouldLoginBody{
            padding: 30px;
            padding-top: 0px;
          }
      `}</style>
    </div>
  }

  const onDisplayTitle = () => {
    if (locationDetail.claimVerified2 && user?.email && user?.email == locationDetail.claimedBy2) {
      return <div ><span onClick={() => {
        if (!user) {
          setShowModal(true)
          return
        }
        setIsError(false)
        setmodalType('alreadyClaimed')
        setShowModal(true)
      }} className='boatersListEmailFormat'>Claimed - click to edit</span></div>
    } else {
      if (locationDetail.claimVerified2 && user?.email && user?.email !== locationDetail.claimedBy2) {
        return ""
      } else {
        return <span onClick={() => {
          if (!user) {
            setShowModal(true)
            return
          }
          setIsError(false)
          setShowModal(true)
        }} className="boatersListEmailFormat">Claim this business</span>
      }
    }
  }

  return (
    <div className="claimBusiness">
      {<div>
        {onDisplayTitle()}
      </div>}

      <Modal onShow={showModal} onClose={() => setShowModal(false)}>
        {(!user) ? shouldLoginBody() :
          modalBody()}
      </Modal>

      <style jsx>{`
      `}</style>
    </div>
  )
}
