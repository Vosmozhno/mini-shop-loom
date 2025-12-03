export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        credentials: {
          accessKeyId: env('B2_KEY_ID'),
          secretAccessKey: env('B2_KEY_SECRET'),
        },
        region: env('B2_REGION'),
        endpoint: env('B2_ENDPOINT'),
        s3ForcePathStyle: true,
        baseUrl: env('B2_S3_URL'),
        params: {
          Bucket: env('B2_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
