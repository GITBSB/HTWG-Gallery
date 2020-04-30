package de.example.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author michael.meister@siobra.de
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Ensure client-side paths redirect to index.html so client can handle routing.
     * NOTE: Do NOT use @EnableWebMvc or this will break.
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        // Map "/"
        registry.addViewController("/")
                .setViewName("forward:/index.html");

        // Map all urls except for anything starting with "/api/..." or ending with a file extension like ".js" to index.html.
        // By doing this, the client receives the url and can handle routing. This allows client-side URLs to be bookmarked and call directly.

        // Single directory level - no need to exclude "api"
        registry.addViewController("/{x:[\\w\\-]+}")
                .setViewName("forward:/index.html");

        // Multi-level directory path, need to exclude "api" on the first part of the path
        registry.addViewController("/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}")
                .setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/webapp/");

        // Swagger UI
        registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/swagger-ui.html");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

}
