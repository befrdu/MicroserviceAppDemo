package com.microservice.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
@EnableEurekaServer
@SpringBootApplication
@EnableZuulProxy
public class MicroServiceAppServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroServiceAppServerApplication.class, args);
	}
}
