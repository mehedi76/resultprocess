var app = angular.module('myApp', ['ngRoute','ngResource','ngCookies']).run(function($rootScope,$http,$cookieStore, $location){


   $rootScope.current_user = $cookieStore.get('user') || {};
   console.log("From the run funtjion :     "+ $rootScope.current_user);
    $rootScope.authenticated = $rootScope.current_user.username ? true : false;

    $rootScope.signOut = function() {
      $http.get('/auth/signout');
      $cookieStore.remove('user');
      $rootScope.authenticated = false;
      $rootScope.current_user = '';
     // $rootScope.showResultInput = false;
      $location.path('/login');
      location.reload();
    };


});


app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'directives/welcome.html',
      controller: 'welcomeController'
    })
   
  .when('/login', {
    templateUrl: 'directives/loginPage.html',
    controller: 'authentication'
  })
    .when('/setCommittee', {
      templateUrl: 'directives/commitee.html',
      controller: 'setCommittee'
    })
    .when('/showCommittee', {
      templateUrl: 'directives/showCommitee.html',
      controller: 'setCommittee'
    })
    .when('/inputResult', {
      templateUrl: 'directives/inputResult.html',
      controller: 'resultController'
    })
    .when('/showResult', {
      templateUrl: 'directives/showResult.html',
      controller: 'resultController'
    })
    .when('/markSheet', {
      templateUrl: 'directives/markSheet.html',
      controller: 'markSheetCtrl'
    })
    .when('/tabulation', {
      templateUrl: 'directives/tabulation.html',
      controller: 'tabulationCtrl'
    })
    .when('/studentInput', {
      templateUrl: 'directives/studentInput.html',
      controller: 'studentController'
    })
    .when('/students', {
      templateUrl: 'directives/students.html',
      controller: 'studentController'
    })
    .when('/syllabusInput', {
      templateUrl: 'directives/courseInput.html',
      controller: 'courseController'
    })
    .when('/syllabus', {
      templateUrl: 'directives/allCourse.html',
      controller: 'courseShowController'
    })
    .when('/teacher/register', {
      templateUrl: 'directives/teacherRegistration.html',
      controller: 'teacherController'
    })
    .when('/teacher/info', {
      templateUrl: 'directives/teacherInfo.html',
      controller: 'teacherController'
    })
    .when('/teacher/success', {
      templateUrl: 'directives/successRegistration.html',
      controller: 'teacherController'
    });
});



app.filter("findCourse",function(){
  return function(courseList,semesterCourses){
      var courses = [];
      angular.forEach(courseList,function(course,key){
         angular.forEach(semesterCourses,function(value,keyv){
            if(value.course_id == course.course_id){
              console.log("From findCourse: " + course.course_id);
              courses.push(course);
            }
         });
      });

      console.log(courses);
      return courses;
  };
});

app.filter('unique',function(){
  return function(array){
    var uniqueArray = [];
    angular.forEach(array,function(value,key){
        if(!uniqueArray.length){
          uniqueArray.push(value.session);
          //console.log('Form Unique: ' + uniqueArray);
        }else{
          angular.forEach(uniqueArray,function(uniqueItem,key){
              if(uniqueItem !== value.session && uniqueArray.length==key+1){
                uniqueArray.push(value.session);
                //console.log('Form Unique: ' + uniqueArray);
              }
          });
        }
    });
   // console.log('Form Unique: ' + uniqueArray);
    return uniqueArray;
  };
});


app.filter('chairmanFilter',function(){
  return function(array,id,role){
    var uniqueArray = [];
    angular.forEach(array,function(value,key){
        if(role=="admin"){
          if(!uniqueArray.length){
            uniqueArray.push(value.session);
            //console.log('Form Unique: ' + uniqueArray);
          }else{
            angular.forEach(uniqueArray,function(uniqueItem,key){
                if(uniqueItem !== value.session && uniqueArray.length==key+1){
                  uniqueArray.push(value.session);
                  //console.log('Form Unique: ' + uniqueArray);
                }
            });
          }
        }else{
          if(!uniqueArray.length && value.chairman==id){
            uniqueArray.push(value.session);
            //console.log('Form Unique: ' + uniqueArray);
          }else{
            angular.forEach(uniqueArray,function(uniqueItem,key){
                if(uniqueItem !== value.session && uniqueArray.length==key+1 && value.chairman==id){
                  uniqueArray.push(value.session);
                  //console.log('Form Unique: ' + uniqueArray);
                }
            });
          }
        }
    });
   // console.log('Form Unique: ' + uniqueArray);
    return uniqueArray;
  };
});




