/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.guides.aem.components.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import com.adobe.cq.wcm.core.components.models.ListItem;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.form.OptionItem;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;
import com.day.cq.i18n.I18n;
import org.jetbrains.annotations.Nullable;

@Model(adaptables = SlingHttpServletRequest.class, adapters = { Search.class,
		ComponentExporter.class }, resourceType = { SearchImpl.RESOURCE_TYPE })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SearchImpl implements Search {

	protected static final String RESOURCE_TYPE = "guides-components/components/searchresult";

	public static final int PROP_RESULTS_SIZE_DEFAULT = 10;
	public static final int PROP_SEARCH_TERM_MINIMUM_LENGTH_DEFAULT = 3;
	public static final String PROP_SEARCH_ROOT_DEFAULT = "/content";
	public static final String PN_TEXT = "text";
	public static final String PN_VALUE = "value";
	public static final String NN_ITEMS = "sortItems";
	public static final String PN_LOAD_MORE_TEXT = "loadMoreText";
	public static final String LOAD_MORE_TEXT_DEFAULT_VALUE = "Load More";
	public static final String PN_NO_RESULT_TEXT = "noResultText";
	public static final String NO_RESULT_TEXT_DEFAULT_VALUE = "No more results";
	public static final String DEFAULT_RESULT_FORMAT = "Showing {count} out of {total} results";
	public static final String DEFAULT_SORT_BY_TITLE = "By";

	@Self
	private SlingHttpServletRequest request;

	@ScriptVariable
	private Page currentPage;

	@ScriptVariable
	private ValueMap properties;
	protected java.util.List<OptionItem> sortOptions;

	@ScriptVariable
	private Style currentStyle;

	private String relativePath;
	private int resultsSize;
	private int searchTermMinimumLength;
	private int guessTotal;
	private I18n i18n;
	protected java.util.List<ListItem> tags;

	@SlingObject
	private Resource resource;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("loadMoreText")
	private String loadMoreText;

	private String resultFormat;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("facetTitle")
	private String facetTitle;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("sortTitle")
	private String sortTitle;
	
	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("sortBy")
	private String sortBy;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("enableSort")
	private boolean enableSort;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("enableFacet")
	private boolean enableFacet;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	private String tagProperty;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	private String noResultText;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("ascendingLabel")
	@Default(values = "ASC")
	private String ascLabel;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("descendingLabel")
	@Default(values = "DESC")
	private String descLabel;

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	@Named("showResultCount")
	private boolean showResultCount;

	@PostConstruct
	private void initModel() {
		if (request != null) {
			i18n = new I18n(request);
		}
		resultsSize = properties.get(PN_RESULTS_SIZE, PROP_RESULTS_SIZE_DEFAULT);
		searchTermMinimumLength = properties.get(PN_SEARCH_TERM_MINIMUM_LENGTH,
				PROP_SEARCH_TERM_MINIMUM_LENGTH_DEFAULT);
		loadMoreText = translate(properties.get(PN_LOAD_MORE_TEXT, LOAD_MORE_TEXT_DEFAULT_VALUE));
		noResultText = translate(properties.get(PN_NO_RESULT_TEXT, NO_RESULT_TEXT_DEFAULT_VALUE));
		resultFormat = translate(properties.get(RESULT_FORMAT, DEFAULT_RESULT_FORMAT));
		sortBy = translate(properties.get(SORT_BY_TITLE, DEFAULT_SORT_BY_TITLE));
		PageManager pageManager = currentPage.getPageManager();
		Resource currentResource = request.getResource();
		if (pageManager != null) {
			Page containingPage = pageManager.getContainingPage(currentResource);
			if (containingPage != null) {
				relativePath = StringUtils.substringAfter(currentResource.getPath(), containingPage.getPath());
			}
		}
	}

	public String translate(String str) {
		return (i18n != null ? i18n.getVar(str) : str);
	}

	public void populateTags() {
		final TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
		tags = new ArrayList<>();
		if (tagManager != null) {
			final Tag[] tagList = tagManager.getTags(resource);
			if (tagList != null) {
				for (final Tag tag : tagList) {
					tags.add(new ListItem() {
						private String tagName = tag.getTagID();
						private String tagTitle = tag.getTitle();

						@Nullable
						@Override
						public String getName() {
							return tagName;
						}

						@Nullable
						@Override
						public String getTitle() {
							return tagTitle;
						}
					});
				}
			}
		}
	}

	public void populateItems() {
		sortOptions = new ArrayList<>();
		Resource childItem = resource.getChild(NN_ITEMS);
		if (childItem != null) {
			childItem.getChildren().forEach(this::addItems);
		}
	}

	private void addItems(Resource res) {
		ValueMap childProperties = res.getValueMap();
		sortOptions.add(new OptionItem() {
			private String text = childProperties.get(PN_TEXT, String.class);
			private String value = childProperties.get(PN_VALUE, String.class);

			@Nullable
			@Override
			public String getText() {
				return text;
			}

			@Nullable
			@Override
			public String getValue() {
				return value;
			}
		});
	}

	@Override
	public List<OptionItem> getSortOptions() {
		if (sortOptions == null) {
			populateItems();
		}
		return sortOptions;
	}

	@Override
	public String getAscLabel() {
		return ascLabel;
	}

	@Override
	public String getDescLabel() {
		return descLabel;
	}

	@Override
	public List<ListItem> getTags() {
		if (tags == null) {
			populateTags();
		}
		return tags;
	}

	@Override
	public String getFacetTitle() {
		return facetTitle;
	}

	@Override
	public String getSortTitle() {
		return sortTitle;
	}

	@Override
	public String getSortBy() {
		return sortBy;
	}

	@Override
	public String getTagProperty() {
		return tagProperty;
	}

	@Override
	public int getResultsSize() {
		return resultsSize;
	}

	@Override
	public String getLoadMoreText() {
		return loadMoreText;
	}

	@Override
	public int getSearchTermMinimumLength() {
		return searchTermMinimumLength;
	}

	@Override
	public String getNoResultText() {
		return noResultText;
	}

	@NotNull
	@Override
	public String getRelativePath() {
		return relativePath;
	}

	@NotNull
	@Override
	public boolean isSortEnabled() {
		return enableSort;
	}

	@NotNull
	@Override
	public boolean isFacetEnabled() {
		return enableFacet;
	}

	@NotNull
	@Override
	public boolean getShowResultCount() {
		return showResultCount;
	}

	@NotNull
	@Override
	public int getGuessTotal() {
		return guessTotal;
	}

	@NotNull
	@Override
	public String getResultFormat() {
		return resultFormat;
	}
}
