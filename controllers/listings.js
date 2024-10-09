const Listing = require("../models/listing.js");
module.exports.index = async (req, res) => {
     const allListings = await Listing.find({});
     let percentage = Math.floor(Math.random() * 18) + 1;
     res.render("listings/index.ejs", { allListings, percentage });
   };
   //New Route
   module.exports.renderNewForm = (req, res) => {
     res.render("listings/new.ejs");
   };
 
   //show route
   module.exports.showListing = async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id).populate({
       path: "reviews",
       populate: {
         path: "author",
       },
     })
       .populate("owner");
     if (!listing) {
       req.flash("error", "Listing you requested for does not exist! ");
       res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show.ejs", { listing });
   };
// Post route 
module.exports.createListing = async (req, res, next) => {
     let url = req.file.path;
     let filename = req.file.filename;
     console.log(url);
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = { url, filename };
     await newListing.save();
     req.flash("success", "New Listing created!");
     res.redirect("/listings");
   }

   //Edit route
   module.exports.EditListing = async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if (!listing) {
       req.flash("error", "Listing you requested for does not exist! ");
       res.redirect("/listings");
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
     res.render("listings/edit.ejs", { listing, originalImageUrl });
   }
   //Update Route
   module.exports.UpdateRoute = async (req, res) => {
     let { id } = req.params;
     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     if (typeof req.file != "undefined") {
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = { url, filename };
       await listing.save();
     }
     res.redirect(`/listings/${id}`);
   }
   module.exports.DeleteListing = async (req, res) => {
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
   }