app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                console.log('value=', value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            element.bind('blur', function () {
               // console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
}]);


 app.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
 
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);

// app.factory('studentBatch',function($http){
//    var object = {};
//    object.getStudent = function(session){
//       $http.get('/api/allStudents/' +session).success(function(data){
//         console.log(data);
//         return data;
//       });
//    };
//    return object;
// });

app.service('resultCalculation',function(){
  
  this.attendenceMark = function(performance,total_class){
    var number, percentage;

    percentage = (performance / total_class) * 100;
    console.log("The percentage is : " + percentage); //+ " attendence : " + attendence + " totla: " + total_Class);


    if (percentage > 94) {
      number = 10;
      //console.log("The attendence number is : " + number);
    } else {
      if (89 < percentage && percentage <= 94) {
        number = 9;
        //console.log("The attendence number is : " + number);
      } else {
        if (84 < percentage && percentage <= 89) {
          number = 8;
          //console.log("The attendence number is : " + number);
        } else {
          if (79 < percentage && percentage <= 84) {
            number = 7;
            //console.log("The attendence number is : " + number);
          } else {
            if (74 < percentage && percentage <= 79) {
              number = 6;
              //console.log("The attendence number is : " + number);
            } else {
              if (70 < percentage && percentage <= 74) {
                number = 5;
                //console.log("The attendence number is : " + number);
              } else {
                if (64 < percentage && percentage <= 69) {
                  number = 4;
                 // console.log("The attendence number is : " + number);
                } else {
                  if (59 < percentage && percentage <= 64) {
                    number = 3;
                    //console.log("The attendence number is : " + number);
                  } else {
                    number = 0;
                    //console.log("The attendence number is : " + number);
                  }
                }
              }
            }
          }
        }
      }
    }

    return  number;
  };


this.gradePoint = function(number){
    var grade;
    console.log("The number for grade is : "+ number);
    number = Math.round(number);

      if(number>=80){        
        grade = "4.00";
      }else{
        if(75<=number && number <80){
          grade = "3.75";
        }else{
            if(70<=number && number <75){
               grade = "3.50";
            }else{
              if(65<=number && number <70){
                  grade = "3.25";
              }else{

                   if(60<=number && number <65){
                       grade = "3.00";
                    } else{

                        if(55<=number && number <60){
                            grade = "2.75";
                        }else{

                            if(50<=number && number <55){
                                grade = "2.50";
                           } else {

                                if(45<=number && number <50){
                                   grade = "2.25";
                                 }else{

                                    if(40<=number && number <45){
                                         grade = "2.00";
                                    }else {
                                         grade = "0.00";
                                    }
                                 }
                             }

                        }
                    }
               }
            }
          }
      }

      return grade;
  };

this.gradeLetter = function(gradePoint){
    var letter;

    if(gradePoint>=4){        
        letter = "A+";
      }else{
        if(3.75<=gradePoint && gradePoint <4){
          letter = "A";
        }else{
            if(3.50<=gradePoint && gradePoint <3.75){
               letter = "A-";
            }else{
              if(3.25<=gradePoint && gradePoint <3.50){
                  letter = "B+";
              }else{

                   if(3.00<=gradePoint && gradePoint <3.25){
                       letter = "B";
                    } else{

                        if(2.75<=gradePoint && gradePoint <3.0){
                            letter = "B-";
                        }else{

                            if(2.50<=gradePoint && gradePoint <2.75){
                                letter = "C+";
                           } else {

                                if(2.25<=gradePoint && gradePoint <2.50){
                                   letter = "C";
                                 }else{

                                    if(2.0<=gradePoint && gradePoint <2.25){
                                         letter = "C-";
                                    }else {
                                         letter = "F";
                                    }
                                 }
                             }

                        }
                    }
               }
            }
          }
      }

    return letter;

  };


  this.termTestMark = function(term_test,modyfy){
    var mark = (term_test / modyfy) * 20 ;
    return mark;
  };

  this.finalExam = function(result,modyfy){
    var mark = (result / modyfy) * 70 ;
    mark = Math.round(mark * 100) / 100;
    return mark;
  };
});



