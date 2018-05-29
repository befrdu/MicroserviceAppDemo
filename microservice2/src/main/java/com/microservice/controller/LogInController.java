package com.microservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.microservice.model.User;
@RestController
@RequestMapping("rest/service/user")
public class LogInController {
	private static final String course_registration_db_url = "http://registration-db/rest/db/user";
	@Autowired
	RestTemplate restTemplate;
	@PostMapping("/isAuthorized")
	public boolean isAuthorized(@RequestBody User user){
		HttpHeaders headers=new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		Map<String,Object>payLoad=new HashMap<String, Object>();
		payLoad.put("user", user);
		
		ResponseEntity<Boolean>isAuthorized= restTemplate.postForEntity(
				course_registration_db_url+"/login", user, Boolean.class);
		return isAuthorized.getBody();
	}
	@PostMapping("/add")
	public Map<String, String> addUser(@RequestBody User user){
		
		ResponseEntity<Map>response=restTemplate.postForEntity(
				course_registration_db_url+"/add", user,Map.class);
		
		Map<String, String>result=(Map<String, String>)response.getBody();
		
		return result;
		
	}
}
