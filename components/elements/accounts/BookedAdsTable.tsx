import { Badge, createStyles, ScrollArea, Table, Title } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import React, { memo } from 'react';
import { PremiumAdDetailed } from '../../../lib/types/AccountHandlingTypes';

const useStyles = createStyles((theme) => ({
    root: {
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
    },
    progressBar: {
        '&:not(:first-of-type)': {
            borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
        },
    },
}));

interface Props {
    data: PremiumAdDetailed[]
}

const BookedAdsTable: React.FC<Props> = ({ data }: Props) => {
    const { classes, theme } = useStyles();

    // Language
    const { t, lang } = useTranslation('account');
    const langContent = {
        adSizeSmall: t('ad-size-small'),
        adSizeMedium: t('ad-size-medium'),
        adSizeLarge: t('ad-size-large'),

        adTypeInstitution: t('ad-type-institution'),
        adTypeSubject: t('ad-type-subject'),

        adColID: t('ad-col-id'),
        adColBookedUntil: t('ad-col-booked-until'),
        adColType: t('ad-col-type'),
        adColSize: t('ad-col-size'),
        adColLevel: t('ad-col-level'),
    }

    const getAdSizeString = (size: number) => {
        switch (size) {
            case 1:
                return langContent.adSizeSmall;
            case 2:
                return langContent.adSizeMedium;
            case 3:
                return langContent.adSizeLarge;
            default:
                return "";
        }
    }

    const getAdTypeString = (type: string) => {
        switch (type) {
            case "institution":
                return langContent.adTypeInstitution;
            case "subject":
                return langContent.adTypeSubject;
            default:
                return "";
        }
    }

    const rows = data.map((row) => {

        return (
            <tr key={Number(row.id)}>
                <td>
                    {Number(row.id)}
                </td>
                <td>
                    <Badge>
                        {getAdTypeString(row.type)}
                    </Badge>
                </td>
                <td>
                    <Badge>
                        {getAdSizeString(row.size)}
                    </Badge>
                </td>
                <td>{row.Subject?.name}</td>
                <td>{row.description}</td>
                <td>{new Date(Number(row.booked_until)).toLocaleDateString()}</td>
            </tr>
        );
    });

    return (
        <>
            <ScrollArea className={classes.root}>
                <Title order={6} mb={8}>Booked Ads</Title>
                <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Subject Name</th>
                            <th>Description</th>
                            <th>Until</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </>
    );
}

export default memo(BookedAdsTable)