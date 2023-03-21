import { createStyles, Select } from '@mantine/core';
import { IconArrowsSort } from '@tabler/icons-react';
import * as React from 'react';
import { OrderBy, OrderCategoryBy } from '../../lib/types/zod/zodOrderBy';

const useStyles = createStyles((theme) => ({
    input: {
        backgroundColor: theme.colors.light[0],
    },
    dropdown: {
        backgroundColor: theme.colors.light[0],
    },
}));

type Props = {
    variant: "default"
    orderBy: OrderBy
    handleChange: (selected: OrderBy) => void
} | {
    variant: "categories"
    orderBy: OrderCategoryBy
    handleChange: (selected: OrderCategoryBy) => void
}

const OrderBySelect: React.FC<Props> = ({ variant, orderBy, handleChange }: Props) => {
    const { classes } = useStyles();

    let data = [
        { value: 'popularity', label: 'Popularity' },
        { value: 'az', label: 'A-Z' },
        { value: 'za', label: 'Z-A' },
    ]

    if (variant === "categories") {
        data.push({ value: 'subject-count', label: 'Subject Count' })
    }

    return (
        <Select
            size={'md'}
            label="Order by"
            radius="md"
            data={data}
            value={orderBy}
            icon={<IconArrowsSort size={14} />}
            onChange={(value) => {
                if (variant === "default") {
                    handleChange(value as OrderBy)
                } else {
                    handleChange(value as OrderCategoryBy)
                }
            }}
            classNames={classes}
            transitionProps={{ transition: "pop-top-left", duration: 100, timingFunction: "ease" }}
        />
    )
}

export default OrderBySelect