// const tf = require("@tensorflow/tfjs-node");
// const nsfw = require("nsfwjs");
// const axios = require("axios");
// let _model;

// const load_model = async () => {
//   _model = await nsfw.load();
// };

// exports.load_model = load_model;

// exports.isImageNSFW = async (imageUrl) => {
//   try {
//     const pic = await axios.get(`${imageUrl}`, {
//       responseType: "arraybuffer",
//     });
//     const model = await nsfw.load(); // To load a local model, nsfw.load('file://./path/to/model/')
//     // Image must be in tf.tensor3d format
//     // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
//     const image = await tf.node.decodeImage(pic.data, 3);
//     const predictions = await model.classify(image);
//     image.dispose(); // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).
//     console.log(predictions);
//   } catch (error) {
//     console.error("Error while detecting NSFW content:", error);
//     return false; // In case of an error, consider the image as not NSFW
//   }
// };