app.service('resultData',function($http){

    this.save = function(result){

        $http.post('/api/result/autoSave',result)
          .success(function(data){
            console.log("save : .......from service: " + data);

          })
          .error(function(err) {
            console.log(err)
          });
    };

    this.markBaseSave = function(result){

        $http.post('/api/result/autoSave/resultBase',result)
          .success(function(data){

           })
          .error(function(err) {
             console.log(err);
       }); 

           
    };
});








app.controller('authentication',function($scope,$http,$rootScope,$location,$cookieStore){

   

    

  $scope.login = function(){

    $http.post('/auth/login',$scope.user).success(function(data){
      console.log(data.state + " " + data.user.username + " " + data.user.designation + " " + data.role);

      if(data.state==="failure"){
        $scope.fail_message = data.message;
        $scope.user.username = "";
        $scope.user.password = "";
        $location.path('/login');
      }else{
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user;

        $http.get("/api/admin/exam/commitee").success(function(data){
          $scope.allcommitee = data; 
          console.log("Hello........................"+ $scope.allcommitee[0].chairman);  

          angular.forEach($scope.allcommitee,function(value,key){
            
            if(value.chairman == $rootScope.current_user._id || $rootScope.current_user.role == "admin"){
                console.log("Yes it work");
                $rootScope.current_user.showResultInput = true;
            }else{
                $rootScope.current_user.showResultInput = false;
            }
            
            $cookieStore.put("user",$rootScope.current_user);
          });       
       });
        
        
        $location.path('/');
      }
      

    });
  };

});




app.controller('welcomeController',function($scope,$http,$rootScope,$location){



});



app.controller('tabulationCtrl',function($scope,$http,resultCalculation){

  $scope.resultCalculation = resultCalculation;

   var findSession = function(){
    $http.get("/api/admin/exam/commitee").success(function(data){
      $scope.allSemester = data;
    });
  };
 
  findSession();

  var semesterCourses = function(){

    $http.get('/api/session/semesterCourse/'+$scope.session).success(function(data){
        console.log("Get the all course no..........." + data);
        $scope.terms = data;
    });

  };

  var studentResultInfo = function(){

      $http.get('/api/student/result/session/'+$scope.session).success(function(data){
          if(!data){
            console.log("Student Result not found");
          }else{
            $scope.allResult = data;
          }
      });
  };


var studentBatch = function(){

  $http.get('/api/allStudents/' +$scope.session).success(function(data){
           console.log(data);
           $scope.students =  data;
        });
};


var courseInfo = function(){
  
      $http.get("/api/admin/register/courses").success(function(data){
          if(!data){
            console.log("Student Result not found");
          }else{
            $scope.courses = data;
          }
      });

  };

$scope.findValue = function(reg,value){

    var credit = 0;
    var totalGpa = 0;

          console.log(".....................fre: : " + reg+ " " + value) ;

    angular.forEach($scope.semester_no.course_teacher,function(value,key){

     // console.log(".....................fre: : " + value.course_id) ;
        angular.forEach($scope.allResult,function(course,index){
          //console.log("found: " + course.course_id) ;
          if(value.course_id === course.course_id && reg===course.reg){
            console.log("found: " + course.course_id) ;

            if(course.total >= 40 ){
              credit = credit + parseInt(course.courseInfo[0].credit,10);
              totalGpa = totalGpa +  resultCalculation.gradePoint(course.total) * parseInt(course.courseInfo[0].credit,10);
            }
            
            console.log("found: course criditt: " + course.courseInfo[0].credit + " cre: "+ credit);
          }

        });
    });


    if(value === "credit"){
      return credit;
    }else{
      return Math.round((totalGpa/credit) * 100) /100 ;
    }

};


  $scope.$watch('session', function() {
        console.log($scope.session);
        semesterCourses();
        studentResultInfo();
        courseInfo();
        studentBatch();
  });


});





