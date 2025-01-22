// const multer = require('multer');
// const path = require('path');

// // Set up multer storage options
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // The destination folder for uploaded images
//     cb(null, 'public/rooms'); // Specify folder where you want to store the image
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique file name to avoid overwriting
//     cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to the filename
//   }
// });

// // File filter to allow only image files (jpeg, png, jpg)
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error('Only image files are allowed'), false); // Reject other file types
//   }
// };

// // Initialize multer with the storage and file filter options
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
// });

// module.exports = upload;
