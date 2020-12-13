import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ElectronService} from '../../service/electron.service';
import {MessageService, SelectItem} from 'primeng/api';
import {CalendarModule} from 'primeng/calendar';
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
import {InputSwitchModule} from 'primeng/inputswitch';
import { DatePipe } from '@angular/common';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

export interface TicketData {
  grossWeight?:string;
  tareWeight?:string;
  netWeight?:string;
  weightType?:string;
  receiptNo?: number;
  truckNumber?: string;
  purchaser?: string;
  supplier?: string;
  material?: string;
  user?: string;
  charges?:number;
  isFirstWeight?: boolean;
  isManualWeight?: boolean;
  isSecondWeight?: boolean;
  imageData1?:string;
  imageData2?:string;
  dateStr?:string;
}
@Component({
    selector: 'homepage-component',
    templateUrl: 'homepage.component.html',
  })
  export class HomePageComponent implements OnInit {
   
 
    imageData: string;
    imageData1: string;
    cameraStatus: boolean=false;

    displaySecondWeightSelectDialog: boolean=false;

    grossWeight: string;
    tareWeight : string;
    netWeight: string;
    weightType: boolean=false;
    receiptNo: number=0;
    truckNumber: string;
    purchaser: string;
    supplier: string;
    material: string;
    isFirstWeight: boolean=false;
    isManualWeight: boolean=false;
    isSecondWeight: boolean=false;
    user: string;
    charges: number;

    imageDataSave1:string;
    imageDataSave2:string;

    selectedWeight: any;
    secondWeightData: any[];

    constructor(public electronService: ElectronService, private ref: ChangeDetectorRef
      ,private messageService: MessageService,private confirmationService: ConfirmationService) {

     }


    ngOnInit() {

      const me = this;

      this.electronService.ipcRenderer.on("Cam1Feed", function (evt, result) {
        me.imageData="data:image/jpeg;base64,"+result;
        me.ref.detectChanges();
      });

      this.electronService.ipcRenderer.on("Cam2Feed", function (evt, result) {
        me.imageData1="data:image/jpeg;base64,"+result;
        me.ref.detectChanges();
      });

      this.electronService.ipcRenderer.on("SaveData", function (evt, result) {
        if(result){
          let receiptNo=me.receiptNo;
          me.confirmationService.confirm({
            message: 'Do you want to print the ticket?',
            accept: () => {
              me.electronService.ipcRenderer.send("PrintTicket",receiptNo);
            }
        });
        me.onReset();
        }
      });
      
      let supplierMasterValues1= this.electronService.ipcRenderer.sendSync("loadSupplierData")
      this.supplierMasterValues=[];
      supplierMasterValues1.forEach(element => {
        this.supplierMasterValues.push({label: element, value: element});
      });
    }

    handleCameraSwitch(event){
      let isChecked = event.checked;
      if(isChecked){
        this.electronService.ipcRenderer.send("StartCam1");
        this.electronService.ipcRenderer.send("StartCam2");
      }else{
        this.electronService.ipcRenderer.send("StopCam1");
        this.electronService.ipcRenderer.send("StopCam2");
      }
    }

    onFirstWeightClick(){
      this.isSecondWeight=false;
      this.isFirstWeight=true;
      this.isManualWeight=false;
      this.receiptNo=this.getNextReceiptNo();

      this.grossWeight=this.electronService.weightData.value+"";
      this.tareWeight="";
      this.imageDataSave1=this.imageData;
      this.imageDataSave2=this.imageData1;

    }

    onSecondWeightClick(){
     
      this.secondWeightData=this.electronService.ipcRenderer.sendSync("loadWeight2Data");
      this.displaySecondWeightSelectDialog=true;

      this.imageDataSave1=this.imageData;
      this.imageDataSave2=this.imageData1;

    }
    
    onManualWeightClick(){
      this.isFirstWeight=false;
      this.isManualWeight=true;
      this.isSecondWeight=false;
      this.receiptNo=this.getNextReceiptNo();
    }

    supplierMasterValues: any[];

    onReset(){
      let supplierMasterValues1= this.electronService.ipcRenderer.sendSync("loadSupplierData")
      this.supplierMasterValues=[];
      supplierMasterValues1.forEach(element => {
        this.supplierMasterValues.push({label: element.DataValue, value: element.DataValue});
      });

      this.isFirstWeight=false;
      this.isManualWeight=false;
      this.isSecondWeight=false;

      this.grossWeight="";
      this.tareWeight="";
      this.netWeight="";
      this.weightType=false;
     
      this.truckNumber="";
      this.purchaser="";
      this.supplier="";
      this.material="";

      this.imageDataSave1=this.imageData;
      this.imageDataSave2=this.imageData1;

      this.receiptNo=this.getNextReceiptNo();
      this.selectedWeight=null;
      
    }

    isAnyButtonClicked(){
      return (this.isFirstWeight || this.isSecondWeight || this.isManualWeight);
    }

    onChangeWeightType(event){
      if(event.checked){
        this.tareWeight=this.grossWeight;
        this.grossWeight="";
      }else{
        this.grossWeight=this.tareWeight;
        this.tareWeight="";
      }
    }

    onSave(){

      var datePipe = new DatePipe('en-US');
      let datestr = datePipe.transform(Date.now(),'dd/MM/yyyy h:mm:ss a');

      let ticketData:TicketData = {
        grossWeight:this.grossWeight,
        tareWeight:this.tareWeight,
        netWeight:this.netWeight,
        weightType:this.weightType?"T":"G",
        receiptNo: this.receiptNo,
        truckNumber: this.truckNumber,
        purchaser: this.purchaser,
        supplier: this.supplier,
        material: this.material,
        isFirstWeight: this.isFirstWeight,
        isManualWeight: this.isManualWeight,
        isSecondWeight: this.isSecondWeight,
        imageData1:this.imageDataSave1,
        imageData2:this.imageDataSave2,
        user: this.user,
        charges:this.charges,
        dateStr: datestr
      }

      this.electronService.ipcRenderer.send("SaveData",ticketData);

    }

    onSecondWeightSelect(event){
     // console.log(event.data);
      let data=event.data;
      this.grossWeight=data.GrossWeight;
      this.tareWeight=data.TareWeight;
      this.netWeight=data.NetWeight;
      
      this.weightType=data.WeightType=="T";
     
      this.truckNumber=data.TruckNumber;
      this.purchaser=data.Purchaser;
      this.supplier=data.Supplier;
      this.material=data.Material;
      this.receiptNo=data.ReceiptNo;

      if(this.weightType){
        this.grossWeight= this.electronService.weightData.value+"";
      }else{
        this.tareWeight= this.electronService.weightData.value+"";
      }

      let tareNum=Number(this.tareWeight);
      let grossNum=Number(this.grossWeight);

      if(tareNum>=grossNum){
        this.netWeight=(tareNum-grossNum)+"";
      }else{
        this.netWeight=(grossNum-tareNum)+"";
      }

      this.displaySecondWeightSelectDialog=false;


      this.isSecondWeight=true;
      this.isFirstWeight=false;
      this.isManualWeight=false;

    }

    getNextReceiptNo(){
      let nextid=this.electronService.ipcRenderer.sendSync("getNextReceiptId")[0].NextId;

      if((typeof nextid ==undefined) || nextid=="" || nextid==null){
        return 1;
      }
      return nextid;
    }


  }