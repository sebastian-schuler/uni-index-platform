import { JSONContent } from "@tiptap/react"

export type ArticleCardData = {
    id: string
    url: string
    title: { [key: string]: string }
    excerpt: string
    date: number,
    image: {
        id: string
        filetype: string
    }
    institution: {
        name: string
        url: string
    }
    country: {
        name: string
        url: string
        countryCode: string
    }
}

export type ArticleData = ArticleCardData & {
    content: JSONContent
}