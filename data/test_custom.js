module.exports = function(req, res){
	var response
	var method = req.method.toUpperCase()

	if(method == 'GET'){
		response = {
			"status": {
				"code": 10000,
				"message": "Success",
				"alert": ""
			},
			"data": {
				"desc":"test the custom config, use `mocking.custom.json` to write ur custom config.",
				"name":"this is GET"
			}
		}
	}
	else if(method == 'POST'){
		var lat = req.param('lat')
		var lng = req.param('lng')
		var address = req.param('address')

		response = {
			"status": {
				"code": 10000,
				"message": "Success",
				"alert": ""
			},
			"data":{
				"desc":"test the custom config, use `mocking.custom.json` to write ur custom config.",
				"name":"this is POST"
			}
		}
	}

	return JSON.stringify(response)
}