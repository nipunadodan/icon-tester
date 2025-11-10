let img = null;

window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file');
    const canvasDark = document.getElementById('previewDark');
    const canvasLight = document.getElementById('previewLight');
    const blurInput = document.getElementById('blur');
    const bgColourDark = document.getElementById('bgColourDark');
    const bgColourLight = document.getElementById('bgColourLight');
    const sizeInputs = [
        document.getElementById('size1'),
        document.getElementById('size2'),
        document.getElementById('size3'),
        document.getElementById('size4')
    ];

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                img = new Image();
                img.onload = () => {
                    drawCanvas(canvasDark, bgColourDark.value);
                    drawCanvas(canvasLight, bgColourLight.value);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    blurInput.addEventListener('input', () => {
        drawCanvas(canvasDark, bgColourDark.value);
        drawCanvas(canvasLight, bgColourLight.value);
    });
    bgColourDark.addEventListener('input', () => drawCanvas(canvasDark, bgColourDark.value));
    bgColourLight.addEventListener('input', () => drawCanvas(canvasLight, bgColourLight.value));
    sizeInputs.forEach(input => input.addEventListener('input', () => {
        drawCanvas(canvasDark, bgColourDark.value);
        drawCanvas(canvasLight, bgColourLight.value);
    }));

    function drawCanvas(canvas, bgColor) {
        if (!img) return;

        const ctx = canvas.getContext('2d');
        const sizes = sizeInputs.map(input => parseInt(input.value));
        const blur = parseInt(blurInput.value);
        const padding = 40;

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = Math.max(...sizes) * 2 + padding * 3;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const maxSize = Math.max(...sizes);
        let x = padding;

        // normal images
        ctx.filter = 'none';
        sizes.forEach(size => {
            const yOffset = (maxSize - size) / 2;
            ctx.drawImage(img, x, padding + yOffset, size, size);
            x += size + padding;
        });

        // blurred images
        x = padding;
        ctx.filter = `blur(${blur}px)`;
        sizes.forEach(size => {
            const yOffset = (maxSize - size) / 2;
            ctx.drawImage(img, x, maxSize + padding * 2 + yOffset, size, size);
            x += size + padding;
        });
    }
});

