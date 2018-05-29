package com.microservice.registration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.microservice.registration.model.Student;
@Repository
public interface StudentRegistrationDAO extends JpaRepository<Student, Integer> {
	Student findByRegistrationId(String registrationId);
}
