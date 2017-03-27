var express = require('express');
var router = express.Router();

var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Course = mongoose.model('Course');
var Student = mongoose.model('Student');
var Result = mongoose.model('Result');
var Committee = mongoose.model('Committee');

var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");



router.use(function(req,res,next){
	//if(req.method === "GET"){
		//continue to the next middleware or request handler
		//return next();
	//}

	if(!req.isAuthenticated()){
		//user not authenticated, redirect to login page
		return res.redirect('/#/');
	}

	//user authenticated
	return next();
});



var storage = multer.diskStorage({
	designation: function(req,file,cb){
		cb(null, '../public/uploads');
	},
    filename: function(req, file, cb) {
    	var datetimestamp = Date.now();
    	cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});


var upload = multer({
	storage:storage,
	fileFilter:function(req,file,callback){
		if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {

    		return callback(new Error('Wrong extension type'));
    	}

    	return callback(null,true);
	}
}).single('file');






router.route('/student/upload')
	.post(function(req,res){

		var excelToJson;
		
		upload(req,res,function(err){
			//console.log("Enter in post request 1   " + req.file.originalname);
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

    		var fs = require('fs');
    		try {
    			fs.unlinkSync(req.file.path);
    			console.log("File is Delete.........");
    		} catch (e) {
    			console.log("Error during File is Delete.........");
    		}


		});
	})
	.get(function(req,res){
		return res.json({
			hellO: "it is linked"
		});
	});







//---------------Router for user----------------------------



router.get('/', function(req, res) {
	res.send("it is get requent");
});

router.get('/users', function(req, res) {
	User.find(function(err, user) {
		if (err) {
			res.send("database search Error");
		}
		console.log("user get");
		res.json(user);
	});
});






//----------------  Router for teacher Schema--------------------


router.route('/teacher')

//----- read from schema------------

.get(function(req, res) {
	User.find({},{username: 0,password: 0},function(err, user) {
		if (err) {
			return res.status(500).send("Error during reading user data.....");
		}

		return res.json(user);
	});
})


//------------Write to schema----------


.post(function(req, res) {

	User.findOne({username:req.body.username},function(err,findUser){

		if(err){
			console.log("Error during searching user......................");
			return res.status(500).send(err);
		}

		if(!findUser){
			var user = new User();

			user.name = req.body.name;
			user.username = req.body.username;
			user.password = createHash(req.body.password);
			user.role = req.body.role;
			user.designation = req.body.designation;
			user.email = req.body.email;
			user.phone = req.body.phone;


			user.save(function(err, newUser) {
				if (err) {
					return res.status(500).send("Error during saving user....");
				}

				console.log("User Registratin Successful........");
				return res.json(newUser);
			});
		}else{
			console.log("User already Exist.............");
			return res.json({
				fall: "User exists"
			});
		}

	});

	var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null);
    };

});

router.route('/teacher/:id')

.get(function(req, res) {

	var id = req.params.id;

	User.findById(id, function(err, teacher) {
		if (err) {
			return res.status(500).send("Error while finding teacher by ID.....");
		}

		console.log("find teacher by ID.......");
		return res.json(teacher);
	});
});


router.route('/teacher/checkUser/:username')
	.get(function(req,res){
		User.findOne({username:req.params.username},function(err,foundUser){
			if(err){
				console.log("Error during finding user .............");
				return res.status(500).send(err);
			}

			if(foundUser){
				console.log("username is found .............");
				
				return res.json({
					status:"failure",
					message:"Username already exist."
				});

			}else{
				console.log("username can be use .............");
				return res.json({
					status:"success",
					message:"Can be Use               "
				});
			}
		});
	});

//----------------------change Password-------------------------------

router.route('/changepassword')

    .post(function(req,res){

    	var createHash = function(password){
        	return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null);
        };

    	var newPassword = createHash(req.body.newPassword);

    	console.log("..............user: " + req.body.username + "..............password: "+ req.body.password + ".......newpass: " + req.body.newPassword);
    	console.log("....................newPassword: " + newPassword);

        User.update({
                username:req.body.username
            },{
                $set:{
                    password: newPassword 
                }
            },function(err,user){
                if(err){
                    console.log("Error during commitee updating...............");
                    return res.status(500).send(err);
                }

                if(!user){
                    console.log("data is not updata..............");
                    return res.status(500).send({
                        status: "Not found."
                    });
                }
                console.log("......................change password..............");
                return res.json(user);
        });
    });




//----------------------- router for Students -------------------

require('./student.js')(router, mongoose);

//----------------------- router for Courses-------------------

require('./course.js')(router, mongoose);

//----------------- Router for commitee ---------------------
require('./committee.js')(router, mongoose);

//-------------------- Router for Result ---------------------

require('./result.js')(router, mongoose);


module.exports = router;