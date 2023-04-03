import { Box, Center, Grid, Stack, Title, useMantineTheme } from '@mantine/core';
import { IconBuilding, IconSchool } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';
import CreateAdTextArea from '../../components/CreateAd/CreateAdTextArea';
import CreateAdTextField from '../../components/CreateAd/CreateAdTextField';
import ImagePicker from '../../components/CreateAd/ImagePicker';
import SegmentedSelect from '../../components/CreateAd/SegmentedSelect';
import { FromToDateRange } from '../../lib/types/UiHelperTypes';
import AdDateRangePicker from './AdDateRangePicker';
import AdPreview from './AdPreview';
import AutocompleteSubject, { SubjectAutofill } from './AutocompleteSubject';

const MAX_DESCRIPTION_LENGTH = 200;
export type CreateAdLinkedItemType = "institution" | "subject";

type CreateAdBuilderProps = {
    title: string
    setTitle: (value: string) => void
    setSelectedDateRange: (value: FromToDateRange | undefined) => void
    adSize: number
    setAdSize: (value: number) => void
    description: string
    setDescription: (value: string) => void
    image: File | null
    setImage: (value: File | null) => void
    selectedAdSubject: SubjectAutofill | undefined
    setSelectedAdSubject: (value: SubjectAutofill | undefined) => void
    adLinkedItemType: CreateAdLinkedItemType
    setAdLinkedItemType: (value: CreateAdLinkedItemType) => void
    subjects: {
        id: string;
        name: string;
    }[]
}

const CreateAdBuilder: React.FC<CreateAdBuilderProps> = (
    { title, setTitle, setSelectedDateRange, adSize, setAdSize, description, setDescription, image, setImage,
        selectedAdSubject, setSelectedAdSubject, adLinkedItemType, setAdLinkedItemType, subjects }: CreateAdBuilderProps) => {

    const theme = useMantineTheme();
    const { t } = useTranslation('account');

    // Ad image
    const [imageFilepath, setImageFilepath] = useState<string | undefined>(undefined);

    return (
        <Grid gutterMd={theme.spacing.lg} sx={{ maxWidth: theme.breakpoints.lg }}>
            <Grid.Col sm={12} md={6}>
                <Title order={2} size='h5' mb={'md'}>{t('create-ad.ad.section-title')}</Title>
                <Stack>

                    <SegmentedSelect
                        label={t('create-ad.ad.linked.label')} value={adLinkedItemType}
                        onChange={(value) => setAdLinkedItemType(value as "institution" | "subject")}
                        helperText={t('create-ad.ad.linked.helper')}
                        data={{
                            type: "jsx",
                            arr: [
                                {
                                    label: (
                                        <Center>
                                            <IconBuilding size={16} />
                                            <Box ml={10}>{t('create-ad.ad.linked.label-institution')}</Box>
                                        </Center>
                                    ),
                                    value: "institution"
                                },
                                {
                                    label: (
                                        <Center>
                                            <IconSchool size={16} />
                                            <Box ml={10}>{t('create-ad.ad.linked.label-subject')}</Box>
                                        </Center>
                                    ),
                                    value: "subject"
                                },
                            ]
                        }}
                    />

                    {adLinkedItemType === "subject" && (
                        <AutocompleteSubject
                            label={t('create-ad.ad.subject.label')}
                            helper={t('create-ad.ad.subject.helper')}
                            nothingFound={t('create-ad.ad.subject.nothing-found')}
                            subjects={subjects}
                            selectedAdSubject={selectedAdSubject}
                            setSelectedAdSubject={setSelectedAdSubject}
                        />
                    )}

                    <CreateAdTextField
                        value={title}
                        onChange={setTitle}
                        label={t('create-ad.ad.title.label')}
                        placeholder={t('create-ad.ad.title.placeholder')}
                        helpText={t('create-ad.ad.title.helper')}
                    />

                    <SegmentedSelect
                        label={t('create-ad.ad.size.label')} value={adSize.toString()}
                        onChange={(value) => setAdSize(parseInt(value))}
                        helperText={t('create-ad.ad.size.helper')}
                        data={{
                            type: "string",
                            arr: [
                                {
                                    label: t('create-ad.ad.size.label-large'),
                                    value: "3"
                                },
                                {
                                    label: t('create-ad.ad.size.label-medium'),
                                    value: "2"
                                },
                                {
                                    label: t('create-ad.ad.size.label-small'),
                                    value: "1"
                                },
                            ]
                        }}
                    />
                    <CreateAdTextArea
                        label={t('create-ad.ad.description.label')}
                        placeholder={t('create-ad.ad.description.placeholder')}
                        helper={t('create-ad.ad.description.helper')}
                        value={description}
                        onChange={setDescription}
                        error={description.length > MAX_DESCRIPTION_LENGTH}
                    />
                    {
                        (adSize === 3 || adSize === 2) &&
                        <ImagePicker
                            label={t('create-ad.ad.image.label')}
                            placeholder={t('create-ad.ad.image.placeholder')}
                            helper={t('create-ad.ad.image.helper')}
                            image={image}
                            setImage={setImage}
                            setImageFilepath={setImageFilepath}
                        />
                    }
                    <AdDateRangePicker
                        label={t('create-ad.ad.dates.label')}
                        placeholder={t('create-ad.ad.dates.placeholder')}
                        helper={t('create-ad.ad.dates.helper')}
                        onChange={setSelectedDateRange}
                    />
                </Stack>

            </Grid.Col>

            <Grid.Col sm={12} md={6}>
                <AdPreview
                    title={title}
                    adSize={adSize}
                    description={description}
                    adLinkedItemType={adLinkedItemType}
                    imageFilepath={imageFilepath}
                />
            </Grid.Col>
        </Grid>
    )
}

export default CreateAdBuilder