export const html = `
    <h1>CSS Gradient & Mesh Generator</h1>
    <p class="subtitle">Design modern Linear, Radial, Conic gradients and soft mesh backgrounds with real-time CSS export.</p>

    <div class="tool-section">
        <!-- Preset Gradients -->
        <div class="presets-bar" style="margin-bottom: 1.5rem;">
            <button class="preset-btn active" id="preset-emerald">Emerald Mirage</button>
            <button class="preset-btn" id="preset-hyper">Hyper Violet</button>
            <button class="preset-btn" id="preset-sunset">Sunset Glow</button>
            <button class="preset-btn" id="preset-midnight">Deep Midnight</button>
            <button class="preset-btn" id="preset-conic">Conic Rainbow</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin-bottom: 2rem;" class="gradient-layout-grid">
            <!-- Gradient Canvas Preview -->
            <div id="gradientCanvas" style="min-height: 280px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
                <div style="background: rgba(15, 17, 21, 0.75); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 0.75rem 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 500;">
                    Live CSS Canvas
                </div>
            </div>

            <!-- Controls Panel -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div class="input-group" style="margin-bottom: 0;">
                    <label for="gradientType" class="input-label">Gradient Type</label>
                    <select id="gradientType" class="input-field" style="height: 40px;">
                        <option value="linear" selected>Linear Gradient</option>
                        <option value="radial">Radial Gradient</option>
                        <option value="conic">Conic Gradient</option>
                    </select>
                </div>

                <div id="angleControlGroup">
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                        <span style="color: var(--text-muted);">Angle</span>
                        <span id="angleVal" style="font-family: var(--font-mono);">135°</span>
                    </div>
                    <input type="range" id="angleSlider" min="0" max="360" value="135" style="width: 100%;">
                </div>

                <!-- Color Stops List -->
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label class="input-label" style="margin-bottom: 0;">Color Stops</label>
                        <button class="btn btn-outline" id="addColorStopBtn" style="padding: 0.2rem 0.55rem; font-size: 0.75rem;">+ Add Color Stop</button>
                    </div>
                    <div id="colorStopsContainer" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
                </div>
            </div>
        </div>

        <!-- CSS Code Block -->
        <div class="input-group" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="gradientCssOutput" class="input-label" style="margin-bottom: 0;">CSS Output</label>
                <button class="btn btn-outline" id="copyGradientCssBtn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">Copy CSS</button>
            </div>
            <textarea id="gradientCssOutput" class="textarea-field" style="height: 80px; font-family: var(--font-mono); font-size: 0.85rem;" readonly></textarea>
        </div>
    </div>
`;

