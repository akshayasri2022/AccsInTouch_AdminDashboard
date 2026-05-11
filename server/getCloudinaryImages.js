const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dy67uxay7',
  api_key: '886159745499824',
  api_secret: 'pDZg5KJHiABlk9-yQ50u5oyBu64'
});

const getAllImages = async () => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    max_results: 200
  });

  result.resources.forEach(img => {
    console.log(`${img.public_id}: ${img.secure_url}`);
  });
};

getAllImages();