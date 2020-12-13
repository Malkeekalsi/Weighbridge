import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ElectronService} from '../../service/electron.service';
import {MessageService, SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {CardModule} from 'primeng/card';
import * as $ from 'jquery';
import {InputTextModule} from 'primeng/inputtext';


interface Port {
    name: string,
    code: string
}

@Component({
    selector: 'header-component',
    templateUrl: 'header.component.html',
  })
  export class HeaderComponent implements OnInit,OnDestroy {
    displayModal : boolean=false;
    portList: SelectItem[]=[];
    selectedPort: string;
    public portOpts = { baudRate: 9600, autoOpen: false };
    public port: any;
    screen: number=0;
  
    public today = Date.now();

   

    constructor(public electronService: ElectronService, private ref: ChangeDetectorRef,private messageService: MessageService) {
    
      setInterval(() => {
        this.today = Date.now();
      }, 100);
     }
  
  
  ngOnDestroy(): void {
    this.port.close();
  }

  
    ngOnInit() {

      let me=this;
      this.electronService.ipcRenderer.on("Message", function (evt, result) {
        me.messageService.add({severity:'success', summary: 'Success', detail: result});
      });

      this.electronService.ipcRenderer.on("errorMessage", function (evt, result) {
        me.messageService.add({severity:'error', summary: 'error', detail: result});
      });

    }

    scan() {
        this.portList = []
        this.electronService.serialPort.list().then(ports => {
            ports.forEach(port => {
                this.portList.push({label: port.path,value: port.path});
            });
        });
    }

    
  openPort() {
    this.port=null;
    this.port = new this.electronService.serialPort(
      this.selectedPort,
      this.portOpts,
      err => {
        if (err) {
            this.messageService.add({severity:'error', summary: 'error', detail: 'Error opening port: ' + err.message});
        }
      }
    );

    //this.readLine =  this.electronService.serialPort.parsers.Readline

    const readLine=new this.electronService.serialPort.parsers.Readline({ delimiter: '\r\n' });

    const parser = this.port.pipe(readLine)


    this.port.on('open', () => {
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Port opened: ' + this.selectedPort});
    });

    parser.on('data', (data : string) => {
     this.screen=Number(data);
     this.electronService.weightData.next(this.screen);
     this.ref.detectChanges()
    });

    this.port.open(err => {
      if (err) {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error opening port: ' + this.selectedPort});
      }
    });
  }

  data:any[];
  showPrintView: boolean=false;
  selectedWeight: any;
  printViewTicket(){
    this.data=this.electronService.ipcRenderer.sendSync("loadAllData");
    this.showPrintView=true;
  }

  printTicket(ticketNo){
    this.electronService.ipcRenderer.send("PrintTicket",ticketNo);
  }

  showPartyMaster:boolean=false;
  supplierMasterValues: any[];
  supplier: string;
  loadSupplierMaster(){
    this.showPartyMaster=true;
    this.supplierMasterValues= this.electronService.ipcRenderer.sendSync("loadSupplierData")
  }

  insertIntoSupplier(){
    this.electronService.ipcRenderer.sendSync("insertSupplier",this.supplier);
    this.supplierMasterValues= this.electronService.ipcRenderer.sendSync("loadSupplierData")
    this.supplier="";
  }

  deleteSupplier(value){
    this.electronService.ipcRenderer.sendSync("deleteSupplier",value)
    this.supplierMasterValues= this.electronService.ipcRenderer.sendSync("loadSupplierData")

  }
    
  }