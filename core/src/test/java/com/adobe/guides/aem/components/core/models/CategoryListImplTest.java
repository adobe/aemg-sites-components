package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
public class CategoryListImplTest {

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @BeforeEach
    public void classSetup() {
        context.load().json("/Template.json", "/content/Tragopan/en");
    }

    @Test
    public void shouldReturnEmptyJsonWhenNoPagesConfigured() {
        ResourceResolver resolver = context.resourceResolver();
        List<Resource> items = new ArrayList<>();
        String result = CategoryListImpl.buildCategoryListJson(items, resolver);
        assertEquals("[]", result);
    }

    @Test
    public void shouldSkipEntriesWithEmptyPagePath() {
        ResourceResolver resolver = context.resourceResolver();
        context.create().resource("/tmp/items/item0",
                "pagePath", "",
                "redirectPath", "/content/somewhere");

        List<Resource> items = new ArrayList<>();
        items.add(resolver.getResource("/tmp/items/item0"));

        String result = CategoryListImpl.buildCategoryListJson(items, resolver);
        assertEquals("[]", result);
    }

    @Test
    public void shouldSkipEntriesWithInvalidPagePath() {
        ResourceResolver resolver = context.resourceResolver();
        context.create().resource("/tmp/items/item0",
                "pagePath", "/content/nonexistent/page",
                "redirectPath", "");

        List<Resource> items = new ArrayList<>();
        items.add(resolver.getResource("/tmp/items/item0"));

        String result = CategoryListImpl.buildCategoryListJson(items, resolver);
        assertEquals("[]", result);
    }

    @Test
    public void shouldBuildJsonWithConfiguredPages() {
        ResourceResolver resolver = context.resourceResolver();
        context.create().resource("/tmp/items/item0",
                "pagePath", "/content/Tragopan/en/kb/category",
                "redirectPath", "/content/Tragopan/en/kb/category/article1");

        List<Resource> items = new ArrayList<>();
        items.add(resolver.getResource("/tmp/items/item0"));

        String result = CategoryListImpl.buildCategoryListJson(items, resolver);

        assertTrue(result.contains("\"path\":\"/content/Tragopan/en/kb/category\""));
        assertTrue(result.contains("\"title\":\"Category\""));
        assertTrue(result.contains("\"description\":\"\""));
        assertTrue(result.contains("\"thumbnail\":\"/content/Tragopan/en/kb/category.thumb.480.300.png\""));
        assertTrue(result.contains("\"redirectPath\":\"/content/Tragopan/en/kb/category/article1\""));
    }

    @Test
    public void shouldUseEmptyStringWhenNoRedirectConfigured() {
        ResourceResolver resolver = context.resourceResolver();
        context.create().resource("/tmp/items/item0",
                "pagePath", "/content/Tragopan/en/kb/category");

        List<Resource> items = new ArrayList<>();
        items.add(resolver.getResource("/tmp/items/item0"));

        String result = CategoryListImpl.buildCategoryListJson(items, resolver);

        assertTrue(result.contains("\"path\":\"/content/Tragopan/en/kb/category\""));
        assertTrue(result.contains("\"redirectPath\":\"\""));
    }

    @Test
    public void shouldPreserveConfiguredOrder() {
        ResourceResolver resolver = context.resourceResolver();
        context.create().resource("/tmp/items/item0",
                "pagePath", "/content/Tragopan/en/kb/category/article1",
                "redirectPath", "");
        context.create().resource("/tmp/items/item1",
                "pagePath", "/content/Tragopan/en/kb/category",
                "redirectPath", "/content/Tragopan/en");

        List<Resource> items = new ArrayList<>();
        items.add(resolver.getResource("/tmp/items/item0"));
        items.add(resolver.getResource("/tmp/items/item1"));

        String result = CategoryListImpl.buildCategoryListJson(items, resolver);

        int firstIndex = result.indexOf("\"title\":\"First Article\"");
        int secondIndex = result.indexOf("\"title\":\"Category\"");
        assertTrue(firstIndex > -1, "First Article should be present");
        assertTrue(secondIndex > -1, "Category should be present");
        assertTrue(firstIndex < secondIndex, "First Article should come before Category");
    }

    @Test
    public void shouldListDirectChildPagesWhenNoneConfigured() {
        Page parent = context.create().page("/content/auto", "/conf/test/settings/wcm/templates/page", "Auto Root");
        context.create().page("/content/auto/child1", "/conf/test/settings/wcm/templates/page", "Child One");
        context.create().page("/content/auto/child2", "/conf/test/settings/wcm/templates/page", "Child Two");

        String result = CategoryListImpl.buildChildPagesJson(parent);

        assertTrue(result.contains("\"path\":\"/content/auto/child1\""), "Child One should be listed");
        assertTrue(result.contains("\"title\":\"Child One\""));
        assertTrue(result.contains("\"path\":\"/content/auto/child2\""), "Child Two should be listed");
        assertTrue(result.contains("\"title\":\"Child Two\""));
    }

    @Test
    public void shouldUseSelfRedirectForAutoListedChildren() {
        Page parent = context.create().page("/content/auto", "/conf/test/settings/wcm/templates/page", "Auto Root");
        context.create().page("/content/auto/child1", "/conf/test/settings/wcm/templates/page", "Child One");

        String result = CategoryListImpl.buildChildPagesJson(parent);

        assertTrue(result.contains("\"path\":\"/content/auto/child1\""));
        // Empty redirectPath => client JS links each card to its own page.
        assertTrue(result.contains("\"redirectPath\":\"\""));
        assertTrue(!result.contains("\"redirectPath\":\"/"), "Auto-listed children must not carry an explicit redirect");
    }

    @Test
    public void shouldOnlyIncludeDirectChildrenNotGrandchildren() {
        Page parent = context.create().page("/content/auto", "/conf/test/settings/wcm/templates/page", "Auto Root");
        context.create().page("/content/auto/child1", "/conf/test/settings/wcm/templates/page", "Child One");
        context.create().page("/content/auto/child1/grandchild", "/conf/test/settings/wcm/templates/page", "Grand Child");

        String result = CategoryListImpl.buildChildPagesJson(parent);

        assertTrue(result.contains("\"path\":\"/content/auto/child1\""), "Direct child should be listed");
        assertTrue(!result.contains("/content/auto/child1/grandchild"), "Grandchildren must not be flattened in");
    }

    @Test
    public void shouldReturnEmptyJsonWhenPageHasNoChildren() {
        Page parent = context.create().page("/content/auto", "/conf/test/settings/wcm/templates/page", "Auto Root");

        String result = CategoryListImpl.buildChildPagesJson(parent);

        assertEquals("[]", result);
    }

    @Test
    public void shouldEscapeSpecialCharactersInJson() {
        String result = CategoryListImpl.escapeJson("He said \"hello\"\nnew line");
        assertEquals("He said \\\"hello\\\"\\nnew line", result);
    }
}
