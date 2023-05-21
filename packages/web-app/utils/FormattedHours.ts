export function formattedHours(hoursArray: any): string {
  const formattedHoursArray = hoursArray.map((odh: any) => {
    return (
      odh.dayFrom +
      (odh.dayTo !== "" ? "-" : "") +
      odh.dayTo +
      ":" +
      odh.timeFrom +
      (odh.timeTo !== "" ? "-" : "") +
      odh.timeTo
    );
  });

  return formattedHoursArray.join(", ");
};
