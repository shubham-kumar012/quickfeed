import multer from "multer";

// Store uploaded files directly in memory (RAM buffer) so we can optimize them with Sharp
const storage = multer.memoryStorage();

// Check that only common image formats are uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WebP images are supported."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware helper to handle image uploads and catch any size/type errors cleanly
export const handleImageUpload = (req, res, next) => {
  const singleUpload = upload.single("image");

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Image size must be less than 5MB.",
        });
      }
      return res.status(400).json({
        message: err.message || "File upload error.",
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message || "Invalid image file.",
      });
    }
    next();
  });
};
