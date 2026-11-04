package com.colalimpa.service.impl;

import com.colalimpa.service.EmailSenderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "colalimpa.mail.smtp.enabled", havingValue = "false", matchIfMissing = true)
public class ConsoleEmailSenderService implements EmailSenderService {

    private static final Logger log = LoggerFactory.getLogger(ConsoleEmailSenderService.class);

    @Override
    public void enviarCodigoAcesso(String emailDestinatario, String codigo) {
        log.info("""
                
                ============================================================
                [COLA LIMPA] CÓDIGO DE AUTENTICAÇÃO (DEV / TEST MODE)
                Para: {}
                Código de Acesso: >>> {} <<<
                Validade: 5 minutos
                ============================================================
                """, emailDestinatario, codigo);
    }
}

