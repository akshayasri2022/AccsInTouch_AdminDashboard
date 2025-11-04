// const formidable = require("formidable");

// const parseRequestFiles = async (req) => {
//     console.log('came to parse');
//     const form = new formidable.IncomingForm();
//     console.log(form,"formmmmmm");
    
//     return new Promise((resolve, reject) => {
//       console.log(resolve,"resolvee",reject,"rejectsssss");
      
//         form.parse(req, (err, fields, files) => { 
//           console.log(req,"ggggggg");
//           console.log(fields,"ggggmmmmggg");
//           console.log(files,"ggggnnnnggg");       
//           if (err) {
//             console.log(err,"hgghghhhh");
//           reject(err);   
//         } else {
//           console.log("filesssssssss",files)
//           resolve({ fields, files }); 
//         }
//       });
//     });
//   };


//   module.exports = parseRequestFiles;


const formidable = require("formidable");

const parseRequestFiles = async (req) => {
    console.log('came to parse');
    const form = new formidable.IncomingForm();
    form.maxFileSize = 200 * 1024 * 1024; 
    
    console.log(form, "formmmmmm"); 
    
    return new Promise((resolve, reject) => {
        // console.log(resolve, "resolvee", reject, "rejectsssss");
        
        form.parse(req, (err, fields, files) => {
            // ... console logs removed for clarity
            
            if (err) {
                console.log(err, "hgghghhhh");
                // Check if the error is due to size limit
                if (err.code === formidable.Errors.biggerThanMaxFileSize) {
                    return reject(new Error("File size exceeds the allowed limit."));
                }
                return reject(err); 
            } else {
                console.log("filesssssssss", files)
                resolve({ fields, files }); 
            }
        });
    });
};

module.exports = parseRequestFiles;