var app = angular.module('myApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {

  // $rootScope.authenticated = false;
  // $rootScope.current_user = "";

  // $rootScope.logout = function(){
  //   $http.get('/auth/signout');

  //   $rootScope.authenticated = false;
  //   $rootScope.current_user = "";
  //};
});


// using route in the address bar and bring the template to the single page

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'index.html',
      controller: 'myController'
    })
    .when('/result', {
      templateUrl: 'result_input.html',
      controller: 'inputController'
    });



  //   .when('/login',{
  //     templateUrl: 'login.html',
  //     controller: 'authController'
  //   })
  //   .when('/register',{
  //     templateUrl: 'register.html',
  //     controller: 'authController'
  //   });
});


//*****************************************************
//*****************************************************
//************* dynamic ng-model name change ***********
//*****************************************************
//*****************************************************

app.directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-model'))(scope);
            elem.removeAttr('dynamic-model');
            elem.attr('ng-model', name);
            $compile(elem)(scope);
        }
    };
}]);





//*****************************************************
//*****************************************************
//************* Result Input Section ******************
//*****************************************************
//*****************************************************

app.factory('allResult', function() {

});


app.controller('inputController', function($scope, $http) {
  $scope.results = [];
  $scope.result ={};
  $scope.terms = ["1", "2", "3"];
  $scope.sessions = ["2011-12", "2012-13", "2014-15"];
  $scope.courses = ["PGD-111", "PGD-113", "PGD-115", "PGD-117"];

  $scope.term = 0;
  $scope.attendence = 0;
  $scope.totalResult = 0;
  $scope.gradePoint = 0;
  $scope.count = 1;
  $scope.showSubmit = true;


  var refresh = function() {
    console.log("refresh: ");
    $http.get('/api/teacher/input/result').success(function(data) {
      $scope.results = data;


      $scope.result.reg = NaN;
      $scope.result.attendence = NaN;
      $scope.result.term_test_1 = NaN;
      $scope.result.term_test_2 = NaN;
      $scope.result.part_A = NaN;
      $scope.result.part_B = NaN;

      console.log("refresh: " + data);
    });
  };


  refresh();


  $scope.inputData = function(){
    console.log("blue is called: " + $scope.result.total_class);
  };



  $scope.resultSubmit = function() {

      $scope.result.course_id = $scope.course_id;

      $http.post('/api/teacher/input/result', $scope.result).success(function(data) {

        console.log("The result save database successfull...");
      });

      console.log($scope.result);

      refresh();
  };

//****************************************
//            Update the form for update result
//**************************************
  $scope.update = function(id){

    $http.get("/api/teacher/input/result/"+id).success(function(result){

        $scope.result = result;
        console.log(result);
        $scope.showSubmit = false;
    });

    console.log(id);
  };

//****************************************
//            Update result
//**************************************

  $scope.resultUpdate = function(id){
      console.log(id);

      $http.put("/api/teacher/input/result/"+id,$scope.result).success(function(result){
          console.log("Update successfull.......");
          refresh();
          $scope.showSubmit = true;
      });

  };



//*********************************************************************************
//           Calculate the Total result, attendence mark , GPA point and Grade letter
//***********************************************************************************

  $scope.final_result = function(attendence, term, A, B) {
      var result = attendence + term + ((A + B) * 70 / 100);
      //console.log(result + "  " + attendence + " " + term + "  " + A + "  " + B);
      return result;
  };

  $scope.attendance_Number = function(total_Class, attendence) {
    var number, percentage;

    percentage = (attendence / total_Class) * 100;
    //console.log("The percentage is : " + percentage + " attendence : " + attendence + " totla: " + total_Class);


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

    return number;
  };

  $scope.calculateGradePoint = function(number){
    var grade;
      if(number>79){        
        grade = "4.00";
        //console.log("the grade is " + grade);
      }else{
        if(74<number && number <=79){
          grade = "3.75";
          //console.log("the grade is " + grade);
        }else{
            if(69<number && number <=74){
               grade = "3.50";
               //console.log("the grade is " + grade);
            }else{
              if(64<number && number <=69){
                  grade = "3.25";
                  //console.log("the grade is " + grade);
              }else{

                   if(59<number && number <=64){
                       grade = "3.00";
                      // console.log("the grade is " + grade);
                    } else{

                        if(54<number && number <=59){
                            grade = "2.75";
                           // console.log("the grade is " + grade);
                        }else{

                            if(49<number && number <=54){
                                grade = "2.50";
                                //console.log("the grade is " + grade);
                           } else {

                                if(44<number && number <=49){
                                   grade = "2.25";
                                  // console.log("the grade is " + grade);
                                 }else{

                                    if(39<number && number <=44){
                                         grade = "2.00";
                                      //   console.log("the grade is " + grade);
                                    }else {
                                         grade = "0.00";
                                         //console.log("the grade is " + grade);
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




  $scope.gradeLetter = function(gradePoint){
    var letter;

    switch (gradePoint){
      case "4.00":
          letter = "A+";
          break;
      case "3.75":
          letter = "A";
          break;
      case "3.50":
          letter = "A-";
          break;
      case "3.25":
          letter = "B+";
          break;
      case "3.00":
          letter = "B";
          break;
      case "2.75":
          letter = "B-";
          break;
      case "2.50":
          letter = "C+";
          break;
      case "2.25":
          letter = "C";
          break;
      case "2.00":
          letter = "C-";
          break;
      default:
          letter = "F";
          break;
    }

    return letter;

  };

//*********************************************************************************
//  End of Calculate the Total result, attendence mark , GPA point and Grade letter
//***********************************************************************************




});



//app.factory('collectAll',function($resource){
// var bringData = {};
// bringData.getData = function(){
//   return $http.get('/api/posts');
// };
// return bringData;
//return $resource('/api/posts/:id'); 


//});

// main html controller.............



 /**************************************************************
*********** File directive for upload to the server************ 
****************************************************************/  



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

 // app.service('fileUpload', ['$http', function ($http) {
 //        this.uploadFileToUrl = function(file, uploadUrl){
 //           var fd = new FormData();
 //           fd.append('file', file);
 
 //           $http.post(uploadUrl, fd, {
 //              transformRequest: angular.identity,
 //              headers: {'Content-Type': undefined}
 //           })
 
 //           .success(function(result){
 //               console.log("result "+ result.error_desc);
 //               return result;
 //           })
 
 //           .error(function(){
 //           });
 //        };
 //     }]);


/**************************************************************
***********End of File directive for upload to the server *****
****************************************************************/  





app.controller('myController', function($scope,$http) {

  $scope.students = [];
  var allStudents ;

  $scope.register_panel_hide = false;

  $scope.addStudent = function() {
    $scope.register_panel_hide = false;
    console.log($scope.register_panel_hide);
  };

  $scope.studentRegistration = function() {
    console.log("register calling......");
    $scope.students.push($scope.student);
    $scope.register_panel_hide = true;
    //show();
    console.log($scope.register_panel_hide);
  };

  

  // $scope.uploadXL = function(){

  //   $http.post('/api/student/upload')

  //     console.log("hello");
  // };

 /**************************************************************
*********** Excel file to Json file upload to server************ 
****************************************************************/  

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
           })
 
           .error(function(){

           });

           
        };


/**************************************************************
*********End of Excel file to Json file upload to server******** 
****************************************************************/  


 /**************************************************************
****************** Save all Students in the Database************ 
****************************************************************/      

        $scope.saveStudents = function(){
            angular.forEach($scope.students, function(value,key){
              console.log(key + " " + value);
              saveInDataBase(value);
            });

            };

        

      var saveInDataBase = function(student){

        console.log(student);

        $http.post('/api/chairman/register/students',student)

        .success(function(result){
            console.log("Student information save successfully........");
        });
      };

/**************************************************************
************** End of Save all Students in the Database********
****************************************************************/       

});