export const html = `<h1>Favicon Generator</h1>
        <p class="subtitle">Upload a logo or image to instantly generate standard web & app favicons.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Select logo image (PNG, JPG, SVG) or drag & drop here</p>
            <input type="file" id="fileInput" accept="image/png, image/jpeg, image/svg+xml">
        </div>

        <div class="output-section" id="outputSection">
            <div class="icons-grid" id="iconsGrid"></div>

            <div class="code-box">
                <div class="code-title">HTML HEAD TAGS</div>
                <button class="copy-btn" id="copyBtn" onclick="copyHTML()">Copy HTML</button>
                <pre id="htmlCode"></pre>
            </div>
        </div>`;

export function init() {

}