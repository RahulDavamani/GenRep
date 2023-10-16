export const getQueryParams = (query: string) => [
	...new Set(query.match(/\${(.*?)}/g)?.map((match) => match.slice(2, -1)))
];

export const getQueryParamsObj = (query: string) => {
	const queryParams = getQueryParams(query);
	const queryParamsObj: { [key: string]: string } = {};
	for (const qp of queryParams) queryParamsObj[qp] = '';
	return queryParamsObj;
};

export const highlightQueryParams = (query: string) =>
	query.replace(/\$\{([^}]+)\}/g, '<span class="text-secondary font-semibold">${$1}</span>');

export const replaceQueryParams = (query: string, queryParams: { [key: string]: string }) =>
	query.replace(/\${(.*?)}/g, (match, key) => queryParams[key] || match);
