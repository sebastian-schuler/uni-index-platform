import { JSONContent } from "@tiptap/react"

export type ArticleCardData = {
    id: string
    url: string
    title: string
    excerpt: string
    imageUrl: string | null
    date: number
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