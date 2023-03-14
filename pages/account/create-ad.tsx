import { ActionIcon, Autocomplete, Box, Button, Center, FileInput, Grid, Group, Paper, px, SegmentedControl, Stack, Text, Textarea, Title, useMantineTheme } from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { Subject } from '@prisma/client';
import { IconArticle, IconBuilding, IconLink, IconSchool, IconUpload, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import HelpPopover from '../../components/Popover/HelpPopover';
import AdCardLarge from '../../components/Card/AdCardLarge';
import AdCardMedium from '../../components/Card/AdCardMedium';
import AdCardSmall from '../../components/Card/AdCardSmall';
import { useAuth } from '../../lib/context/SessionContext';
import { getUserDataFromApi } from '../../lib/accountHandling/AccountApiHandler';
import { UserDataProfile } from '../../lib/types/AccountHandlingTypes';

type LinkType = "link" | "post";
type LinkedItemType = "institution" | "subject";

type SubjectAutofill = {
    value: string
    subject: Subject
}

const MAX_DESCRIPTION_LENGTH = 200;
const PRIMARY_AD_HEIGHT = 400;

//TODO: Remove small size and and an option with or without image instead
// TODO 2: Add option to export created ad to a file, so that it can be imported later

const CreateAd = () => {

    const { token } = useAuth();
    const theme = useMantineTheme();
    const SECONDARY_AD_HEIGHT = PRIMARY_AD_HEIGHT / 2 - px(theme.spacing.lg) / 2;

    // Ad type
    const [adLinkType, setAdLinkType] = useState<LinkType>("link");
    // Ad linked item
    const [adLinkedItemType, setAdLinkedItemType] = useState<LinkedItemType>("institution");
    const [adSize, setAdSize] = useState<number>(2);
    // Ad subject
    const [formAvailableSubjects, setFormAvailableSubjects] = useState<SubjectAutofill[]>([]);
    const [selectedAdSubject, setSelectedAdSubject] = useState<SubjectAutofill | undefined>(undefined);
    const [typedAdSubject, setTypedAdSubject] = useState<string>("");
    // Ad image
    const [imageFilepath, setImageFilepath] = useState<string | undefined>(undefined);
    const [image, setImage] = useState<File | null>(null);
    // Ad description
    const [description, setDescription] = useState<string>("");
    // Ad until
    const [until, setUntil] = useState<Date | null>(null);
    // Data
    const [userData, setUserData] = useState<UserDataProfile>(null);

    // COST
    const daysBooked = until === null ? 0 : Math.round(Math.abs((Date.now() - (until.getTime())) / (24 * 60 * 60 * 1000))) + 1;

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

    /**
     * Sets the image to the new image if it is a valid image
     * @param newImage 
     */
    const handleSetImage = (newImage: File) => {
        if (newImage.type === "image/jpeg" || newImage.type === "image/png")
            setImage(newImage);
        else
            setImage(null);
    }

    /**
     * Submits the form to the server
     */
    const submitForm = async () => {

        let formData = new FormData();
        formData.append("type", adLinkedItemType);
        formData.append("size", adSize.toString());

        if (until !== null) {
            formData.append("until", until.getTime().toString());
        }
        if (adSize === 3) {
            formData.append("description", description);
        }
        if ((adSize === 2 || adSize === 3) && image !== null) {
            formData.append("image", image);
        }
        if (adLinkedItemType === "subject" && selectedAdSubject !== undefined) {
            formData.append("subject", selectedAdSubject.subject.id.toString());
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

    /**
     * Creates an object url for the image and sets it as the image filepath
     */
    useEffect(() => {
        let objectUrl = "";
        if (image !== null) {
            objectUrl = URL.createObjectURL(image)
            setImageFilepath(objectUrl)
        } else {
            setImageFilepath(undefined);
        }
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])

    /**
     * Gets the subjects from the api and sets them as the available subjects
     */
    useEffect(() => {
        const getSubjects = async () => {
            const userDataRes = await getUserDataFromApi({ userSubjects: true, profile: true });
            if (userDataRes === null || userDataRes.status !== "SUCCESS") return;

            const subjectAutofill = userDataRes.subjects?.map((subject) => { return { value: subject.name, subject: subject } });
            setFormAvailableSubjects(subjectAutofill || []);
            setUserData(userDataRes.profile || null);
        }

        getSubjects();

        return () => { }
    }, [token])

    /**
     * Gets the headline of the ad
     * @returns 
     */
    const getAdHeadline = (): string => {
        if (adLinkedItemType === "subject") {
            if (selectedAdSubject === null) return "[Title]";
            return selectedAdSubject?.subject.name || "[Title]";
        } else if (adLinkedItemType === "institution") {
            return userData?.institution?.name || "[Institution Name]";
        } else {
            return "[Title]";
        }
    }

    return (
        <Grid sx={{ maxWidth: theme.breakpoints.lg }}>

            <Grid.Col sm={12} md={6}>
                <Paper p="lg" shadow="sm" radius="md" sx={{ backgroundColor: theme.colors.light[0] }}>

                    <Title order={1} size="h5" mb={"lg"}>Create new ad</Title>

                    <Stack>
                        <div>
                            <Group position="apart">
                                <Text size={"sm"}>Type of ad</Text>
                                <HelpPopover helpText='Do you want your ad to link to your entire institution page, or just one specific subject?' size={theme.fontSizes.lg} />
                            </Group>
                            <SegmentedControl
                                radius={theme.radius.md}
                                value={adLinkType}
                                color="brandOrange"
                                size='md'
                                fullWidth
                                onChange={(value) => setAdLinkType(value as LinkType)}
                                data={[
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
                                ]}
                            />
                        </div>
                        {
                            adLinkType === "link" &&
                            <div>
                                <Group position="apart">
                                    <Text size={"sm"}>Linked item</Text>
                                    <HelpPopover helpText='Do you want your ad to link to your entire institution page, or just one specific subject?' size={theme.fontSizes.lg} />
                                </Group>
                                <SegmentedControl
                                    radius={theme.radius.md}
                                    value={adLinkedItemType}
                                    color="brandOrange"
                                    size='md'
                                    fullWidth
                                    onChange={(value) => setAdLinkedItemType(value as "institution" | "subject")}
                                    data={[
                                        {
                                            label:
                                                <Center>
                                                    <IconBuilding size={16} />
                                                    <Box ml={10}>Institution</Box>
                                                </Center>,
                                            value: 'institution'
                                        },
                                        {
                                            label:
                                                <Center>
                                                    <IconSchool size={16} />
                                                    <Box ml={10}>Subject</Box>
                                                </Center>,
                                            value: 'subject'
                                        },
                                    ]}
                                />
                            </div>
                        }

                        {adLinkedItemType === "subject" && adLinkType === "link" && (
                            <Box>
                                <Group position="apart">
                                    <Text size={"sm"}>Subject</Text>
                                    <HelpPopover helpText='Select the subject you want to advertise for.' size={theme.fontSizes.lg} />
                                </Group>
                                <Autocomplete
                                    size='md'
                                    value={selectedAdSubject?.value}
                                    onChange={(value) => {
                                        setSelectedAdSubject(formAvailableSubjects.find((subject) => subject.value === value));
                                        setTypedAdSubject(value);
                                    }}
                                    icon={<IconSchool color={theme.colors.brandGray[0]} />}
                                    radius={theme.radius.md}
                                    data={formAvailableSubjects}
                                    nothingFound="No subjects found"
                                    required
                                    error={
                                        typedAdSubject.length !== 0 && selectedAdSubject === undefined
                                    }
                                />
                            </Box>
                        )}

                        <Box>
                            <Group position="apart">
                                <Text size={"sm"}>Size of ad</Text>
                                <HelpPopover helpText='The size your ad should be, check the preview.' size={theme.fontSizes.lg} />
                            </Group>
                            <SegmentedControl
                                radius={theme.radius.md}
                                value={adSize.toString()}
                                color="brandOrange"
                                size='md'
                                fullWidth
                                onChange={(value) => setAdSize(parseInt(value))}
                                data={[
                                    {
                                        label:
                                            <Center>Large</Center>,
                                        value: "3"
                                    },
                                    {
                                        label:
                                            <Center>Medium</Center>,
                                        value: "2"
                                    },
                                    {
                                        label:
                                            <Center>Small</Center>,
                                        value: "1"
                                    },
                                ]}
                            />
                        </Box>

                        <Box>
                            <Group position="apart">
                                <Text size={"sm"}>Description</Text>
                                <HelpPopover helpText='The description placed inside your ad.' size={theme.fontSizes.lg} />
                            </Group>
                            <Textarea
                                placeholder="Your description"
                                radius="md"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={description.length > MAX_DESCRIPTION_LENGTH}
                            />
                        </Box>

                        {
                            (adSize === 3 || adSize === 2) &&
                            <Box>
                                <Group position="apart">
                                    <Text size={"sm"}>Image</Text>
                                    <HelpPopover helpText='The description placed inside your ad.' size={theme.fontSizes.lg} />
                                </Group>
                                <Group spacing={0}>
                                    <FileInput
                                        value={image}
                                        onChange={handleSetImage}
                                        radius={theme.radius.md}
                                        icon={<IconUpload size={14} />}
                                        placeholder="Pick image"
                                        withAsterisk
                                        accept="image/png,image/jpeg"
                                        sx={{ flex: 1 }}
                                        rightSection={
                                            image !== null &&
                                            <ActionIcon radius="xl" onClick={() => setImage(null)}>
                                                <IconX size={theme.fontSizes.md} />
                                            </ActionIcon>
                                        }
                                    />
                                </Group>
                            </Box>
                        }

                        <Box>
                            <Group position="apart">
                                <Text size={"sm"}>Book ad until</Text>
                                <HelpPopover helpText='How long you want to book your ad for. Starting from the day after the booking until the day of your choosing, inclusive.' size={theme.fontSizes.lg} />
                            </Group>
                            <DatePickerInput
                                placeholder='Select until date'
                                value={until}
                                onChange={setUntil}
                                radius={theme.radius.md}
                                excludeDate={(date) => date.getTime() < Date.now()}
                                getDayProps={(date) => {

                                    const today = new Date();
                                    const tomorrow = new Date(today);
                                    tomorrow.setDate(tomorrow.getDate() + 1);

                                    if (
                                        today.getFullYear() === date.getFullYear() &&
                                        today.getMonth() === date.getMonth() &&
                                        today.getDate() === date.getDate()
                                    ) {
                                        return { backgroundColor: theme.colors.gray[6], color: theme.white }
                                    } else if (
                                        tomorrow.getFullYear() === date.getFullYear() &&
                                        tomorrow.getMonth() === date.getMonth() &&
                                        tomorrow.getDate() === date.getDate()
                                    ) {
                                        return { backgroundColor: theme.colors.brandOrange[5], color: theme.white }
                                    } else if (
                                        until?.getFullYear() === date.getFullYear() &&
                                        until?.getMonth() === date.getMonth() &&
                                        until?.getDate() === date.getDate()
                                    ) {
                                        return { backgroundColor: theme.colors.brandOrange[5], color: theme.white }
                                    } else if (
                                        until !== null &&
                                        date.getTime() > Date.now() &&
                                        date.getTime() < until.getTime()
                                    ) {
                                        return { backgroundColor: theme.colors.brandOrange[1], color: theme.colors.brandGray[0] }
                                    } else if (date.getTime() < today.getTime()) {
                                        return { color: theme.colors.gray[3] }
                                    }

                                    return { color: theme.colors.brandGray[0] }
                                }}
                            />
                        </Box>

                    </Stack>
                </Paper>
            </Grid.Col>

            <Grid.Col sm={12} md={6}>
                <Text size={"xl"} color={"dimmed"} weight={"bold"}>Preview</Text>

                {
                    adSize === 3 &&
                    <AdCardLarge
                        description={description === "" ? "[Description]" : description}
                        subtext='subtext'
                        title={getAdHeadline()}
                        link='#'
                        colHeight={PRIMARY_AD_HEIGHT}
                        adType={adLinkedItemType}
                        imgUrl={imageFilepath}
                        disableLink
                    />
                    ||
                    adSize === 2 &&
                    <AdCardMedium
                        subtext='subtext'
                        description={description === "" ? "[Description]" : description}
                        title={getAdHeadline()}
                        link='#'
                        colHeight={SECONDARY_AD_HEIGHT}
                        adType={adLinkedItemType}
                        imgUrl={imageFilepath}
                        disableLink
                    />
                    ||
                    adSize === 1 &&
                    <Box sx={{ maxWidth: 260 }}>
                        <AdCardSmall
                            subtext='subtext'
                            description={description === "" ? "[Description]" : description}
                            title={getAdHeadline()}
                            link='#'
                            adType={adLinkedItemType}
                            colHeight={SECONDARY_AD_HEIGHT}
                            disableLink
                        />
                    </Box>
                }

            </Grid.Col>

            <Grid.Col span={12}>
                <Paper p="lg" shadow="sm" radius="md" sx={{ backgroundColor: theme.colors.light[0] }}>

                    <Text>{daysBooked} days booking</Text>
                    <Text>{getAdTotalCost()} Eur</Text>
                    <Button onClick={submitForm}>Submit</Button>

                </Paper>
            </Grid.Col>
        </Grid>
    )
}

export default CreateAd