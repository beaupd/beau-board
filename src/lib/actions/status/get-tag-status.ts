"use server";

export const getTagStatus = async (
	tag: string,
): Promise<{ lastUpdated: string }> => {
	const res = await fetch(`${process.env.SERVER_URL}/api/status/${tag}`, {
		cache: "force-cache",
		next: { tags: [tag] },
	});
	const data = await res.json();

	return data;
};
