// Modules to control application life and create native browser window

const {app, BrowserWindow,ipcMain,shell } = require('electron')
const path = require('path')
var sqlite3 = require('sqlite3')
let db = new sqlite3.Database('./DB/_database.sqlite');
const url = require('url')
const os = require('os')
var hogan = require("hogan.js");

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nativeWindowOpen: true
    }
  });
  mainWindow.maximize();
  mainWindow.show();

  //create hidden window 
 const secondWindow = new BrowserWindow({
  show: false,
  webPreferences: {
      nodeIntegration: true
  }
});

  // and load the index.html of the app.
  mainWindow.loadFile('dist/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

 /* db.run(`create table WeightData
  (
  ReceiptNo NUMERIC,
  GrossWeight NUMERIC,
  TareWeight	NUMERIC,
  NetWeight	NUMERIC,
  isfirstWeight BOOLEAN,
  isManualWeight BOOLEAN,
  isFinalWeight BOOLEAN,
  WeightType VARCHAR(2),
  TruckNumber		VARCHAR(50),
  Purchaser		VARCHAR(50),
  Supplier		VARCHAR(50),
  User			VARCHAR(50),
  charges			VARCHAR(50),
  firstWeightTime	DATETIME,
  secondWeightTime DATETIME,
  
  firstWeightImage1	CLOB,
  firstWeightImage2	CLOB,
  secondWeightImage1	CLOB,
  secondWeightImage2	CLOB
  )
  `);
*/

   // insert one row into the langs table
  /*db.run(`INSERT INTO langs(name) VALUES(?)`, ['C'], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

*/

var template = `
<h2 style="text-align: center;margin: 2px;"><strong>Kalsi Computerized Dharam Kanda</strong></h2>
<div style="text-align: center;"><strong>Mehar Chand road, Gurdaspur, Punjab</strong></div>
<div style="text-align: center;"><strong>Tel: 9814049491, 9781349491</strong></div>
<p style="margin: 2px;"><strong>&nbsp;</strong></p>
<div style="
    padding: 2px;
    border: 1px solid;
">
<table style="width: 80%; margin-left: auto; margin-right: auto;    margin-bottom: 8px;">
   <tbody>
      <tr>
         <td width="25%">
            <p style="text-align: left;">Serial No :</p>
         </td>
         <td width="25%"
            <p>{{ReceiptNo}}</p>
         </td>
         <td width="25%">
            <p style="text-align: left;">Vehicle No.</p>
         </td>
         <td width="25%">
            <p>{{TruckNumber}}</p>
         </td>
      </tr>
      <tr>
         <td width="25%">
            <p style="text-align: left;">Purchaser :</p>
         </td>
         <td width="25%">
            <p>{{Purchaser}}</p>
         </td>
         <td width="25%">
            <p style="text-align: left;">Supplier:</p>
         </td>
         <td width="25%">
            <p>{{Supplier}}</p>
         </td>
      </tr>
	   <tr>
         <td width="25%">
            <p style="text-align: left;">Material :</p>
         </td>
         <td width="25%">
            <p>{{Material}}</p>
         </td>
         <td colspan="2" width="50%">
           &nbsp;
         </td>
      </tr>
       </tbody>
</table>
{{#printTicket1}}
<table style="width: 65%; margin-left: auto; margin-right: auto;    margin-bottom: 8px;">
   <tbody>

      <tr>
         <td width="25%">
            <p style="text-align: right;">{{weightLabel}} Weight :</p>
         </td>
         <td width="25%">
            <p style="text-align: right;">{{weightValue}}</p>
         </td>
         <td width="50%">
            <p style="text-align: center;">{{firstWeightTime}}</p>
         </td>
      </tr>
   </tbody>
</table>
{{/printTicket1}}

{{#printTicketManual}}
<table style="width: 65%; margin-left: auto; margin-right: auto;    margin-bottom: 8px;">
    <tbody>

    <tr>
      <td width="25%">
          <p style="text-align: right;">Gross Weight :</p>
      </td>
      <td width="25%">
          <p style="text-align: right;">{{GrossWeight}}</p>
      </td>
      <td width="50%">
          <p style="text-align: center;">{{firstWeightTime}}</p>
      </td>
    </tr>
    <tr>
      <td width="25%">
          <p style="text-align: right;">Tare Weight :</p>
      </td>
      <td width="25%">
          <p style="text-align: right;">{{TareWeight}}</p>
      </td>
      <td width="50%">
          <p style="text-align: center;">{{firstWeightTime}}</p>
      </td>
    </tr>
    <tr>
      <td width="25%">
          <p style="text-align: right;">Net Weight :</p>
      </td>
      <td width="25%">
          <p style="text-align: right;">{{NetWeight}}</p>
      </td>
      <td width="50%">
          <p><strong>&nbsp;</strong></p>
      </td>
    </tr>
    </tbody>
</table>
{{/printTicketManual}}

</div>
<br/>

<table style=" margin-left: auto; margin-right: auto;">
   <tbody>
      <tr>
         <td style="width: 50%;"> <img id="img" src="{{ firstWeightImage1 }}"></td>
         <td style="width: 50%;"> <img id="img" src="{{ firstWeightImage2 }}"></td>
      </tr>
   </tbody>
</table>
<br/>

{{#printTicket2}}
<br/>
<h2 style="text-align: center;margin: 2px;"><strong>Kalsi Computerized Dharam Kanda</strong></h2>
<div style="text-align: center;"><strong>Mehar Chand road, Gurdaspur, Punjab</strong></div>
<div style="text-align: center;"><strong>Tel: 9814049491, 9781349491</strong></div>
<p style="margin: 2px;"><strong>&nbsp;</strong></p>
<div style="
    padding: 2px;
    border: 1px solid;
">
<table style="width: 80%; margin-left: auto; margin-right: auto;    margin-bottom: 8px;">
   <tbody>
      <tr>
         <td width="25%">
            <p style="text-align: left;">Serial No :</p>
         </td>
         <td width="25%"
            <p>{{ReceiptNo}}</p>
         </td>
         <td width="25%">
            <p style="text-align: left;">Vehicle No.</p>
         </td>
         <td width="25%">
            <p>{{TruckNumber}}</p>
         </td>
      </tr>
      <tr>
         <td width="25%">
            <p style="text-align: left;">Purchaser :</p>
         </td>
         <td width="25%">
            <p>{{Purchaser}}</p>
         </td>
         <td width="25%">
            <p style="text-align: left;">Supplier:</p>
         </td>
         <td width="25%">
            <p>{{Supplier}}</p>
         </td>
      </tr>
	   <tr>
         <td width="25%">
            <p style="text-align: left;">Material :</p>
         </td>
         <td width="25%">
            <p>{{Material}}</p>
         </td>
         <td colspan="2" width="50%">
           &nbsp;
         </td>
      </tr>
       </tbody>
</table>
<table style="width: 65%; margin-left: auto; margin-right: auto;    margin-bottom: 8px;">
    <tbody>

    <tr>
      <td width="25%">
          <p style="text-align: right;">Gross Weight :</p>
      </td>
      <td width="25%">
          <p style="text-align: right;">{{GrossWeight}}</p>
      </td>
      <td width="50%">
          <p style="text-align: center;">{{grossWeightTime}}</p>
      </td>
    </tr>
    <tr>
      <td width="25%">
          <p style="text-align: right;">Tare Weight :</p>
      </td>
      <td width="25%">
          <p style="text-align: right;">{{TareWeight}}</p>
      </td>
      <td width="50%">
          <p style="text-align: center;">{{tareWeightTime}}</p>
      </td>
    </tr>
    <tr>
      <td width="25%">
          <p style="text-align: right;">Net Weight :</p>
      </td>
      <td width="25%">
          <p style="text-align: right;">{{NetWeight}}</p>
      </td>
      <td width="50%">
          <p><strong>&nbsp;</strong></p>
      </td>
    </tr>
    </tbody>
</table>
</div>
<br/>

<table style=" margin-left: auto; margin-right: auto;">
   <tbody>
      <tr>
         <td style="width: 50%;"> <img id="img" src="{{ secondWeightImage1 }}"></td>
         <td style="width: 50%;"> <img id="img" src="{{ secondWeightImage2 }}"></td>
      </tr>
   </tbody>
</table>
{{/printTicket2}}

`;
var hello = hogan.compile(template);


  ipcMain.on("loadWeight2Data", function (event, arg) {
    db.all('Select * from WeightData where isFinalWeight=0 and isManualWeight=0 order by ReceiptNo desc', (err, results) => {
      if (err) {
        mainWindow.webContents.send("errorMessage","Some error while getting data for second weight"+ err.message)
        console.log(err)
      } else {
        event.returnValue=results;
      }
    })
  });

  ipcMain.on("getNextReceiptId", function (event, arg) {
    db.all('Select max(ReceiptNo)+1 as NextId from WeightData', (err, results) => {
      if (err) {
        mainWindow.webContents.send("errorMessage","Some error while getting next Receipt no "+ err.message)
        console.log(err)
      } else {
        event.returnValue=results;
      }
    })
  });

  var cam1Feed = function(data) {
    var myData=data.toString('base64');
    mainWindow.webContents.send("Cam1Feed", myData)
   };

   var cam2Feed = function(data) {
    var myData=data.toString('base64');
    mainWindow.webContents.send("Cam2Feed", myData)
   };

  ipcMain.on("StartCam1", function () {
    cam1FFMpedStream.on('data', cam1Feed );   
   });
  ipcMain.on("StartCam2", function () {
    cam2FFMpedStream.on('data', cam2Feed );
   });

   ipcMain.on("StopCam1", function () {
    cam1FFMpedStream.removeListener('data', cam1Feed );   
   });
  ipcMain.on("StopCam2", function () {
    cam2FFMpedStream.removeListener('data', cam2Feed );   
   });

   let query="";
   let values="";

   ipcMain.on("SaveData",(kalsi,store) => {
      if(store.isFirstWeight || store.isManualWeight){
        query=`INSERT INTO WeightData (ReceiptNo,GrossWeight,TareWeight,NetWeight,isfirstWeight,isManualWeight,isFinalWeight,WeightType,TruckNumber,Purchaser,Supplier,User,charges,firstWeightTime,firstWeightImage1,firstWeightImage2,Material) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?)`;
        values = [store.receiptNo,store.grossWeight,store.tareWeight,store.netWeight,store.isFirstWeight,store.isManualWeight,store.isSecondWeight,store.weightType,store.truckNumber,store.purchaser,store.supplier,store.user,store.charges,store.imageData1,store.imageData2,store.material]
  
      }else if(store.isSecondWeight){
        query=`Update WeightData set GrossWeight=?,TareWeight=?,NetWeight=?,isFinalWeight=?,secondWeightTime=CURRENT_TIMESTAMP,secondWeightImage1=?,secondWeightImage2=? where ReceiptNo=?`;
        values = [store.grossWeight,store.tareWeight,store.netWeight,true,store.imageData1,store.imageData2,store.receiptNo]
      }

      db.run(query,values, function(err) {
        if (err) {
          mainWindow.webContents.send("errorMessage", err.message)
          mainWindow.webContents.send("SaveData", false)
          
          return console.log(err.message);
        }
        mainWindow.webContents.send("Message", `Data has been inserted Successfully`)
        mainWindow.webContents.send("SaveData", true)

        console.log(`Data has been inserted Successfully`);
      });


      
   });

   ipcMain.on('PrintTicket',(event,receiptNo)=>{
      
      //console.log(outt);
      let values;
      db.all('Select * from WeightData where ReceiptNo = '+receiptNo, (err, results) => {
        if (err) {
          mainWindow.webContents.send("errorMessage","Some error while getting data "+ err.message)
          console.log(err)
        } else {
          values=results[0];

          if(values.isfirstWeight && !values.isFinalWeight ){
            values.printTicket1="printTicket1";
            if(values.WeightType == 'T'){
              values.weightLabel="Tare"
              values.weightValue=values.TareWeight
            }else{
              values.weightLabel="Gross"
              values.weightValue=values.GrossWeight
            }
          }else if(values.isManualWeight){
            values.printTicketManual="printTicketManual";
          }else if(values.isFinalWeight){
            values.printTicket1="printTicket1";
            values.printTicket2="printTicket2";
            if(values.WeightType == 'T'){
              values.weightLabel="Tare"
              values.weightValue=values.TareWeight
              values.tareWeightTime=values.firstWeightTime;
              values.grossWeightTime=values.secondWeightTime;
            }else{
              values.weightLabel="Gross"
              values.weightValue=values.GrossWeight
              values.grossWeightTime=values.firstWeightTime;
              values.tareWeightTime=values.secondWeightTime;
            }
          }

          var outt=hello.render(values);

          secondWindow.webContents.send("printPDF", outt,values);
        }
      })
   })

   ipcMain.on("Print",(event,store) => {
   const win = BrowserWindow.fromWebContents(event.sender)
   win.webContents.printToPDF({}).then(data => {
    const pdfPath = path.join(__dirname, 'reports','Ticket_No_'+store.ReceiptNo+'.pdf')
      fs.writeFile(pdfPath, data, (error) => {
       if (error) throw error
       console.log(`Wrote PDF successfully to ${pdfPath}`)
       mainWindow.webContents.send("Message", `Wrote PDF successfully to ${pdfPath}`)
     })
   }).catch(error => {
     mainWindow.webContents.send("errorMessage",`Failed to write PDF to ${pdfPath}: `+ error.message)
     console.log(`Failed to write PDF to ${pdfPath}: `, error)
   })
  });


 
  // hide the hidden window on ready to show
  //secondWindow.once('ready-to-show', () => win.hide())
  secondWindow.loadURL('file://' + __dirname + '/printWorker.html');

// send data to hidden window
ipcMain.on('printPDF', (event, content ) => {
  win.webContents.send('printPDF', content);
});

  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})