app.controller('markSheetCtrl',function($scope,$http,resultCalculation){

  $scope.resultCalculation = resultCalculation;
  $scope.courses = [];
  var totalCredit = 0;
  var semesterCredit = 0;
  var semesterGradePoint = 0;
 

  var semesterCourses = function(session){
    console.log("From sems:......."+session);

    $http.get('/api/session/semesterCourse/'+session).success(function(data){
        console.log("session: ......" + data[0].chairman);
        $scope.terms = data;
       
    }).error(function() {
          console.log("error: ");
        });

  };

var studentInfo = function(reg){

    $http.get('/api/student/' +reg).success(function(data){
        $scope.student = data;
        console.log(data.reg + " " + data.name)
    });
};

  $scope.findStudentData = function(reg){
    console.log(reg);

    $http.get('/api/student/result/name/'+reg).success(function(data){

        if(data[0] !== undefined){

          var semsF = parseInt((data[0].reg).substr(0, 4),10);
          var semsL = parseInt((data[0].reg).substr(2, 2),10);

            //console.log(semsF + "  " + semsL);
            var session = semsF +"-"+ (semsL +1);

            console.log(session + typeof(session));
            semesterCourses(session);
            studentInfo(reg);
            $scope.courses = data;
            $scope.show = true;

        }else{
            //console.log("esle" + data);           
        }
    });
  };

$scope.thisSemesterCredit = function(semester,value){

  semesterCredit = 0;
  semesterGradePoint = 0;
  semester = parseInt(semester,10);

  console.log("the semester no is : " + semester);

  angular.forEach($scope.terms,function(value,key){

      console.log("The key is : " + key);

      if(value.semester_no === semester){

        console.log("Hello value " + value.semester_no + " length" + value.course_teacher.length);

      angular.forEach(value.course_teacher,function(semesterCourse,index){

        console.log("semster course: " + semesterCourse.course_id);

        angular.forEach($scope.courses,function(course,indexKey){

            console.log("course........" + course.course_id);
            if(course.course_id === semesterCourse.course_id){
               console.log("Found: " + course.course_id);
               semesterCredit = semesterCredit + parseInt(course.courseInfo[0].credit,10);
               semesterGradePoint = semesterGradePoint + parseInt(course.courseInfo[0].credit,10) *  resultCalculation.gradePoint(course.total);
               console.log("credit: " + semesterCredit + "total gpa: " + semesterGradePoint);
            }
        });
      });
    }

  });

  if(value === 1){
    return semesterCredit;
  }else{
    return semesterGradePoint;
  }
};



$scope.cumulativeCredit = function(semester,value){

  semesterCredit = 0;
  semesterGradePoint = 0;
  semester = parseInt(semester,10);

  console.log("the semester no is : " + semester);

  angular.forEach($scope.terms,function(value,key){

      console.log("The key is : " + key);

      if(value.semester_no <= semester){

        console.log("Hello value " + value.semester_no + " length" + value.course_teacher.length);

      angular.forEach(value.course_teacher,function(semesterCourse,index){

        console.log("semster course: " + semesterCourse.course_id);

        angular.forEach($scope.courses,function(course,indexKey){

            console.log("course........" + course.course_id);
            if(course.course_id === semesterCourse.course_id){
               console.log("Found: " + course.course_id);
               if(course.total>=40){
                 semesterCredit = semesterCredit + parseInt(course.courseInfo[0].credit,10);
                 semesterGradePoint = semesterGradePoint + parseInt(course.courseInfo[0].credit,10) *  resultCalculation.gradePoint(course.total);
                 console.log("credit: " + semesterCredit + "total gpa: " + semesterGradePoint);
               }
            }
        });
      });
    }

  });

  if(value === 1){
    return semesterCredit;
  }else{
    return semesterGradePoint;
  }
};

$scope.roundNum = function(num){
  return Math.round(num * 100) / 100;
};


});




