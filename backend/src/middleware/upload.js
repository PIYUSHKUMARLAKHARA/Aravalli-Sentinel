import multer from 'multer';

// Configure memory storage for streaming directly to Gemini and Firebase Storage
const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only JPEG, PNG, WEBP, and HEIC are accepted.`), false);
  }
};

export const uploadEvidence = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Megabytes max
    files: 1, // 1 primary photo per initial report
  },
});

export default uploadEvidence;
