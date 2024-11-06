package com.adobe.guides.aem.components.core.models;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.junit.jupiter.api.Test;
import io.wcm.testing.mock.aem.junit5.AemContext;
import static org.junit.jupiter.api.Assertions.assertEquals;

import javax.jcr.*;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(AemContextExtension.class)
public class CategoryListImplTest {

    private static final String CONF_PATH_TOKEN = "conf";
    private static final String CONTENT_PATH_TOKEN = "content";
    private static final String TEMPLATE_PATH_TOKEN = "/settings/wcm/templates/kb-content";

    @InjectMocks
    CategoryListImpl categoryListImpl;

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @BeforeEach
    public void classSetup() {
        context.load().json("/Template.json", "/content/Tragopan/en");
    }

    @Test
    public void shouldReturnTemplateNameIfStringHasTemplate() {
        String cqTemplateString = "/conf/Tragopan/en/kb";
        String templateName = categoryListImpl.getTemplateName(cqTemplateString);
        assertEquals("Tragopan", templateName);
    }

    @Test
    public void shouldReturnErrorIfStringIsInvalid() {
        String cqTemplateString = "/en/kb";
        assertThrows(RuntimeException.class,
                () -> {
                    categoryListImpl.getTemplateName(cqTemplateString);
                });
    }

    @Test
    public void shouldReturnEmptyListIfCategoryDoesNotExist() throws RepositoryException {
        Session session = spy(context.resourceResolver().adaptTo(Session.class));
        Workspace workspace = mock(Workspace.class);
        Node node = session.getNode("/content/Tragopan/en/random");
        NodeIterator nodeIter = node.getNodes();
        QueryManager queryManager = mock(QueryManager.class);
        QueryResult queryResult = mock(QueryResult.class);
        Query query = mock(Query.class);
        doReturn(workspace).when(session).getWorkspace();
        when(workspace.getQueryManager()).thenReturn(queryManager);
        when(queryManager.createQuery(any(), any())).thenReturn(query);
        when(query.execute()).thenReturn(queryResult);
        when(queryResult.getNodes()).thenReturn(nodeIter);
        List<String> sessionCategoryList = categoryListImpl.findPagesByTemplate(context.resourceResolver(), "/" + CONTENT_PATH_TOKEN + "/" + "Tragopan");
        List<String> templateCategoryList = new ArrayList<>();
        assertEquals(templateCategoryList, sessionCategoryList);
    }

    @Test
    public void shouldReturnCategoryListIfCategoryExist() throws RepositoryException {
        ResourceResolver resourceResolver = spy(context.resourceResolver());
        Session session = spy(resourceResolver.adaptTo(Session.class));
        doReturn(session).when(resourceResolver).adaptTo(Session.class);
        Workspace workspace = mock(Workspace.class);
        Node node = session.getNode("/content/Tragopan/en/kb");
        NodeIterator nodeIter = node.getNodes();
        QueryManager queryManager = mock(QueryManager.class);
        QueryResult queryResult = mock(QueryResult.class);
        Query query = mock(Query.class);
        doReturn(workspace).when(session).getWorkspace();
        when(workspace.getQueryManager()).thenReturn(queryManager);
        when(queryManager.createQuery(any(), any())).thenReturn(query);
        when(query.execute()).thenReturn(queryResult);
        when(queryResult.getNodes()).thenReturn(nodeIter);
        List<String> sessionCategoryList = categoryListImpl.findPagesByTemplate(resourceResolver, "/" + CONTENT_PATH_TOKEN + "/" + "Tragopan");
        List<String> templateCategoryList = new ArrayList<>();
        templateCategoryList.add("/content/Tragopan/en/kb/category");
        templateCategoryList.add("Category");
        templateCategoryList.add("/content/Tragopan/en/kb/category.thumb.480.300.png");
        assertEquals(templateCategoryList, sessionCategoryList);
    }

}