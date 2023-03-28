import { Box, Center, Grid, Stack, Title, useMantineTheme } from '@mantine/core';
import { IconBuilding, IconSchool } from '@tabler/icons-react';
import React, { useState } from 'react';
import CreateAdTextArea from '../../components/CreateAd/CreateAdTextArea';
import CreateAdTextField from '../../components/CreateAd/CreateAdTextField';
import ImagePicker from '../../components/CreateAd/ImagePicker';
import SegmentedSelect from '../../components/CreateAd/SegmentedSelect';
import { CreateAdLinkType, FromToDateRange } from '../../lib/types/UiHelperTypes';
import AdDateRangePicker from './AdDateRangePicker';
import AdPreview from './AdPreview';
import AutocompleteSubject, { SubjectAutofill } from './AutocompleteSubject';

const MAX_DESCRIPTION_LENGTH = 200;
export type CreateAdLinkedItemType = "institution" | "subject";

type CreateAdBuilderProps = {
    title: string
    setTitle: (value: string) => void
    adLinkType: CreateAdLinkType
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
    { title, setTitle, adLinkType, setSelectedDateRange, adSize, setAdSize, description, setDescription, image, setImage,
        selectedAdSubject, setSelectedAdSubject, adLinkedItemType, setAdLinkedItemType, subjects }: CreateAdBuilderProps) => {

    const theme = useMantineTheme();

    // Ad image
    const [imageFilepath, setImageFilepath] = useState<string | undefined>(undefined);

    return (
        <Grid gutterMd={theme.spacing.lg} sx={{ maxWidth: theme.breakpoints.lg }}>
            <Grid.Col sm={12} md={6}>
                <Title order={2} size='h5' mb={'md'}>Link Details</Title>
                <Stack>
                    {
                        adLinkType === "link" &&
                        <SegmentedSelect
                            label='Linked item' value={adLinkedItemType}
                            onChange={(value) => setAdLinkedItemType(value as "institution" | "subject")}
                            helperText='Do you want your ad to link to your entire institution page, or just one specific subject?'
                            data={{
                                type: "jsx",
                                arr: [
                                    {
                                        label: (
                                            <Center>
                                                <IconBuilding size={16} />
                                                <Box ml={10}>Institution</Box>
                                            </Center>
                                        ),
                                        value: "institution"
                                    },
                                    {
                                        label: (
                                            <Center>
                                                <IconSchool size={16} />
                                                <Box ml={10}>Subject</Box>
                                            </Center>
                                        ),
                                        value: "subject"
                                    },
                                ]
                            }}
                        />
                    }

                    {adLinkedItemType === "subject" && adLinkType === "link" && (
                        <AutocompleteSubject
                            subjects={subjects}
                            selectedAdSubject={selectedAdSubject}
                            setSelectedAdSubject={setSelectedAdSubject}
                        />
                    )}

                    <CreateAdTextField
                        value={title}
                        onChange={setTitle}
                        label="Title"
                        placeholder="Enter a title for your article"
                        helpText="The title of your article."
                    />

                    <SegmentedSelect
                        label='Size of ad' value={adSize.toString()}
                        onChange={(value) => setAdSize(parseInt(value))}
                        helperText='The size your ad should be, check the preview.'
                        data={{
                            type: "string",
                            arr: [
                                {
                                    label: "Large",
                                    value: "3"
                                },
                                {
                                    label: "Medium",
                                    value: "2"
                                },
                                {
                                    label: "Small",
                                    value: "1"
                                },
                            ]
                        }}
                    />
                    <CreateAdTextArea
                        label='Description'
                        value={description}
                        onChange={setDescription}
                        error={description.length > MAX_DESCRIPTION_LENGTH}
                    />
                    {
                        (adSize === 3 || adSize === 2) &&
                        <ImagePicker
                            image={image}
                            setImage={setImage}
                            setImageFilepath={setImageFilepath}
                        />
                    }
                    <AdDateRangePicker
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