/* js/workers/image-worker.js */
self.onmessage = async (e) => {
  const { id, file, action, options } = e.data;
  
  try {
    const bitmap = await createImageBitmap(file);
    let canvas, ctx;

    if (typeof OffscreenCanvas !== 'undefined') {
      canvas = new OffscreenCanvas(options.width || bitmap.width, options.height || bitmap.height);
    } else {
      self.postMessage({ id, error: 'OffscreenCanvas unsupported' });
      return;
    }

    ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await canvas.convertToBlob({
      type: options.mimeType || 'image/webp',
      quality: options.quality || 0.85
    });

    self.postMessage({ id, success: true, blob });
  } catch (err) {
    self.postMessage({ id, success: false, error: err.message });
  }
};
