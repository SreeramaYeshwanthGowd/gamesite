// Drawing Game for Purvi Pinki Games
// This game implements a simple drawing canvas with various tools

// Canvas and context
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing settings
let currentTool = 'pencil'; // pencil, eraser, shape
let currentColor = '#000000';
let currentSize = 5;
let currentShape = 'circle'; // circle, square, line

// Initialize the game
function initDrawingGame() {
    // Create game container
    const gameContainer = document.getElementById('game-content');
    gameContainer.innerHTML = `
        <div class="drawing-container">
            <div class="drawing-toolbar">
                <div class="tool-section">
                    <h3>Tools</h3>
                    <div class="tool-buttons">
                        <button id="pencil-tool" class="tool-btn active" title="Pencil">
                            <img src="assets/pencil-icon.png" alt="Pencil" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><path d=%22M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z%22 fill=%22%23333%22/></svg>'">
                        </button>
                        <button id="eraser-tool" class="tool-btn" title="Eraser">
                            <img src="assets/eraser-icon.png" alt="Eraser" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><path d=%22M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.77-.78 2.04 0 2.83L5.03 20h7.97l8.41-8.41c.78-.78.78-2.05 0-2.83l-4.85-4.85c-.39-.39-.9-.59-1.41-.59M6.42 18L3.5 15.08l6.18-6.19 2.93 2.93L6.42 18z%22 fill=%22%23333%22/></svg>'">
                        </button>
                        <button id="shape-tool" class="tool-btn" title="Shapes">
                            <img src="assets/shape-icon.png" alt="Shapes" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><path d=%22M11 13h2v2h-2zm0-6h2v2h-2zm0 3h2v2h-2zM7 7h2v2H7zm0 3h2v2H7zm0 3h2v2H7zM3 7h2v2H3zm0 3h2v2H3zm0 3h2v2H3zM3 3h18v2H3zm0 16h18v2H3z%22 fill=%22%23333%22/></svg>'">
                        </button>
                    </div>
                </div>
                
                <div class="tool-section" id="shape-options" style="display: none;">
                    <h3>Shapes</h3>
                    <div class="shape-buttons">
                        <button id="circle-shape" class="shape-btn active" title="Circle">⭕</button>
                        <button id="square-shape" class="shape-btn" title="Square">⬛</button>
                        <button id="line-shape" class="shape-btn" title="Line">➖</button>
                    </div>
                </div>
                
                <div class="tool-section">
                    <h3>Color</h3>
                    <input type="color" id="color-picker" value="#000000">
                    <div class="color-presets">
                        <button class="color-btn" style="background-color: #000000;" data-color="#000000"></button>
                        <button class="color-btn" style="background-color: #ff0000;" data-color="#ff0000"></button>
                        <button class="color-btn" style="background-color: #00ff00;" data-color="#00ff00"></button>
                        <button class="color-btn" style="background-color: #0000ff;" data-color="#0000ff"></button>
                        <button class="color-btn" style="background-color: #ffff00;" data-color="#ffff00"></button>
                        <button class="color-btn" style="background-color: #ff00ff;" data-color="#ff00ff"></button>
                    </div>
                </div>
                
                <div class="tool-section">
                    <h3>Size</h3>
                    <input type="range" id="size-slider" min="1" max="50" value="5">
                    <span id="size-value">5px</span>
                </div>
            </div>
            
            <div class="canvas-container">
                <canvas id="drawing-canvas" width="800" height="500"></canvas>
            </div>
            
            <div class="drawing-controls">
                <button id="clear-canvas" class="game-button">Clear Canvas</button>
                <button id="save-drawing" class="game-button">Save Drawing</button>
            </div>
        </div>
    `;

    // Add game-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .drawing-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        .drawing-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin-bottom: 1rem;
            background-color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
        }
        .tool-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .tool-section h3 {
            margin: 0 0 0.5rem 0;
            color: #118ab2;
            font-size: 1rem;
        }
        .tool-buttons, .shape-buttons {
            display: flex;
            gap: 0.5rem;
        }
        .tool-btn, .shape-btn {
            width: 40px;
            height: 40px;
            border: 2px solid #ddd;
            border-radius: 5px;
            background-color: white;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.2s;
        }
        .tool-btn img {
            width: 24px;
            height: 24px;
        }
        .tool-btn.active, .shape-btn.active {
            border-color: #118ab2;
            background-color: #e6f7ff;
        }
        .color-presets {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .color-btn {
            width: 30px;
            height: 30px;
            border: 2px solid #ddd;
            border-radius: 50%;
            cursor: pointer;
        }
        #color-picker {
            width: 100%;
            height: 30px;
            border: none;
            cursor: pointer;
        }
        #size-slider {
            width: 100%;
            margin: 0.5rem 0;
        }
        .canvas-container {
            margin: 1rem 0;
        }
        #drawing-canvas {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            cursor: crosshair;
        }
        .drawing-controls {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        .game-button {
            background-color: #ffd166;
            border: none;
            border-radius: 30px;
            padding: 0.5rem 1.5rem;
            font-family: 'Comic Neue', sans-serif;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .game-button:hover {
            background-color: #ffbd00;
        }
        
        @media (max-width: 768px) {
            .drawing-toolbar {
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }
            .tool-section {
                width: 100%;
            }
            #drawing-canvas {
                max-width: 100%;
                height: auto;
            }
        }
    `;
    document.head.appendChild(style);

    // Get canvas and context
    canvas = document.getElementById('drawing-canvas');
    ctx = canvas.getContext('2d');
    
    // Set initial canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Tool selection
    document.getElementById('pencil-tool').addEventListener('click', () => setTool('pencil'));
    document.getElementById('eraser-tool').addEventListener('click', () => setTool('eraser'));
    document.getElementById('shape-tool').addEventListener('click', () => setTool('shape'));
    
    // Shape selection
    document.getElementById('circle-shape').addEventListener('click', () => setShape('circle'));
    document.getElementById('square-shape').addEventListener('click', () => setShape('square'));
    document.getElementById('line-shape').addEventListener('click', () => setShape('line'));
    
    // Color selection
    document.getElementById('color-picker').addEventListener('input', (e) => setColor(e.target.value));
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => setColor(btn.getAttribute('data-color')));
    });
    
    // Size selection
    document.getElementById('size-slider').addEventListener('input', (e) => {
        setSize(e.target.value);
        document.getElementById('size-value').textContent = `${e.target.value}px`;
    });
    
    // Clear canvas
    document.getElementById('clear-canvas').addEventListener('click', clearCanvas);
    
    // Save drawing
    document.getElementById('save-drawing').addEventListener('click', saveDrawing);
    
    // Play start sound
    window.gameUtils.playSound('click');
}

// Set the current drawing tool
function setTool(tool) {
    currentTool = tool;
    
    // Update UI
    document.getElementById('pencil-tool').classList.toggle('active', tool === 'pencil');
    document.getElementById('eraser-tool').classList.toggle('active', tool === 'eraser');
    document.getElementById('shape-tool').classList.toggle('active', tool === 'shape');
    
    // Show/hide shape options
    document.getElementById('shape-options').style.display = tool === 'shape' ? 'block' : 'none';
    
    // Update cursor
    if (tool === 'eraser') {
        canvas.style.cursor = 'url(data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22 fill=%22white%22 stroke=%22black%22 stroke-width=%222%22/></svg>) 12 12, auto';
    } else {
        canvas.style.cursor = 'crosshair';
    }
    
    // Play sound
    window.gameUtils.playSound('click');
}

// Set the current shape
function setShape(shape) {
    currentShape = shape;
    
    // Update UI
    document.getElementById('circle-shape').classList.toggle('active', shape === 'circle');
    document.getElementById('square-shape').classList.toggle('active', shape === 'square');
    document.getElementById('line-shape').classList.toggle('active', shape === 'line');
    
    // Play sound
    window.gameUtils.playSound('click');
}

// Set the current color
function setColor(color) {
    currentColor = color;
    document.getElementById('color-picker').value = color;
    
    // Play sound
    window.gameUtils.playSound('click');
}

// Set the current brush size
function setSize(size) {
    currentSize = size;
    
    // Play sound
    window.gameUtils.playSound('click');
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Play sound
    window.gameUtils.playSound('error');
}

// Save the drawing
function saveDrawing() {
    // Create a temporary link
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    link.click();
    
    // Play sound
    window.gameUtils.playSound('success');
}

// Start drawing
function startDrawing(e) {
    isDrawing = true;
    
    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    
    // If using shape tool, just record the start position
    if (currentTool === 'shape') {
        return;
    }
    
    // Start drawing
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    
    // Draw a single dot if just clicked
    if (currentTool === 'pencil') {
        ctx.fillStyle = currentColor;
        ctx.arc(lastX, lastY, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentTool === 'eraser') {
        ctx.fillStyle = 'white';
        ctx.arc(lastX, lastY, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Play sound
    window.gameUtils.playSound('drawingSound');
}

// Draw on the canvas
function draw(e) {
    if (!isDrawing) return;
    
    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // If using shape tool, just preview the shape
    if (currentTool === 'shape') {
        // Redraw canvas to clear previous preview
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
        
        // Draw shape preview
        drawShape(lastX, lastY, currentX, currentY);
        return;
    }
    
    // Draw line
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    
    if (currentTool === 'pencil') {
        ctx.strokeStyle = currentColor;
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = 'white';
    }
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    // Update last position
    lastX = currentX;
    lastY = currentY;
}

// Stop drawing
function stopDrawing(e) {
    if (!isDrawing) return;
    
    // If using shape tool, draw the final shape
    if (currentTool === 'shape') {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        drawShape(lastX, lastY, currentX, currentY);
    }
    
    isDrawing = false;
}

// Draw a shape
function drawShape(startX, startY, endX, endY) {
    ctx.lineWidth = currentSize;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    
    switch (currentShape) {
        case 'circle':
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
            
        case 'square':
            const width = endX - startX;
            const height = endY - startY;
            ctx.beginPath();
            ctx.rect(startX, startY, width, height);
            ctx.stroke();
            break;
            
        case 'line':
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            break;
    }
}

// Handle touch events
function handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
}

// Initialize the game when loaded
initDrawingGame();
