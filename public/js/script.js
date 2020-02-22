//script.js is where all of our VUE code will go
//Everything here is in Frontend
//VUE is basically one big object we need the constructor "vue" for

(function() {
    //this component is the modal that will popup
    //'cute-animal-modal' can be named anything (1st argument)
    // second argument is object
    Vue.component("img-modal", {
        template:
            //#1 define the HTML right here in my object
            // '<div class="cute-animal-cotainer"><h1this is a cute animal!</h1><p></p></div>'
            //#2 define html for the modal in my HTML file and then temm my component where to find the HTML for the component
            "#modal-template",
        //what is passed to props is the "properties" of the Vue instance's "data" that I want my component to have access to
        //whatever is passed to the array here needs to be included in html, named the same way;
        props: ["imgThatWasClicked"],
        data: function() {
            return {
                modal: [],
                comments: [],
                form: {
                    comment: "",
                    username: "",
                    id: this.imgThatWasClicked
                }
            };
        },
        mounted: function() {
            var self = this;
            self.popup();
        }, // closes mounted
        methods: {
            uploadComment: function() {
                // because files are special, we have to treat themspecially. We have to use an API called FormData to handle the file
                var formData = new FormData();

                formData.append("comment", this.form.comment);
                formData.append("username", this.form.username);

                var self = this;
                axios.post("/comments", this.form).then(function(resp) {
                    // console.log("POSTDATA:", resp.data);
                    self.comments.push(resp.data);
                });
            },

            popup: function popup() {
                var self = this;
                axios
                    .get("/modal/" + this.imgThatWasClicked)
                    .then(function(resp) {
                        self.modal = resp.data[0];
                        self.comments = resp.data[1];
                    });
            },

            // closes uploadComment
            closeModal: function() {
                this.$emit("close-modal");
            }
        },
        watch: {
            imgThatWasClicked: function() {
                console.log("heloooooo");
                var self = this;
                vm.modal = true;
                self.popup();
                //this.imgThatWasClicked
                // axios
                //     .get("/modal/" + this.imgThatWasClicked)
                //     .then(function(resp) {
                //         self.modal = resp.data[0];
                //         self.comments = resp.data[1];
                //     });
            }
        }
    }); // closes Vue component

    // Vue components ONLY have access to their own "data".
    // Vue components DO NOT have access to the data of their parents (Vue instance).

    var vm = new Vue({
        //majority of our vue code will go in this object
        el: "#main",
        // data is our best friend; it is extremelyimportant
        //any info put here, the HTML file has access to
        data: {
            imgThatWasClicked: location.hash.slice(1),
            images: [],
            getMoreButton: false,

            //adressing the form in HTML. The properties don't have to have the same names as the input fields in HTML, but it is recommended for recognition
            //The idea is to pass data from input fields to the properties
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        }, // closes data

        // lifecycle method
        mounted: function() {
            // here we're going to make axios requests (GET request) to get  data from the server that we need to then render on screen
            // there are no arrow functions and only ES5

            //this refers to the Vue instance
            //needs to be in front of the axios
            var self = this;

            axios.get("/images").then(function(resp) {
                //resp is the response we get from the server
                //data is the property of resp that contains the info we
                //requested from the server
                //selft.cities refers to cities array in data
                self.images = resp.data;
                if (
                    self.images[self.images.length - 1].id !=
                    self.images[self.images.length - 1].lowest_id
                ) {
                    self.getMoreButton = true;
                }
                // with this line of code the cities array now lives in the "data" object of Vue
            });

            addEventListener("hashchange", function() {
                self.imgThatWasClicked = location.hash.slice(1);
            });
        }, // closes mounted
        methods: {
            //everything you put in "data" gets transfered to "this"
            //CHANGE CODE TO EXISTING
            //     this.imgThatWasClicked = clickedImg;
            // toggleModal: function(clickedImg) {
            // },
            getMoreImages: function() {
                var self = this;
                var lastId = this.images[this.images.length - 1].id;
                axios.get("/get-more-images/" + lastId).then(function(resp) {
                    self.images = self.images.concat(resp.data);
                    if (
                        self.images[self.images.length - 1].id ===
                        self.images[self.images.length - 1].lowest_id
                    ) {
                        self.getMoreButton = false;
                    }
                });
            },
            //every single function that runs in response to an event will be written here
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },

            close: function() {
                this.imgThatWasClicked = "";
                location.hash = "";
            },

            uploadFile: function() {
                // because files are special, we have to treat themspecially. We have to use an API called FormData to handle the file
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description);
                // if you log formData and get an {}, that's ok

                axios.post("/upload", formData).then(function(resp) {
                    vm.images.push(resp.data);
                });
            }
        } // closes methods
    });
})();