app.controller('resultController',function($scope,$http,$location,$timeout,resultCalculation,resultData){

  var editable = false;
  var hide = true;
  $scope.students = [];
  $scope.resultCalculation = resultCalculation;
  $scope.dropperShow = false;
  var autoSaveTotal = function(reg,total){

    var result = {};

    result.reg = reg;
    result.course_id = $scope.course_id.course_id;
    result.total = total;

    console.log("The total auto Save working............................." + result.total);
    resultData.save(result);
    
  };

  $scope.totalResult = function(student){

    var studentIndex = $scope.students.indexOf(student);

    var classPerformance = resultCalculation.attendenceMark($scope.students[studentIndex].attendence,$scope.baseResult.total_class);

    var termTest = resultCalculation.termTestMark($scope.students[studentIndex].term_test,$scope.baseResult.term_test_modify);

    var theoryLab = $scope.students[studentIndex].theory + $scope.students[studentIndex].lab;
    var theoryLabModify = $scope.baseResult.theory_modify + $scope.baseResult.lab_modify;

    var final_result = resultCalculation.finalExam(theoryLab,theoryLabModify);

    console.log("................................ The total result is : performance" + classPerformance + " term: " + termTest + " final: " + final_result);

    // console.log("thse index is: " + studentIndex);
    // console.log("thse attendence is: " + $scope.students[studentIndex].attendence);
    // console.log("thse term is: " + $scope.students[studentIndex].term_test);
    // console.log("thse theory is: " + $scope.students[studentIndex].theory);
    // console.log("thse lab is: " + $scope.students[studentIndex].lab);
    // console.log("thse totol is: " + $scope.students[studentIndex].total);

    $scope.students[studentIndex].total = Math.round((classPerformance +  termTest + final_result) * 100) / 100;

    autoSaveTotal($scope.students[studentIndex].reg,$scope.students[studentIndex].total);
  };







 var findSession = function(){
    $http.get("/api/admin/exam/commitee").success(function(data){
      $scope.allSemester = data;
     // console.log("..............."+data.chairman);
    });
  };
 
  findSession();

var courseDetails = function(){
     console.log("From course details: ..........");

    $http.get('/api/course/' +$scope.course_id.course_id).success(function(data){
          // console.log("From course details: " + typeof(data.lab));
           $scope.courseDetail =  data;
        });
};

var resultRefresh = function(){

  $http.get('/api/student/result/name/' +$scope.session + "/" +$scope.course_id.course_id).success(function(data){

     $scope.students =  data;

    }).error(function(err){
          console.log(err);
               
  });  
};


var studentBatch =  function() {


      $http.get('/api/student/result/name/' +$scope.session + "/" +$scope.course_id.course_id).success(function(data){
                
        if(data[0] === undefined){

          $http.get('/api/allStudents/' +$scope.session).success(function(data){
           console.log("The students batch............" + data);

           angular.forEach(data,function(value,key){

              var result = {};

              result.reg = value.reg;
              result.course_id = $scope.course_id.course_id;

              result.term_test= 0;       
              result.attendence = 0;        
              result.term_test = 0;        
              result.theory = 0;        
              result.lab = 0;

              resultData.save(result);
              console.log("The students batch............" + value);

           });

          $timeout(function(){
            resultRefresh();
          },100);

         });

        }else{

           $scope.students =  data;
            console.log("get all result from database ....................." + $scope.students);
        }
                
        }).error(function(err){
          console.log(err);
               
      });
        
  };


  var semesterCourses = function(){

    $http.get('/api/session/semesterCourse/'+$scope.session).success(function(data){
        console.log("Get the all course no..........." + data);
        $scope.terms = data;
    });

  };

var markModify = function(){

    $http.get('/api/result/autoSave/resultBase/'+$scope.session+'/'+$scope.semester_no.semester_no+'/'+$scope.course_id.course_id)
    .success(function(data){
        $scope.baseResult = data;
        console.log("Modify: " + data.total_class)
    });
};

 $scope.$watch('course_id', function() {
        //console.log($scope.course_id);
        courseDetails();
        studentBatch();
        markModify();
  });

  $scope.$watch('session', function() {
        console.log($scope.session);
        semesterCourses();
        
  });

  $scope.hideOrShow = function(){
    if($scope.course_id === undefined && hide===true){
      return false;
    }else{
      return true;
    }
  };







  //************** result save to database *************

  $scope.autoSaveAttendance = function(reg,attendence){

    var result = {};

    result.reg = reg;
    result.course_id = $scope.course_id.course_id;
    result.attendence = attendence;

    resultData.save(result);
    //calculateTotal();
  };

  $scope.autoSaveTerm = function(reg,termNo){

    var result = {};

    result.reg = reg;
    result.course_id = $scope.course_id.course_id;
    result.term_test = termNo;

    resultData.save(result);
  };


  $scope.autoSaveTheory = function(reg,theory){

    var result = {};

    result.reg = reg;
    result.course_id = $scope.course_id.course_id;
    result.theory = theory;

    resultData.save(result);
    
  };


$scope.autoSaveLab = function(reg,lab){

    var result = {};

    result.reg = reg;
    result.course_id = $scope.course_id.course_id;
    result.lab = lab;

    resultData.save(result);
    
  };

  $scope.modifyPerformance = function(modifyAttendance){

    var result = {};
    $scope.semester_no.semester_no = parseInt($scope.semester_no.semester_no,10);

    result.session = $scope.session;
    result.course_id = $scope.course_id.course_id;
    result.semester_no = $scope.semester_no.semester_no;
    result.total_class = modifyAttendance;    

    resultData.markBaseSave(result);
  };

$scope.modifyTermNo = function(term_test_modify){

    var result = {};
    $scope.semester_no.semester_no = parseInt($scope.semester_no.semester_no,10);

    result.session = $scope.session;
    result.course_id = $scope.course_id.course_id;
    result.semester_no = $scope.semester_no.semester_no;
    result.term_test_modify = term_test_modify;

    //console.log(result);
    

    resultData.markBaseSave(result);
  };

  $scope.modifyThory = function(theory_modify){

    var result = {};
    $scope.semester_no.semester_no = parseInt($scope.semester_no.semester_no,10);

    result.session = $scope.session;
    result.course_id = $scope.course_id.course_id;
    result.semester_no = $scope.semester_no.semester_no;
    result.theory_modify = theory_modify;

   // console.log(result);
    resultData.markBaseSave(result);
  };


    $scope.modifyLab = function(lab_modify){

      var result = {};
      $scope.semester_no.semester_no = parseInt($scope.semester_no.semester_no,10);

      result.session = $scope.session;
      result.course_id = $scope.course_id.course_id;
      result.semester_no = $scope.semester_no.semester_no;
      result.lab_modify = lab_modify;

     // console.log(result);
     resultData.markBaseSave(result);
  };

  $scope.saveBtn = function(){
     console.log("redirect to show students.......");
     resultData.session = $scope.session;
     resultData.semester = $scope.semester_no.semester_no;
     resultData.course_id = $scope.semester_no.semester_no;
    $location.path('/showResult');
  };


$scope.showDropper = function(){
  $scope.dropperShow = true;
  console.log("droper show....................");
};

});




