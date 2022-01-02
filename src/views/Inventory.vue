<template>
  <div class="inventory">
    <div class="h1">{{$t('product.products')}}</div>
    <b-container fluid>
      <b-row>
        <b-col cols="4">
          <b-button variant="outline-info" pill @click="newProduct">{{
            $t("product.new")
          }}</b-button>
        </b-col>

        <b-col cols="4">
          <b-button
            variant="success"
            size="small"
            plain
            @click="exportCSV">{{ $t("inventory.export") }}</b-button>
        </b-col>
        <b-col cols="6">
          <input :label="$t('inventory.import')" type="file" @change="loadTextFromFile"/>
        </b-col>
      </b-row>

      <div v-if="products.length == 0" style="margin:10px">
        nessun prodotto
      </div>
      <div v-else>
        <b-table :fields="fields" :items="products" responsive="sm">
          <template #cell(stock)="data">
            <span :class="getAvailabilityColor(data.item.inventory)">
              {{ data.item.inventory.stock}}
            </span>
          </template>
          <template #cell(winery)="data">
            <span class="winery">
              {{ data.item.winery.name}}
            </span>
          </template>
          <template #cell(modify)="data">
              <b-icon icon="pencil-fill" scale="1.2" variant="danger"
              @click="editProduct(data.item)"></b-icon>
          </template>
          <template #cell(select)="data">
            <b-icon :icon="getStarIcon(data.item)" scale="1.2"
              @click="selectProduct(data.item)"></b-icon>
          </template>
        </b-table>
      </div>

      <div>
        <b-modal
          ref='product-details-dialog'
          :title="getHeader()"
          @ok="handleOk"
          @hidden="onHidden"
          size="lg">
          <template #header>
            <h2>{{$t('product.product')}}</h2>
          </template>
          <slot>
            <div>
              <product-form
                :data="currentProduct"
                :documentId="documentId"
                :categories="categories"
                :key="randKey()"
                @productUpdated="productUpdated"
                @productCreated="productCreated"
                @productCanceled="productCanceled"
              />
            </div>
          </slot>
          <template #footer>
            footer
          </template>
        </b-modal>
      </div>

    </b-container>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js"
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { addDoc, onSnapshot } from "firebase/firestore"; 
import { doc, setDoc, deleteDoc } from "firebase/firestore";

import utils from "../utils.js";
import Product from "../data/Product.js";
import ProductForm from "../components/ProductForm.vue";

