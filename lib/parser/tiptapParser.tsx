import { Anchor, Blockquote, Box, Divider, List, Text, Title, Mark } from '@mantine/core'
import { JSONContent } from '@tiptap/react'

type RenderOptions = {
    isInsideList?: boolean
}

export class TipTapParser {

    renderJson(json: JSONContent) {
        return this.handleMany(json.content ?? []);
    }

    private handleMany(json: JSONContent[], options: RenderOptions = {}) {
        return json.map((item, i) => {
            return (
                <Box key={i} style={{ display: "inline" }}>
                    {this.handle(item, options)}
                </Box>
            )
        })
    }

    private handle(json: JSONContent, options: RenderOptions = {}) {

        if (json.type === "heading") {
            // HEADING

            let level = json.attrs?.level;
            let textAlign = json.attrs?.textAlign || 'left';

            return (
                <Title order={level} align={textAlign}>{json.content ? this.handleMany(json.content, options) : json.text}</Title>
            )

        } else if (json.type === "paragraph") {
            // PARAGRAPH

            let textAlign = json.attrs?.textAlign || 'left';

            return (
                <Text align={textAlign}>{json.content ? this.handleMany(json.content, options) : json.text}</Text>
            )

        } else if (json.type === "text") {
            // TEXT

            let isBold = false;
            let isItalic = false;
            let isUnderline = false;
            let isHighlight = false;
            let isStrikethrough = false;
            let link: { url: string, target: string } | undefined = undefined;
            let componentType: 'span' | 'sup' | 'sub' = 'span';

            for (const mark of json.marks || []) {

                if (mark.type === "bold") {
                    isBold = true;
                    continue;
                } else if (mark.type === "italic") {
                    isItalic = true;
                    continue;
                } else if (mark.type === "underline") {
                    isUnderline = true;
                    continue;
                } else if (mark.type === "link") {
                    link = { url: mark.attrs?.href, target: mark.attrs?.target };
                    continue;
                } else if (mark.type === "subscript") {
                    componentType = 'sub';
                    continue;
                } else if (mark.type === "superscript") {
                    componentType = 'sup';
                    continue;
                } else if (mark.type === "highlight") {
                    isHighlight = true;
                    continue;
                } else if (mark.type === "strike") {
                    isStrikethrough = true;
                    continue;
                }
                console.log("Unkown mark:", mark);
            }

            const formattedText = <Text
                component={componentType}
                weight={isBold ? 'bold' : 'normal'}
                italic={isItalic}
                underline={isUnderline}
                strikethrough={isStrikethrough}
            >
                {isHighlight ? <Mark>{json.text}</Mark> : json.text}
            </Text>;

            return (
                link ? (
                    <Anchor href={link.url} target={link.target}>{formattedText}</Anchor>
                ) : (formattedText)
            )
        } else if (json.type === "bulletList") {
            // BULLET LIST	
            const newOptions = { ...options, isInsideList: true };

            return (
                <List type="unordered" withPadding={options.isInsideList}>{json.content ? this.handleMany(json.content, newOptions) : json.text}</List>
            )
        } else if (json.type === "orderedList") {
            // ORDERED LIST
            const newOptions = { ...options, isInsideList: true };

            return (
                <List type="ordered" withPadding={options.isInsideList}>{json.content ? this.handleMany(json.content, newOptions) : json.text}</List>
            )
        } else if (json.type === "listItem") {
            // LIST ITEM

            return (
                <List.Item>{json.content ? this.handleMany(json.content, options) : json.text}</List.Item>
            )
        } else if (json.type === "blockquote") {
            // LIST ITEM

            return (
                <Blockquote>{json.content ? this.handleMany(json.content, options) : json.text}</Blockquote>
            )
        } else if (json.type === "horizontalRule") {
            return (
                <Divider py={'md'} />
            )
        }

        return <div>Unknown component: {json.type}</div>;
    }
}