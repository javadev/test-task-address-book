// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Contact Model
  // ----------

  // Our basic **Contact** model has ``, `order`, and `done` attributes.
  var Contact = Backbone.Model.extend({

    // Default attributes for the contact item.
    defaults: function() {
      return {
        name: "empty contact...",
        id: Contacts.nextOrder(),
        done: false
      };
    },

    // Ensure that each contact created has `name`.
    initialize: function() {
      if (!this.get("name")) {
        this.set({"name": this.defaults().name});
      }
    },

    // Toggle the `done` state of this contact item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  // Contact Collection
  // ---------------

  // The collection of contacts is backed by *localStorage* instead of a remote
  // server.
  var ContactList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Contact,

    url: '/api/contacts',

    // Filter down the list of all contact items that are finished.
    done: function() {
      return this.filter(function(contact){ return contact.get('done'); });
    },

    // Filter down the list to only contact items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Contacts in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    },

    // Contacts are sorted by their original insertion order.
    comparator: function(contact) {
      return contact.get('id');
    }

  });

  // Create our global collection of **Contacts**.
  var Contacts = new ContactList;

  // Contact Item View
  // --------------

  // The DOM element for a contact item...
  var ContactView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The ContactView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Contact** and a **ContactView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    // Re-render the names of the contact item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the contact.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({name: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#contactapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #new-contact":  "createContact",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Contacts`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting contacts that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-contact");
      this.allCheckbox = this.$("#toggle-all")[0];

      Contacts.on('add', this.addOne, this);
      Contacts.on('reset', this.addAll, this);
      Contacts.on('all', this.render, this);

      this.footer = this.$('footer');
      this.main = $('#main');

      Contacts.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Contacts.done().length;
      var remaining = Contacts.remaining().length;

      if (Contacts.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single contact item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(contact) {
      var view = new ContactView({model: contact});
      this.$("#contact-list").append(view.render().el);
    },

    // Add all items in the **Contacts** collection at once.
    addAll: function() {
      Contacts.each(this.addOne);
    },

    // If you hit return in the main input field, create new **Contact** model,
    // persisting it to *localStorage*.
    createContact: function(e) {
      if (!$('#new-name').val()) return;

      Contacts.create({name: $('#new-name').val()});
      $('#new-name').val('');
    },

    // Clear all done contact items, destroying their models.
    clearCompleted: function() {
      _.invoke(Contacts.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Contacts.each(function (contact) { contact.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
