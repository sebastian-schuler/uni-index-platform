function searchWikipedia(searchQuery: string, locale: string) {

    return getTitles(searchQuery, locale).then((searchRes) => {

        return getContent(searchRes.query.search[0].title, locale).then((contentRes) => {

            const extract: string = contentRes.query.pages[0].extract;
            
            // In wikipedias wiki language == title == is a header, we want to find the first one and take the excerpt until that header
            let firstHeader = extract.search(/==(.)+==/g)
            
            firstHeader = firstHeader == -1 ? extract.length : firstHeader;
            return extract.substring(0,firstHeader).trim();

        })

    })
}

async function getTitles(searchQuery: string, locale: string) {
    const endpoint = `https://${locale}.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
}

async function getContent(title: string, locale: string) {
    const endpoint = `https://${locale}.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&titles=${title}&explaintext=1&formatversion=2&format=json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
}

export default searchWikipedia;