export default {
  name: "Inventory",
  components: { ProductForm },
  data() {
    return {
      fields: [
        {key: 'code', label: this.$t('product.code')},
        {key: 'name', label: this.$t('product.name')},
        {key: 'winery', label: this.$t('product.winery')},
        {key: 'price', label: this.$t('product.price')},
        {key: 'modify', label: this.$t('product.edit')},
        {key: 'select', label: this.$t('product.favorite')},
        {key: 'stock', label: this.$t('inventory.stock')}
      ],
      currentProduct: new Product(),
      documentId: "",
      categories: [],
      products: [],
    };
  },
  methods: {
    loadTextFromFile: function(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.readFile(files[0]);
    },
    getStarIcon: function(p) {
      if(p.favorite == undefined || p.favorite == false) {
        console.log('getStarIcon', false)
        return 'star'
      } else {
        console.log('getStarIcon', true)
        return 'star-fill'    
      }
    },
    async deleteArchive() {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "wines"));
      const querySnapshot = await getDocs(q);
      var ids = [];
      querySnapshot.forEach((doc) => {
        ids.push(doc.id);
      });

      for(var i=0; i<ids.length; i++) {
        await deleteDoc(doc(db, "wines", ids[i]));
      }
    },
    async readFile(file) {
      let reader = new FileReader();
      await this.deleteArchive();
      reader.onload = e => {
        var lines = e.target.result.split('\n');
        for(var i=1; i<lines.length; i++) {
          console.log(lines[i])
          if(lines[i].length > 0) {
            this.insertCSVLine(lines[i]);
          }
        }
      };
      reader.readAsText(file);
    },
    async insertCSVLine(line) {
      var data = line.split(';');
      var p = new Product;
      var index = 0;
      p.code = data[index++];
      p.name = data[index++];
      p.designation = data[index++];
      p.type = data[index++];
      p.description = data[index++];
      p.flavour = data[index++];
      p.winery.id = data[index++];
      p.winery.name = data[index++];
      p.grapes = data[index++];
      p.country = data[index++];

      p.region = data[index++];
      p.alcohol = data[index++];
      p.vintage = data[index++];
      p.size = data[index++];
      p.price = Number(data[index++]).toFixed(2);
      p.cost = Number(data[index++]).toFixed(2);
      p.barcodes[0] = data[index++];
      p.imgUrls[0] = data[index++];
      p.notes = data[index++];
      p.inventory.stock = data[index++];
      p.inventory.availability = p.inventory.stock;

      const db = getFirestore(firebaseApp);
      const docRef = await addDoc(
        collection(db, "wines"),
        Object.assign({}, p)
      );

      const winRef = doc(db, 'wineries', p.winery.id);
      await setDoc(winRef, p.winery, { merge: true });

      console.log('insertCSVLine', p.code, docRef)
    },
    onHidden() {

    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      //bvModalEvt.preventDefault()
      console.log('handleOk', this.currentProduct, bvModalEvt);
      if(this.currentProduct.id == '') {
        this.insertNewProduct();
      } else {
        this.updateProduct();
      }
    },
    async updateProduct() {
      const db = getFirestore(firebaseApp);
      var d = doc(db, 'wines', this.currentProduct.id);
      await setDoc(
        d,
        Object.assign({}, this.currentProduct)
      );
      console.log('updateProduct', d);
    },
    async insertNewProduct() {
      const db = getFirestore(firebaseApp);
      const docRef = await addDoc(
        collection(db, "wines"),
        Object.assign({}, this.currentProduct)
      );
      console.log('insertNewProduct', docRef)
    },
    getHeader: function() {
      if(this.currentProduct.id == 0)
        return this.$t('product.new')
      else
        return this.currentProduct.name;
    },
    newProduct: function() {
      this.currentProduct = new Product;
      this.$refs['product-details-dialog'].show();
    },
    getAvailabilityColor: function(inv) {
      if(inv.alarm == 0)
        return 'regularBadge';
      if(inv.stock <= inv.alarm)
        return 'warningBadge';//"#EF5350"
      else
        return 'regularBadge';
    },
    getPrice: function(price) {
      return Number(price).toFixed(2);
    },
    productCreated: function (event) {
      console.log("productCreated", event);
      this.resetDialog();
    },
    productCanceled: function () {
      console.log("productCanceled", event);
      this.resetDialog();
    },
    resetDialog: function () {
      console.log("resetDialog");

      this.currentProduct = new Product();
      this.documentId = "";
      this.$refs['product-details-dialog'].hide();
    },
    handleClose: function () {
      this.resetDialog();
    },
    productUpdated: function (event) {
      console.log("productUpdated", event);
      this.resetDialog();
    },
    editProduct: function (p) {
      this.currentProduct = p;
      this.documentId = p.id;
      console.log("handleEdit", this.currentProduct);
      this.$refs['product-details-dialog'].show();
    },
    selectProduct: function (p) {
      const db = getFirestore(firebaseApp);
      console.log('selectProduct', p.id);
      const prodRef = doc(db, 'wines', p.id);
      var setVal = true;
      if(p.favorite == undefined || p.favorite == false) {
        setVal = true;
      } else {
        setVal = false;
      }
      setDoc(prodRef, { favorite: setVal }, { merge: true });
    },
    handleDuplicate: function (index) {
      var p = this.products[index];
      var obj = Object.assign({}, p);
      obj.name = obj.name + " (copia)";
      /*
      Firebase.db
        .collection("products")
        .add(obj)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
        */
    },
    handleDelete: function (index) {
      this.documentId = this.products[index].id;

      this.$confirm(this.$t("inventory.ask_delete_product"), "Warning", {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
        type: "warning",
      }).then(() => {
        /*
        var docRef = Firebase.db.collection("products").doc(this.documentId);
        console.log(this.documentId, docRef);
        docRef
          .update({
            status: -1,
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "Delete completed",
            });
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: "Delete error: " + error,
            });
          });
          */
      });
    },
    async loadProducts () {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "wines"), where("status", "==", 1), orderBy("name"));

      onSnapshot(q, (querySnapshot) => {
        this.products = [];
        querySnapshot.forEach((doc) => {
          var record = doc.data();
          record.id = doc.id;
          record.price = utils.formatPrice(record.price);
          record.cost = utils.formatPrice(record.cost);
          this.products.push(record);
        });
      });
    },
    randKey: function () {
      return Number(Math.ceil(Math.random()*100));
    },
    exportCSV: function() {
      var arrData = this.products;
      var CSV = '';

      //This condition will generate the Label/Header
      {
        var row = '';

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ';';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          row = '';

          //2nd loop will extract each column and convert it in string comma-seprated
          for (index in arrData[i]) {
              row += '"' + arrData[i][index] + '";';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
      }

      if (CSV === '') {
          alert('Invalid data');
          return;
      }

      var ReportTitle = "export";

      //Generate a file name
      var fileName = '';
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g, '_');

      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
      // generate a temp <a /> tag
      var link = document.createElement('a');
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // console.log('finish download one file');
    },
    exportJson: function () {
      const data = JSON.stringify(this.products);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "test.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    parseProducts: function(json) {
      var objs = JSON.parse(json);
      console.log('parseProducts', objs.length);
/*
      Firebase.db.collection('products').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
          })

          for(var i=0; i<objs.length; i++) {
            Firebase.db.collection('products').doc(objs[i].id).set(objs[i].data);
          }

        })
*/
    }
  },
  mounted() {
    this.loadProducts();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.regularBadge {
  background: green;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 25px;
  font-size: 12px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
  display: inline-block;
}
.warningBadge {
  background: red;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 25px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  min-width: 40px;
  display: inline-block;
}
.inventory {
  text-align: left;
  padding: 12px;
}
.title {
  font-size: 40px;
  font-weight: bold;
}
.list {
  padding: 10px;
}
</style>
