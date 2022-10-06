import { Anchor, createStyles, ScrollArea, Table } from '@mantine/core';
import React from 'react'

const useStyles = createStyles((theme) => ({

}));

const SmIndexTopRanking = () => {

    const { classes, theme } = useStyles();

    // const rows = data.map((row) => {

    //     return (
    //         <tr key={row.title}>
    //             <td>
    //                 <Anchor<'a'> size="sm" onClick={(event) => event.preventDefault()}>
    //                     {row.title}
    //                 </Anchor>
    //             </td>
    //             <td>
    //                 <Anchor<'a'> size="sm" onClick={(event) => event.preventDefault()}>
    //                     {row.author}
    //                 </Anchor>
    //             </td>
    //             <td>{Intl.NumberFormat().format(totalReviews)}</td>
    //         </tr>
    //     );
    // });

    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
                <thead>
                    <tr>
                        <th>Book title</th>
                        <th>Year</th>
                        <th>Author</th>
                        <th>Reviews</th>
                        <th>Reviews distribution</th>
                    </tr>
                </thead>
                {/* <tbody>{rows}</tbody> */}
            </Table>
        </ScrollArea>
    );
}

export default SmIndexTopRanking