import { Page } from "./page";

export class TodoPage extends Page {
	properties: ConstructorParameters<typeof Page>[0]["properties"] & {
		Status: {
			id: string;
			status: { id: string; name: string; color: string };
			type: "status";
		};
	};

	constructor({
		...data
	}: ConstructorParameters<typeof Page>[0] & {
		properties: ConstructorParameters<typeof Page>[0]["properties"] & {
			Status: {
				id: string;
				status: { id: string; name: string; color: string };
				type: "status";
			};
		};
	}) {
		super(data);
		this.properties = data.properties;
	}
}
