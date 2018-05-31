var studentsList;
var courseList;
function populateForm(select) {
    var selectedText = (select.options[select.selectedIndex].text)
    var textArea = document.getElementById("textArea");
    if (selectedText == 'Select Id...') {
        alert("Please Select the Student id");
    }

    else {
        var registrationIdTxt = document.getElementById('txtRegistrationId');
        registrationIdTxt.value = selectedText;
        studentsList.forEach(function (student) {
            if (student['registrationId'] == selectedText) {
                var firstName = document.getElementById('fname');
                var lastName = document.getElementById('lname');
                firstName.value = student['fName'];
                lastName.value = student['lName'];
                var courseList = student['courseList'];
                var textAreaValue = "";
                for (var i in courseList) {
                    textAreaValue += courseList[i].courseCode + ': ' + courseList[i].courseName + '\n';
                }
                textArea.value = textAreaValue;

            }
        });
    }

}
function populateValue() {
    var courseCode = document.getElementById('courseCodeList').value;
    var courseCodeTxt = document.getElementById('courseCodeTxt');
    var courseNameTxt = document.getElementById('courseDescriptionTxt');
    if (courseCode == 'Select...') {
        alert('Please select courseCode');
    }
    else {
        courseList.forEach(function (course) {
            if (course['courseCode'] == courseCode) {
                courseCodeTxt.value = course['courseCode'];
                courseNameTxt.value = course['courseName'];
            }
        });
    }

}
var app = angular.module("myApp", [])
app.controller('LoginCtrl', function ($scope, $http, $window, $compile) {
    $scope.courses = {};
    $scope.students = {};
    $scope.selectIdHtml = '';
    $scope.selectCourseHtml = '';
    $scope.getCoursesApiUrl = 'http://localhost:8304/api/registration-service/rest/service/courses/';
    $scope.getStudentsApiUrl = 'http://localhost:8304/api/registration-service/rest/service/students/';
    $window.onload = $scope.clearData;
    $scope.clearData = function () {
        $scope.courseCode = "";
        $scope.courseDescription = "";
        $scope.fname = "";
        $scope.lname = "";
        $scope.registrationId = "";
        $scope.courseListTextArea="";
    }
    $scope.showHomePage = function () {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        contentBody.innerHTML = '<div class="form-row"> <div class="col-2"></div><div class="col-8"><h3>Welcome to Student Registration System!<h3></div></div>';
    }
    $scope.getData = function (ApiUrl) {
        return new Promise(function (resolve, reject) {
            var req = {
                method: 'GET',
                url: ApiUrl,
                headers: {
                    'Accept': 'application/json'
                }
            }
            $http(req)
                .then(function (response) {
                    resolve(response); 
                }).catch(function (error) {
                    alert("Exception occured while fetching the data!")
                    callThis('<option>No course List</option>');
                    reject(error);
                })
        });

    }
    $scope.populateCourseSelect = function (response) {
        var courseListSelect = '';
        var courseList = response.data;
        for (var i in courseList) {
            courseListSelect += '<option value=' + courseList[i].courseCode + '>' + courseList[i].courseName + '</option>'
        }
        return courseListSelect;
    }
    $scope.populateStudentIdSelect = function (response) {
        var selectHtml = '';
        var studentList = response.data;
        for (var index in studentList) {
            selectHtml += '<option value=' + studentList[index].registrationId + '>' + studentList[index].registrationId + '</option>'
        }
        return selectHtml;

    }
    $scope.displayUpdateCourseForm = function (courseListSelect) {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var htmlText = `<form class="form-group" style="align-content: center">
            <div class="form-row"> <div class="col-4"></div><div><h4>Update Course Form</h4></div> </div><p></p>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Course Name:</label>
            <select class="form-control col-3" id="courseCodeList"onchange="populateValue()" style="min-width:200px"><option>Select...</option>${courseListSelect}</select></div><p></p>
            <div class="form-row">  <div class="col-2"></div> <label class="col-2">Course Code:</label><input type="text" class="form-control col-3" id="courseCodeTxt" ng-model="courseCode"disabled="disabled" > </div> <p></p>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Course Name:</label>
            <input type="text" class="form-control col-3" id="courseDescriptionTxt"ng-model="courseDescription"></div> <p></p> 
            <div class="form-row"><div class="col-4"></div><button id="updateCourseBtn" ng-click="updateCourseData()" class="btn btn-primary">Update Course</button>
            </div><div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div></form>`;
        var temp = $compile(htmlText)($scope);
        angular.element(contentBody).append(temp);
    }
    $scope.updateCourse = function () {
        var updateCoursePromise=$scope.getData($scope.getCoursesApiUrl, 'courses');
        updateCoursePromise.then(function(response){
            courseList = response.data;
            var result = $scope.populateCourseSelect(response);
            $scope.displayUpdateCourseForm(result);
        });

    }
    $scope.populateValue = function () {
        var courseCode = document.getElementById('courseCodeList').value;
        var courseCodeTxt = document.getElementById('courseCodeTxt');
        var courseNameTxt = document.getElementById('courseDescriptionTxt');
        if (courseCode == 'Select...') {
            alert('Please select courseCode');
        }
        else {
            courseList.forEach(function (course) {
                if (course['courseCode'] == courseCode) {
                    courseCodeTxt.value = course['courseCode'];
                    courseNameTxt.value = course['courseName'];
                }
            });
        }

    }
    $scope.deleteCourse = function () {
        var deleteCoursePromise=$scope.getData($scope.getCoursesApiUrl);
        deleteCoursePromise.then(function(response){
            courseList = response.data;
            var result = $scope.populateCourseSelect(response);
            $scope.displayDeleteCourseForm(result);
        })
    }
    $scope.displayDeleteCourseForm = function (couseListSelect) {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var htmlText = `<form class="form-group" style="align-content: center">
            <div class="form-row"> <div class="col-4"></div><div><h4>Delete a Course</h4></div> </div><p></p>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Course Name:</label>
            <select class="form-control col-3" id="courseCodeList" onchange="populateValue()" style="min-width:200px"><option>Select...</option>${couseListSelect}</select></div><p></p>
            <div class="form-row">  <div class="col-2"></div> <label class="col-2">Course Code:</label>
            <input type="text" class="form-control col-3" id="courseCodeTxt" ng-model="courseCode"disabled="disabled" > </div> <p></p>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Course Name:</label>
            <input type="text" class="form-control col-3" disabled="disabled" id="courseDescriptionTxt"ng-model="courseDescription"></div> <p></p> 
            <div class="form-row"><div class="col-4"></div><button id="deleteCourseBtn" ng-click="deleteCourseData()" class="btn btn-primary">Delete Course</button>
            </div><div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div></form>`;
        var temp = $compile(htmlText)($scope);
        angular.element(contentBody).append(temp);
    }
    $scope.searchCourse = function () {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var searchHTML = `<div class="form-row"><div class="col-2"></div><label class="col-2">Enter Course Code:</label><input type="text" id="searchId" class="form-control col-3">
        <button id="submitForSearch" class="btn btn-primary col-2" ng-click="search('course')">Search</button></div><div id="searchResult"></div>
        <div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div>`;
        var temp = $compile(searchHTML)($scope);
        angular.element(contentBody).append(temp);
    }
    $scope.search = function (searchType) {
        var searchResult = document.getElementById("searchResult");
        searchResult.innerHTML = "";
        var searchText = document.getElementById('searchId').value;
        var displayElement = "";
        var displayHtml = function () {
            return `<div class="form-row"></div><div class="form-row"><div class="col-4"></div><div class="panel panel-primary">
            <div class="panel-heading"></div><div class="panel-body">${displayElement}</div></div></div>`;
        }

        if (searchType == "student") {
            var apiUrl='http://localhost:8304/api/registration-service/rest/service/students/' + searchText;
            var getStudentPromise=$scope.getData(apiUrl);
            getStudentPromise.then(function(response){
                displayRestult(response, searchType);
            }).catch(function(error){
                displayElement += 'No Result found'
                searchResult.innerHTML = displayHtml();
            }); 
        }  
        if (searchType == "course") {
            var apiUrl='http://localhost:8304/api/registration-service/rest/service/courses/' + searchText;
            var getCoursePromise=$scope.getData(apiUrl);
            getCoursePromise.then(function(response){
                displayRestult(response, searchType);
            }).catch(function(error){
                displayElement += 'No Result found';
                searchResult.innerHTML = displayHtml();
            });
       
        }
        function displayRestult(response, requestedData) {
            var result = response.data;
            if (requestedData == 'student') {
                var registrationId = result['registrationId'];
                var firstName = result['fName'];
                var lastName = result['lName'];
                var registeredCourses = result['courseList'];

                displayElement += `<p><h6>Registration Id:</h6>${registrationId}<p><h6>First Name:</h6>${firstName}</p>
               <p><h6>Last Name:</h6>${lastName}</p><ul><h5>Registered Courses</h5>`;
                for (var i in registeredCourses) {
                    displayElement += '<li>' + registeredCourses[i].courseCode + ':' + registeredCourses[i].courseName + '</li>'
                }
                displayElement += '</ul>';
                searchResult.innerHTML = displayHtml();
            }
            if (requestedData == 'course') {
                var course = response.data;
                var courseCode = course['courseCode'];
                var courseName = course['courseName'];

                displayElement += `<p><h6>Course Code:</h6> ${courseCode}</p><p><h6>Course Name:</h6>${courseName}</p>`
                searchResult.innerHTML = displayHtml();
            }
        }
    }

    $scope.searchStudent = function () {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var searchHTML = `<div class="form-row"><div class="col-2"></div><label class="col-2">Enter Registration Id:</label><input type="text" id="searchId" class="form-control col-3">
        <button id="submitForSearch" class="btn btn-primary col-2" ng-click="search('student')">Search</button></div><div id="searchResult"></div>
        <div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div>`;
        var temp = $compile(searchHTML)($scope);
        angular.element(contentBody).append(temp);
    }

    $scope.updateStudentRecord = function () {

        var courseSelectPromise =$scope.getData($scope.getCoursesApiUrl);
        var studentSelectPromise = $scope.getData($scope.getStudentsApiUrl);
        Promise.all([courseSelectPromise, studentSelectPromise]).then(function(values){
            var courseSelecResponse=values[0];
            var studentSelectResponse=values[1];

            studentsList = studentSelectResponse.data;
            courseList=courseSelecResponse.data;
            var studentSelectHtml = $scope.populateStudentIdSelect(studentSelectResponse);
            var courseSelectHtml=$scope.populateCourseSelect(courseSelecResponse);
            $scope.displayStudentUpdateForm(studentSelectHtml, courseSelectHtml);
        });
    }

    $scope.displayStudentUpdateForm = function (selectIdHtml, selectCourseHtml) {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var updateContent = `<form class="form-group" style="align-content: center">
            <div class="form-row"><div class="col-4"></div><div><h4>Update Student Record</h4></div></div><p></P>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Registration_Id:</label><select class="form-control col-3" id="regIdList" style="min-width:200px" onchange="populateForm(this)"><option>Select Id...</option>
            ${selectIdHtml}</select></div><p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Registration_Id:</label><input type="text" class="form-control col-3" id="txtRegistrationId" disabled="disabled" ng-model="fname"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">First Name:</label><input type="text" class="form-control col-3" id="fname"ng-model="fname"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Last Name:</label> <input type="text" ng-model="lname" id="lname" class="form-control col-3"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Registered Courses:</label><textarea id="textArea" disabled="disabled" class="col-3"></textarea></div><p></p>
            <div class="form-row"> <div class="col-2"></div> <label class="col-2">Add Courses:</label><select multiple class="form-control col-3" id="couseListMultiSelect" ng-model="courseList">
            ${selectCourseHtml}</select></div> <p></p> 
            <div class="form-row"><div class="col-4"></div><button id="studentUpdateBtn" class="btn btn-primary" ng-click="submitForUpdate();">Update</button> </div>
            <div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div></form>`;
        var temp = $compile(updateContent)($scope);
        angular.element(contentBody).append(temp);
    }

    $scope.deleteStudentRecord = function () {
        var getStudentPromise=$scope.getData($scope.getStudentsApiUrl);
        getStudentPromise.then(function(value){
            studentsList=value.data;
            var result=$scope.populateStudentIdSelect(value);
            $scope.displayStudentDeleteForm(result);
        }).catch(function(error){
            $scope.displayStudentDeleteForm('<option>No Student List</option>');
        });
    }
   $scope.displayStudentDeleteForm=function(selectIdHtml) {
            var contentBody = document.getElementById("contentBody");
            contentBody.innerHTML = "";
            var deleteHtml = `<form class="form-group" style="align-content: center">
            <div class="form-row"><div class="col-4"></div><div><h4>Delete Student Record</h4></div></div><p></P>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Registration_Id:</label><select class="form-control col-3" id="regIdList" style="min-width:200px" onchange="populateForm(this)"><option>Select Id...</option>
            ${selectIdHtml}</select></div><p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Registration_Id:</label><input type="text" class="form-control col-3" id="txtRegistrationId" disabled="disabled" ng-model="fname"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">First Name:</label><input type="text" disabled="disabled" class="form-control col-3" id="fname"ng-model="fname"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Last Name:</label> <input type="text" disabled="disabled" id="lname" ng-model="lname" class="form-control col-3"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Registered Courses:</label><textarea ng-model="courseListTextArea" id="textArea" disabled="disabled" class="col-3"></textarea></div><p></p> 
            <div class="form-row"><div class="col-4"></div><button id="studentDeleteBtn" class="btn btn-primary" ng-click="deleteStudent();">Delete Record</button> </div>
            <div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div></form>`;
            var temp = $compile(deleteHtml)($scope);
            angular.element(contentBody).append(temp);
        }

    $scope.generateStudentRegistrationForm = function () {
        var selectCourseHtml = '';
        var getCoursePromise=$scope.getData($scope.getCoursesApiUrl)
        getCoursePromise.then(function(value){
          var result=getCourseSelectOptions(value);
            $scope.displayStudentRegistrationForm(result);
        }).catch(function(error){
            $scope.displayStudentRegistrationForm('<option value="-1">No course List..</option>');
        });
       
        function getCourseSelectOptions(response) {
            var courseList = response.data;
            for (var i in courseList) {
                selectCourseHtml += '<option value=' + courseList[i].courseCode + '>' + courseList[i].courseName + '</option>'
            }
            return selectCourseHtml;
        }   
    }
  $scope.displayStudentRegistrationForm=function(selectCourseHtml) {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var displayHtml=`<form class="form-group" style="align-content: center">
            <div class="form-row"><div class="col-4"></div><div><h4>Student Registration Form</h4></div></div><p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">Registration_Id:</label><input type="text" class="form-control col-3" id="txtRegistrationId" ng-model="registrationId"></div> <p></p>
            <div class="form-row"><div class="col-2"></div><label class="col-2">First Name:</label><input type="text" class="form-control col-3" id="fname"ng-model="fname"></div> <p></p>
            <div class="form-row"> <div class="col-2"></div><label class="col-2">Last Name:</label> <input type="text" class="form-control col-3" id="lname" ng-model="lname"></div> <p></p> 
            <div class="form-row"> <div class="col-2"></div> <label class="col-2">Add Courses:</label></div> <p></p> 
            <div class="form-row"><div class="col-4"></div><select multiple class="form-control col-3" id="couseListMultiSelect" ng-model="courseList">${selectCourseHtml}</select></div> <p></p> 
            <div class="form-row"><div class="col-4"></div><button id="studentRegisterationBtn" ng-click="saveData()" class="btn btn-primary">Register</button> </div>
           <div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div></form>`;
        var temp = $compile(displayHtml)($scope);
        angular.element(contentBody).append(temp);
        }
    $scope.generateCourseRegistrationForm = function () {
        var contentBody = document.getElementById("contentBody");
        contentBody.innerHTML = "";
        var courseRegistrationForm = `<form class="form-group" style="align-content: center">
            <div class="form-row"> <div class="col-4"></div><div><h4>Course Registration Form</h4></div> </div><p></p> 
            <div class="form-row">  <div class="col-2"></div> <label class="col-2">Course Code:</label><input type="text" class="form-control col-3" id="courseCodeTxt" ng-model="courseCode"> </div> <p></p>
            <div class="form-row"><div class="col-2"></div> <label class="col-2">Course Description:</label><input type="text" class="form-control col-3" id="courseNameTxt"ng-model="courseDescription"></div> <p></p> <div class="form-row"><div class="col-4"></div>
            <button id="courseRegisterationBtn" class="btn btn-primary" ng-click="addCourse()">Add Course</button></div>
            <div class="form-row"><div class="col-2"></div><span id="successMessage" class="text-success"></span><span id="failureMessage" class="text-warning"></span></div></form>`;
        var temp = $compile(courseRegistrationForm)($scope)
        angular.element(contentBody).append(temp);
    }
    $scope.displaySuccessMessage = function (message) {
        var messagePlace = document.getElementById("successMessage");
        message.innerHTML = "";
        messagePlace.innerHTML = message;
    }
    $scope.onLoginButtonClick = function () {

        var datatosend = {

            "password": $scope.password,
            "userName": $scope.userName
        };
        var user = JSON.stringify(datatosend);

        var req = {
            method: 'POST',
            url: 'http://localhost:8304/api/registration-service/rest/service/user/isAuthorized',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: user
        }

        $http(req)
            .then(function (response) {
                if (response.data === true) {
                    $window.location.href = 'file:///D:/BefrduGebreamlack-codingExercise/Front_End/registration.html';
                }
                else {
                    $scope.message = "Invalid login credintial! Try again";
                    $scope.userName = "";
                    $scope.password = "";
                }

            })
            .catch(function (response) {
                alert("ERROR");
                $scope.userName = "";
                $scope.password = "";
            });
    }

    $scope.submitForUpdate = function () {
        console.log("Inside submitForUpdate");
        var multiSelect = document.getElementById('couseListMultiSelect');
        var orgRegistrationIdSelect = document.getElementById('regIdList');
        var orgRegistrationId = orgRegistrationIdSelect.options[orgRegistrationIdSelect.selectedIndex].text
        var selectedCourses = [];
        var course;
        var studentForUpdate;
        var registrationId = document.getElementById('txtRegistrationId').value;
        var firstName = document.getElementById('fname').value;
        var lastName = document.getElementById('lname').value;
        for (var i = 0; i < multiSelect.selectedOptions.length; i++) {
            course = {
                "courseCode": multiSelect.selectedOptions[i].value,
                "courseName": multiSelect.selectedOptions[i].text
            }
            selectedCourses.push(course);
        }
        studentForUpdate = {
            "registrationId": registrationId,
            "fName": firstName,
            "lName": lastName,
            "courseList": selectedCourses

        }
        var apiURI = 'http://localhost:8304/api/registration-service/rest/service/students/update/' + orgRegistrationId
        postForUpdate(studentForUpdate, apiURI);
    }
    $scope.saveData = function () {
        var multiSelect = document.getElementById('couseListMultiSelect');
        var selectedCourses = [];
        var course;
        var studentToBeSaved;
        var registrationId = document.getElementById('txtRegistrationId').value;
        var firstName = document.getElementById('fname').value;
        var lastName = document.getElementById('lname').value;
        for (var i = 0; i < multiSelect.selectedOptions.length; i++) {
            course = {
                "courseCode": multiSelect.selectedOptions[i].value,
                "courseName": multiSelect.selectedOptions[i].text
            }
            selectedCourses.push(course);
        }
        studentToBeSaved = {
            "registrationId": registrationId,
            "fName": firstName,
            "lName": lastName,
            "courseList": selectedCourses

        }
        var apiURI = 'http://localhost:8304/api/registration-service/rest/service/students/add/'
        postForUpdate(studentToBeSaved, apiURI);
    }
    function postForUpdate(datatosend, apiURI) {
        var postData = JSON.stringify(datatosend);
        var req = {
            method: 'POST',
            url: apiURI,
            transformResponse: undefined,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: postData
        }
        $http(req)
            .then(function (response) {
                $scope.displaySuccessMessage(response.data);
                $scope.clearData();
            }).catch(function (error) {
                console.log(error);
            })
    }
    $scope.addCourse = function () {
        var courseCode = document.getElementById('courseCodeTxt').value;
        var courseName = document.getElementById('courseNameTxt').value
        var course = {
            "courseCode": courseCode,
            "courseName": courseName
        }
        var courseToBeSaved = JSON.stringify(course);
        var req = {
            method: 'POST',
            transformResponse: undefined,
            url: 'http://localhost:8304/api/registration-service/rest/service/courses/add/',
            headers: {
                'Accept': 'application/json',
            },
            data: courseToBeSaved
        }
        $http(req)
            .then(function (response) {
                $scope.displaySuccessMessage(response.data);
                $scope.clearData();
            }).catch(function (error) {
                console.log(error);
                $scope.clearData();
            });
    }
    $scope.updateCourseData = function () {
        var courseCode = document.getElementById('courseCodeTxt').value;
        var courseName = document.getElementById('courseDescriptionTxt').value;
        var course = {
            "courseCode": courseCode,
            "courseName": courseName
        }
        var datatosend = JSON.stringify(course);
        var req = {
            method: 'POST',
            url: 'http://localhost:8304/api/registration-service/rest/service/courses/update',
            transformResponse: undefined,
            headers: {
                'Accept': 'application/json'
            },
            data: datatosend
        }
        $http(req).then(function (response) {
            $scope.displaySuccessMessage(response.data);
            document.getElementById('courseCodeList').selectedIndex = "0";
            $scope.clearData();
        }).catch(function (error) {
            console.log("Exception thrown")
            document.getElementById('courseCodeList').selectedIndex = "0";
        })
    }
    $scope.deleteCourseData = function () {
        var courseCode = document.getElementById('courseCodeTxt').value;
        var req = {
            method: 'DELETE',
            url: 'http://localhost:8304/api/registration-service/rest/service/courses/delete/' + courseCode,
            transformResponse: undefined,
            headers: {
                'Accept': 'application/json'
            }
        }
        $http(req).then(function (response) {
            $scope.displaySuccessMessage(response.data);
            document.getElementById('regIdList').selectedIndex = "0";
            $scope.clearData();
        }).catch(function (error) {
            console.log("Exception thrown")
            document.getElementById('regIdList').selectedIndex = "0";
            $scope.clearData();
        })
    }
    $scope.deleteStudent = function () {
        var registrationId = document.getElementById('txtRegistrationId').value;
        var req = {
            method: 'DELETE',
            url: 'http://localhost:8304/api/registration-service/rest/service/students/delete/' + registrationId,
            transformResponse: undefined,
            headers: {
                'Accept': 'application/json'
            }
        }
        $http(req).then(function (response) {
            $scope.displaySuccessMessage(response.data);
            $scope.clearData();
        }).catch(function (error) {
            console.log("Exception thrown")
        })
    }

});