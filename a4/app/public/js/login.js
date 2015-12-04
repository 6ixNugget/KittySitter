var TabModalController = {
    tabsElementName: ".form_toggle",
    tabElementName: ".form_tab",
    inputElementsName: ".form_tab .form_field",

    inputElements: null,
    tabsElement: null,
    tabElement: null,

    activeTab: null,
    tabSelection: 0, // 0 - first, 1 - second

    findElements: function () {
        var base = this;

        base.tabsElement = $(base.tabsElementName);
        base.tabElement = $(base.tabElementName);
        base.inputElements = $(base.inputElementsName);
        return base;
    },

    setState: function (state) {
    	var base = this,
            elem = null;

        if (!state) {
            state = 1;
        }
        if (base.tabsElement) {
        	elem_sign_in = $(base.tabsElement[state]);
            elem_sign_in.addClass("active")
            elem_sign_up = $(base.tabsElement[1-state]);
            $("." + elem_sign_up.attr("tab-toggle")).addClass("hidden");
        }

        return base;
    },

    getActiveTab: function () {
        var base = this;

        base.tabsElement.each(function (i, el) {
           if ($(el).hasClass("active")) {
               base.activeTab = $(el);
           }
        });

        return base;
    },

    addClickEvents: function () {
    	var base = this;

        base.tabsElement.on("click", function (e) {
            var targetTab = $(this).attr("tab-toggle");

            e.preventDefault();
            base.activeTab.removeClass("active");
            base.activeTab = $(this);
            base.activeTab.addClass("active");

            base.tabElement.each(function (i, el) {
                el = $(el);
                el.addClass("hidden");
                if (el.hasClass(targetTab)) {
                    el.removeClass("hidden");
                }
            });
        });

        base.tabsElement.on("click", function (e) {
            var targetTab = $(this).attr("tab-toggle");

            e.preventDefault();
            base.activeTab.removeClass("active");
            base.activeTab = $(this);
            base.activeTab.addClass("active");

            base.tabElement.each(function (i, el) {
                el = $(el);
                el.addClass("hidden");
                if (el.hasClass(targetTab)) {
                    el.removeClass("hidden");
                }
            });
        });

        base.inputElements.find("label").on("click", function (e) {
           var $this = $(this),
               $input = $this.next("input");

            $input.focus();
        });

        return base;
    },

    initialize: function () {
        var base = this;
        base.findElements().setState().getActiveTab().addClickEvents();
    }
};

$(document).ready(function() {
    TabModalController.initialize();
});
