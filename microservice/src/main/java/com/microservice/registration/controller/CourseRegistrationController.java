package com.microservice.registration.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.registration.model.Course;
import com.microservice.registration.service.RegistrationService;

@RestController
@RequestMapping("rest/db/courses")
public class CourseRegistrationController {
	@Autowired
	private RegistrationService registrationService;
	
	@GetMapping("/")
	public List<Course>getAllCourse(){
		
		return registrationService.getAllCourse();
	}
	@PostMapping("/add")
	public String saveCourse(@RequestBody Course course){
		return registrationService.addCourse(course);
	}
	@GetMapping("/{courseCode}")
	public Course getCourse(@PathVariable String courseCode){
		return registrationService.getCourse(courseCode);
	}
    @DeleteMapping("/delete/{courseCode}")
    public String deleteCourse(@PathVariable String courseCode){
    	return registrationService.deleteCourse(courseCode);
    }
    @PostMapping("/update")
    public String updateCourse(@RequestBody Course course){
    	return registrationService.updateCourse(course);
    }
}
