package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.LanguageManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.Calendar;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
public class PagePropertyImplTest {

    private static final String PAGE_PATH = "/content/site/en/topic";
    private static final String TEMPLATE = "/conf/site/settings/wcm/templates/topic-content";
    private static final String LAST_MODIFIED = "jcr:lastModified";
    private static final String DESCRIPTION = "jcr:description";
    private static final Calendar SOURCE_DATE = utcNoon(2024, Calendar.MAY, 10);
    private static final Calendar CREATED_DATE = utcNoon(2026, Calendar.SEPTEMBER, 29);
    private static final String SOURCE_RENDERED = "May 10, 2024";
    private static final String CREATED_RENDERED = "Sep 29, 2026";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @BeforeEach
    public void setUp() {
        LanguageManager languageManager = mock(LanguageManager.class);
        when(languageManager.getLanguage(any(Resource.class))).thenReturn(Locale.ENGLISH);
        context.registerService(LanguageManager.class, languageManager);
        context.addModelsForClasses(PagePropertyImpl.class);
    }

    @Test
    public void shouldRenderLastModifiedWhenPresent() throws PersistenceException {
        Page page = createPage(Collections.singletonMap(LAST_MODIFIED, SOURCE_DATE));

        assertEquals(SOURCE_RENDERED, render(page, LAST_MODIFIED));
    }

    @Test
    public void shouldRenderCreatedDateWhenLastModifiedIsAbsent() throws PersistenceException {
        Page page = createPage(Collections.emptyMap());

        assertEquals(CREATED_RENDERED, render(page, LAST_MODIFIED));
    }

    @Test
    public void shouldRenderEmptyWhenOtherPropertyIsAbsent() throws PersistenceException {
        Page page = createPage(Collections.emptyMap());

        assertEquals("", render(page, DESCRIPTION));
    }

    @Test
    public void shouldRenderStringPropertyVerbatim() throws PersistenceException {
        Page page = createPage(Collections.singletonMap(DESCRIPTION, "About RoboHelp"));

        assertEquals("About RoboHelp", render(page, DESCRIPTION));
    }

    private Page createPage(Map<String, Object> contentProps) throws PersistenceException {
        Page page = context.create().page(PAGE_PATH, TEMPLATE, contentProps);
        page.adaptTo(Resource.class).adaptTo(ModifiableValueMap.class).put("jcr:created", CREATED_DATE);
        context.resourceResolver().commit();
        return page;
    }

    private String render(Page page, String property) {
        Resource component = context.create().resource(page.getContentResource().getPath() + "/date",
                "sling:resourceType", PagePropertyImpl.RESOURCE_TYPE_V1,
                "property", property);
        context.currentPage(page);
        context.currentResource(component);
        return context.request().adaptTo(PageProperty.class).getProperty();
    }

    private static Calendar utcNoon(int year, int month, int day) {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        calendar.clear();
        calendar.set(year, month, day, 12, 0, 0);
        return calendar;
    }
}
