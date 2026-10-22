package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import javax.jcr.Node;
import javax.jcr.Session;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
public class TocListImplTest {

    private static final String SITE_PATH = "/content/output/sites/mysite";
    private static final String CATEGORY_PATH = "/content/mysite/en/kb";
    private static final String PAGE_PATH = CATEGORY_PATH + "/home";
    private static final String TEMPLATE = "/conf/mysite/settings/wcm/templates/kb-content";

    private static final String TOC_JSON = "{\"children\":["
            + "{\"displayName\":\"Getting Started, Basics\",\"outputPath\":\"getting-started.html\",\"active\":true,\"visible\":true,"
            + "\"children\":[{\"displayName\":\"Nested\",\"outputPath\":\"getting-started/nested.html\",\"active\":true,\"visible\":true,\"children\":[]}]},"
            + "{\"displayName\":\"Hidden\",\"outputPath\":\"hidden.html\",\"active\":true,\"visible\":false,\"children\":[]},"
            + "{\"displayName\":\"Topic Head\",\"outputPath\":\"topic-head.html\",\"active\":false,\"children\":[]}"
            + "]}";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @BeforeEach
    public void setUp() {
        context.addModelsForClasses(TocListImpl.class);
    }

    private void createSite(String tocJson) throws Exception {
        context.create().resource(SITE_PATH, "jcr:primaryType", "nt:unstructured");
        context.create().resource(SITE_PATH + "/jcr:content", "jcr:primaryType", "nt:unstructured");
        if (tocJson != null) {
            Session session = context.resourceResolver().adaptTo(Session.class);
            Node node = session.getNode(SITE_PATH + "/jcr:content");
            node.setProperty(TocListImpl.GUIDES_NAVIGATION_PROPERTY, session.getValueFactory()
                    .createBinary(new ByteArrayInputStream(tocJson.getBytes(StandardCharsets.UTF_8))));
            session.save();
        }
    }

    private TocList adaptModel(String sitePath) {
        if (context.pageManager().getPage(CATEGORY_PATH) == null) {
            context.create().page(CATEGORY_PATH, TEMPLATE, "id", "category-page");
        }
        Page page = sitePath == null
                ? context.create().page(PAGE_PATH)
                : context.create().page(PAGE_PATH, TEMPLATE, TocListImpl.SITE_PATH_PROPERTY, sitePath);
        context.currentPage(page);
        context.currentResource(context.create().resource(page.getContentResource().getPath() + "/toclist",
                "sling:resourceType", TocListImpl.RESOURCE_TYPE_V1));
        TocList model = context.request().adaptTo(TocList.class);
        assertNotNull(model);
        return model;
    }

    @Test
    public void shouldReturnOnlyVisibleTopLevelEntries() throws Exception {
        createSite(TOC_JSON);
        String raw = adaptModel(SITE_PATH).getTocList();
        JSONArray result = new JSONArray(raw);

        assertEquals(1, result.length());
        JSONObject first = result.getJSONObject(0);
        assertEquals("Getting Started, Basics", first.getString("title"));
        assertEquals(CATEGORY_PATH + "/getting-started.html", first.getString("url"));
        assertEquals(CATEGORY_PATH + "/getting-started.thumb.480.300.png", first.getString("thumbnail"));
        assertTrue(first.getBoolean("active"));
        assertFalse(first.has("children"));

        assertFalse(raw.contains("Topic Head"));
        assertFalse(raw.contains("Nested"));
        assertFalse(raw.contains("Hidden"));
    }

    @Test
    public void shouldReturnEmptyArrayWhenSitePathMissing() {
        assertEquals("[]", adaptModel(null).getTocList());
    }

    @Test
    public void shouldReturnEmptyArrayWhenSiteNodeMissing() {
        assertEquals("[]", adaptModel("/content/does/not/exist").getTocList());
    }

    @Test
    public void shouldReturnEmptyArrayWhenNavigationPropertyMissing() throws Exception {
        createSite(null);
        assertEquals("[]", adaptModel(SITE_PATH).getTocList());
    }

    @Test
    public void shouldReturnEmptyArrayForInvalidJson() throws Exception {
        createSite("{not valid json");
        assertEquals("[]", adaptModel(SITE_PATH).getTocList());
    }

    @Test
    public void shouldReturnEmptyArrayWhenNoChildren() {
        assertEquals("[]", TocListImpl.buildTopLevelTocList("{}", CATEGORY_PATH + "/"));
    }

