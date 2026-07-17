const uploadResume = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.error(400, "No file uploaded");
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.error(400, "Only PDF files allowed");
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.error(404, "User Not Found");
    }

    // DELETE OLD RESUME

    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(
        user.resumePublicId,
        {
          resource_type: "raw",
        }
      );
    }

    // UPLOAD NEW RESUME

    const uploadToCloudinary = (buffer) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "raw",

              folder:
                "placement-intelligence/resumes",

              format: "pdf",

              public_id: `resume_${Date.now()}`,
            },
            (err, result) =>
              err ? reject(err) : resolve(result)
          )
          .end(buffer);
      });

    const result = await uploadToCloudinary(
      req.file.buffer
    );

    // SAVE DATA

    user.resumeUrl = result.secure_url;

    user.resumePublicId =
      result.public_id;

    const uint8Array = req.file.buffer;

    const parser = new PDFParse({
      data: uint8Array,
    });

    const parsed = await parser.getText();

    user.resumeText = parsed.text;

    await user.save();

    return res.success(
      200,
      "Resume Uploaded Successfully",
      {
        resumeUrl: result.secure_url,
      }
    );
  } catch (error) {
    next(error);
  }
};