package com.colalimpa.service;

public interface EmailSenderService {

    void enviarCodigoAcesso(String emailDestinatario, String codigo);
}

