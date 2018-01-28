setTimeout(function(){ 
      const inputBox = document.getElementById('name');
      const can = document.getElementById('canvas1');
      const ctx = can.getContext('2d');

      const canWidth = ctx.canvas.width = window.innerHeight /4;
      const canHeight =  ctx.canvas.height = window.innerHeight;

      const tailHeight = canHeight / 3.5 ;
      const tailPos = canHeight / 1.4;

      function drawBoard() {
        drawWhiteBg();      
        drawName();
        drawSilhouette();
        drawWhiteBg();
        drawTail();
        drawName();
      }

      function drawWhiteBg() {
        const context = can.getContext('2d');

        context.fillStyle = "white";
        context.fillRect(0, 0, canWidth, canHeight);
      }

      function drawTail() {
        const context = can.getContext('2d');

        context.fillStyle = "red";
        context.fillRect(0, tailPos, canWidth, tailHeight);
      }

      function drawSilhouette(){
        const context = can.getContext('2d');
        const imageObj = new Image();

        imageObj.onload = function() {
          context.drawImage(imageObj, 0, canHeight / 2.04, canWidth,canHeight / 3   );
        }

        imageObj.src = 'images/silhouette.png';
      }

      function drawName(){
       
        const context = can.getContext("2d");
        const string = "SOUSA";
        const formatString = string.split('');

        let x = canWidth / 1.35;
        let y = canHeight / 8;

        let fontSize = canHeight/8;

        for (let i = 0; i < formatString.length; i++) {
          context.font = "800 " + fontSize + "px Graduate" ;
          //console.log(context.font);
        
          context.textAlign = "center";
          context.shadowColor="gray";
          context.shadowBlur=2;
          context.lineJoin = "round";
          context.lineWidth=8;

          context.strokeStyle = "white";
          context.strokeText(formatString[i], x, y);
          context.globalCompositeOperation = "destination-out";

          ctx.globalCompositeOperation = "source-over"; 
          context.fillStyle = "gray";
          context.fillText(formatString[i], x, y);
          
          y += fontSize;
        }
         
      }

      drawBoard();
    }, 30);
