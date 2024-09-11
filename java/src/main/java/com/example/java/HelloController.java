package com.example.java;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    private static final Tracer tracer = GlobalOpenTelemetry.getTracer("java-service");
    private final Logger logger = LoggerFactory.getLogger(getClass().getName());
    private final HelloService service;

    public HelloController(HelloService service) {
        this.service = service;
    }

    @GetMapping("/hello")
    public String sayHi(){
        // Simple log
        logger.info("Called say hi");
        // Custom log
        logger.atInfo().setMessage("Hello structured logging!").addKeyValue("userId", "1").log();
        return service.getMessage();
    }

}

@Service
class HelloService {

    private final Logger logger = LoggerFactory.getLogger(getClass().getName());

    @WithSpan("HelloService:getMessage")
    public String getMessage() {
        logger.atInfo().setMessage("Called get message").addKeyValue("userId", "1").log();
        return "Hello world";
    }
}
