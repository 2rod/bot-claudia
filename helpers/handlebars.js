"use strict";

const hbs = require("koa-hbs");
const config = require("../config.json");

hbs.registerHelper("if_eq", function if_eq(a, b, opts) {
	if (a == b) {
		return opts.fn(this);
	}
	return opts.inverse(this);
});

hbs.registerHelper("copyright_year", (opts) => {
	return new Date().getFullYear();
});

hbs.registerHelper("get_name", (opts) => {
	return config.site.name;
});

hbs.registerHelper("get_analytics", (opts) => {
	if (config.site.analytics) {
		return config.site.analytics;
	}
});

hbs.registerHelper("has_analytics", function has_analytics(opts) {
	const fnTrue = opts.fn;
	const fnFalse = opts.inverse;
	return (config.site.analytics && config.site.analytics !== false) ? fnTrue() : fnFalse();
});

hbs.registerHelper("has_fb_sdk", function has_fb_sdk(opts) {
	const fnTrue = opts.fn;
	const fnFalse = opts.inverse;
	return (config.site.fb_sdk && config.site.fb_sdk.enable !== false) ? fnTrue() : fnFalse();
});

hbs.registerHelper("get_fb_page_name", (opts) => {
	if (config.site.fb_sdk.enable) {
		return config.site.fb_sdk.fb_page_name;
	}
});

hbs.registerHelper("get_fb_page_title", (opts) => {
	if (config.site.fb_sdk.enable) {
		return config.site.fb_sdk.fb_page_title;
	}
});

hbs.registerHelper("get_fb_app_id", (opts) => {
	if (config.site.fb_sdk.enable) {
		return config.site.fb_sdk.fb_app_id;
	}
});

hbs.registerHelper("get_fb_page_id", (opts) => {
	if (config.site.fb_sdk.enable) {
		return config.site.fb_sdk.fb_page_id;
	}
});
