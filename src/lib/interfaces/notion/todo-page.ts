import { Page } from "./page";

export class TodoPage<Creation extends boolean = false> extends Page {
	properties: ConstructorParameters<typeof Page>[0]["properties"] & {
		Status: {
			id?: string;
			status: {
				id: string;
				name: Creation extends true ? undefined : string;
				color: Creation extends true ? undefined : string;
			};
			type?: "status";
		};
		Archived: {
			id?: string;
			formula: { type: "boolean"; boolean: boolean };
			type?: "formula";
		};
	};

	constructor({
		...data
	}: ConstructorParameters<typeof Page>[0] & {
		properties: ConstructorParameters<typeof Page>[0]["properties"] & {
			Status: {
				id?: string;
				status: {
					id: string;
					name: Creation extends true ? undefined : string;
					color: Creation extends true ? undefined : string;
				};
				type?: "status";
			};
			Archived: {
				id?: string;
				formula: { type: "boolean"; boolean: boolean };
				type?: "formula";
			};
		};
	}) {
		super(data);
		this.properties = data.properties;
	}

	static createFromData({ name, column }: { name: string; column: string }) {
		return new TodoPage<true>({
			properties: {
				Name: {
					title: [{ type: "text", text: { content: name } }],
				},
				Status: {
					status: { id: column, name: undefined, color: undefined },
				},
				Archived: { formula: { boolean: false, type: "boolean" } },
			},
		});
	}
}
