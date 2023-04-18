import { Stack, SimpleGrid, Image, Text, Skeleton, useMantineTheme } from '@mantine/core';
import { Editor } from '@tiptap/react';
import CreateAdTextField from '../../components/CreateAd/CreateAdTextField';
import ImagePicker from '../../components/CreateAd/ImagePicker';
import ArticleEditor from './ArticleEditor';
import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import CreateAdTextArea from '../../components/CreateAd/CreateAdTextArea';

type Props = {
    editor: Editor | null
    title: string
    setTitle: (title: string) => void
    excerpt: string
    setExcerpt: (excerpt: string) => void
    image: File | null
    setImage: (image: File | null) => void
}

const ArticleBuilder = ({ editor, title, setTitle, excerpt, setExcerpt, image, setImage }: Props) => {

    const { t } = useTranslation('account');
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
                        label={t('create-ad.article.title.label')}
                        placeholder={t('create-ad.article.title.placeholder')}
                        helpText={t('create-ad.article.title.helper')}
                    />
                    <CreateAdTextArea
                        label={t('create-ad.article.excerpt.label')}
                        placeholder={t('create-ad.article.excerpt.placeholder')}
                        helpText={t('create-ad.article.excerpt.helper')}
                        onChange={setExcerpt}
                        value={excerpt}
                    />
                    <ImagePicker
                        label={t('create-ad.article.image.label')}
                        placeholder={t('create-ad.article.image.placeholder')}
                        helper={t('create-ad.article.image.helper')}
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

                    <Text align='center' size='sm'>{t('create-ad.article.image-preview-label')}</Text>
                </Stack>
            </SimpleGrid>

            <ArticleEditor
                editor={editor}
            />
        </Stack>
    )
}

export default ArticleBuilder