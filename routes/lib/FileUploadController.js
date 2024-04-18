const config = require('../../config/environment'),
  path = require("path"),
  uniqid = require('uniqid'),
  fs = require("fs"),
  sharp = require('sharp');

FileUploadController = function() {};

FileUploadController.prototype.uploadFileUser = function(req, res) {
  /**
   * The following takes the blob uploaded to an arbitrary location with
   * a random file name and copies it to the specified file.path with the file.name.
   * Note that the file.name should come from your upload request on the client side
   * because when the file is selected it is paired with its name. The file.name is
   * not random nor is the file.path.
   */

  const file = req.files.file;
  const fileName = uniqid() + path.extname(file.name);

  const proms = new Promise((resolve, reject) => {
    fs.readFile(file.path, function (err, data) {
      // set the correct path for the file not the temporary one from the API:
      file.path = path.join(config.root, "public", "images", "users", "original", fileName);

      // copy the data from the req.files.file.path and paste it to file.path
      fs.writeFile(file.path, data, function (err) {
        if (err) {
          console.warn(err);
          reject(err);
        }else{
          // console.log("The file was saved to " + file.path);
          sharp(file.path).resize(450).toBuffer().then(data => {
            file.path = path.join(config.root, "public", "images", "users", "medium", fileName);
            fs.writeFile(file.path, data, function (err) {
              if(err){reject(err);}
              sharp(file.path).resize(150).toBuffer().then(data => {
                file.path = path.join(config.root, "public", "images", "users", "small", fileName);
                fs.writeFile(file.path, data, function (err) {
                  if(err){reject(err);}
                  else{resolve(file);}
                });
              }).catch(err => {reject(err);});
            });
          }).catch(err => {reject(err);});
        }
      });
    });
  });

  return proms.then(rep => {return res.status(200).json(rep);}, err => {console.error(err);res.status(409).json(err);})
}

FileUploadController.prototype.uploadFilePhotos = function(req, res) {
  /**
   * The following takes the blob uploaded to an arbitrary location with
   * a random file name and copies it to the specified file.path with the file.name.
   * Note that the file.name should come from your upload request on the client side
   * because when the file is selected it is paired with its name. The file.name is
   * not random nor is the file.path.
   */
  const files = [];
  if(req.files.file.length===undefined)
    files.push(req.files.file);
  else{
    for(let i in req.files.file)
      files.push(req.files.file[i])
  }

  const proms = files.map(file => {
    return new Promise((resolve, reject) => {
        const fileName = uniqid() + path.extname(file.name);
        fs.readFile(file.path, function (err, data) {
        // set the correct path for the file not the temporary one from the API:
        file.path = path.join(config.root, "public", "images", "photos", "original", fileName);

        // copy the data from the req.files.file.path and paste it to file.path
        fs.writeFile(file.path, data, function (err) {
          if (err) {
            console.warn(err);
            reject(err);
          }else{
            // console.log("The file was saved to " + file.path);
            sharp(file.path).resize(450).toBuffer().then(data => {
              file.path = path.join(config.root, "public", "images", "photos", "medium", fileName);
              fs.writeFile(file.path, data, function (err) {
                if(err){reject(err);}
                sharp(file.path).resize(150).toBuffer().then(data => {
                  file.path = path.join(config.root, "public", "images", "photos", "small", fileName);
                  fs.writeFile(file.path, data, function (err) {
                    if(err){reject(err);}
                    else{resolve(file);}
                  });
                }).catch(err => {reject(err);});
              });
            }).catch(err => {reject(err);});
          }
        });
      });
    })
  });

  return Promise.all(proms).then(rep => {return res.status(200).json(rep);}, err => {console.error(err);res.status(409).json(err);})

}

module.exports = new FileUploadController();