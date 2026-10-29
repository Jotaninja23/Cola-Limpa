package com.colalimpa.service.impl;

import com.colalimpa.service.EmailSenderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "colalimpa.mail.smtp.enabled", havingValue = "true")
public class SmtpEmailSenderService implements EmailSenderService {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailSenderService.class);

    @Override
    public void enviarCodigoAcesso(String emailDestinatario, String codigo) {
        log.info("Despachando e-mail SMTP para {} com código OTP {}", emailDestinatario, codigo);
    }
}

