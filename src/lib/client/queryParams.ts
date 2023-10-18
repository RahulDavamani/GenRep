export const getQueryParams = (query: string) => [
	...new Set(query.match(/\${(.*?)}/g)?.map((match) => match.slice(2, -1)))
];

export const highlightQueryParams = (query: string) =>
	query.replace(/\$\{([^}]+)\}/g, '<span class="text-secondary font-semibold">${$1}</span>');

export const replaceQueryParams = (query: string, queryParams: { key: string; value: string }[], highlight = false) =>
	query.replace(/\${(.*?)}/g, (_, key) => {
		const value = queryParams.find((param) => param.key === key)?.value ?? '';
		return highlight ? `<span class="text-secondary font-semibold">${value}</span>` : value;
	});
