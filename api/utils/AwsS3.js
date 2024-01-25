const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
class AwsS3 {
  constructor() {
    this.s3Client = new S3Client({});
  }

  async uploadFile(params) {
    try {
      const command = new PutObjectCommand(params);
      const result = await this.s3Client.send(command);
      console.log('File uploaded successfully:', result.Location);
      return result.Location;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFile(params) {
    try {
      const command = new GetObjectCommand(params);
      const result = await this.s3Client.send(command);
      console.log('File fetched successfully:', result);
      return result.Body;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async deleteFile(key) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      };

      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);

      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
  getMulter() {
    const upload = multer({
      storage: multerS3({
        s3: this.s3Client,
        bucket: process.env.AWS_BUCKET_NAME,

        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          cb(null, `uploads/${Date.now()}-${file.originalname}`);
        },
      }),
    });

    return upload;
  }
}

module.exports = AwsS3;
