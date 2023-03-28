import { Box, Button, Center, Divider, Grid, Text, Title, useMantineTheme } from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { Link } from '@mantine/tiptap';
import { IconArticle, IconLink } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import SegmentedSelect from '../../components/CreateAd/SegmentedSelect';
import ArticleBuilder from '../../features/AccountCreateAd/ArticleBuilder';
import { SubjectAutofill } from '../../features/AccountCreateAd/AutocompleteSubject';
import CreateAdBuilder, { CreateAdLinkedItemType } from '../../features/AccountCreateAd/CreateAdBuilder';
import { useAuth } from '../../lib/context/SessionContext';
import { CreateAdLinkType } from '../../lib/types/UiHelperTypes';

//TODO: Remove small size and and an option with or without image instead
// TODO 2: Add option to export created ad to a file, so that it can be imported later

const CreateAd = () => {

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
    const [selectedDateRange, setSelectedDateRange] = useState<DatesRangeValue | undefined>(undefined);
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

    /**
     * Calculates the total cost of the ad
     * @returns 
     */
    const getAdTotalCost = (): number => {
        let cost = 0;
        if (adSize === 1) {
            cost = 0.99 * daysBooked;
        } else if (adSize === 2) {
            cost = 1.99 * daysBooked;
        } else {
            cost = 2.99 * daysBooked;
        }
        return cost;
    }

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
    }, [adLinkType, adLinkedItemType, selectedAdSubject, setTitle])

    // =============== Submit function =================

    /**
 * Submits the form to the server
 */
    const submitForm = async () => {

        let formData = new FormData();

        formData.append("bookingType", adLinkType);

        if (adLinkType === "link") {

            // Add all generic data to the form
            formData.append("adType", adLinkedItemType);
            formData.append("size", adSize.toString());
            formData.append("description", description);

            // Add date range to the form
            if (selectedDateRange && selectedDateRange[0] && selectedDateRange[1]) {
                formData.append("dateFrom", selectedDateRange[0].getTime().toString());
                formData.append("dateTo", selectedDateRange[1].getTime().toString());
            } else {
                return;
            }

            // Add image to the form
            if (adSize === 2 || adSize === 3) {
                if (image) {
                    formData.append("image", image);
                } else {
                    return;
                }
            }

            // If the ad is linked to a subject, add the subject id to the form
            if (adLinkedItemType === "subject") {
                if (selectedAdSubject) {
                    formData.append("subject", selectedAdSubject.subject.id.toString());
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
                                        <Box ml={10}>Post</Box>
                                    </Center>,
                                value: 'post'
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
                            selectedDateRange={selectedDateRange}
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
                        />
                    ) : (
                        <ArticleBuilder
                            title={title}
                            setTitle={setTitle}
                            editor={editor}
                        />
                    )
                }

            </Grid.Col>

            <Grid.Col span={12}>
                <Divider mb={'md'} />
                <Title order={2} size='h5' mb={'md'}>Cost</Title>
                <Text>{daysBooked} days booking</Text>
                <Text>{getAdTotalCost()} Eur</Text>
                <Button onClick={submitForm}>Submit</Button>

            </Grid.Col>
        </Grid>
    )
}

const dateDiffInDays = (range: DatesRangeValue | undefined): number => {
    if (!range) return 0;
    const date1 = range[0]?.getTime() || 0;
    const date2 = range[1]?.getTime() || 0;
    const diffInMs = Math.abs(date1 - date2);
    return Math.round(diffInMs / (24 * 60 * 60 * 1000));
}

export default CreateAd