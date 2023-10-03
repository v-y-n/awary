# Logs

Logs are text with a date and tags associated with it.

## API Calls

You need 2 things to make an api call to create a log:

- An API Key (generate one from the "Api keys" tab on the left).
- The project's `id`, you can copy it by clicking on the clipboard icon at the top of the page.

### Add a log

Method: `POST`  
Url: `/projects/{PROJECT_ID}/logs`  
Header: 
```json
Authorization: Bearer {API_KEY}
```
Body:
```json
{
	"title": "The title",
	"content": "More information",
	"tags": [123456789098765432123456]
}
```

The `tags` is an array of `id`, you can find the `id` on the tags config panel on the Logs page.

### Retrieving all logs

Method: `GET`  
Url: `/projects/{PROJECT_ID}/logs`  
Header: 
```json
Authorization: Bearer {API_KEY}
```
Response body example:
```json
[
	{
		"id": "647a148a4f68451001cec326",
		"projectId": "647a146d4f68451001cec323",
		"title": "The title",
		"content": "More information",
		"tags": [
			{
				"id": "647a148e4f68451001cec328",
				"projectId": "647a146d4f68451001cec323",
				"name": 1685722254142,
				"color": "#ff00ff"
			}
		],
	}
]
```
