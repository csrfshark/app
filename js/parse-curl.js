function parse_curl(curlCommand) {
    const urlRegex = /curl\s+(['"])(.*?)\1/;
    const urlMatches = curlCommand.match(urlRegex);
    const url = urlMatches[2];

    const methodRegex = /-X\s+([^\s]+)/;
    const methodMatches = curlCommand.match(methodRegex);
    const method = methodMatches ? methodMatches[1].toUpperCase() : 'GET';

    const bodyRegex = /--data-raw\s+(['"])(.*?)\1|--data-ascii\s+(['"])(.*?)\3|--data\s+(['"])(.*?)\5|-d\s+(['"])(.*?)\7/;
    const bodyMatches = curlCommand.match(bodyRegex);
    const body = bodyMatches ? bodyMatches.slice(2).filter(Boolean).join('') : '';

    const headerRegex = /-H\s+(['"])(.*?)\1|--header\s+(['"])(.*?)\3/g;
    const headerMatches = curlCommand.matchAll(headerRegex);
    const headers = {};

    for (const match of headerMatches) {
        const header = match[2] || match[4];
        const colonIndex = header.indexOf(':');
        const key = header.slice(0, colonIndex).trim();
        const value = header.slice(colonIndex + 1).trim();
        const formattedKey = key
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');

        headers[formattedKey] = value;
    }

    return {
        method,
        header: headers,
        url,
        body,
    };
}