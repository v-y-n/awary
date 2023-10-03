# Metrics

Metrics are an easy way to keep track of how things evolve.

## Use case

Each time a value change on your app or something else you want to track, you can call the api to 
update the value, all previous values are stored in a database and can be viewed in the
form of a graph on the official web app, or you can call the api to retrieve the data and make your
own thing.

## API Calls

You need 3 things to make an api call for a metric:

- An API Key (check this to know how to generate one).
- The project's `id`, you can copy it by clicking on the clipboard icon next to the project's name.
- The metric's `id`, you can copy it by clicking on the clipboard icon next to the metric's name.

### Updating a metric

Method: `PUT`  
Url: `/projects/{PROJECT_ID}/metrics/{METRIC_ID}`  
Header: 
```json
Authorization: Bearer {API_KEY}
```
Body:
```json
{
	value: 42
}
```

### Retrieving one metric

Method: `GET`  
Url: `/projects/{PROJECT_ID}/metrics/{METRIC_ID}`  
Header: 
```json
Authorization: Bearer {API_KEY}
```
Response body example:
```json
{
	"id": "647a148a4f68451001cec326",
	"projectId": "647a146d4f68451001cec323",
	"name": "My metric name",
	"history": [
		{
			"id": "647a148e4f68451001cec328",
			"metricId": "647a148a4f68451001cec326",
			"date": 1685722254142,
			"value": 33
		}
	],
	"currentValue": 33
}
```

### Retrieving all metrics

Method: `GET`  
Url: `/projects/{PROJECT_ID}/metrics`  
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
		"name": "My metric name",
		"history": [
			{
				"id": "647a148e4f68451001cec328",
				"metricId": "647a148a4f68451001cec326",
				"date": 1685722254142,
				"value": 33
			}
		],
		"currentValue": 33
	}
]
```
