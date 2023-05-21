import { Locations } from 'common/models/Locations';
import { useRouter } from "next/router";
import { SingleLocation } from 'components/SearchResults/SingleLocation';
import { ClaimBusiness } from './ClaimBusiness';

interface locationData {
  id: string
  source: Locations,
}

interface PropTypes {
  locations: locationData[] | [],
  label?: string,
  claim?: boolean,
  onClaim?: (val: boolean) => void
}

export function LocationsResults({ locations, label, claim, onClaim }: PropTypes) {
  const MAXELEMENTS = 10
  const router = useRouter();
  console.log(locations)
  let locationsFiltered = []
  if (locations.length > MAXELEMENTS) {
    locationsFiltered = locations.slice(0, MAXELEMENTS)
  } else {
    locationsFiltered = [...locations]
  }
  return (
    <div className='locationsContainer'>
      {label !== '' &&
        <>
          <div className='label'>{label}</div>
          <hr />
        </>
      }
      {locationsFiltered.map((el: locationData, index: number) => <div key={index}>
        <>
          <SingleLocation location={el} onClaim={onClaim} />
          {claim && <div className='claim'><ClaimBusiness onClaim={onClaim} locationDetail={el.source} /></div>}
          <hr />
        </>

      </div>)}
      <style jsx>{`
          .label{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .claim{
            text-align: right;
          }
          .locationsContainer{
              padding: 40px;
          }
      `}</style>
    </div>
  )
}

LocationsResults.defaultProps = {
  label: '',
  claim: false
}
