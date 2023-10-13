export const formDataToObject = (formData: FormData): Record<string, unknown> => {
	const object: Record<string, unknown> = {};

	formData.forEach((value, key) => {
		const keys = key.split('[');
		let currentObject: Record<string, unknown> = object;

		for (let i = 0; i < keys.length; i++) {
			const k = keys[i].replace(']', '');

			if (!currentObject[k]) {
				if (i === keys.length - 1) {
					// Last key
					currentObject[k] = value;
				} else {
					currentObject[k] = {};
				}
			}

			currentObject = currentObject[k] as Record<string, unknown>;
		}
	});

	return object;
};
