package com.microservice.registration.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.registration.model.User;

public interface LogInDAO extends JpaRepository<User, Integer> {
	User findByUserName(String userName);
}
