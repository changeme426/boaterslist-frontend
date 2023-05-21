const validateWebsite = (website: string) => {
  const VALIDEMAIL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/gm;
  const websiteExtract = website.match(VALIDEMAIL);
  return websiteExtract ? websiteExtract : null;
};

const parseWebsite = (website: any) => {
  let parsedWebsite: any = {
    original: null,
    parsed: "",
    redirect: false,
  };
  if (website) {
    const validWebsite = validateWebsite(website);
    parsedWebsite.original = validWebsite;
    if (validWebsite) {
      if (
        validWebsite[0].includes("http") ||
        validWebsite[0].includes("https")
      ) {
        parsedWebsite.parsed = validWebsite[0];
      } else {
        parsedWebsite.parsed = `https://${validWebsite[0]}`;
      }
      parsedWebsite.redirect = true;
    }
  }
  return parsedWebsite;
};

export default parseWebsite;
