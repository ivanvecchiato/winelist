export default class Product {
  constructor() {
    this.id = '';
    this.code = 0;
    this.name = '';
    this.type = ''; // bianco, rosso, rosato, spumante, dolce.
    this.designation = ''; // denominazione
    this.description = '';
    this.winery = {
      id: '',
      name: ''
    };
    this.grapes = '';
    this.flavour = '',
    this.alcohol = '',
    this.country = '';
    this.region = '';
    this.vintage = '';
    this.size = 0.75;
    this.price = 0.0;
    this.cost = 0.0;    // prezzo di acquisto
    this.barcodes = [];   // String array
    this.inventory = {
      enabled: false,
      availability: 0,
      stock: 0,
      alarm: 0
    },
    this.imgUrls = [];
    this.status = 1;  // 1=active, 0=inactive; -1 deleted
    this.pairings = [];
    this.favorite = false;
  }
}
