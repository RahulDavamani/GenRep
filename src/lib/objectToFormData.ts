export const objectToFormData = (
	data?: Record<string, unknown>,
	formData = new FormData(),
	parentKey = ''
): FormData => {
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const nestedKey = parentKey ? `${parentKey}[${key}]` : key;
			const value = data[key];

			if (value)
				if (typeof value === 'object') {
					objectToFormData(value as Record<string, unknown>, formData, nestedKey);
				} else {
					formData.append(nestedKey, value as string);
				}
		}
	}
	return formData;
};
