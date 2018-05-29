package com.microservice.registration.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.registration.model.User;
import com.microservice.registration.service.LogInService;

@RestController
@RequestMapping("/rest/db/user")
public class LogInController {
	@Autowired
	private LogInService logInService;

	@PostMapping("/login")
	public boolean login(@RequestBody User user) {

		return logInService.isAuthorized(user);
	}

	@PostMapping("/add")
	public Map<String, String> addUser(@RequestBody User user) {

		return logInService.addUser(user);
	}

	@DeleteMapping("/delete")
	public Map<String, String> deleteUser(@RequestBody User user) {

		return logInService.deleteUser(user);
	}

	@GetMapping("/users")
	public List<User> getAllUser() {

		return logInService.getAllUser();
	}
}
