package com.microservice.registration.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.microservice.registration.dao.CourseRegistrationDAO;
import com.microservice.registration.dao.StudentRegistrationDAO;
import com.microservice.registration.model.Course;
import com.microservice.registration.model.Student;
/**
 * 
 * @author Befrdu
 * Registration service class for the registration-db microservice
 * perform Course and Student CRUD. The two REST APIs' used this service class, to 
 * interact with the database. 
 * Contain methods
 * 		addStudent(Student students)
 * 		getAllStudent()
 * 		deleteStudent(String studentId)
 * 		getStudent(String studentId)
 * 
 * 		getAllCourse()
 * 		addCourse(Course course)
 * 		getCourse(String courseCode)
 * 		deleteCourse(String courseCode);
 *
 */
@Service
public class RegistrationService {
	@Autowired
	private CourseRegistrationDAO courseRegistrationDAO;
	@Autowired
	private StudentRegistrationDAO studentRegistrationDAO;

	public String addStudent(Student student) {
		if(student.getRegistrationId()==null 
				|| StringUtils.isEmpty(student.getRegistrationId())){
			return "Student must have valid registration Id ";
		}
		Student existingStudent = studentRegistrationDAO.findByRegistrationId(student.getRegistrationId());
		if(existingStudent!=null){
			return "Student with "+student.getRegistrationId()+" is alread Existed in the System";
		}
		studentRegistrationDAO.save(student);
		return student.getfName() + " is added into the DB";
	}

	public List<Student> getAllStudent() {

		return studentRegistrationDAO.findAll();
	}

	public String deleteStudent(String studentId) {
		try {
			Student student=studentRegistrationDAO.findByRegistrationId(studentId);
			studentRegistrationDAO.delete(student);
		} catch (Exception e) {
			e.printStackTrace();
			return "Unable to Delete\n"+e.getMessage();
		}

		return "Student having registration_id "+studentId+" is delleted successfully!";
	}

	public Student getStudent(String registrationId) {
		return studentRegistrationDAO.findByRegistrationId(registrationId);

	}

	public Course getCourse(String courseCode) {
		return courseRegistrationDAO.findByCourseCode(courseCode);
	}

	public List<Course> getAllCourse() {
		return courseRegistrationDAO.findAll();
	}

	public String addCourse(Course course) {
		if(course.getCourseCode()==null
				|| StringUtils.isEmpty(course.getCourseCode())){
			return "Course should have, courseCode!";
		}
		Course existingCourse=courseRegistrationDAO.findByCourseCode(course.getCourseCode());
		if(existingCourse!=null){
			return "Course with courseCode "+course.getCourseCode()+" is already Exist!";
		}
		courseRegistrationDAO.save(course);
		return course.getCourseCode() + " course is added into the database";
	}

	public String deleteCourse(String courseCode) {
		try {
			Course course=courseRegistrationDAO.findByCourseCode(courseCode);
			courseRegistrationDAO.delete(course);
		} catch (Exception e) {
			e.printStackTrace();
			return "Unable to delete\n"+e.getMessage();
		}
		return courseCode+" is Deleted successfully!";
	}
	private List<Course> removeDuplicateCourseFromList(List<Course> courseList){
		int numberOfElement=courseList.size();
		for(int i=0;i<numberOfElement;i++){
			for(int j=i+1;j<numberOfElement;j++){
				if(courseList.get(i).equals(courseList.get(j))){
					courseList.remove(j);
					numberOfElement-=1;
				}
			}
		}
		return courseList;
	}
	
	public String updateStudentRecord(String studentId, Student newStudent){
		try{
		Student existingStudent=getStudent(studentId);
		if(!(StringUtils.isEmpty(newStudent.getRegistrationId()))){
			existingStudent.setRegistrationId(newStudent.getRegistrationId());
		}
		existingStudent.setfName(newStudent.getfName());
		existingStudent.setlName(newStudent.getlName());
		List<Course>allCourses=newStudent.getCourseList();
		allCourses.addAll(existingStudent.getCourseList());
		existingStudent.setCourseList(removeDuplicateCourseFromList(allCourses));
		studentRegistrationDAO.save(existingStudent);
		}catch(Exception e){
			return "Couldn't update student record\n"+e.getMessage();
		}
		return "Student Record is updated!";
	}
   public String updateCourse(Course course){
	   System.out.print("course"+course);
	   try{
	   Course courseForUpdate=courseRegistrationDAO.findOne(course.getCourseCode());
	   courseForUpdate.setCourseName(course.getCourseName());
	   courseRegistrationDAO.save(courseForUpdate);
	   return course.getCourseCode()+" record is updated";
	   }catch(Exception e){
		   e.printStackTrace();
		   return course.getCourseCode()+" is not updated because\n"+e.getMessage();
	   }
	   
   }

}
