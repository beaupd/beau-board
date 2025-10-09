// app/api/status/[tag]/route.ts
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static"; // ✅ allow caching
export const fetchCache = "force-cache";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ tag: string }> },
) {
	const { tag } = await params;

	// this response is cached under the provided tag name
	const payload = {
		tag,
		lastUpdated: Date.now(),
	};

	return NextResponse.json(payload, {
		headers: {
			"Cache-Tag": tag,
		},
	});
}
