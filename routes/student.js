//----------------- Router for Students ----------------------


module.exports = function(router, mongoose) {

	var Student = mongoose.model('Student');

	router.route('/chairman/register/students')

	.get(function(req, res) {

		Student.find(function(err, allStudent) {
			if (err) {
				return res.status(500).send("Error during Reading Students from db");
			}
			return res.json(allStudent);
		});
	})


	.post(function(req, res) {

		Student.findOne({reg:req.body.reg},function(err,studentExist){

			if(err){
				console.log('Error during finding...student');
				return res.status(500).send(err);
			}

			if(!studentExist){
				var student = new Student();

				student.name = req.body.name;
				student.reg = req.body.reg;
				student.father_name = req.body.father_name;
				student.mother_name = req.body.mother_name;
				student.session = req.body.session;
				student.dept = req.body.dept;
				student.phone = req.body.phone;
				student.email = req.body.email;
				student.address = req.body.address;

				student.save(function(err, newStudent) {
					if (err) {
						return res.status(500).send("Error during Student information Saving in db");
					}

					console.log("Student Registratin Successful.....");
					return res.json(newStudent);
				});
			}else{
				console.log("Student already exists......................");
				return res.json({
					status: "Already Exists."
				});
			}

		});

		
	});



	router.route('/allStudents/:session')

		.get(function(req,res){
			Student.find({session:req.params.session},function(err,students){
				if(err){
					console.log('Error during data reading ...........');
					return res.status(500).send(err);
				}
				if(!students){
					console.log('Sata not found ...........');
					return res.status(500).send(err);
				}

				return res.json(students);
			});
		});



	router.route('/student/:reg')

	.get(function(req, res) {
		Student.findOne({
			reg: req.params.reg
		}, function(err, student) {
			if (err) {
				console.log("Error while searching staudent by reg no.");
				return res.status(500).send(err);
			}

			console.log("Find Student by reg no......");
			return res.json(student);
		});
	});


	
	return router;

};