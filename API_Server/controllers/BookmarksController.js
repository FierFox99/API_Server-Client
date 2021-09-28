const Repository = require('../models/Repository');

module.exports =
    class BookmarksController extends require('./Controller') {
        constructor(req, res) {
            super(req, res);
            this.bookmarksRepository = new Repository('Bookmarks');
        }
        getAll() {
            this.response.JSON(this.bookmarksRepository.getAll());
        }
        get(id) {
            let params = this.getQueryStringParams();
            console.log('test:');
            //console.log('test:'+ params['sort'].length);
            if (!isNaN(id))
                this.response.JSON(this.bookmarksRepository.get(id));
            else if (params == null) {
                this.response.JSON(this.bookmarksRepository.getAll());
            }
            else if (params["sort"] != null) {
                this.response.JSON(this.bookmarksRepository.getAllSorted(params["sort"]));
            }
            else if (params["name"] != null) {
                console.log("ici bitch");
                this.response.JSON(this.bookmarksRepository.getByKey(params["name"]));
            }
            else {
                this.response.JSON(this.bookmarksRepository.getAll());
            }

            //console.log(this.getQueryStringParams());
        }
        post(bookmark) {
            // todo : validate bookmark before insertion
            // todo : avoid duplicates
            let newBookmark = this.bookmarksRepository.add(bookmark);
            if (newBookmark)
                this.response.created(JSON.stringify(newBookmark));
            else
                this.response.internalError();
        }
        put(bookmark) {
            // todo : validate bookmark before updating
            if (this.bookmarksRepository.update(bookmark))
                this.response.ok();
            else
                this.response.notFound();
        }
        remove(id) {
            if (this.bookmarksRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        }
    }