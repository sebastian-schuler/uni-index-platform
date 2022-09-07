import { Masonry } from '@mui/lab'
import { SelectChangeEvent } from '@mui/material'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { Searchable } from '../../lib/types/UiHelperTypes'
import CountryCard from '../elements/itemcards/CountryCard'
import OrderBySelect, { OrderByState, sortSearchableArray } from '../elements/OrderBySelect'
import Breadcrumb from '../layout/Breadcrumb'
import SearchBox from '../partials/SearchBox'

type Props = {
    title: string,
    subtitle: string,
    root: "location" | "institution",
    searchableCountries: Searchable[],
    children?: React.ReactNode
}

const CountryList = ({ title, subtitle, root, searchableCountries, children }: Props) => {

    const [dataList, setDataList] = useState<Searchable[]>(searchableCountries);

    const { t } = useTranslation('common');
    const langContent = {
        searchLabel: t('countries-search-label'),
        searchPlaceholder: t('countries-search-placeholder'),
    }

    // Order by
    const [orderBy, setOrderBy] = useState<OrderByState>("relevance");

    const handleOrderChange = (event: SelectChangeEvent) => {
        setOrderBy(event.target.value as OrderByState);
    };

    // Searchable
    useEffect(() => {
        setDataList(searchableCountries);
        return () => { setDataList([]); }
    }, [searchableCountries]);

    useEffect(() => {
        setDataList(sortSearchableArray(dataList, orderBy));
    }, [orderBy]);

    return (
        <Grid container spacing={4}>

            <Grid item xs={12}>
                <Breadcrumb />
            </Grid>

            <Grid item xs={12} sm={12} md={2}>

                <SearchBox
                    label={langContent.searchLabel}
                    placeholder={langContent.searchPlaceholder}
                    searchableList={dataList}
                    setSearchableList={setDataList}
                />

            </Grid>

            <Grid item
                xs={12} sm={12} md={10}
                flexGrow={1}
                component={'section'}
            >

                <Stack spacing={4} direction={"row"} justifyContent={"space-between"}>

                    <Stack sx={{ marginBottom: 1 }}>
                        <Typography
                            variant="h6"
                            component="h2"
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="span"
                        >
                            {subtitle}
                        </Typography>
                    </Stack>

                    <OrderBySelect orderBy={orderBy} handleChange={handleOrderChange} />
                </Stack>

                <Masonry columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }} spacing={3} sx={{ paddingX: 0, marginBottom: 6 }}>
                    {
                        dataList.map((searchableCountry, i) => (
                            searchableCountry.visible && (

                                <CountryCard key={i} country={searchableCountry.data} linkType={root} />

                            )
                        ))
                    }
                </Masonry>
                {
                    children
                }
            </Grid>
        </Grid>
    )
}

export default CountryList