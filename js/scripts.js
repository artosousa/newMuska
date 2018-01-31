window.addEventListener("load", function(event) {
  const can = document.getElementById('canvas1');
  const ctx = can.getContext('2d');
  const canWidth = ctx.canvas.width = window.innerHeight /4;
  const canHeight =  ctx.canvas.height = window.innerHeight;
  const tailHeight = canHeight / 3.5 ;
  const tailPos = canHeight / 1.4;



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

    function addInput(x, y) {
      var input = document.createElement('input');
      input.type = 'text';
      input.style.position = 'fixed';
      input.style.left = (x - 4) + 'px';
      input.style.top = (y - 4) + 'px';

      input.onkeydown = handleEnter;
      document.body.appendChild(input);
      input.focus();
      hasInput = true;
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

        console.log(fontSize);
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
        if(hasInput) return;
        addInput(20,20);

      }

      function addInput(x, y) {
        var input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'fixed';
        input.style.left = (x - 4) + 'px';
        input.style.top = (y - 4) + 'px';

        input.onkeydown = handleEnter;
        document.body.appendChild(input);
        input.focus();
        hasInput = true;
      }

      function handleEnter(e) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            ctx.clearRect(0, 0, canWidth, canHeight);
            drawWhiteBg();
            drawTail();
            drawName(this.value);
            drawSilhouette();
            document.body.removeChild(this);
            hasInput = false;
        }
      }
    }

    drawBoard();

    $("button#upload").click(function(e) {

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

  }

  imgObj.src = 'http://muska-new.surge.sh/images/silhouette.png';

});