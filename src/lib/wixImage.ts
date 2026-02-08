/**
 * Converts a Wix image URI (wix:image://v1/...) to a valid static.wixstatic.com URL.
 * If the input is already a valid URL or doesn't match the Wix format, it returns it as is.
 */
export function getWixImageUrl(wixUri: string | null | undefined): string {
  if (!wixUri) return "";
  
  // If it's already a full URL, return it
  if (wixUri.startsWith("http")) return wixUri;
  
  // If it's a Wix image URI
  if (wixUri.startsWith("wix:image://v1/")) {
    // Format: wix:image://v1/<image_id>/<file_name>#originWidth=<w>&originHeight=<h>
    const parts = wixUri.replace("wix:image://v1/", "").split("/");
    const imageId = parts[0];
    
    // Some URIs have the filename after the imageId
    // If not, we use the imageId as the filename (common in Wix)
    const fileName = parts[1] ? parts[1].split("#")[0] : imageId;
    
    return `https://static.wixstatic.com/media/${imageId}`;
  }
  
  // For other relative paths or unknown formats
  return wixUri;
}
