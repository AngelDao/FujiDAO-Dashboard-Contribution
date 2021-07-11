# Grafana DeFi Dashboard

This application utilizes Node.js, MongoDB, Express.js, and Grafana.

## Flow

The following is a pseudo flow of the app

1. `POST` request is sent from Grafana to `/query`. In the body of the request the `only` key value pair is passed to choose which data to target per the panel

2. `scraper.js` collects data from **new onchain events** stores them in db, including blocknumber and timestamp

3. db is queried and data is formatted to match [Grafana JSON Timeseries plugin pattern](https://grafana.com/grafana/plugins/simpod-json-datasource/)

4. formatted data is sent to Grafana and displayed on the panel per settings set.
