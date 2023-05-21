export function formattedHours(hoursArray: any): string {
  if (hoursArray) {
    const formattedHoursArray = hoursArray.map((odh: any) => {
      return trim(odh.dayFrom) +
        (trim(odh.dayTo) !== "" ? "-" : "") +
        trim(odh.dayTo) +
        ":" +
        trim(odh.timeFrom) +
        (trim(odh.timeTo) !== "" ? "-" : "") +
        trim(odh.timeTo)
    })
    return formattedHoursArray.join(", ");
  }
  return ""
}

function trim(s?: string): string {
  if (s) {
    return s.trim()
  }
  return ""
}
