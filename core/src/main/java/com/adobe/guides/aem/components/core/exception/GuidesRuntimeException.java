package com.adobe.guides.aem.components.core.exception;

public class GuidesRuntimeException extends RuntimeException {

    public GuidesRuntimeException(String message) {
        super(message);
    }

    public GuidesRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }
}
