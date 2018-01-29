
window.onload = function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
       /* canvaspreview = document.getElementById('canvas-preview'),
        ctxpreview = canvaspreview.getContext('2d'),*/
        elem = document.getElementById('taille'),
        taille = document.getElementById('taille').value,
        down = false,
        color = document.getElementById('color'),
        rect = document.getElementById('rect'),
        circle = document.getElementById('circle'),
        filled_rect = document.getElementById('filled-rect'),
        filled_circle = document.getElementById('filled-circle'),
        ecraser = document.getElementById('ecraser'),
        line = document.getElementById('line'),
        free = document.getElementById('free'),
        free_symmetric_h = document.getElementById('free_symmetric_h'),
        free_symmetric_v = document.getElementById('free_symmetric_v'),
        input = document.getElementById('file_input'),
        dl_name = document.getElementById('filename'),
        download = document.getElementById('download'),
        error = document.getElementById('error'),
        layer_contener = document.getElementById('layers-contener'),
        add_layer = document.getElementById('add-layer'),
        drawmode = 'free',
        imgname = 'test.png',
        prevx,
        prevy,
        ilayer = 1;


    function newLayer() {
        layer = document.createElement('canvas');
        layer_view = document.createElement('ul');
        layer.setAttribute('id', 'layer-'+ilayer);
        layer_view.innerHTML = '<li><a href="#" id="layer-view-'+ilayer+'">'+ilayer+'</a><button id="hide-layer-'+ilayer+'">hide</button><button id="remove-layer-'+ilayer+'" >supprimer</button></li>';
        canvas.parentNode.appendChild(layer);
        layer_contener.appendChild(layer_view);
        ilayer++;
        return layer;
    }

    function sqr(a) {
        return a*a;
    }
    /*add_layer.addEventListener('click', newLayer);*/
    canvas.addEventListener('mousedown' ,function (e) {
        down = true;
        xposclick = e.clientX - canvas.offsetLeft;
        yposclick = e.clientY - canvas.offsetTop;
        if (drawmode === 'free' || drawmode === 'ecraser') {
            ctx.beginPath();
        } else {
            prevx = xposclick;
            prevy = yposclick;
        }

    });


    canvas.addEventListener('mouseup', function (e) {
        down = false;
        xposuc= e.clientX - canvas.offsetLeft;
        yposuc= e.clientY - canvas.offsetTop;
        if (drawmode === 'circle') {
            ctx.beginPath();
            ctx.arc(xposclick, yposclick, Math.sqrt(sqr(yposuc - yposclick) + sqr(xposuc - xposclick)), 0, 2*Math.PI);
            ctx.stroke();
        } else if (drawmode==='filled_rect') {
            ctx.beginPath();
            ctx.fillRect(xposclick, yposclick, xpos-xposclick, ypos-yposclick);
            ctx.stroke();
        } else if (drawmode === 'filled_circle') {
            ctx.beginPath();
            ctx.arc(xposclick, yposclick, Math.sqrt(sqr(yposuc - yposclick) + sqr(xposuc - xposclick)), 0, 2*Math.PI);
            ctx.fill();
        }
        else if (drawmode === 'line') {
            ctx.beginPath();
            ctx.moveTo(xposclick, yposclick);
            ctx.lineTo(xpos, ypos);
            ctx.stroke();
        } else if (drawmode === 'rect') {
            ctx.rect(xposclick, yposclick, xpos-xposclick, ypos-yposclick);
            ctx.stroke();
        }

    });


    canvas.addEventListener('mousemove' ,function (e) {
        if (down) {
            draw(e);

        }
    });


    function draw(e) {
        xpos= e.offsetX;
        ypos= e.offsetY;
        if (drawmode === 'free_symmetric_h') {
            if (e.buttons === 1) {
                drawLine(prevx, prevy, xpos, ypos);
                drawLine(canvas.width - prevx, prevy, canvas.width - xpos, ypos);
            }

        } else if (drawmode === 'free_symmetric_v') {
            if (e.buttons === 1) {
                drawLine(prevx, prevy, xpos, ypos);
                drawLine(prevx, canvas.height-prevy, xpos, canvas.height - ypos);
            }
        }
        else if (drawmode === "free") {
            ctx.lineWidth = taille;
            ctx.lineTo(xpos, ypos);
            ctx.stroke();
        }
        else if (drawmode === 'ecraser') {

            ctx.strokeStyle = '#ffffff';
            ctx.lineTo(xpos, ypos);
            ctx.stroke();
            ctx.strokeStyle = color.value;
        }
        else if (drawmode==='rect') {
            /*ctx.save();
            ctx.beginPath();
            ctx.rect(xposclick, yposclick, xpos-xposclick, ypos-yposclick);
            ctx.restore();
            ctx.stroke();*/

        }

        prevx = xpos;
        prevy = ypos;
    }
    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    function downloadCanvas(link, filename) {
        link.href = canvas.toDataURL();
        link.download = filename;
    }

    /**
     * The event handler for the link's onclick event. We give THIS as a
     * parameter (=the link element), ID of the canvas and a filename.
     */
    download.addEventListener('click', function() {
        downloadCanvas(this, imgname);
    }, false);

    elem.addEventListener('change' , function () {

        taille = document.getElementById('taille').value;
        ctx.lineWidth = taille;
    });
    color.addEventListener('change', function () {
        ctx.strokeStyle = color.value;
    });
    rect.addEventListener('click', function () {
        drawmode = 'rect';
    });
    circle.addEventListener('click', function () {
        drawmode = 'circle';
    });
    filled_rect.addEventListener('click', function () {
        drawmode = 'filled_rect';
    });
    filled_circle.addEventListener('click', function () {
        drawmode = 'filled_circle';
    });
    line.addEventListener('click', function () {
        drawmode = 'line';
    });
    free.addEventListener('click', function () {
        drawmode = 'free';
    });
    ecraser.addEventListener('click', function () {
        drawmode = 'ecraser';
    });
    dl_name.addEventListener('keyup', function () {
        var regex = /.*.\.png/;
        if(dl_name.value.match(regex)) {
            imgname=dl_name.value;
            error.style.display = 'none';
        } else {
            error.style.display = 'inline-block';
        }
    });
    input.addEventListener('change', function (e) {
        var img = new Image;
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.height*(img.width/img.height), canvas.height);
            alert('the image is drawn');
        };
        img.src = URL.createObjectURL(e.target.files[0]);

    });
    free_symmetric_h.addEventListener('click', function (e) {
        drawmode = 'free_symmetric_h';
    });
    free_symmetric_v.addEventListener('click', function (e) {
        drawmode = 'free_symmetric_v';
    });


};
