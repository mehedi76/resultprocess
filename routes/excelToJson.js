var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");


var storage = multer.diskStorage({
	designation: function(req,file,cb){
		cb(null, '../public/uploads/');
	},
    filename: function(req, file, cb) {
    	var datetimestamp = Date.now();
    	cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});


    var upload = multer({ //multer settings
    	storage: storage,
    	fileFilter: function(req, file, callback) { //file filter
    		if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {

    			return callback(new Error('Wrong extension type'));
    		}

    		callback(null, true);
    	}
    }).single('file');




router.route('/student/upload')
	.post(function(req,res){
		var excelToJson;
		console.log("Enter in post request 1");
		upload(req,res,function(err){
			if(err){
				return res.json({
					error_code: 1,
    				err_desc: err
				});
			}

			if(!req.file){
				return res.json({
					error_code: 1,
					err_desc: "No file upload"
				});
			}

/**************************************************************
		Check the extension of the incoming file and 
    		 *  use the appropriate module

*************************************************************/
			if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
    			exceltojson = xlsxtojson;
    		} else {
    			exceltojson = xlstojson;
    		}


    		try{
    			exceltojson({
    				input: req.file.path,
    				output:null,
    				lowerCaseHeaders: true
    			},function(err,result){
    				if(err){
    					return res.json({
    						error_code:1,
    						err_desc:err,
    						data:null
    					});
    				}

    				return res.json(result);
    			});
    		}catch(e){
    			res.json({
    				error_code: 1,
    				err_desc:"Corupted excel file"
    			});
    		}

    		// var fs = require('fs');
    		// try {
    		// 	fs.unlinkSync(req.file.path);
    		// 	console.log("File is Delete.........");
    		// } catch (e) {
    		// 	console.log("Error during File is Delete.........");
    		// }


		});
	})
	.get(function(req,res){
		return res.json({
			hellO: "it is linked"
		});
	});

