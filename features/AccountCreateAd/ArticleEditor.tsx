import { Text } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';

type Props = {
    editor: Editor | null
}

const ArticleEditor = ({ editor }: Props) => {

    return (
        <div>
            <Text size={'sm'} weight={500}>
                Content
                <Text component='span' color={'brandOrange'}>{' *'}</Text>
            </Text>
            <RichTextEditor editor={editor} >
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold tabIndex={1} />
                        <RichTextEditor.Italic tabIndex={1} />
                        <RichTextEditor.Underline tabIndex={1} />
                        <RichTextEditor.Strikethrough tabIndex={1} />
                        <RichTextEditor.ClearFormatting tabIndex={1} />
                        <RichTextEditor.Highlight tabIndex={1} />
                        <RichTextEditor.Code tabIndex={1} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 tabIndex={1} />
                        <RichTextEditor.H2 tabIndex={1} />
                        <RichTextEditor.H3 tabIndex={1} />
                        <RichTextEditor.H4 tabIndex={1} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote tabIndex={1} />
                        <RichTextEditor.Hr tabIndex={1} />
                        <RichTextEditor.BulletList tabIndex={1} />
                        <RichTextEditor.OrderedList tabIndex={1} />
                        <RichTextEditor.Subscript tabIndex={1} />
                        <RichTextEditor.Superscript tabIndex={1} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link tabIndex={1} />
                        <RichTextEditor.Unlink tabIndex={1} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft tabIndex={1} />
                        <RichTextEditor.AlignCenter tabIndex={1} />
                        <RichTextEditor.AlignJustify tabIndex={1} />
                        <RichTextEditor.AlignRight tabIndex={1} />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>
        </div>
    )
}

export default ArticleEditor