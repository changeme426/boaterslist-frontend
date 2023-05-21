import { useRouter } from "next/router";
import LocationEdit from 'web-app/components/LocationDetails/LocationEdit'

export default function Location() {
  const router = useRouter()
  const { id } = router.query
  return id ? <LocationEdit id={id as string}/> : null
}
