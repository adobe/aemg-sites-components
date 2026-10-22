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
import java.util.HashMap;
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
    private final LanguageManager languageManager = mock(LanguageManager.class);
    private int renders;

    @BeforeEach
    public void setUp() {
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

    @Test
    public void shouldRenderLocaleStandardDateForPageLanguage() throws PersistenceException {
        Page page = createPage(Collections.singletonMap(LAST_MODIFIED, SOURCE_DATE));

        assertEquals("10.05.2024", renderIn(Locale.GERMAN, page));
        assertEquals("10 mai 2024", renderIn(Locale.FRENCH, page));
        assertEquals("2024/05/10", renderIn(Locale.JAPANESE, page));
    }

    @Test
    public void shouldHonorAuthoredDateFormat() throws PersistenceException {
        Page page = createPage(Collections.singletonMap(LAST_MODIFIED, SOURCE_DATE));
        when(languageManager.getLanguage(any(Resource.class))).thenReturn(Locale.GERMAN);

        assertEquals("10. Mai 2024", render(page, LAST_MODIFIED, "d. MMMM yyyy"));
    }

    private String renderIn(Locale locale, Page page) {
        when(languageManager.getLanguage(any(Resource.class))).thenReturn(locale);
        return render(page, LAST_MODIFIED);
    }

    private Page createPage(Map<String, Object> contentProps) throws PersistenceException {
        Page page = context.create().page(PAGE_PATH, TEMPLATE, contentProps);
        page.adaptTo(Resource.class).adaptTo(ModifiableValueMap.class).put("jcr:created", CREATED_DATE);
        context.resourceResolver().commit();
        return page;
    }

    private String render(Page page, String property) {
        return render(page, property, null);
    }

    private String render(Page page, String property, String dateFormat) {
        Map<String, Object> props = new HashMap<>();
        props.put("sling:resourceType", PagePropertyImpl.RESOURCE_TYPE_V1);
        props.put("property", property);
        if (dateFormat != null) {
            props.put("dateFormat", dateFormat);
        }
        Resource component = context.create().resource(page.getContentResource().getPath() + "/date" + (++renders), props);
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