/**********************************************************************************
                          Student controller
**********************************************************************************/

app.controller('studentController',function($scope,$http,$rootScope,$location){

  $scope.students = [];
  $scope.allSemester = {};
  $scope.showSave = false;
  $scope.error = null;
  $scope.searchByReg = false;

  $scope.addStudent = function(){
    var student = {};
    $scope.showSave = true;
    $scope.students.push(student);
    console.log("workign.........");
  };

//********************* Course delete function ***************************
  $scope.deleteStudent = function(student){
    var studentIndex = $scope.students.indexOf(student);
    $scope.students.splice(studentIndex,1);
  };


//********************* upload excel file function ***************************


  $scope.uploadFile = function(){
    var file = $scope.myFile;
    var uploadUrl = "/api/student/upload";
        

    var fd = new FormData();
    fd.append('file', file);
    console.log("fjinle name; " + fd);
 
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    })
 
    .success(function(result){
      console.log("result"+ result);
      $scope.students = result;
      $scope.showSave = true;
    })
 
    .error(function(){

      });           
  };

//********************* save student to database ***************************
 
$scope.notfound = function(check){
   console.log(check);
    return value = (check === 'error'? 'error': null);
  };




$scope.saveStudents = function(){
  var keepgoing = true;

  angular.forEach($scope.students, function(value,key){
    //console.log(key + " " + value.reg);
    //console.log(key + " " + value.name);
    if(keepgoing === true){
      if(value.reg === "" || value.name === "" || value.session === ""){
        console.log(" NOt found: " + value.name);
         $scope.error = 'error';
         keepgoing = false;
        
      }else{
         $scope.error = null;
         console.log(" Yes found: " + value.name);
         saveInDataBase(value);
         var studentIndex = $scope.students.indexOf(value);
         $scope.students.splice(studentIndex,1);
      }
    }
    
  });

  console.log($scope.students);
  if($scope.students.length<=0){
    $location.path('/students');
  }

};

        

