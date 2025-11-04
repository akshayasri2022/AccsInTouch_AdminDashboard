const ALLOWED_EMP_DOC_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "image/svg+xml",
  "image/webp",
  "application/zip",
  "application/json",        // for geojson fallback
  "application/geo+json",    // standard geojson MIME
  "image/tiff",
  "image/x-tiff",
  "text/csv",
  "application/x-shapefile",  // for .shp files
];

module.exports = ALLOWED_EMP_DOC_TYPES;
