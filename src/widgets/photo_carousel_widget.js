var PhotoCarouselWidget = Class.create(Widget,
{
  initialize: function(element) {
    PhotoCarouselWidget.self = this;
    Widget.prototype.initialize.apply(this, arguments);
  }
});

CurrentPage.registerBehaviour("thc2-photo-carousel", PhotoCarouselWidget);