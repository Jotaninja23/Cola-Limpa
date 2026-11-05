package com.colalimpa.service.impl;

import com.colalimpa.service.EmailSenderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "colalimpa.mail.smtp.enabled", havingValue = "true")
public class SmtpEmailSenderService implements EmailSenderService {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailSenderService.class);

    private final JavaMailSender mailSender;

    public SmtpEmailSenderService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void enviarCodigoAcesso(String emailDestinatario, String codigo) {
        log.info("Despachando e-mail SMTP para {} com código OTP {}", emailDestinatario, codigo);
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(emailDestinatario);
                message.setSubject("Cola Limpa — Seu Código de Acesso");
                message.setText("Olá!\n\nSeu código de acesso único para entrar no Cola Limpa é: " + codigo + "\n\nEste código expira em 5 minutos.\nSe você não solicitou este acesso, ignore esta mensagem.");
                mailSender.send(message);
                log.info("E-mail com código OTP enviado com sucesso para {}", emailDestinatario);
            } catch (Exception e) {
                log.error("Falha ao despachar e-mail SMTP para {}: {}", emailDestinatario, e.getMessage());
            }
        }
    }
}
