package com.microservice.registration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.microservice.registration.model.Course;

@Repository
public interface CourseRegistrationDAO extends JpaRepository<Course, String> {
	Course findByCourseCode(String courseCode);
}
