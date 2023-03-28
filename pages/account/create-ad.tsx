import { Box, Button, Center, Divider, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useMantineTheme } from '@mantine/styles';
import { Link } from '@mantine/tiptap';
import { IconArticle, IconLink } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import SegmentedSelect from '../../components/CreateAd/SegmentedSelect';
import ArticleBuilder from '../../features/AccountCreateAd/ArticleBuilder';
import { SubjectAutofill } from '../../features/AccountCreateAd/AutocompleteSubject';
import CreateAdBuilder, { CreateAdLinkedItemType } from '../../features/AccountCreateAd/CreateAdBuilder';
import { getCalculatedAdCost } from '../../lib/accountHandling/costCalculator';
import { useAuth } from '../../lib/context/SessionContext';
import { getInstitutionDataFromToken } from '../../lib/prisma/prismaUserAccounts';
import { CreateAdLinkType, FromToDateRange } from '../../lib/types/UiHelperTypes';

// TODO 2: Add option to export created ad to a file, so that it can be imported later

type Props = {
    institutionData: {
        subject: {
            id: string;
            name: string;
        }[];
        name: string;
    }
}

const CreateAd = ({ institutionData }: Props) => {

    const { t, lang } = useTranslation("account");
    const theme = useMantineTheme();
    const { token } = useAuth();

    // ====================== GENERIC VARS ======================

    // Title
    const [title, setTitle] = useState<string>("");
    // Image
    const [image, setImage] = useState<File | null>(null);

    // ====================== AD VARS ======================

    // Type
    const [adLinkType, setAdLinkType] = useState<CreateAdLinkType>("link");
    // Date range
    const [selectedDateRange, setSelectedDateRange] = useState<FromToDateRange | undefined>(undefined);
    // Size of ad
    const [adSize, setAdSize] = useState<number>(2);
    // Ad description
    const [description, setDescription] = useState<string>("");
    // Ad subject
    const [selectedAdSubject, setSelectedAdSubject] = useState<SubjectAutofill | undefined>(undefined);
    // Ad linked item
    const [adLinkedItemType, setAdLinkedItemType] = useState<CreateAdLinkedItemType>("institution");

    // ====================== ARTICLE VARS ======================

    // Article Editor 
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
        ]
    });

    // ==========================================================

    // COST
    const daysBooked = dateDiffInDays(selectedDateRange);

    const getAdCost = () => {

        let cost;
        try {
            cost = getCalculatedAdCost(adLinkType, adSize, daysBooked).toLocaleString(lang, { style: 'currency', currency: 'EUR' });
            return cost;
        } catch (error) {
            return "N/A";
        }
    }

    const isSubmitDisabled = () => {

        // Title has to be at least 3 characters long
        if (title.length < 3) return true;

        if (adLinkType === "link") {

            if (adLinkedItemType === "subject") {
                // Subject has to be selected
                if (!selectedAdSubject) return true;
            }

            if (adSize === 2 || adSize === 3) {
                // Image has to be selected
                if (!image) return true;
            }

            // Description has to be between 10 and 1000 characters long
            if (description.length < 10 || description.length > 1000) return true;

            // Date range has to be selected
            if (!selectedDateRange || selectedDateRange.from === 0 || selectedDateRange.to === 0) return true;

        } else if (adLinkType === "article") {

            // Editor has to have at least 4 lines of text
            if ((editor && editor.getJSON().content?.length || 0) <= 3) return true;

        }

        return false;
    }

    const submitDisabled = isSubmitDisabled();

    // ====================== EFFECTS ======================

    useEffect(() => {

        if (adLinkType === "link") {

            if (adLinkedItemType === "subject") {
                setTitle(selectedAdSubject?.value ?? "");
            } else if (adLinkedItemType === "institution") {
                setTitle("");
            }

        } else {
            setTitle("")
        }

        return () => { }
    }, [adLinkType, adLinkedItemType, selectedAdSubject, setTitle]);

    // =============== Submit function =================

    /**
 * Submits the form to the server
 */
    const submitForm = async () => {

        let formData = new FormData();

        formData.append("bookingType", adLinkType);

        // Add image to the form
        if (adSize === 2 || adSize === 3 || adLinkType === "article") {
            if (image) {
                formData.append("image", image);
            } else {
                return;
            }
        }

        if (adLinkType === "link") {

            // Add all generic data to the form
            formData.append("adType", adLinkedItemType);
            formData.append("size", adSize.toString());
            formData.append("description", description);

            // Add date range to the form
            if (selectedDateRange) {
                formData.append("dateFrom", selectedDateRange.from.toString());
                formData.append("dateTo", selectedDateRange.to.toString());
            } else {
                return;
            }

            // If the ad is linked to a subject, add the subject id to the form
            if (adLinkedItemType === "subject") {
                if (selectedAdSubject) {
                    formData.append("subject", selectedAdSubject.subjectId.toString());
                } else {
                    return;
                }
            }

        } else if (adLinkType === "article") {

            formData.append("title", title);

            // Add editor content to the form
            if (editor) {
                formData.append("content", JSON.stringify(editor.getJSON()));
            }

        }

        const res = await fetch('/api/account/user-create-ad', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData

        }).then((t) => t.json());

        console.log(res)
    }

    return (
        <div>
            <Grid sx={{ maxWidth: theme.breakpoints.lg }}>

                <Grid.Col sm={12} md={6}>
                    <Title order={1} size='h3' mb={'md'}>Create new ad</Title>
                    <SegmentedSelect
                        label='Type of ad' value={adLinkType}
                        onChange={(value) => setAdLinkType(value as CreateAdLinkType)}
                        helperText='Do you want your ad to link to your entire institution page, or just one specific subject?'
                        data={{
                            type: "jsx",
                            arr: [
                                {
                                    label:
                                        <Center>
                                            <IconLink size={16} />
                                            <Box ml={10}>Link</Box>
                                        </Center>,
                                    value: 'link'
                                },
                                {
                                    label:
                                        <Center>
                                            <IconArticle size={16} />
                                            <Box ml={10}>Article</Box>
                                        </Center>,
                                    value: 'article'
                                },
                            ]
                        }}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Divider mb={'md'} />
                    {
                        adLinkType === "link" ? (
                            <CreateAdBuilder
                                title={title}
                                setTitle={setTitle}
                                adLinkType={adLinkType}
                                setSelectedDateRange={setSelectedDateRange}
                                adSize={adSize}
                                setAdSize={setAdSize}
                                description={description}
                                setDescription={setDescription}
                                image={image}
                                setImage={setImage}
                                selectedAdSubject={selectedAdSubject}
                                setSelectedAdSubject={setSelectedAdSubject}
                                adLinkedItemType={adLinkedItemType}
                                setAdLinkedItemType={setAdLinkedItemType}
                                subjects={institutionData.subject}
                            />
                        ) : (
                            <ArticleBuilder
                                title={title}
                                setTitle={setTitle}
                                editor={editor}
                                image={image}
                                setImage={setImage}
                            />
                        )
                    }

                </Grid.Col>

                <Grid.Col span={12}>
                    <Divider mb={'md'} />
                    <Title order={2} size='h5' mb={'md'}>Cost</Title>
                    <Group position='apart' align={'flex-start'}>
                        <Stack spacing={'xs'}>
                            {
                                adLinkType === "link" &&
                                <Text>
                                    <Text component='span' weight={500}>{daysBooked}</Text>
                                    {' days booking'}
                                </Text>
                            }
                            <Text>
                                <Text component='span' weight={500}>{getAdCost()}</Text>
                                {' estimated total cost'}
                            </Text>
                        </Stack>
                        <Stack spacing={'xs'}>
                            {submitDisabled && <Text color={'red'}>Please fill out all required fields</Text>}
                            <Button onClick={submitForm} size={'lg'} disabled={submitDisabled}>Submit booking</Button>
                        </Stack>
                    </Group>
                </Grid.Col>
            </Grid>
        </div>
    )
}

const dateDiffInDays = (range: FromToDateRange | undefined): number => {
    if (!range || range.from === 0 || range.to === 0) return 0;
    const diffInMs = Math.abs(range.from - range.to);
    return Math.ceil(diffInMs / (24 * 60 * 60 * 1000));
}


export const getServerSideProps: GetServerSideProps = async (context) => {

    // Check if the token exists in the cookies
    const token = context.req.cookies["institution-session"];
    if (!token) return {
        redirect: {
            destination: '/login',
            permanent: false
        }
    }

    // Get data from the token
    const data = await getInstitutionDataFromToken(token);

    // Check if the token is valid
    if (!data || Number(data.lifetime) < Date.now()) return {
        redirect: {
            destination: '/login',
            permanent: false
        }
    }

    const props: Props = { institutionData: data.user.institution };
    return { props };
}

export default CreateAd