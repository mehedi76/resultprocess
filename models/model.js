var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//----------Teacher Schema--------------

var teacherSchema = new mongoose.Schema({
	name: {
		type : String,
		required: true
	},
	username: {
		type : String,
		required: true
	},
	password: {
		type : String,
		required: true
	},
	role    : {
		type : String,
		required: true
	},
	designation: String,
	email    : String,
	phone    : Number,
	created_at: { type: Date, default: Date.now}
});


//----------Courses Schema--------------

var courseSchema = new mongoose.Schema({
	course_id: {
		type : String,
		required: true
	},
	title    : {
		type : String,
		required: true
	},
	credit   : {
		type : String,
		required: true
	},
	theory    : String,
	lab    : String,
	created_at: { type: Date, default: Date.now}
});

//----------Students Schema--------------

var studentSchema = new mongoose.Schema({
	name : {
		type : String,
		required: true
	},
	reg: {
		type : String,
		required: true
	},
	father_name: String,
	mother_name: String,
	session: {
		type : String,
		required: true
	},
	dept: String,
	email: String,
	phone: String,
	address: String,
	created_at: { 
		type: Date, 
		default: Date.now
	}
});



//----------Result Schema-----------------

var resultSchema = new mongoose.Schema({
	course_id: {
		type: String,
		ref: "Course"
	},
	reg: {
		type : String,
		ref: "Student"
	},
	attendence: {
		type : Number,
		default: 0
	},
	term_test: {
		type : Number,
		default: 0
	},
	theory: {
		type : Number,
		default: 0
	},
	lab: {
		type : Number,
		default: 0
	},
	total: {
		type: Number,
		default: 0
	},	
	created_at: { 
		type: Date, 
		default: Date.now
	}

});


var reultBase = new mongoose.Schema({
	course_id: {
		type: String,
	},
	session: {
		type: String,
	},
	semester_no: {
		type: Number
	},	
	total_class: {
		type : Number,
		default: 0
	},
	theory_modify: {
		type : Number,
		default: 0
	},
	lab_modify: {
		type : Number,
		default: 0
	},
	term_test_modify: {
		type : Number,
		default: 0
	},
	
	created_at: { 
		type: Date, 
		default: Date.now
	}
});



//----------Course offer Schema--------------

var commiteeSchema = new mongoose.Schema({
	session: {
		type: String,
		required: true
	},
	semester_no: {
		type: Number
	},
	chairman:{
		type: String//Schema.ObjectId,
		//required: true,
		//ref: "User"
	},
	course_teacher: [{
		course_id: String,
		teacher: String//mongoose.Schema.ObjectId
	}]
});



mongoose.model('User',teacherSchema); 

mongoose.model('Course',courseSchema);
mongoose.model('Student',studentSchema);
mongoose.model('Result',resultSchema);
mongoose.model('ResultBase',reultBase);
mongoose.model('Committee',commiteeSchema);