export function init() {
    const gradientCanvas = document.getElementById('gradientCanvas');
    const gradientType = document.getElementById('gradientType');
    const angleSlider = document.getElementById('angleSlider');
    const angleVal = document.getElementById('angleVal');
    const angleControlGroup = document.getElementById('angleControlGroup');
    const colorStopsContainer = document.getElementById('colorStopsContainer');
    const addColorStopBtn = document.getElementById('addColorStopBtn');
    const gradientCssOutput = document.getElementById('gradientCssOutput');
    const copyGradientCssBtn = document.getElementById('copyGradientCssBtn');

    // Presets
    const presetEmerald = document.getElementById('preset-emerald');
    const presetHyper = document.getElementById('preset-hyper');
    const presetSunset = document.getElementById('preset-sunset');
    const presetMidnight = document.getElementById('preset-midnight');
    const presetConic = document.getElementById('preset-conic');
    const presetButtons = [presetEmerald, presetHyper, presetSunset, presetMidnight, presetConic];

    let stops = [
        { color: '#00e599', pos: 0 },
        { color: '#0072ff', pos: 100 }
    ];

    function renderStopsUI() {
        colorStopsContainer.innerHTML = stops.map((stop, idx) => `
            <div style="display: flex; gap: 0.6rem; align-items: center; background: var(--bg); padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid var(--border);" data-stop-idx="${idx}">
                <input type="color" value="${stop.color}" class="stop-color-picker" data-idx="${idx}" style="width: 32px; height: 32px; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; background: transparent; padding: 1px;">
                <input type="text" value="${stop.color}" class="stop-color-text" data-idx="${idx}" style="width: 80px; font-family: var(--font-mono); font-size: 0.8rem; background: var(--card-bg); border: 1px solid var(--border); color: var(--text); border-radius: 4px; padding: 4px 6px;">
                <div style="display: flex; align-items: center; gap: 0.4rem; flex: 1;">
                    <input type="range" min="0" max="100" value="${stop.pos}" class="stop-pos-slider" data-idx="${idx}" style="width: 100%;">
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; width: 32px; text-align: right;">${stop.pos}%</span>
                </div>
                ${stops.length > 2 ? `<button class="btn btn-outline stop-del-btn" data-idx="${idx}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem; color: var(--error);">✕</button>` : ''}
            </div>
        `).join('');

        // Attach listeners to stop controls
        colorStopsContainer.querySelectorAll('.stop-color-picker').forEach(picker => {
            picker.addEventListener('input', (e) => {
                const i = parseInt(e.target.getAttribute('data-idx'), 10);
                stops[i].color = e.target.value;
                renderStopsUI();
                updateGradient();
            });
        });

        colorStopsContainer.querySelectorAll('.stop-color-text').forEach(text => {
            text.addEventListener('input', (e) => {
                const i = parseInt(e.target.getAttribute('data-idx'), 10);
                stops[i].color = e.target.value;
                updateGradient();
            });
        });

        colorStopsContainer.querySelectorAll('.stop-pos-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const i = parseInt(e.target.getAttribute('data-idx'), 10);
                stops[i].pos = parseInt(e.target.value, 10);
                renderStopsUI();
                updateGradient();
            });
        });

        colorStopsContainer.querySelectorAll('.stop-del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                stops.splice(i, 1);
                renderStopsUI();
                updateGradient();
            });
        });
    }

    function updateGradient() {
        const type = gradientType.value;
        const angle = angleSlider.value;
        angleVal.innerText = `${angle}°`;

        if (type === 'radial') {
            angleControlGroup.style.display = 'none';
        } else {
            angleControlGroup.style.display = 'block';
        }

        const sortedStops = [...stops].sort((a, b) => a.pos - b.pos);
        const stopsString = sortedStops.map(s => `${s.color} ${s.pos}%`).join(', ');

        let cssVal = '';
        if (type === 'linear') {
            cssVal = `linear-gradient(${angle}deg, ${stopsString})`;
        } else if (type === 'radial') {
            cssVal = `radial-gradient(circle, ${stopsString})`;
        } else if (type === 'conic') {
            cssVal = `conic-gradient(from ${angle}deg, ${stopsString})`;
        }

        gradientCanvas.style.background = cssVal;
        gradientCssOutput.value = `background: ${cssVal};`;
    }

    gradientType.addEventListener('change', () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        updateGradient();
    });

    angleSlider.addEventListener('input', () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        updateGradient();
    });

    addColorStopBtn.addEventListener('click', () => {
        if (stops.length >= 6) {
            window.Atelier.showToast('Max 6 color stops supported', 'info');
            return;
        }
        stops.push({ color: '#ff007a', pos: 50 });
        renderStopsUI();
        updateGradient();
    });

    function applyPreset(btn, type, angle, newStops) {
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gradientType.value = type;
        angleSlider.value = angle;
        stops = newStops;
        renderStopsUI();
        updateGradient();
    }

    presetEmerald.addEventListener('click', () => applyPreset(presetEmerald, 'linear', 135, [
        { color: '#00e599', pos: 0 },
        { color: '#0072ff', pos: 100 }
    ]));

    presetHyper.addEventListener('click', () => applyPreset(presetHyper, 'linear', 135, [
        { color: '#f72585', pos: 0 },
        { color: '#7209b7', pos: 50 },
        { color: '#4cc9f0', pos: 100 }
    ]));

    presetSunset.addEventListener('click', () => applyPreset(presetSunset, 'linear', 90, [
        { color: '#ff512f', pos: 0 },
        { color: '#dd2476', pos: 100 }
    ]));

    presetMidnight.addEventListener('click', () => applyPreset(presetMidnight, 'radial', 0, [
        { color: '#1e293b', pos: 0 },
        { color: '#0f172a', pos: 100 }
    ]));

    presetConic.addEventListener('click', () => applyPreset(presetConic, 'conic', 0, [
        { color: '#ef4444', pos: 0 },
        { color: '#eab308', pos: 33 },
        { color: '#3b82f6', pos: 66 },
        { color: '#ef4444', pos: 100 }
    ]));

    copyGradientCssBtn.addEventListener('click', () => {
        if (!gradientCssOutput.value) return;
        navigator.clipboard.writeText(gradientCssOutput.value).then(() => {
            window.Atelier.showToast('Copied CSS to clipboard!', 'success');
        });
    });

    renderStopsUI();
    updateGradient();
}
