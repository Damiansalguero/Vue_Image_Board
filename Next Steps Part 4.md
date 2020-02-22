# Next Steps Part 4 HASH

1) in the data of your main instance give the current image id an initial value of wahtever is in the hash.
i.e. location.hash (with the first character removed).

2) Remove the click handlers from our images/titles and replace them with hrefs whose links are value '#' + image.id (use :href )

3) listen for the 'hashchange' event -> set the imageid to be location.hash etc...

4) when closing the modal we want to set location.hash = ""

5) add a watcher to the modal component and do exactly what we do in mounted

watch: {
    id: function() {
         // this code will run when the prop changes
    }
}

6) deal with there being no image in our databases for the hash.  