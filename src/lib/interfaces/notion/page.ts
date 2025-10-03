export class Page {
	id: string;
	archived: boolean;
	object: "page";
	properties: {
		Name: {
			id: "title";
			title: { type: "text"; text: { content: string } }[];
		};
	};
	url: string;

	constructor(data: {
		id: string;
		archived: boolean;
		object: "page";
		properties: {
			Name: {
				id: "title";
				title: { type: "text"; text: { content: string } }[];
			};
		};
		url: string;
	}) {
		this.id = data.id;
		this.archived = data.archived;
		this.object = data.object;
		this.properties = data.properties;
		this.url = data.url;
	}
}
