# Sample AEM project template

This is a project template for AEM-based applications. It is intended as a best-practice set of examples as well as a potential starting point to develop your own functionality.

## Modules

The main parts of the template are:

* core: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* it.tests: Java based integration tests
* ui.apps: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, and templates
* ui.content: contains sample content using the components from the ui.apps
* ui.config: contains runmode specific OSGi configs for the project
* ui.frontend: an optional dedicated front-end build mechanism (Angular, React or general Webpack project)
* ui.tests: Selenium based UI tests
* all: a single content package that embeds all of the compiled modules (bundles and content packages) including any vendor dependencies

## Prebuilt packages

Go to <https://github.com/adobe/aemg-sites-components/releases/latest> and download the artifact that matches your AEM target:

| AEM target | Artifact to download |
| --- | --- |
| AEM as a Cloud Service | `guides-components.all-{version}.zip` |
| AEM 6.5 on-prem | `on-prem-guides-components.all-aem6.5-{version}.zip` |
| AEM 6.6 (LTS) | `on-prem-guides-components.all-aem6.6-{version}.zip` |


## How to build locally

To build all the modules run in the project root directory for on-prem:

    mvn clean install -Pclassic


To build all the modules and deploy the `all` package to a local instance of AEM, run in the project root directory the following command:

    mvn clean install -Pclassic -PautoInstallSinglePackage

Or to deploy it to a publish instance, run

    mvn clean install -Pclassic -PautoInstallSinglePackagePublish

Or alternatively

    mvn clean install -Pclassic -PautoInstallSinglePackage -Daem.port=4503

Or to deploy only the bundle to the author, run

    mvn clean install -Pclassic -PautoInstallBundle


## Release Guidelines

When publishing a new release on GitHub, build the appropriate variant for each AEM target and upload the artifacts using the naming convention below. Replace `{version}` with the release version (for example `1.5.1`).

| AEM target | Build command | Source artifact (`all/target/`) | Renamed asset to upload |
| --- | --- | --- | --- |
| AEM as a Cloud Service | `mvn clean install` | `guides-components.all-{version}.zip` | `guides-components.all-{version}.zip` |
| AEM 6.5 on-prem | `mvn clean install -Pclassic` | `guides-components.all-{version}.zip` | `on-prem-guides-components.all-aem6.5-{version}.zip` |
| AEM 6.6 (LTS) | `mvn clean install -Pclassic` (built against the AEM 6.6 LTS WCM Core Components) | `guides-components.all-{version}.zip` | `on-prem-guides-components.all-aem6.6-{version}.zip` |

Steps for cutting a release:

1. Bump the project version in every `pom.xml` (parent, `all`, `core`, `ui.apps`, `ui.apps.structure`, `ui.config`).
2. Open and merge a `dev-to-main-{version}-release` PR from `develop` into `main`.
3. Tag the merge commit on `main` as `v{version}` (for example `v1.5.1`).
4. Build each variant from the tagged commit, rename the output `guides-components.all-{version}.zip` according to the table above, and attach all three variants to the GitHub Release for `v{version}`.


## Testing

There are three levels of testing contained in the project:

### Unit tests

This show-cases classic unit testing of the code contained in the bundle. To
test, execute:

    mvn clean test

### Integration tests

This allows running integration tests that exercise the capabilities of AEM via
HTTP calls to its API. To run the integration tests, run:

    mvn clean verify -Plocal

Test classes must be saved in the `src/main/java` directory (or any of its
subdirectories), and must be contained in files matching the pattern `*IT.java`.

The configuration provides sensible defaults for a typical local installation of
AEM. If you want to point the integration tests to different AEM author and
publish instances, you can use the following system properties via Maven's `-D`
flag.

| Property | Description | Default value |
| --- | --- | --- |
| `it.author.url` | URL of the author instance | `http://localhost:4502` |
| `it.author.user` | Admin user for the author instance | `admin` |
| `it.author.password` | Password of the admin user for the author instance | `admin` |
| `it.publish.url` | URL of the publish instance | `http://localhost:4503` |
| `it.publish.user` | Admin user for the publish instance | `admin` |
| `it.publish.password` | Password of the admin user for the publish instance | `admin` |

The integration tests in this archetype use the [AEM Testing
Clients](https://github.com/adobe/aem-testing-clients) and showcase some
recommended [best
practices](https://github.com/adobe/aem-testing-clients/wiki/Best-practices) to
be put in use when writing integration tests for AEM.

### UI tests

They will test the UI layer of your AEM application using Selenium technology. 

To run them locally:

    mvn clean verify -Pui-tests-local-execution

This default command requires:
* an AEM author instance available at http://localhost:4502 (with the whole project built and deployed on it, see `How to build` section above)
* Chrome browser installed at default location

Check README file in `ui.tests` module for more details.

## ClientLibs

The frontend module is made available using an [AEM ClientLib](https://helpx.adobe.com/experience-manager/6-5/sites/developing/using/clientlibs.html). When executing the NPM build script, the app is built and the [`aem-clientlib-generator`](https://github.com/wcm-io-frontend/aem-clientlib-generator) package takes the resulting build output and transforms it into such a ClientLib.

A ClientLib will consist of the following files and directories:

- `css/`: CSS files which can be requested in the HTML
- `css.txt` (tells AEM the order and names of files in `css/` so they can be merged)
- `js/`: JavaScript files which can be requested in the HTML
- `js.txt` (tells AEM the order and names of files in `js/` so they can be merged
- `resources/`: Source maps, non-entrypoint code chunks (resulting from code splitting), static assets (e.g. icons), etc.

## Maven settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html

## TODO

### LTS version creation

Right now we are picking up the latest version of `core.wcm.components.version` and then we create the package.

**TODO:** Automate the build for LTS as well.

