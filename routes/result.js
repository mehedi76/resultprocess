module.exports = function(router, mongoose) {

	var Result = mongoose.model('Result');
	var ResultBase = mongoose.model('ResultBase');
	var Student = mongoose.model('Student');
	var Committee = mongoose.model('Committee');
	var Dropper = mongoose.model('Dropper');
	
	router.route('/teacher/input/result')

	.get(function(req, res) {
		Result.find(function(err, allResult) {
			if (err) {
				return res.status(500).send("Error during result reading....");
			}

			if(!allResult){
				return res.status(500).send({
					status: 'failure',
					message: 'data is not find'
				});
			}
			return res.json(allResult);
		});

	});


	// .post(function(req, res) {
	// 	var eachResult = new Result();

	// 	//ecachResult = req.body.result;

	// 	//console.log(req.body.result.reg +" " + req.body.result.course_id +" " + req.body.result.total_class +" " + req.body.result.attendence +" " + req.body.result.term_test_1 +" " + req.body.result.term_test_2 +" " + req.body.result.part_A +" " + req.body.result.part_B);
	// 	eachResult.reg = req.body.reg;
	// 	eachResult.course_id = req.body.course_id;
		
	// 	eachResult.total_class = req.body.total_class;
	// 	eachResult.attendence = req.body.attendence;
	// 	eachResult.term_test_1 = req.body.term_test_1;
	// 	eachResult.term_test_2 = req.body.term_test_2;
	// 	eachResult.part_A = req.body.part_A;
	// 	eachResult.part_B = req.body.part_B;

	// 	eachResult.save(function(err, newResult) {
	// 		if (err) {
	// 			return res.status(500).send("Error during saving Result....");
	// 		}

	// 		console.log("Result is successfully save in database........");
	// 		return res.json(newResult);
	// 	});

	// });




// router.route('/teacher/input/result/:id')

// 	.get(function(req,res){

// 		Result.findById({_id:req.params.id},function(err,result){
// 			if(err){
// 				console.log("Error during result finding by Id............");
// 				res.status(500).send(err);
// 			}

// 			if(!result){
// 				console.log("Result not found............");
// 				res.status(500).send("Result Not In Database.......");
// 			}

// 			res.json(result);
// 		});
// 	})

// 	.put(function(req,res){

// 		Result.update({_id:req.params.id},
// 			{
// 				$set:{
// 					reg : req.body.reg,
// 					course_id : req.body.course_id,
// 					total_class : req.body.total_class,
// 					attendence : req.body.attendence,
// 					term_test_1 : req.body.term_test_1,
// 					term_test_2 : req.body.term_test_2,
// 					part_A : req.body.part_A,
// 					part_B : req.body.part_B
// 				}
// 			},function(err,result){
// 				if(err){
// 					console.log("Error during updating result........");
// 					res.status(500).send(err);
// 				}

// 				res.json(result);
// 			});
// 	});








// new start here upper portion can be delete

router.route('/result/autoSave')
	
	.get(function(req,res){

		Result.find(function(err,data){

			if (err) {
				return res.status(500).send("Error during result reading....");
			}

			if(!data){
				console.log("Result data not found......................................");
				return res.status(500).send({
					status: 'failure',
					message: 'data is not found'
				});
			}
			return res.json(data);
		});
	})

	.post(function(req,res){

		console.log(".......... finding by course_id: " + req.body.course_id + " and reg: "+ req.body.reg);

		Result.findOne({
			reg: req.body.reg,
			course_id: req.body.course_id
		},function(err,data){
	
			if(err){
				console.log("Error during result searching............");
				res.status(500).send(err);
			}

			if(!data){

				var result = new Result();

				result.reg = req.body.reg;				
				result.course_id = req.body.course_id;				
				result.term_test= req.body.term_test;				
				result.attendence = req.body.attendence;				
				result.total = req.body.total;				
				result.theory = req.body.theory;				
				result.lab = req.body.lab;
				
				result.save(function(err,newResult){
					if(err){
						console.log("Error during saving.................");
						res.status(500).send(err);
					}

					res.json(newResult)
				});				
			}else{
				
				if(req.body.attendence){
					console.log("................ Update............ Attendence: " + req.body.attendence);
					Result.update({
						reg: req.body.reg,
						course_id: req.body.course_id
					},{
						$set:{
							attendence: req.body.attendence
						}
					},function(err,result){

						if(err){
							console.log("Error during result searching............");
							res.status(500).send(err);
						}
						
						return res.json(result);
					});
				}else{

					
							if(req.body.term_test){
								console.log("................ Update............ term_test: " + req.body.term_test);
								Result.update({
									reg: req.body.reg,
									course_id: req.body.course_id
								},{
									$set:{
										term_test: req.body.term_test
									}
								},function(err,result){

									if(err){
										console.log("Error during result searching............");
										res.status(500).send(err);
									}
									return res.json(result);
								});
							}else{

				

								if(req.body.theory){
									console.log("................ Update............ theory: " + req.body.theory);
									Result.update({
										reg: req.body.reg,
										course_id: req.body.course_id
									},{
										$set:{
											theory: req.body.theory
										}
									},function(err,result){

										if(err){
											console.log("Error during result searching............");
											res.status(500).send(err);
										}
										return res.json(result);
									});
								}else {
					
									if(req.body.lab){
										console.log("................ Update............ lab: " + req.body.lab);
										Result.update({
											reg: req.body.reg,
											course_id: req.body.course_id
										},{
											$set:{
												lab: req.body.lab
											}
										},function(err,result){

											if(err){
												console.log("Error during result searching............");
												res.status(500).send(err);
											}
											return res.json(result);
										});
									}else {
										if(req.body.total){
											console.log("................ Update............ total: " + req.body.total);
											Result.update({
												reg: req.body.reg,
												course_id: req.body.course_id
											},{
												$set:{
													total: req.body.total
												}
											},function(err,result){

												if(err){
													console.log("Error during result searching............");
													res.status(500).send(err);
												}
												return res.json(result);
											});
										}
									}
								}
							}
					
				}
			}

		});
	});




router.route('/student/result/name/:session/:course')
	
	.get(function(req,res){

		Result.aggregate([{

			$lookup:{
				 from: "students",
         		 localField: "reg",
         		 foreignField: "reg",
          			as: "student"
			}
		},{

			$match:{
				'student.session': req.params.session,
				course_id : req.params.course
			}
		},


		{
			$project:{
				reg: 1,
				course_id: 1,
				attendence: 1,
				term_test: 1,
				theory: 1,
				lab: 1,
				total: 1,
				'student.name': 1,
				'student.session': 1
			}
		}],function(err,data){

			if (err) {
				return res.status(500).send("Error during result reading....by: " + req.params.session + "and" + req.params.course);
			}

			if(!data){
				console.log("Result data not found......................................"  + req.params.session + "......and........" + req.params.course);
				return res.status(500).send({
					status: 'failure',
					message: 'data is not found'
				});
			}
			console.log(">>>>>>>>>>>>>>>>>>>>loopup works: " + data  + "...........for ." + req.params.session + ".......and.........." + req.params.course);
			return res.json(data);
		});
	});


router.route('/result/autoSave/resultBase')

	.get(function(req,res){
		ResultBase.find(function(err,data){
			return res.json(data);
		});
	})

	.post(function(req,res){

		console.log("........................... type of ..........." + typeof(req.body.semester_no));

		ResultBase.findOne({
			session: req.body.session,
			semester_no : req.body.semester_no,
			course_id: req.body.course_id
		},function(err,data){
			if(err){
				console.log("Error in finding resultBase............................");
				return res.status(500).send(err);
			}

			if(!data){

				console.log("No data found so create resultBase............................");

				var base = new ResultBase();

				base.session = req.body.session;
				base.semester_no = req.body.semester_no;
				base.course_id = req.body.course_id;

				base.total_class = req.body.total_class;
				base.theory_modify = req.body.theory_modify;				
				base.lab_modify = req.body.lab_modify;
				base.term_test_modify = req.body.term_test_modify;

				base.save(function(err,newBase){
					if(err){
						console.log("Error during saving base....................");
						return res.status(500).send(err);
					}

					return res.json(newBase);
				});
			}else {
				if(req.body.term_test_modify){
					console.log("................ Update............ term_test_modify: " + req.body.term_test_modify);
					ResultBase.update({
						session: req.body.session,
						semester_no : req.body.semester_no,
						course_id: req.body.course_id
					},{
						$set:{
							term_test_modify: req.body.term_test_modify
						}
					},function(err,result){

					if(err){
						console.log("Error during result searching............");
						res.status(500).send(err);
					}
					console.log("................ Update............ term_test_modify: " + result.term_test_modify);

					return res.json(result);
					});

				}else {
					if(req.body.lab_modify){
						console.log("................ Update............ lab_modify: " + req.body.lab_modify);
						
						ResultBase.update({
							session: req.body.session,
							semester_no : req.body.semester_no,
							course_id: req.body.course_id
						},{
							$set:{
								lab_modify: req.body.lab_modify
							}
						},function(err,result){

							if(err){
								console.log("Error during result searching............");
								res.status(500).send(err);
							}
							console.log("................ Update............ lab_modify: " + result.lab_modify);

							return res.json(result);
						});
					}else{
						if(req.body.theory_modify){
							console.log("................ Update............ theory_modify: " + req.body.theory_modify);
							ResultBase.update({
								session: req.body.session,
								semester_no : req.body.semester_no,
								course_id: req.body.course_id
							},{
								$set:{
									theory_modify: req.body.theory_modify
								}
							},function(err,result){

								if(err){
									console.log("Error during result searching............");
									res.status(500).send(err);
								}
								console.log("................ Update............ theory_modify: " + result.theory_modify);

								return res.json(result);
							});

						}else{
							if(req.body.total_class){
								console.log("................ Update............ total_class: " + req.body.total_class);
								ResultBase.update({
									session: req.body.session,
									semester_no : req.body.semester_no,
									course_id: req.body.course_id
								},{
									$set:{
										total_class: req.body.total_class
									}
								},function(err,result){

									if(err){
										console.log("Error during result searching............");
										res.status(500).send(err);
									}
								console.log("................ Update............ total_class: " + result.total_class);

									return res.json(result);
								});
							}

						}

					}
				}
			}
		});
	});


router.route('/result/autoSave/resultBase/:session/:semester/:course')

	.get(function(req,res){

		req.params.semester = parseInt(req.params.semester,10);
		console.log("session: " + req.params.session + " semester: " + req.params.semester + "............. typeof: " + typeof(req.params.semester)+" course: " + req.params.course);

		ResultBase.findOne({
			session: req.params.session,
			semester_no : req.params.semester,
			course_id: req.params.course
		},function(err,data){
			if(err){
				console.log("Error in finding resultBase............................");
				return res.status(500).send(err);
			}

			if(!data){
				console.log("Data is not found in resultBase............................");
				return res.json({
					status: "Not found"
				});
			}

			return res.json(data);

		});

	});


router.route('/student/result/name/:reg')
	
	.get(function(req,res){

	Result.aggregate([
		{
			
			$lookup:{
				 from: "courses",
         		 localField: "course_id",
         		 foreignField: "course_id",
          			as: "courseInfo"
			}
		},{

			$match:{
				reg: req.params.reg
			}
		},


		{
			$project:{
				reg: 1,
				name:1,
				course_id: 1,
				total: 1,
				"courseInfo.credit": 1,
				"courseInfo.title": 1
				
			}
		}

		],function(err,data){
			
			if (err) {
				return res.status(500).send("Error during result reading....by Reg: " + req.params.reg);
			}

			if(!data){
				console.log("Result data not found...by reg..................................."  + req.params.reg);
				return res.status(500).send({
					status: 'failure',
					message: 'data is not found'
				});
			}
			console.log(">>>>>>>>>>>>>>>>>>>>loopup works: " + data  + "...........for ." + req.params.reg);
			return res.json(data);
		});
	});




	router.route('/student/result/session/:session')
	
	.get(function(req,res){

		//req.params.semester = parseInt(req.params.semester, 10);
	Result.aggregate([
		
		{
			
			$lookup:{
				 from: "students",
         		 localField: "reg",
         		 foreignField: "reg",
          			as: "studentInfo"
			}
		},{
			
			$lookup:{
				 from: "courses",
         		 localField: "course_id",
         		 foreignField: "course_id",
          			as: "courseInfo"
			}
		},
		{
			$match:{
				'studentInfo.session': req.params.session
			}
		},

		{
			$project:{
				'studentInfo.session': 1,
				'studentInfo.name': 1,
				total: 1,
				course_id: 1,
				reg:1,
				"courseInfo.credit": 1,
				"courseInfo.title": 1
				
			}
		}

		],function(err,data){
			
			if (err) {
				return res.status(500).send("Error during result reading....by Reg: " + req.params.reg);
			}

			if(!data){
				console.log("Result data not found...by reg..................................."  + req.params.reg);
				return res.status(500).send({
					status: 'failure',
					message: 'data is not found'
				});
			}
			console.log(">>>>>>>>>>>>>>>>>>>>loopup works: " + data  + "...........for ." + req.params.reg);
			return res.json(data);
		});
	});



	router.route('/student/droppers')

	.post(function(req,res){

		Dropper.findOne({
			reg: req.body.reg,
  			course_id : req.body.course_id,
			exam_session : req.body.exam_session,
			exam_semester_no : req.body.exam_semester_no
  		},function(err,result){
  			if(err){
				console.log("Error during dropper result saving.................");
				res.status(500).send(err);
			}

			if(!result){
				console.log("................ come to create ............dropper result: ");

				var newDropper = new Dropper();

				newDropper.course_id = req.body.course_id;
				newDropper.reg = req.body.reg;
				newDropper.exam_session = req.body.exam_session;
				newDropper.exam_semester_no = req.body.exam_semester_no;
				newDropper.attendence = req.body.attendence;
				newDropper.term_test = req.body.term_test;
				newDropper.theory = req.body.theory;
				newDropper.lab =req.body.lab;
				newDropper.total = req.body.total;
				newDropper.total_class = req.body.total_class;
				newDropper.theory_modify = req.body.theory_modify;
				newDropper.lab_modify =req.body.lab_modify;
				newDropper.term_test_modify = req.body.term_test_modify;

				console.log("Dropper result entry..................................."+ newDropper);
				
				newDropper.save(function(err,newResult){

					if(err){
						console.log("Error during dropper result saving.................");
						res.status(500).send(err);
					}else{
						console.log("New dropper result save Successfully..............");
					}

					res.json(newResult);
				});
			}else{
				console.log("................ come to update ............dropper result: ");
				Dropper.update({
					reg: req.body.req,
		  			course_id : req.body.course_id,
					exam_session : req.body.exam_session,
					exam_semester_no : req.body.exam_semester_no
				},{
					$set:{
						attendence : req.body.attendence,
						term_test : req.body.term_test,
						theory : req.body.theory,
						lab :req.body.lab,
						total : req.body.total,
						total_class : req.body.total_class,
						theory_modify : req.body.theory_modify,
						lab_modify :req.body.lab_modify,
						term_test_modify : req.body.term_test_modify

						}
				},function(err,result){

					if(err){
						console.log("Error during result searching............");
						res.status(500).send(err);
					}
						console.log("................ Update............ total_class: " + result.total_class);

						return res.json(result);
					});
			}
  		});

		

	});


  router.route('/student/droppers/:reg')

  .get(function(req,res){

		Dropper.find({reg:req.params.reg},function(err,results){
			if(err){
				console.log("Error during dropper result retriving.................");
				res.status(500).send(err);
			}
			if(!results){
				console.log("Result is not found.....................");
			}
			return res.json(results);
		});
	});



  router.route('/student/droppers/:session/:semester_no/:course_id')

  .get(function(req,res){
  	Dropper.find({
  		course_id : req.params.course_id,
		exam_session : req.params.session,
		exam_semester_no : req.params.semester_no
  	},function(err,allResult){
  		if(err){
				console.log("Error in finding Dropper resultBase............................");
				return res.status(500).send(err);
			}

			if(!allResult){
				console.log("Data is not found in Dropper resultBase............................");
				return res.json({
					status: "Not found"
				});
			}
			console.log("Dropper.................get requenst..........."+ allResult);
			return res.json(allResult);
  	});

  });

	return router;
};