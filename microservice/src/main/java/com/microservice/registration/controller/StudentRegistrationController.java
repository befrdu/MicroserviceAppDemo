package com.microservice.registration.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.registration.model.Student;
import com.microservice.registration.service.RegistrationService;

@RestController
@RequestMapping("rest/db/students")
public class StudentRegistrationController {
	@Autowired
	private RegistrationService registrationService;
	
	@PostMapping("/add")
	public String registerStudent(@RequestBody Student student){
		return registrationService.addStudent(student);
	}
	@GetMapping("/{studentId}")
	public Student getStudent(@PathVariable String studentId){
		return registrationService.getStudent(studentId);
	}
	@DeleteMapping("/delete/{studentId}")
	public String deleteStudent(@PathVariable String studentId){
		return registrationService.deleteStudent(studentId);
	}
	@GetMapping("/")
	public List<Student> getAllStudents(){
		return registrationService.getAllStudent();
	}
	@PostMapping("/update/{studentId}")
	public String updateStudent(@PathVariable String studentId, @RequestBody Student newStudent){
		return registrationService.updateStudentRecord(studentId, newStudent);
	}

}
