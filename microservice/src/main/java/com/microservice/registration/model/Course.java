package com.microservice.registration.model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

@Entity
public class Course implements Serializable{

	@Id
	private String courseCode;
	private String courseName;
	@ManyToMany(mappedBy="courseList")
	List<Student>students;
	
	public Course(){
		
	}
	public Course(String courseCode, String courseName){
		this.courseCode=courseCode;
		this.courseName=courseName;
	}
	public String getCourseCode() {
		return courseCode;
	}
    
	public void setCourseCode(String courseCode) {
		this.courseCode = courseCode;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((courseCode == null) ? 0 : courseCode.hashCode());
		result = prime * result + ((courseName == null) ? 0 : courseName.hashCode());
		return result;
	}
	@Override
	public String toString() {
		return "Course [courseCode=" + courseCode + ", courseName=" + courseName + "]";
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Course other = (Course) obj;
		if (courseCode == null) {
			if (other.courseCode != null)
				return false;
		} else if (!courseCode.equals(other.courseCode))
			return false;
		if (courseName == null) {
			if (other.courseName != null)
				return false;
		} else if (!courseName.equals(other.courseName))
			return false;
		return true;
	}
	

}