var saveInDataBase = function(student){

  console.log(student);

  $http.post('/api/chairman/register/students',student)

  .success(function(result){
    console.log("Student information save successfully........");
  });
};


  var findSession = function(){
    $http.get("/api/admin/exam/commitee").success(function(data){
      $scope.allSemester = data;
      console.log("..............."+$scope.allSemester);
    });
  };
 
  findSession();

$scope.$watch('session', function() {
        console.log($scope.session);

        $http.get('/api/allStudents/' +$scope.session).success(function(data){
           console.log(data);
           $scope.searchByReg = false;
           $scope.students =  data;
        });
  });

$scope.searchStudent = function(reg){

  $http.get("/api/student/" +reg).success(function(data){
    if(data){
      $scope.student =  data;
      $scope.searchByReg = true;
      console.log("Find the student: " + data);
    }
  }).error(function(err){
    console.log(err);
  });
};




});



/**********************************************************************************
               Teacher controller
**********************************************************************************/
app.controller('teacherController',function($scope,$http,$rootScope,$location){

  $scope.registerTeacher = function(user){
    user.role = "user";//"admin"; 

    if($scope.found.status !== 'success'){ 
      $scope.wearingMessage = 'Username already exist. Choose another name...';

    }else{
        $http.post('/api/teacher',user).success(function(result){
        $rootScope.teacherReg = result;
        console.log("Registration Successful");
      });

      $scope.wearingMessage = null;
      $location.path('/teacher/success');
    }
    
  };


  $scope.checkUser = function(username){
    $http.get('/api/teacher/checkUser/'+username)

    .success(function(found){
      $scope.found = found;
      if($scope.found.status === 'success'){ 
      $scope.wearingMessage = null;

    }
    })
    .error(function(err){
      $scope.found = null;
    });
  };

  $scope.showColor = function(){
    console.log($scope.found.status);
    var value = ($scope.found.status === 'success'? 'green':'red');
    console.log(value);
    return value ;//= ($scope.found.status === 'success'? 'green':'red');
  };


  $scope.getAllTeacher = function(){
    $http.get('/api/teacher').success(function(data){
      $scope.teachers = data;
    });
  };

});









/**********************************************************************************
                        
**********************************************************************************/

app.controller('setCommittee',function($scope,$http,$location){

/**********************************************************************
***********      Sesssion and  Semester information   ****************
********************************************************************/

  var findSession = function(){
    $http.get("/api/admin/exam/commitee").success(function(data){
      $scope.allSemester = data;
      console.log("..............."+data.chairman);
    });
  };
 
  findSession();


  var courseInfo = [];
var courseList = function(){
   
    $http.get('/api/admin/register/courses').success(function(data){
        courseInfo = data;
        console.log("Course list for show........."+courseInfo);
        
      })
      .error(function(err) {
        console.log(err);
      });
};




  var semesterCourses = function(){

    $http.get('/api/session/semesterCourse/'+$scope.session).success(function(data){
        console.log(data);
        $scope.terms = data;
        angular.forEach(data,function(value,key){
          console.log("semester: " + value.semester_no);
          console.log("semester: " + value.course_teacher);
        });
    });

  };


  $scope.$watch('session', function() {
        console.log($scope.session);
        semesterCourses();
        courseList();
  });

 

  var getTeacherList = function(){
    console.log("teachershow......click.");
      $http.get('/api/teacher')
      .success(function(data){
          $scope.teacherList = data;
          console.log(data);
      })
      .error(function(err){
        console.log("Error sending data....."+ err);
      });
  };

  getTeacherList();


  var getTeacherById = function(id){

    console.log("teachershow......click." + id);

     $http.get('/api/teacher/'+id)
      .success(function(data){
          
        
         
      })
      .error(function(err){
        console.log("Error sending data....."+ err);
      });

      // console.log(teacherName);

      // return teacherName;

  };

  //$scope.$watch('semester_no', function() {
        // console.log(typeof($scope.semester_no));
        // console.log($scope.semester_no.chairman);
        // teacher = getTeacherById($scope.semester_no.chairman);
        // console.log("value..." + teacher);

        // angular.forEach($scope.semester_no.course_teacher,function(value,key){

        //     //value.teacher= getTeacherById(value.teacher);
        //     $scope.courseTeacher = getTeacherById(value.teacher);

        //     console.log("value..." + value.course_id);
        //     console.log("value..." + value.teacher);
        //     console.log("value..." + $scope.courseTeacher);
        // });
  //});

 


//************************ update committee *********************************

  $scope.assignTeacher = function(course_id,teacherName){

    var commitee = {};

    commitee.session = $scope.session;
    commitee.semester_no = $scope.semester_no.semester_no;
    commitee.course_id = course_id;
    commitee.teacherName = teacherName._id;

    $http.post('/api/session/semester/commitee/courseTeacher',commitee).success(function(result){
      console.log(result);
    });

  };



  $scope.assignChairman = function(chairman){

    var commitee = {};

    commitee.session = $scope.session;
    commitee.semester_no = $scope.semester_no.semester_no;
    commitee.teacherName = $scope.chairman._id;
    

    $http.post('/api/session/semester/commitee/chairman',commitee).success(function(result){
      console.log(result);
    });
  };



  $scope.courseTitle = function(course_id){
   
   var title;
      angular.forEach(courseInfo,function(value,key){

          if(value.course_id === course_id){
            title = value.title;
            console.log(title);
          }
          console.log(title);
      });


    return title;    
  };

  $scope.courseTitle('PGD-111');

  $scope.goShowCommittee = function(){
    $location.path('/showCommittee');
  };

});










