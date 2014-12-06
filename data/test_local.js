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
				"desc":"test local mode.",
				"name":"this is GET",
				"id": req.params.order_id
			}
		}
	}
	else if(method == 'POST'){
		response = {
			"status": {
				"code": 10000,
				"message": "Success",
				"alert": ""
			},
			"data":{
				"desc":"test local mode.",
				"name":"this is POST"
			}
		}
	}

	return JSON.stringify(response)
}