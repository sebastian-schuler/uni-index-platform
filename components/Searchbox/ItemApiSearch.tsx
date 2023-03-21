import { ActionIcon, createStyles, Group, TextInput } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { IconArrowLeft, IconArrowRight, IconSearch, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';

const useStyles = createStyles((theme) => ({
    rightSection: {
        justifyContent: 'flex-end',
        paddingRight: theme.spacing.sm,
    },
    root: {
        width: '100%',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
            width: '50%',
        },
    }
}));

type ItemApiSearchProps = {
    label: string
    placeholder: string
    onSearch: (searchTerm: string) => void
    value: string
    setValue: (value: string) => void
    onCancel: () => void
}

const ItemApiSearch = ({ label, placeholder, onSearch, value, setValue, onCancel }: ItemApiSearchProps) => {

    const { classes, theme } = useStyles();

    const isEmpty = value === "";

    useDidUpdate(() => {
        if (isEmpty) {
            onCancel();
        }
    }, [value]);

    const runSearch = () => {
        onSearch(value);
    }

    return (
        <TextInput
            label={label}
            icon={<IconSearch size="1.1rem" stroke={1.5} />}
            radius="xl"
            size="md"
            classNames={{
                rightSection: classes.rightSection,
                root: classes.root
            }}
            rightSection={
                <Group spacing={theme.spacing.xs} position='right'>
                    {
                        !isEmpty && (
                            <ActionIcon size={32} radius="xl" variant="subtle" onClick={() => onCancel()}>
                                <IconX size="1.1rem" stroke={2} color={'gray'} />
                            </ActionIcon>
                        )
                    }
                    <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled" onClick={() => runSearch()}>
                        {theme.dir === 'ltr' ? (
                            <IconArrowRight size="1.1rem" stroke={1.5} />
                        ) : (
                            <IconArrowLeft size="1.1rem" stroke={1.5} />
                        )}
                    </ActionIcon>

                </Group>
            }
            placeholder={placeholder}
            rightSectionWidth={84} // 42 isEmpty ? 42 : 84
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    runSearch();
                }
            }}
        />
    )
}

export default ItemApiSearch