app.controller('courseShowController', function($scope,$http,$location,$filter,$rootScope){

  //****************** read data for showing syllabu*********************

  $scope.session = $rootScope.sendSemester;

  var refresh = function(){
    $http.get('/api/admin/register/courses').success(function(data){
      $scope.courses = data;
      console.log("Courses read in database successfully" + $scope.courses);
    });
  };

  refresh();

/**********************************************************************
***********      Sesssion and  Semester information   ****************
********************************************************************/

  var findSession = function(){
    $http.get("/api/admin/exam/commitee").success(function(data){
      $scope.allSemester = data;
    });
  };
 
  findSession();

  var semesterCourses = function(){

    $http.get('/api/session/semesterCourse/'+$scope.session).success(function(data){
        console.log(data);
        $scope.terms = data;
        angular.forEach(data,function(value,key){
          console.log("semester: " + value.semester_no);
          console.log("semester: " + value.course_teacher);
        }).error(function() {
          console.log("error: ");
        });
    });

  };


//**********************************************************************

  semesterCourses();

  $scope.$watch('session', function() {
        console.log($scope.session);
        semesterCourses();
    });



});







app.controller('courseController', function($scope,$http,$location,$filter,$rootScope) {

  $scope.terms = []; 
  $scope.courses = [];
  $scope.allSemester = [];


//********************* Course add function ***************************

  $scope.addCourse = function(term){
    var course = {
      course_id: "",
      course_title: "",
      term: term
    };
    $scope.showSave = true;
    $scope.courses.push(course);
    console.log("workign.........");
  };

//********************* Course delete function ***************************
  $scope.deleteCourse = function(course){
    var courseIndex = $scope.courses.indexOf(course);
    $scope.courses.splice(courseIndex,1);
  };


  $scope.addSemester = function(){
    if (!$scope.terms.length){
      console.log("..............");
      $scope.terms.push(1);
    }else{
      var term = $scope.terms[$scope.terms.length-1];
      console.log(typeof(term) + term);
      $scope.terms.push(term+1);
    }
    
  };


  //*********************** input in database ***********************


  $scope.save = function(){

    //************ courses input in course database*********

    angular.forEach($scope.courses, function(value,key){
      console.log(key + " " + value);
              
      $http.post('/api/admin/register/courses',value).success(function(data){
                    
        console.log("Courses save in database successfully");
      });  

      $rootScope.sendSemester =  $scope.session;

    });


   //************ semester information in committee database*********  

    angular.forEach($scope.terms, function(value,key){
      console.log(" Starting..................................");
      var semesterInformation = {};
      semesterInformation.semester_no = value;
      semesterInformation.session = $scope.session;

      
      var courseInfo = []; 

      $scope.courses.filter(function (course) {
          if(course.term == value){
            console.log(" filter: " + course.course_id);

            var courseObject = {
              course_id: course.course_id
            };

            courseInfo.push(courseObject);
            return course.course_id;
          }
      });

      semesterInformation.courseList = courseInfo;
    

      $http.post('/api/input/semester',semesterInformation)

       .success(function(data){

             console.log("Semester information save successfully." );
         });
    });

    $location.path('/syllabus');

  };

});












