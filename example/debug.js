/**
 * Debug script for Map Controls
 */

// Function to display errors in the UI
function displayError(message, details) {
  const container = document.getElementById('map-container');
  if (!container) return;
  
  // Create error overlay
  const errorOverlay = document.createElement('div');
  errorOverlay.style.position = 'absolute';
  errorOverlay.style.top = '0';
  errorOverlay.style.left = '0';
  errorOverlay.style.width = '100%';
  errorOverlay.style.height = '100%';
  errorOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  errorOverlay.style.color = 'red';
  errorOverlay.style.padding = '20px';
  errorOverlay.style.boxSizing = 'border-box';
  errorOverlay.style.overflow = 'auto';
  errorOverlay.style.zIndex = '1000';
  errorOverlay.style.fontFamily = 'monospace';
  
  // Add error message
  const errorMessage = document.createElement('h3');
  errorMessage.textContent = message;
  errorOverlay.appendChild(errorMessage);
  
  // Add error details
  if (details) {
    const errorDetails = document.createElement('pre');
    errorDetails.textContent = typeof details === 'object' ? JSON.stringify(details, null, 2) : details.toString();
    errorOverlay.appendChild(errorDetails);
  }
  
  // Add image test
  const imageTest = document.createElement('div');
  imageTest.innerHTML = `
    <h4>Image Load Test:</h4>
    <img src="world-map.jpeg" style="max-width: 200px; border: 1px solid #ccc;" 
         onerror="this.onerror=null; this.after(document.createTextNode(' ❌ Failed to load image'));"
         onload="this.after(document.createTextNode(' ✅ Image loaded successfully'));" />
  `;
  errorOverlay.appendChild(imageTest);
  
  // Add to container
  container.appendChild(errorOverlay);
}

// Listen for errors from the map controls
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  displayError('JavaScript Error', event.error?.stack || event.message);
});

// Debug function to check image loading
function testImageLoad(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({
      success: true,
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    img.onerror = () => reject({
      success: false,
      error: 'Failed to load image'
    });
    img.src = src;
  });
}

// Test image loading when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Testing image load...');
    const result = await testImageLoad('world-map.jpeg');
    console.log('Image load test result:', result);
  } catch (error) {
    console.error('Image load test failed:', error);
    displayError('Image Load Test Failed', error);
  }
});
