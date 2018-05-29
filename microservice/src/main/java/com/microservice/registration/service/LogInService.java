package com.microservice.registration.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.microservice.registration.dao.LogInDAO;
import com.microservice.registration.model.User;
@Service
public class LogInService {
@Autowired
private LogInDAO logInDAO;
private static String ERROR_CODE="300";
private static String SUCCESS_CODE="200";
private static String STATUS="status";
private static String MESSAGE="message";
private Map<String, String>response=new HashMap<String, String>();

public boolean isAuthorized(User user){
	String password=user.getPassword();
	String userName=user.getUserName();
	if(userName==null 
			|| StringUtils.isEmpty(userName) 
			|| password==null 
			|| StringUtils.isEmpty(password)){
		return false;
	}
	User legalUser=logInDAO.findByUserName(userName);
	
	if(legalUser==null
			|| !password.equals(legalUser.getPassword())){
		return false;
	}
	if(legalUser!=null && password.equals(legalUser.getPassword())){
		return true;
	}
	return false;
}
public Map<String, String> addUser(User user){
	User legalUser=logInDAO.findByUserName(user.getUserName());
	if(legalUser!=null){
		response.put(STATUS,ERROR_CODE);
		response.put(MESSAGE,user.getUserName()+" is already exist");		
		return response;
	}
	if(user.getPassword()==null 
			|| StringUtils.isEmpty(user.getPassword())){
		response.put(STATUS, ERROR_CODE);
		response.put(MESSAGE, "Password is required");
		return response;
	}
	logInDAO.save(user);
	response.put(STATUS, SUCCESS_CODE);
	response.put(MESSAGE, "New login credintial is created");
	return response;
}
public Map<String, String>deleteUser(User user){
	try{
		logInDAO.delete(user);
		response.put(STATUS, SUCCESS_CODE);
		response.put(MESSAGE, "User credintial is deleted");
	}catch(Exception e){
		response.put(STATUS, ERROR_CODE);
		response.put(MESSAGE, "Unable to delete");
	}
	return response;
}
public List<User> getAllUser(){
	return logInDAO.findAll();
}
public Map<String, String>updatePassword(User user){
	User existingUser=logInDAO.findByUserName(user.getUserName());
	if(existingUser==null){
		response.put(STATUS, ERROR_CODE);
		response.put(MESSAGE, "No user registered with "+user.getUserName());
		return response;
	}
	else{
		existingUser.setPassword(user.getPassword());
		logInDAO.save(existingUser);
		response.put(STATUS, SUCCESS_CODE);
		response.put(MESSAGE, "Password is Updated");
		return response;
	}
}
}
