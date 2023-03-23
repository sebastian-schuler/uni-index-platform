import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Pagination, Group } from '@mantine/core'
import Link from 'next/link'

type Props = {
    currentPage: number
    pageCount: number
    rootPath: string
}

const CustomPagination = ({ currentPage, pageCount, rootPath }: Props) => {

    // const { classes, theme } = useStyles();
    const { t } = useTranslation('common');
    
    return (
        <Pagination.Root
            value={currentPage}
            total={pageCount}
            getItemProps={(page) => ({
                component: Link,
                href: `${rootPath}?page=${page}`, //  pathname: rootPath, query: { page: page } 
                title: t('pagination.label', { page }),
            })}
        >
            <Group spacing={7} position="center" mt="xl">
                {
                    currentPage > 1 ? <Pagination.First component={Link} href={{ pathname: rootPath, query: { page: 1 } }} title={t('pagination.first')} />
                        : <Pagination.First disabled />
                }
                {
                    currentPage > 1 ? <Pagination.Previous component={Link} href={{ pathname: rootPath, query: { page: currentPage - 1 } }} title={t('pagination.prev')} />
                        : <Pagination.Previous disabled />
                }
                <Pagination.Items />
                {
                    currentPage < pageCount ? <Pagination.Next component={Link} href={{ pathname: rootPath, query: { page: currentPage + 1 } }} title={t('pagination.next')}/>
                        : <Pagination.Next disabled />
                }
                {
                    currentPage < pageCount ? <Pagination.Last component={Link} href={{ pathname: rootPath, query: { page: pageCount } }} title={t('pagination.last')}/>
                        : <Pagination.Last disabled />
                }
            </Group>
        </Pagination.Root>
    )
}

export default CustomPagination