    @Test
    public void shouldResolveOutputPathsAgainstCategoryPath() throws Exception {
        String toc = "{\"children\":["
                + "{\"displayName\":\"Sub\",\"outputPath\":\"category/submap.html#anchor\"},"
                + "{\"displayName\":\"Up\",\"outputPath\":\"../other/page.html\"},"
                + "{\"displayName\":\"Absolute\",\"outputPath\":\"/content/abs/page\"},"
                + "{\"displayName\":\"External\",\"outputPath\":\"https://example.com/doc\"}"
                + "]}";
        JSONArray result = new JSONArray(TocListImpl.buildTopLevelTocList(toc, CATEGORY_PATH + "/"));

        assertEquals(CATEGORY_PATH + "/category/submap.html#anchor", result.getJSONObject(0).getString("url"));
        assertEquals(CATEGORY_PATH + "/category/submap.thumb.480.300.png", result.getJSONObject(0).getString("thumbnail"));
        assertEquals("/content/mysite/en/other/page.html", result.getJSONObject(1).getString("url"));
        assertEquals("/content/abs/page.html", result.getJSONObject(2).getString("url"));
        assertEquals("/content/abs/page.thumb.480.300.png", result.getJSONObject(2).getString("thumbnail"));
        assertEquals(3, result.length());
    }

    @Test
    public void shouldUsePageTitleLikeCategoryList() throws Exception {
        String toc = "{\"children\":["
                + "{\"displayName\":\"topic2.dita\",\"outputPath\":\"topic2.html\",\"visible\":true},"
                + "{\"displayName\":\"untitled.dita\",\"outputPath\":\"untitled.html\",\"visible\":true},"
                + "{\"displayName\":\"No Page\",\"outputPath\":\"missing.html\",\"visible\":true},"
                + "{\"displayName\":\"External Link\",\"outputPath\":\"https://example.com\",\"visible\":true}"
                + "]}";
        createSite(toc);
        context.create().page(CATEGORY_PATH, TEMPLATE, "id", "category-page");
        context.create().page(CATEGORY_PATH + "/topic2", TEMPLATE, "Topic Two, Title");
        context.create().resource(CATEGORY_PATH + "/untitled", "jcr:primaryType", "cq:Page");
        context.create().resource(CATEGORY_PATH + "/untitled/jcr:content", "jcr:primaryType", "cq:PageContent");

        JSONArray result = new JSONArray(adaptModel(SITE_PATH).getTocList());

        assertEquals(3, result.length());
        assertEquals("Topic Two, Title", result.getJSONObject(0).getString("title"));
        assertEquals("untitled", result.getJSONObject(1).getString("title"));
        assertEquals("No Page", result.getJSONObject(2).getString("title"));
    }

    @Test
    public void shouldLinkTopicHeadsToFirstInternalDescendantDepthFirst() throws Exception {
        String toc = "{\"children\":["
                + "{\"displayName\":\"Empty Section\",\"outputPath\":null,\"active\":false,\"children\":[]},"
                + "{\"displayName\":\"External Resources\",\"outputPath\":null,\"active\":false,\"children\":["
                + "  {\"displayName\":\"Ext\",\"outputPath\":\"https://example.com\",\"active\":true,\"external\":true}]},"
                + "{\"displayName\":\"Setup\",\"outputPath\":null,\"active\":false,\"children\":["
                + "  {\"displayName\":\"Ext\",\"outputPath\":\"https://example.com\",\"active\":true,\"external\":true},"
                + "  {\"displayName\":\"Hidden\",\"outputPath\":\"hidden.html\",\"visible\":false},"
                + "  {\"displayName\":\"Nested Head\",\"active\":false,\"children\":["
                + "    {\"displayName\":\"Deep\",\"outputPath\":\"deep.html\",\"active\":true}]},"
                + "  {\"displayName\":\"Later\",\"outputPath\":\"later.html\",\"active\":true}]},"
                + "{\"displayName\":\"User Guide\",\"outputPath\":\"user-guide.html\",\"active\":true,\"children\":["
                + "  {\"displayName\":\"Child\",\"outputPath\":\"user-guide/child.html\",\"active\":true}]}"
                + "]}";
        JSONArray result = new JSONArray(TocListImpl.buildTopLevelTocList(toc, CATEGORY_PATH + "/",
                pagePath -> "Page Title"));

        assertEquals(2, result.length());
        JSONObject setup = result.getJSONObject(0);
        assertEquals("Setup", setup.getString("title"));
        assertEquals(CATEGORY_PATH + "/deep.html", setup.getString("url"));
        assertEquals(CATEGORY_PATH + "/deep.thumb.480.300.png", setup.getString("thumbnail"));
        assertTrue(setup.getBoolean("active"));
        JSONObject guide = result.getJSONObject(1);
        assertEquals("Page Title", guide.getString("title"));
        assertEquals(CATEGORY_PATH + "/user-guide.html", guide.getString("url"));
    }

    @Test
    public void shouldExportResourceType() throws Exception {
        createSite(TOC_JSON);
        assertEquals(TocListImpl.RESOURCE_TYPE_V1, ((TocListImpl) adaptModel(SITE_PATH)).getExportedType());
    }
}
