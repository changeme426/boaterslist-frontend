export const GA_TRACKING_ID = "G-3PXLYTPMLM"

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  typeof window !== "undefined" &&
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  console.log(action, category, label, value);
  typeof window !== "undefined" &&
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    })
}