var fs = require('fs');

var rtsp = require("rtsp-ffmpeg");
const { data } = require('jquery');

var cam1FFMpedStream = new rtsp.FFMpeg({
  input: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
  rate: 1,
  resolution: "260x210"
});

var cam2FFMpedStream = new rtsp.FFMpeg({
  input: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
  rate: 1,
  resolution: "260x210"
});



/*io.on('connection', function(socket) {
  var pipeStream = function(data) {
    socket.emit('data', data.toString('base64'));
  };
  stream.on('data', pipeStream);
  socket.on('disconnect', function() {
    stream.removeListener('data', pipeStream);
  });
});

*/
/*
stream.on("data", data => {
  // img = document.getElementById("img");
  //img.src = "data:image/jpeg;base64," + data.toString('base64');
  // var vid = document.getElementById("video");
  // vid.src = data;
  var bytes = new Uint8Array(data);

  var blob = new Blob([bytes], {
    type: 'application/octet-binary'
  });

  var url = URL.createObjectURL(blob);

  var img = new Image;

  var ctx = canvas[0].getContext("2d");

  img.onload = function () {
    URL.revokeObjectURL(url);
    ctx.drawImage(img, 100, 100);
  };

  img.src = url;
  console.log(data);
});
*/

//stream.start();
    

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.allowRendererProcessReuse = false
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
