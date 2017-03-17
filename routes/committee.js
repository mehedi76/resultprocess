module.exports = function(router, mongoose) {

	var Committee = mongoose.model('Committee');
	var User = mongoose.model('User');
	

	router.route('/admin/exam/commitee')


	.get(function(req, res) {
		Committee.find(function(err, commitee) {
			if (err) {
				return res.send(500).send("Error during reading commitee information...");
			}

			return res.json(commitee);
		});
	})


	.post(function(req, res) {


		var teacher_id, chairman_id;


		User.findOne({
			name: req.body.teacher_name
		}, function(err, teacher) {
			if (err) {
				return res.status(500).send("Error finding teacher_id ..........");
			}

			console.log(teacher.name);
			teacher_id = teacher._id;
			console.log("teacher  id: " + teacher_id);

			User.findOne({
				name: req.body.chairman
			}, function(err, chairman) {
				if (err) {
					return res.status(500).send("Error finding chairman_id ..........");
				}

				console.log(chairman.name);
				chairman_id = chairman._id;
				console.log("chairman id: " + chairman_id);


				var commitee = new Committee();

				commitee.session = req.body.session;
				commitee.semester_no = req.body.semester_no;
				commitee.chairman = chairman_id;
				commitee.course_teacher.push({
					course_id: req.body.course_id,
					teacher: teacher_id
				});

				commitee.save(function(err, newCommitee) {
					if (err) {
						console.log("Error during saving commitee information.........");
					}

					console.log("Committee information save........");
					return res.json(newCommitee);
				});
			});



		});



	});

	router.route('/input/semester')

		.get(function(req, res) {
			Committee.find(function(err, commitee) {
				if (err) {
					return res.send(500).send("Error during reading commitee information...");
				}



				return res.json(commitee);
			});
		})


		.post(function(req,res){

			var courseList = req.body.courseList;//JSON.parse(req.body.courseList);
			var courseTeacher = [];
			console.log(courseList);
			console.log(req.body.session + " ses | semester: " + req.body.semester_no);

			console.log(typeof(courseList));


			Committee.findOne({
				session:req.body.session,
				semester_no : req.body.semester_no
				 },function(err,data){

				 	if(err){
				 		console.log("Error during searching semester information.............. in commmittee.");
				 		return res.status(500).send(err);
				 	}

				 	if(!data){
				 		var commitee = new Committee();

						commitee.session = req.body.session;
						commitee.semester_no = req.body.semester_no;
						commitee.chairman = "";

						for(var i = 0, len = courseList.length; i<len; i++){

							console.log(courseList[i].course_id);
							console.log("............................count : "+ i);

							courseTeacher.push({
								course_id: courseList[i].course_id,
								teacher: ""
							});
							console.log(" in for loop: " +courseTeacher);
						}
					
						commitee.course_teacher = courseTeacher;
						

						commitee.save(function(err, newCommitee) {
							if (err) {
								console.log("Error during saving semester information.........");
							}

							console.log("Semester information save information save........");
							return res.json(newCommitee);
						});
				 	}else{
				 		console.log("Semester information already exists ...................session " + req.body.session + "Semester: " + req.body.semester_no);
				 		return res.json(data);				 	}

				 });

			
		});


//*****************************  for update course teacher in course_teacher array ***********************

	// router.route('/input/semester/course_Teacher/:object_id')

		// .get(function(req,res){

		// 	Committee.findOne({session:"2011-12",semester_no:1})
		// 		.select("course_teacher")
		// 		.find({_id: req.params.object_id})
		// 		.exec(function(err,data){
		// 			if(err){
		// 				console.log("Error during course finding by course object id...............");
		// 				return res.status(500).send(err);
		// 			}

		// 			if(!data){
		// 				console.log("data is not found..............");
		// 				return res.status(500).send({
		// 					status: "Not found."
		// 				});
		// 			}

		// 			console.log("...................." + data);
		// 			return res.json(data);
		// 			// console.log("...................." + data.course_teacher);
		// 			// console.log("...................." + data.course_teacher.course_id);
		// 			// return res.json({
		// 			// 	course_id: data.course_teacher.course_id,
		// 			// 	courseTeacher: data.course_teacher.teacher
		// 			// });

		// 		});
		// });


	router.route('/session/semester/commitee/courseTeacher')

		.post(function(req,res){

			console.log("...............session: " + req.body.session + " semester_no: " + req.body.semester_no + " chairman: " + req.body.teacherName + " course_id: " + req.body.course_id);

			Committee.update({
				session     :req.body.session,
				semester_no : req.body.semester_no,
				"course_teacher.course_id": req.body.course_id
			},{
				$set:{
					"course_teacher.$.teacher": req.body.teacherName
				}
			},function(err,newCommitee){

				if(err){
					console.log("Error during commitee updating...............");
					return res.status(500).send(err);
				}

				if(!newCommitee){
					console.log("data is not updata..............");
					return res.status(500).send({
						status: "Not found."
					});
				}

				return res.json(newCommitee);
			});
		});


		router.route('/session/semester/commitee/chairman')

		.post(function(req,res){

			console.log("...............session: " + req.body.session + " semester_no: " + req.body.semester_no + " chairman" + req.body.teacherName);


			Committee.update({
				session     :req.body.session,
				semester_no : req.body.semester_no
			},{
				$set:{
					chairman: req.body.teacherName
				}
			},function(err,newCommitee){

				if(err){
					console.log("Error during commitee updating...............");
					return res.status(500).send(err);
				}

				if(!newCommitee){
					console.log("data is not updata..............");
					return res.status(500).send({
						status: "Not found."
					});
				}

				return res.json(newCommitee);
			});
		});






//*****************************  for get all term according to session ***********************
	router.route('/session/semesterCourse/:session')

		.get(function(req,res){

			Committee.find({session: req.params.session},function(err,data){
				if(err){
					console.log("Error in finding Session - Semester");
					return res.status(500).send(err);
				}
				if(!data){
					console.log("Data not found.......");
				}

				console.log("Successful in finding Session - Semester");
				res.json(data);
			});
		});

	return router;
};