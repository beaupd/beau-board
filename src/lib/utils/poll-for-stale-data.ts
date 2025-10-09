import { getTagStatus } from "../actions/status/get-tag-status";

export const pollForStaleData = async (
	tag: string,
	lastUpdatedFn: () => string,
) => {
	const data = await getTagStatus(tag);

	const lastUpdated = lastUpdatedFn();

	if (data.lastUpdated !== lastUpdated) {
		return { isStale: true, lastUpdated: data.lastUpdated };
	}

	return { isStale: false, lastUpdated };
};
