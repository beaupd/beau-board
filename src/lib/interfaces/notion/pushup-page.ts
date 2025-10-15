import { Page } from "./page";

export class PushupPage<Creation extends boolean = false> extends Page {
	properties: ConstructorParameters<typeof Page>[0]["properties"] & {
		Timestamp?: {
			id?: string;
			type?: "created_time";
			created_time: string;
		};
		Amount: {
			id?: string;
			type?: "number";
			number: number;
		};
	};

	constructor({
		...data
	}: ConstructorParameters<typeof Page>[0] & {
		properties: ConstructorParameters<typeof Page>[0]["properties"] & {
			Timestamp?: {
				id?: string;
				type?: "created_time";
				created_time: string;
			};
			Amount: {
				id?: string;
				type?: "number";
				number: number;
			};
		};
	}) {
		super(data);
		this.properties = data.properties;
	}
	static createFromData({ amount }: { amount: number }) {
		return new PushupPage<true>({
			properties: {
				Name: {
					title: [{ type: "text", text: { content: "" } }],
				},
				Amount: {
					number: amount,
				},
			},
		});
	}
}
