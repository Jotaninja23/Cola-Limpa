package com.colalimpa.exception;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void shouldHandleResourceNotFoundException() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Recurso não encontrado com id: 1");

        ProblemDetail problem = exceptionHandler.handleResourceNotFound(ex);

        assertThat(problem.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(problem.getTitle()).isEqualTo("Recurso não encontrado");
        assertThat(problem.getDetail()).isEqualTo("Recurso não encontrado com id: 1");
    }

    @Test
    void shouldHandleBusinessRuleException() {
        BusinessRuleException ex = new BusinessRuleException("Regra de negócio violada.");

        ProblemDetail problem = exceptionHandler.handleBusinessRule(ex);

        assertThat(problem.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problem.getTitle()).isEqualTo("Violação de regra de negócio");
        assertThat(problem.getDetail()).isEqualTo("Regra de negócio violada.");
    }

    @Test
    void shouldHandleMethodArgumentNotValidException() throws NoSuchMethodException {
        BindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "usuarioRequest");
        bindingResult.addError(new FieldError("usuarioRequest", "nome", "não deve estar em branco"));

        Method method = getClass().getDeclaredMethod("shouldHandleMethodArgumentNotValidException");
        MethodParameter parameter = new MethodParameter(method, -1);
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(parameter, bindingResult);

        ProblemDetail problem = exceptionHandler.handleValidation(ex);

        assertThat(problem.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problem.getTitle()).isEqualTo("Dados inválidos");

        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) problem.getProperties().get("erros");
        assertThat(errors).containsEntry("nome", "não deve estar em branco");
    }

    @Test
    void shouldHandleGenericException() {
        Exception ex = new RuntimeException("Erro inesperado");

        ProblemDetail problem = exceptionHandler.handleGenericException(ex);

        assertThat(problem.getStatus()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
        assertThat(problem.getTitle()).isEqualTo("Erro interno");
        assertThat(problem.getDetail()).isEqualTo("Ocorreu um erro interno inesperado no servidor.");
    }
}

