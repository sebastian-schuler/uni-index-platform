import { createStyles, Select } from '@mantine/core';
import { IconArrowsSort } from '@tabler/icons';
import * as React from 'react';

const useStyles = createStyles((theme) => ({
    input: {
        backgroundColor: theme.colors.light[0],
    },
    dropdown: {
        backgroundColor: theme.colors.light[0],
    },
}));

export type OrderByState = "popularity" | "az" | "za";

interface Props {
    orderBy: OrderByState
    handleChange: (selected: OrderByState) => void
}

const OrderBySelect: React.FC<Props> = ({ orderBy, handleChange }: Props) => {
    const { classes } = useStyles();
    return (
        <Select
            label="Order by"
            radius="md"
            data={
                [
                    { value: 'popularity', label: 'Popularity' },
                    { value: 'az', label: 'A-Z' },
                    { value: 'za', label: 'Z-A' },
                ]
            }
            value={orderBy}
            icon={<IconArrowsSort size={14} />}
            onChange={(value) => handleChange(value as OrderByState)}
            classNames={classes}
            transition="pop-top-left"
            transitionDuration={100}
            transitionTimingFunction="ease"
        />
    )
}

export default OrderBySelect