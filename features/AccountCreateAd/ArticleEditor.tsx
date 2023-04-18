import { Text } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import CharacterCount from '@tiptap/extension-character-count'
import useTranslation from 'next-translate/useTranslation';

const characterLimit = 1000;

export const getTiptapEditor = () => {
    return useEditor({
        extensions: [
            StarterKit,
            Link,
            Underline,
            Highlight,
            Superscript,
            SubScript,
            CharacterCount.configure({
                limit: characterLimit,
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ]
    });
}

type Props = {
    editor: Editor | null
}

const ArticleEditor = ({ editor }: Props) => {

    const { t, lang } = useTranslation("account");

    return (
        <div>
            <Text size={'sm'} weight={500}>
                {t('create-ad.article.editor.label')}
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
                        <RichTextEditor.H5 tabIndex={1} />
                        <RichTextEditor.H6 tabIndex={1} />
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

                    <Text lh={1} sx={{ userSelect: 'none' }}>
                        {t('create-ad.article.editor.character-count', { count: (editor?.storage.characterCount.characters() || 0), limit: characterLimit })}
                    </Text>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>
        </div>
    )
}

export default ArticleEditor