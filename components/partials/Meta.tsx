import { NextPage } from 'next'
import Head from 'next/head'; // Use head from next/document only in pages, otherwise use next/head

type Props = {
    title: string,
    description: string,
}

const Meta: NextPage<Props> = props => {
    return (
        
            <Head>
                <title key={"title"}>{props.title}</title>
                <meta key={"viewport"} name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta key={"description"} name="description" content={props.description} />
            </Head>
        
    )
}

export default Meta