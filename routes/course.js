
module.exports = function(router,mongoose){
	var Course = mongoose.model("Course");

router.route('/admin/register/courses')

	.get(function(req,response){
		Course.find(function(err,allCourse){
			if(err){
				console.log("Error during course finding........");
				return response.send(err);
			}

			return response.json(allCourse);
		});
	})


	.post(function(req,response){

		Course.findOne({course_id:req.body.course_id},function(err,exitCourse){

			if(err){
				console.log("Error in course finding......");
				return response.status(500).send(err);
			}

			if(!exitCourse){
				var course = new Course();

				course.course_id = req.body.course_id;
				course.title = req.body.course_title;
				course.credit = req.body.credit;
				course.theory = req.body.theory;
				course.lab = req.body.lab;
							
				console.log(course);

				course.save(function(err,newCourse){

					if(err){
						return response.status(500).send("Error during Saving course in database");
					}

					console.log("New course input Successful.....");
					return response.json({
					success: "all courses save"
					});

								
				});
			}else{
				console.log("Data already Exit..........");



				// Course.findOne({course_id:req.body.course_id},{
				// 	$set:{
				// 		course_id : req.body.course_id,
				// 		title     : req.body.course_title,
				// 		credit    : req.body.credit,
				// 		theory    : req.body.theory,
				// 		lab       : req.body.lab
				// 	}
				// },function(err,newCourse){
				// 	if(err){
				// 		console.log("Update fall ...........Coures: " + req.body.course_id);
				// 		return response.status(500).send(err);
				// 	}
				// 	if(!newCourse){
				// 		console.log("Update fall ..........");
				// 		return response.status(500).send(err);
				// 	}

				// 	return response.json(newCourse);
				// });

				return response.json(exitCourse);
			}
		});

		
		
		
	});


	router.route('/course/:id')

		.get(function(req,res){
			console.log(req.params.id);

			Course.findOne({course_id: req.params.id},function(err,course){
				if(err){
					console.log('Error while finding Course by course_id....');
					return res.status(500).send(err);
				}

				console.log("Find course by course_id ...."+ req.params.id);
				console.log("Find course by course ...."+ course);
				return res.json(course);
			});
		});



	router.route('/semester/course')

		.get(function(req,res){

			
		});

	return router;
};