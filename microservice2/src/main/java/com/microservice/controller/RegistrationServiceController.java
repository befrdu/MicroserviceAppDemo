package com.microservice.controller;
/**
 * student and course registration REST API
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import com.microservice.model.Course;
import com.microservice.model.Student;

@RestController
@RequestMapping("/rest/service/")
public class RegistrationServiceController {

	private static final String course_registration_db_url = "http://registration-db/rest/db/courses/";
	private static final String student_registration_db_url = "http://registration-db/rest/db/students/";

	@Autowired
	private RestTemplate restTemplate;
    
	public RegistrationServiceController(){
		
	}
	@GetMapping("/students/{studentId}")
	public Student getStudent(@PathVariable String studentId) {
		Student student = restTemplate.getForObject(student_registration_db_url + studentId, Student.class);
		return student;
	}
	public Student getStudentById(String studentId){
		Student student = restTemplate.getForObject(student_registration_db_url + studentId, Student.class);
		return student;
	}
	@PostMapping("/students/update/{studentId}")
	public String updateStudent(@PathVariable String studentId, @RequestBody Student student){
		String response="";
		
		try{
			ResponseEntity<String>responseText=restTemplate.postForEntity(
					student_registration_db_url+"/update/"+studentId, student, String.class);
			response=responseText.getBody();
		}catch(Exception e){
			response="Student record is not updated because of:\n"+e.getMessage();
		}
		
		return response;
		
	}
	private List<Course> removeDuplicateCourse(List<Course>courses){
		List<Course>nonDuplicateCourse=courses;
		for(int i=0;i<courses.size();i++){
			for(int j=i+1;j<nonDuplicateCourse.size();j++){
				if(nonDuplicateCourse.get(i).equals(courses.get(j))){
					nonDuplicateCourse.remove(j);
				}
			}
		}
		return nonDuplicateCourse;
	}
	@PostMapping("/students/add")
	public String saveOrUpdateStudent(@RequestBody Student student){
		ResponseEntity<String>response=restTemplate.postForEntity(
				student_registration_db_url+"/add", student, String.class);
		return response.getBody();
	}
	@GetMapping("/students")
	public List<Student> getAllStudents() {
		ResponseEntity<Student[]> students = restTemplate.getForEntity(student_registration_db_url, Student[].class);
		return Arrays.asList(students.getBody());
	}
	@DeleteMapping("/students/delete/{studentId}")
	public String deleteStudent(@PathVariable String studentId){
		HttpHeaders headers=new HttpHeaders();
		headers.add("Accept", "application/json");
		HttpEntity<String>request=new HttpEntity<String>(headers);
		ResponseEntity<String>response=restTemplate.exchange(
				student_registration_db_url+"/delete/"+studentId, HttpMethod.DELETE, request, String.class);
		return response.getBody();
	}
	@PostMapping("/courses/add")
	public String saveOrUpdateCourse(@RequestBody Course course){
		ResponseEntity<String>response=restTemplate.postForEntity(
				course_registration_db_url+"/add", course, String.class);
		return response.getBody();
	}
    @DeleteMapping("/courses/delete/{courseCode}")
    public String deleteCourse(@PathVariable String courseCode){
    	HttpHeaders headers=new HttpHeaders();
		headers.add("Accept", "application/json");
		HttpEntity<String>request=new HttpEntity<String>(headers);
		ResponseEntity<String>response=restTemplate.exchange(
				course_registration_db_url+"/delete/"+courseCode, HttpMethod.DELETE, request, String.class);
		return response.getBody();
    }
	@GetMapping("/courses")
	public List<Course> getAllCourses() {

		HttpHeaders header = new HttpHeaders();
		header.add("Accept", "application/json");
		HttpEntity<String> requestEntity = new HttpEntity<String>(header);
		ParameterizedTypeReference<List<Course>> typeRef = new ParameterizedTypeReference<List<Course>>() {
		};
		ResponseEntity<List<Course>> responses = restTemplate.exchange(course_registration_db_url, HttpMethod.GET,
				requestEntity, typeRef);
		return responses.getBody();

	}

	@GetMapping("/courses/{courseCode}")
	public Course getCourse(@PathVariable String courseCode) {
		Course course = restTemplate.getForObject(course_registration_db_url + courseCode, Course.class);
		return course;
	}
    @PostMapping("/courses/update")
    public String updateCourse(@RequestBody Course course){
		ResponseEntity<String> responses = restTemplate.postForEntity(
				course_registration_db_url+"/update", course, String.class);
		return responses.getBody();
    }
    @PutMapping("/students/register/{studentId}")
	public Map<String, String> registerForCourse(@PathVariable String studentId,
			@RequestBody List<String> courseCodes) {

		List<Course> courses = new ArrayList<Course>();
		Map<String, String> response = new HashMap<String, String>();

		Student student = getStudent(studentId);
		if (student == null) {
			response.put(studentId, " Not exist in the database");
			response.put("status", "courses are not added");
			return response;
		}
		for (String courseId : courseCodes) {
			Course course = getCourse(courseId);
			if (course != null) {
				courses.add(course);
			} else {
				response.put(courseId, "Not exist in the database");
			}
		}
		if (courses.size() != 0) {
			courses.addAll(student.getCourseList());
			student.setCourseList(courses);
			response.put("status", studentId + " is registed for courses");
		}
		return response;
	}
	@ExceptionHandler
	public String handleExcepton(Exception e){
		return e.getMessage();
	}

}
