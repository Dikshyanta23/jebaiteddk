const { StatusCodes } = require("http-status-codes");
const path = require("path");
const allErrors = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadProductImageLocal = async (req, res) => {
  //check if file exists
  if (!req.files) {
    throw new allErrors.BadRequestError("No File uploaded");
  }
  //check the format of the file

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new allErrors.BadRequestError("Please upload an image file");
  }
  //check the size of the file
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new allErrors.BadRequestError(
      `Please upload an image less than 1 megabyte`
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "image_upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage,
};
