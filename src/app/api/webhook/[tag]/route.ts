// app/api/webhook/[tag]/route.ts
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ tag: string }> },
) {
	const { tag } = await params;
	try {
		// await req.json(); // read body if needed

		// Invalidate the tag dynamically
		revalidateTag(tag);

		return NextResponse.json({ ok: true, revalidated: tag });
	} catch (err) {
		return NextResponse.json(
			{ error: "Failed to revalidate" },
			{ status: 500 },
		);
	}
}
