$(function() {

  class Cat {
    constructor(name, id) {
      this.name = name;
      this.clickCount = 0;
      this.id = id;
      this.imageUrl = "images/cat"+id;
    }

    increaseClick() {
      this.clickCount += 1;
    }

    getClickCount() {
      return this.clickCount;
    }
  }

  let data = {
    cats: undefined,
    admin: false,
    selectedCat: 1
  }

  let octopus = {

    createCats: function(catNames) {
      data.cats = new Map();
      for (let i = 0; i < catNames.length; i++) {
        let id = i + 1;
        let cat = new Cat(catNames[i], id);
        data.cats.set("" + id, cat);
      }
    },

    getCats: function() {
      return data.cats;
    },

    getCat: function(catId) {
      return data.cats.get(catId);
    },

    openCat: function(cat) {
      let clickedCat = data.cats.get("" + cat.id);
      data.selectedCat = cat.id;
      catFocusView.render(clickedCat);
      catAdminView.render();
    },

    getSelectedCat: function() {
      console.log(data.selectedCat);
      return data.cats.get(""+data.selectedCat);
    },

    updateSelectedCat: function(name, imageUrl, clickCount) {
      let selectedCat = this.getSelectedCat();
      console.log("submitted name:"+name);
      selectedCat.name = name;
      selectedCat.imageUrl = imageUrl;
      selectedCat.clickCount = parseInt(clickCount);
      //practically hides admin view
      this.toggleAdminMode();
      catListView.render();
      catFocusView.render(selectedCat);
    },

    isAdmin: function() {
      return data.admin;
    },

    toggleAdminMode: function() {
      data.admin = !data.admin;
      catAdminView.render();
    },

    init: function() {
      let catNames = ["Juma", "Dana", "Rontti", "Pekka", "Blakkis"];
      this.createCats(catNames);
      catListView.init();
      catFocusView.init();
      catAdminView.init();
    }

  };

  let catListView = {
    init: function() {

      // grab elements and html for using in the render function
      this.$catList = $('.cat-list');
      this.catListTemplate = $('script[data-template="catlist"]').html();

      // Delegated event to listen for removal clicks
      this.$catList.on('click', '.catItem', function(e) {
        let cat = $(this).data();
        octopus.openCat(cat);
        return false;
      });

      this.render();
    },

    render: function() {
      //TODO:maybe not needed
      //Cache vars for use in forEach() callback (performance)
      let $catList = this.$catList,
        catListTemplate = this.catListTemplate;

      // Clear and render
      $catList.html('');

      let cats = octopus.getCats();
      for (var key of cats.keys()) {
        let cat = cats.get(key);
        let thisTemplate = catListTemplate.replace(/{{id}}/g, cat.id);
        thisTemplate = thisTemplate.replace(/{{name}}/g, cat.name);
        $catList.append(thisTemplate);
      }
    }
  };


  let catFocusView = {

    init: function() {

      // grab elements and html for using in the render function
      this.$catFocus = $('#cat-focus');
      this.catFocusTemplate = $('script[data-template="catfocus"]').html();

      // Delegated event to listen for removal clicks
      this.$catFocus.on('click', '#catfocusimage', function(e) {
        //TODO:it would be better to refa this info to model. Store currently selected id in model, not in html-view?
        let catId = $(this).data();
        let cat = octopus.getCat("" + catId.id);
        //TODO: is this against the rule: view should not access model-
        cat.increaseClick();
        let clickCount = cat.getClickCount();
        $("#clickCount").text(clickCount);
        //if (octopus.isAdmin()) {
        $("#clickcount-input").val(clickCount);
        //}
      });

      this.render(octopus.getSelectedCat());
    },

    render: function(cat) {
      //TODO:maybe not needed
      let $catFocus = this.$catFocus,
        catFocusTemplate = this.catFocusTemplate;

      // Clear and render
      $catFocus.html('');
      console.log("selected cat:"+data.selectedCat);
      //TODO:replacing looks too complicated...
      let thisTemplate = catFocusTemplate.replace(/{{id}}/g, cat.id);
      thisTemplate = thisTemplate.replace(/{{imageUrl}}/g, cat.imageUrl);
      thisTemplate = thisTemplate.replace(/{{name}}/g, cat.name);
      thisTemplate = thisTemplate.replace(/{{clickCount}}/g, cat.clickCount);
      //TODO:redraws whole html section every time. could this be done more precisely..
      $catFocus.append(thisTemplate);
    }
  };

  let catAdminView = {

    init: function() {

      // grab elements and html for using in the render function
      this.$catAdmin = $('#admin');
      this.$catAdminForm = $('#admin-form');
      this.$nameInput = $('#catname-input');
      this.$imageUrlInput = $('#image-input');
      this.$clickCountInput = $('#clickcount-input');
      this.$submitButton = $('#submit-button');
      this.$cancelButton = $('#cancel-button');
      //this.catFocusTemplate = $('script[data-template="catfocus"]').html();

        if (octopus.isAdmin()) {
            console.log("app is in admin mode");
        }

        else {
          console.log("app is not in admin mode");
        }

      // Delegated event to listen for removal clicks
      this.$catAdmin.on('click', function(e) {

        /*
        //TODO:it would be better to refa this info to model. Store currently selected id in model, not in html-view?
        let catId = $(this).data();
        let cat = octopus.getCat("" + catId.id);
        //TODO: is this against the rule: view should not access model-
        cat.increaseClick();
        let clickCount = cat.getClickCount();
        $("#clickCount").text(clickCount);
        */
        console.log("admin clicked");
        octopus.toggleAdminMode();

      });

      //this.$nameInput = 1;

      // Delegated event to listen for removal clicks
      this.$submitButton.on('click', function(e) {
        //console.log(this.$nameInput);
        console.log("admin submit clicked");
        //console.log($('#catname-input'));
        e.preventDefault();
        octopus.updateSelectedCat($('#catname-input').val(),$('#image-input').val(),$('#clickcount-input').val() );

/*
        this.$nameInput = $('#catname-input');
        this.$imageUrlInput = $('#image-input');
        this.$clickCountInput = $('#clickcount-input');
*/


        //octopus.toggleAdminMode();

      });

      // Delegated event to listen for removal clicks
      this.$cancelButton.on('click', function(e) {
        //console.log(this.$nameInput);
        console.log("admin cancel clicked");
        //console.log($('#catname-input'));
        e.preventDefault();
        octopus.toggleAdminMode();
      });



      this.render();
    },

    render: function() {
        if (octopus.isAdmin()) {

          this.$nameInput.html('');
          this.$imageUrlInput.html('');
          this.$clickCountInput.html('');
          let selectedCat = octopus.getSelectedCat();
          console.log(this.$nameInput);
          this.$nameInput.val(selectedCat.name);
          console.log(this.$nameInput);
          this.$imageUrlInput.val(selectedCat.imageUrl);
          console.log("click count at admin render:"+selectedCat.clickCount);
          this.$clickCountInput.val(selectedCat.clickCount);

          this.$catAdminForm.show();
          console.log("render admin mode");
        }
        else{
          this.$catAdminForm.hide();
          console.log("render not admin mode");
        }
      /*
      //TODO:maybe not needed
      let $catFocus = this.$catFocus,
        catFocusTemplate = this.catFocusTemplate;

      // Clear and render
      $catFocus.html('');

      //TODO:replacing looks too complicated...
      let thisTemplate = catFocusTemplate.replace(/{{id}}/g, cat.id);
      thisTemplate = thisTemplate.replace(/{{name}}/g, cat.name);
      thisTemplate = thisTemplate.replace(/{{clickCount}}/g, cat.clickCount);
      //TODO:redraws whole html section every time. could this be done more precisely..
      $catFocus.append(thisTemplate);
      */
    }

  };

  octopus.init();
}());
