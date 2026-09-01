import multer from "multer";

// Use memory storage so image files are kept in buffer for Sharp processing
const storage = multer.memoryStorage();

// Validate allowed image types: JPG, JPEG, PNG, WebP
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Wrapper middleware to handle Multer upload errors cleanly
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
