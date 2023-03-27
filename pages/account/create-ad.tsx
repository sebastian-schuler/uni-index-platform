import { Box, Center, Grid, Title, useMantineTheme, Divider, Text, Button } from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { IconArticle, IconLink } from '@tabler/icons-react';
import { useState } from 'react';
import SegmentedSelect from '../../components/CreateAd/SegmentedSelect';
import CreateAdBuilder from '../../features/AccountCreateAd/CreateAdBuilder';

export type CreateAdLinkType = "link" | "post";

//TODO: Remove small size and and an option with or without image instead
// TODO 2: Add option to export created ad to a file, so that it can be imported later

const CreateAd = () => {

    const theme = useMantineTheme();

    // Type
    const [adLinkType, setAdLinkType] = useState<CreateAdLinkType>("link");
    // Date range
    const [selectedDateRange, setSelectedDateRange] = useState<DatesRangeValue | undefined>(undefined);
    // Size of ad
    const [adSize, setAdSize] = useState<number>(2);

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
                    adLinkType === "link" && (
                        <CreateAdBuilder
                            adLinkType={adLinkType}
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                            adSize={adSize}
                            setAdSize={setAdSize}
                        />
                    )
                }

            </Grid.Col>

            <Grid.Col span={12}>
                <Divider mb={'md'} />
                <Title order={2} size='h5' mb={'md'}>Cost</Title>
                <Text>{daysBooked} days booking</Text>
                <Text>{getAdTotalCost()} Eur</Text>
                {/* <Button onClick={submitForm}>Submit</Button> */}

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