import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, tableRowClasses } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import React, { memo } from 'react';
import { PremiumAdDetailed } from '../../../lib/types/AccountHandlingTypes';

interface Column {
    id: 'id' | 'type' | 'size' | 'booked_until' | 'description';
    label: string;
    minWidth?: number;
    align?: 'right';
    formatNumber?: (value: number) => string;
    formatString?: (value: string) => string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.main,
        // borderColor:  theme.palette.primary.dark,
    },
    [`&.${tableCellClasses.body}`]: {
        // backgroundColor: theme.palette.secondary.dark,
        // color: theme.palette.common.white,
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.secondary.main,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    [`&.${tableRowClasses.root}:nth-of-type(odd)`]: {
        // backgroundColor: theme.palette.secondary.dark,
    },
}));

type PremiumAdTable = {
    id: number
    booked_until: number
    level: number
    type: string
    placement: string[]
    size: number
    description: string
    image_name: string
}

type Props = {
    bookedAds: PremiumAdDetailed[]
}

const BookedAdsTable: React.FC<Props> = props => {
    const { bookedAds } = props;

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

    const tableContent: PremiumAdTable[] = bookedAds.map(ad => {
        return {
            id: Number(ad.id),
            booked_until: Number(ad.booked_until),
            level: ad.level,
            type: ad.type,
            placement: ad.placement,
            size: ad.size,
            description: ad.description || "",
            image_name: ad.image_id || ""
        }
    })

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

    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 100 },
        {
            id: 'type',
            label: langContent.adColType,
            minWidth: 170,
            formatString: (value: string) => getAdTypeString(value)
        },
        {
            id: 'size',
            label: langContent.adColSize,
            minWidth: 100,
            formatNumber: (value: number) => getAdSizeString(value)
        },
        {
            id: 'booked_until',
            label: langContent.adColBookedUntil,
            minWidth: 170,
            align: 'right',
            formatNumber: (value: number) => new Date(value).toLocaleDateString('de-DE'), // TODO locale
        },
        {
            id: 'description',
            label: 'Description',
            minWidth: 170,
        }
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow >
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableContent
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={i}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {
                                                        column.formatNumber && typeof value === 'number' ? column.formatNumber(value) :
                                                            column.formatString && typeof value === 'string' ? column.formatString(value) :
                                                                value
                                                    }
                                                </StyledTableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={bookedAds.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default memo(BookedAdsTable)