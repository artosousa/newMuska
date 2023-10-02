window.addEventListener("load", function(event) {
  const can = document.getElementById('canvas1');
  const ctx = can.getContext('2d');
  const canWidth = ctx.canvas.width = window.innerHeight /4;
  const canHeight =  ctx.canvas.height = window.innerHeight;
  const tailHeight = canHeight / 2.5 ;
  const tailPos = canHeight / 0.9;

  let hasInput = false;
  let imgUrl = " ";
  
  imgObj = new Image();
  imgObj.onload = function() {

    //piecing it all together
    function drawBoard() {
      drawWhiteBg();
      drawTail();
      drawName("MCKOY");
      drawSilhouette();
    }

    //Add White Background to the graphic
    function drawWhiteBg() {
      const context = can.getContext('2d');
      context.fillStyle = "white";
      context.fillRect(0, 0, canWidth, canHeight);
    }
    //Drawing the red tail to the board
    function drawTail() {
      const context = can.getContext('2d');
      context.fillStyle = "red";
      context.fillRect(0, tailPos, canWidth, tailHeight);
    }

    //adding silhouette PNG to the board
    function drawSilhouette(){
      const context = can.getContext('2d');
      context.drawImage(imgObj, 0, canHeight / 2.04, canWidth,canHeight / 3   );

      context.save();
      context.drawImage(imgObj, 0, canHeight / 2.04, canWidth,canHeight / 3   );
      context.restore();
    }


    //setting DPI
    function setDPI(canvas, dpi) {
    // Set up CSS size.
	    canvas.style.width = canvas.style.width || canvas.width + 'px';
	    canvas.style.height = canvas.style.height || canvas.height + 'px';

	    // Get size information.
	    var scaleFactor = dpi / 96;
	    var width = parseFloat(canvas.style.width);
	    var height = parseFloat(canvas.style.height);

	    // Backup the canvas contents.
	    var oldScale = canvas.width / width;
	    var backupScale = scaleFactor / oldScale;
	    var backup = canvas.cloneNode(false);
	    backup.getContext('2d').drawImage(canvas, 0, 0);

	    // Resize the canvas.
	    var ctx = canvas.getContext('2d');
	    canvas.width = Math.ceil(width * scaleFactor);
	    canvas.height = Math.ceil(height * scaleFactor);

	    // Redraw the canvas image and scale future draws.
	    ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
	    ctx.drawImage(backup, 0, 0);
	    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
	}
    //Adding name to the board
    function drawName(string){
      const context = can.getContext("2d");
      const formatString = string.split('');
      const writeHeight = canHeight - tailHeight ;
      


      let xAxis = canWidth / 1.35;
      let yAxis = canHeight / 8;

      for (let i = 0; i < formatString.length; i++) {
        
        let fontResize = formatString.length + 1;
        //console.log(fontResize);
        let fontSize = writeHeight / fontResize;

        //console.log(fontSize);
        context.font = "800 " + fontSize + "px Graduate" ;
       
        //console.log(context.font);
        context.textAlign = "center";
        context.shadowColor="gray";
        context.shadowBlur=2;
        context.lineJoin = "round";
        context.lineWidth=8;

        context.strokeStyle = "white";
        context.strokeText(formatString[i], xAxis, yAxis);
        context.globalCompositeOperation = "destination-out";

        ctx.globalCompositeOperation = "source-over";
        context.fillStyle = "gray";
        context.fillText(formatString[i], xAxis, yAxis);

        yAxis += fontSize;

        //fontSize = writeHeight / formatString.length;

      }

      can.onclick = function(){
        showEditor();
        if(hasInput) return;
        addInput(20,20);

        var selectedInput = null;
        $(function() {
            $('input').focus(function() {
                selectedInput = this;
            }).blur(function(){
                selectedInput = null;
                ctx.clearRect(0, 0, canWidth, canHeight);
                drawWhiteBg();
                drawTail();
                drawName(this.value);
                drawSilhouette();
                document.getElementById('middle').removeChild(this);
                hasInput = false;
                showEditor();
            });
        });
      }

      function addInput(x, y) {
        var input = document.createElement('input');
        input.type = 'text';
        input.id = "editName";
        input.placeholder = "your name here";

        input.onkeydown = handleEnter;
        document.getElementById('middle').appendChild(input);
        input.focus();
        hasInput = true;

      }

      function handleEnter(e) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
        	setDPI(can, 300);
            ctx.clearRect(0, 0, canWidth, canHeight);
            drawWhiteBg();
            drawTail();
            drawName(this.value);
            drawSilhouette();
            document.getElementById('middle').removeChild(this);
            hasInput = false;
            showEditor();
        }
      }
    }
    setDPI(can, 300);
    drawBoard();

    function showEditor() {
        var editor = document.getElementById("nameeditor");
        if (editor.style.display === "none") {
            editor.style.display = "block";
        } else {
            editor.style.display = "none";
        }
    }

   function showLoader() {
      var loader = document.getElementById("loading");
      if (loader.style.display === "none") {
          loader.style.display = "block";
      } else {
          loader.style.display = "none";
      }
  }

    $(document).keyup(function(e) {
         if (e.keyCode == 27) { // escape key maps to keycode `27`
            showEditor();
        }
    });




    $("button#upload").click(function(e) {
        showLoader();
      
        try {
            var img = can.toDataURL('image/jpeg', 1).split(',')[1];

        } catch(e) {
            var img = can.toDataURL().split(',')[1];
        }
        e.preventDefault();
        $.ajax({
          url: 'https://api.imgur.com/3/image',
          type: 'post',
          headers: {
              Authorization: 'Client-ID f1b5ccacd2f48b9'
          },
          data: {
              image: img
          },
          dataType: 'json',
          success: function(response) {
            if(response.success) {
                imgUrl = response.data.link;
                //window.location = response.data.link;
                //console.log("Success Image has been uploaded and can be found here " + imgUrl);
                const coverImage = imgUrl;
                const url = 'http://www.zazzle.com/api/create/at-238092028220728468?rf=238092028220728468&ax=Linkover&pd=186437621024529370&fwd=ProductPage&ed=true&boardgraphic=' + coverImage ;
                window.location = url;
            }
          }
        });
    });

    function download_image(i){
        // Dump the canvas contents to a file.
        try {
            var img = can.toDataURL('image/jpeg', 1).split(',')[1];

        } catch(i) {
            var img = can.toDataURL().split(',')[1];
        }
       
        $.ajax({
          url: 'https://api.imgur.com/3/image',
          type: 'post',
          headers: {
              Authorization: 'Client-ID f1b5ccacd2f48b9'
          },
          data: {
              image: img
          },
          dataType: 'json',
          success: function(response) {
            if(response.success) {
                window.location = response.data.link;
            }
          }
        });
    }

    $("button#download").click(function(){
      //console.log('clicked download');
      download_image();
    });

  }
  imgObj.src = 'images/silhouette.png';
  imgObj.crossOrigin = "Anonymous";
  $('#wrapper').width($('#canvas1').width());


});
