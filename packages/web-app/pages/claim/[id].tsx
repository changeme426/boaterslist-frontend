import { useRouter } from "next/router";
import LocationEdit from 'web-app/components/LocationDetails/LocationEdit'

export default function Claim() {
  const router = useRouter()
  const { id } = router.query
  return id ? <LocationEdit viewType="claim" id={id as string} /> : null
}
