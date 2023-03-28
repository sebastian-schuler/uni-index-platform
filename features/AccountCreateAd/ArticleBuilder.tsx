import { Stack, SimpleGrid, Image, Text, Skeleton, useMantineTheme } from '@mantine/core';
import { Editor } from '@tiptap/react';
import CreateAdTextField from '../../components/CreateAd/CreateAdTextField';
import ImagePicker from '../../components/CreateAd/ImagePicker';
import ArticleEditor from './ArticleEditor';
import React, { useState } from 'react';

type Props = {
    editor: Editor | null
    title: string
    setTitle: (title: string) => void
    image: File | null
    setImage: (image: File | null) => void
}

const ArticleBuilder = ({ editor, title, setTitle, image, setImage }: Props) => {

    const [imageFilepath, setImageFilepath] = useState<string | undefined>(undefined);
    const theme = useMantineTheme();

    return (
        <Stack>
            <SimpleGrid breakpoints={[
                { minWidth: theme.breakpoints.md, cols: 2 },
            ]}>
                <Stack>
                    <CreateAdTextField
                        value={title}
                        onChange={setTitle}
                        label="Title"
                        placeholder="Enter a title for your article"
                        helpText="The title of your article."
                    />
                    <ImagePicker
                        image={image}
                        setImage={setImage}
                        setImageFilepath={setImageFilepath}
                    />
                </Stack>
                <Stack>
                    {
                        imageFilepath ? (
                            <Image src={imageFilepath} height={200} fit={'contain'} />
                        ) : (
                            <Skeleton h={200} animate={false} />
                        )
                    }

                    <Text align='center' size='sm'>Image Preview</Text>
                </Stack>
            </SimpleGrid>

            <ArticleEditor
                editor={editor}
            />
        </Stack>
    )
}

export default ArticleBuilder