export const GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
    // @ts-ignore
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    })
}

type EventProps = {
    action: string
    category: string
    label: string
    value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: EventProps) => {
    // @ts-ignore
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}