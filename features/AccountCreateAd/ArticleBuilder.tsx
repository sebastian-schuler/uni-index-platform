import { Stack } from '@mantine/core';
import { Editor } from '@tiptap/react';
import CreateAdTextField from '../../components/CreateAd/CreateAdTextField';
import ArticleEditor from './ArticleEditor';

type Props = {
    editor: Editor | null
    title: string
    setTitle: (title: string) => void
}

const ArticleBuilder = ({ editor, title, setTitle }: Props) => {

    return (
        <Stack>
            <CreateAdTextField
                value={title}
                onChange={setTitle}
                label="Title"
                placeholder="Enter a title for your article"
                helpText="The title of your article."
            />
            <ArticleEditor
                editor={editor}
            />
        </Stack>
    )
}

export default ArticleBuilder