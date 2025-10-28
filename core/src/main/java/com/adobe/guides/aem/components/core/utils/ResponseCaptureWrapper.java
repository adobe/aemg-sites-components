package com.adobe.guides.aem.components.core.utils;

import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.wrappers.SlingHttpServletResponseWrapper;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;

/**
 * Response wrapper that captures the output written to the response.
 * This is used to capture the HTML output from servlet includes,
 * specifically for rendering Image components and capturing their markup.
 * 
 * This wrapper can handle both getWriter() and getOutputStream() calls,
 * though typically only getWriter() is used in Sling/AEM contexts.
 */
public class ResponseCaptureWrapper extends SlingHttpServletResponseWrapper {
    
    private final StringWriter stringWriter;
    private final PrintWriter printWriter;
    private final ByteArrayOutputStream byteArrayOutputStream;
    private ServletOutputStream servletOutputStream;
    
    private boolean writerUsed = false;
    private boolean outputStreamUsed = false;
    
    /**
     * Creates a new response wrapper that captures output
     * 
     * @param wrappedResponse the response to wrap
     */
    public ResponseCaptureWrapper(SlingHttpServletResponse wrappedResponse) {
        super(wrappedResponse);
        this.stringWriter = new StringWriter();
        this.printWriter = new PrintWriter(stringWriter);
        this.byteArrayOutputStream = new ByteArrayOutputStream();
    }
    
    /**
     * Returns a PrintWriter that captures all written content
     * 
     * @return PrintWriter that writes to internal StringWriter
     */
    @Override
    public PrintWriter getWriter() throws IOException {
        if (outputStreamUsed) {
            throw new IllegalStateException("getOutputStream() has already been called on this response");
        }
        writerUsed = true;
        return printWriter;
    }
    
    /**
     * Returns a ServletOutputStream that captures all written content
     * This is rarely used in Sling/HTL contexts but provided for completeness
     * 
     * @return ServletOutputStream that writes to internal ByteArrayOutputStream
     */
    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        if (writerUsed) {
            throw new IllegalStateException("getWriter() has already been called on this response");
        }
        outputStreamUsed = true;
        
        if (servletOutputStream == null) {
            servletOutputStream = new ServletOutputStream() {
                @Override
                public void write(int b) throws IOException {
                    byteArrayOutputStream.write(b);
                }
                
                @Override
                public boolean isReady() {
                    return true;
                }
                
                @Override
                public void setWriteListener(WriteListener writeListener) {
                    // No-op for our use case
                }
            };
        }
        
        return servletOutputStream;
    }
    
    /**
     * Gets the captured output as a String
     * This method flushes the writers to ensure all content is captured
     * 
     * @return the captured output
     */
    public String getCapturedOutput() {
        // Flush to ensure all content is written
        if (writerUsed) {
            printWriter.flush();
            return stringWriter.toString();
        } else if (outputStreamUsed) {
            try {
                servletOutputStream.flush();
                return byteArrayOutputStream.toString(StandardCharsets.UTF_8.name());
            } catch (IOException e) {
                return "";
            }
        }
        return "";
    }
    
    /**
     * Resets the capture buffer
     * Useful if you want to reuse the wrapper
     */
    public void resetBuffer() {
        stringWriter.getBuffer().setLength(0);
        byteArrayOutputStream.reset();
    }
}

