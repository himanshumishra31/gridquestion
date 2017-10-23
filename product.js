function Product(data) {
  this.productsDiv = data.productsDiv;
  this.imageFolderUrl = data.imageFolderUrl;
  this.colorSelectorCheckboxes = data.colorSelectorCheckboxes;
  this.brandSelectorCheckboxes = data.brandSelectorCheckboxes;
  this.availableSelectorCheckboxes = data.availableSelectorCheckboxes;
  this.filters = data.filters;
  this.presentImages = [];
}

Product.prototype.loadImage = function() {
  for(var key in this.jsonResponsedata) {
    var imgurl = this.imageFolderUrl + this.jsonResponsedata[key].url,
        imgElement = $('<img>', { src: imgurl , id: "productImage"}).data('details',{color: this.jsonResponsedata[key].color, brand: this.jsonResponsedata[key].brand, soldOut: this.jsonResponsedata[key].sold_out });
    this.productsDiv.append(imgElement);
  }
  this.productsImages = $('#productsView img');
  var _this = this;
  this.productsImages.each(function() {
    _this.presentImages.push(this);
  })
};

Product.prototype.colorCheckboxes = function() {
  var _this = this;
  return function () {
    _this.checkedColorBoxes = [];
    _this.getCheckedBoxes(_this.checkedColorBoxes, _this.colorSelectorCheckboxes, 'color');
    _this.showSelectedCheckboxes(_this.checkedColorBoxes, 'color', this);
    console.log(_this.presentImages);

    _this.reinitializePresentImages(_this.colorSelectorCheckboxes);
    console.log(_this.presentImages);

  };
};

Product.prototype.brandCheckboxes = function() {
  var _this = this;
  return function () {
    _this.checkedBrandBoxes = [];
    _this.getCheckedBoxes(_this.checkedBrandBoxes, _this.brandSelectorCheckboxes, 'brand');
    _this.showSelectedCheckboxes(_this.checkedBrandBoxes, 'brand', this);
    console.log(_this.presentImages);
    _this.reinitializePresentImages(_this.brandSelectorCheckboxes);
    console.log(_this.presentImages);
  };
};

Product.prototype.reinitializePresentImages = function(selectorNameCheckboxes) {
  var _this = this;
  this.presentImages = [];
  selectorNameCheckboxes.each(function() {
    _this.presentImages.push(this);
  })
  this.presentImagesArray();
};

Product.prototype.getCheckedBoxes = function(selectorNameCheckedCheckboxes, selectorNameCheckboxes, selectorName) {
  var _this = this;
  selectorNameCheckboxes.each(function() {
    if(this.checked) {
      selectorNameCheckedCheckboxes.push($(this).data(selectorName));
    }
  });
};

Product.prototype.presentImagesArray = function() {
  var _this = this;
  $('#productsView img:visible').each(function() {
    _this.presentImages.push(this);
  })
}

Product.prototype.showSelectedCheckboxes = function(checkedCheckBoxes, selectorName, selectedCheckbox) {
  for(var key = 0; key < this.productsImages.length; key++) {
    if(checkedCheckBoxes.length) {
      $(this.productsImages[key]).hide();
      for(var value of checkedCheckBoxes) {
        if(value == $(this.productsImages[key]).data('details')[selectorName] && ( (this.presentImages.indexOf(selectedCheckbox) > -1 && $(selectedCheckbox).data(selectorName) == value) || this.presentImages.indexOf(this.productsImages[key]) > -1)) {
          $(this.productsImages[key]).show();
          console.log(this.presentImages.indexOf(selectedCheckbox) > -1);
          console.log($(selectedCheckbox).data(selectorName) == value);
          console.log(this.presentImages.indexOf(this.productsImages[key]) > -1);
          console.log(this.productsImages[key]);
        }
      }
    } else {
      $(this.productsImages[key]).show();
    }
  }
};


Product.prototype.bindCheckboxes = function() {
  this.colorSelectorCheckboxes.click(this.colorCheckboxes());
  this.brandSelectorCheckboxes.click(this.brandCheckboxes());
};

Product.prototype.readJson = function() {
  var _this = this;
  $.ajax({
    url : "product.json",
    type : "GET",
    dataType : 'json',
  }).done(function(jsonResponse) {
    _this.jsonResponsedata = jsonResponse;
    _this.loadImage();
  }).fail(function() {
    alert("Error occured");
  });
};

Product.prototype.init = function() {
  this.readJson();
  this.bindCheckboxes();
};

$(document).ready(function() {
  var data = {
        productsDiv: $('#productsView'),
        imageFolderUrl: 'product_data/images/',
        colorSelectorCheckboxes: $('#colorSelectors input[data-color]'),
        brandSelectorCheckboxes: $('#brandSelectors input[data-brand]'),
        availableSelectorCheckboxes: $('#availableSelectors input[data-filter]'),
        filters: ['color', 'brand', 'sold_out']
      },
      productObject = new Product(data);
  productObject.init();
});
