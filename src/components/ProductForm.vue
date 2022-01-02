<template>
  <div class="product-form">
    <b-form>

        <b-container>
          <b-row>
            <b-col>
              <label for="product-code">{{$t('product.code')}}</label>
              <b-form-input
                id="product-code"
                v-model="product.code"/>
            </b-col>
            <b-col>
              <div v-if="imgUrl.length == 0">
                <p>{{$t('generic.select_image')}}</p>
                <input type="file" @change="onFileChange">
              </div>
              <div v-else>
                <img :src="imgUrl" class="thumbnail"/>
                <button @click="removeImage">{{$t('generic.delete_image')}}</button>
              </div>
            </b-col>
          </b-row>
          <b-row>
              <b-col>
                <label for="product-name">{{$t('product.name')}}</label>
                <b-form-input
                  id="product-name"
                  :label="$t('product.name')"
                  v-model="product.name"/>
              </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <label for="product-size">{{$t('product.size')}}</label>
              <b-form-select
                id="product-size"
                :options="wine_sizes"
                v-model="product.size"/>
            </b-col>
            <b-col>
              <label for="product-winery">{{$t('product.winery')}}</label>
              <b-form-input
                id="product-winery"
                :label="$t('product.winery')"
                v-model="product.winery.name"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <label for="product-type">{{$t('product.type')}}</label>
              <b-form-select
                id="product-type"
                :options="wine_types"
                v-model="product.type"
                class="mt-3"
              ></b-form-select>
            </b-col>
            <b-col>
              <label for="product-designation">{{$t('product.designation')}}</label>
              <b-form-input
                id="product-designation"
                :label="$t('product.designation')"
                v-model="product.designation"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <label for="product-grape">{{$t('product.grape')}}</label>
              <b-form-input
                id="product-grape"
                :label="$t('product.grape')"
                v-model="product.grapes"/>
            </b-col>
            <b-col>
              <label for="product-alcohol">{{$t('product.alcohol')}}</label>
              <b-form-input
                id="product-alcohol"
                :label="$t('product.alcohol')"
                v-model="product.alcohol"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <label for="product-country">{{$t('product.country')}}</label>
              <b-form-input
                id="product-country"
                :label="$t('product.country')"
                v-model="product.country"/>
            </b-col>
            <b-col>
              <label for="product-region">{{$t('product.region')}}</label>
              <b-form-input
                id="product-region"
                :label="$t('product.region')"
                v-model="product.region"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <label for="product-price">{{$t('product.price')}}</label>
              <b-form-input
                id="product-price"
                :label="$t('product.price')"
                v-model="product.price"/>
            </b-col>
            <b-col>
              <label for="product-cost">{{$t('product.cost')}}</label>
              <b-form-input
                id="product-cost"
                :label="$t('product.cost')"
                v-model="product.cost"/>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <label for="product-flavour">{{$t('product.flavour')}}</label>
              <b-form-input
                id="product-flavour"
                :label="$t('product.flavour')"
                v-model="product.flavour"/>
            </b-col>
          </b-row>

          <b-row>
            <div class="flex md6">
            <label for="product-desc">{{$t('product.description')}}</label>
            <b-form-textarea
              id="product-desc"
              v-model="product.description"
              placeholder="Enter something..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            </div>
          </b-row>

          <b-row>
            <div class="flex md6">
            <label for="product-notes">{{$t('product.notes')}}</label>
            <b-form-textarea
              id="product-notes"
              v-model="product.notes"
              placeholder="Enter something..."
              rows="3"
              max-rows="5"
            ></b-form-textarea>
            </div>
          </b-row>
        </b-container>
    </b-form>
  </div>
</template>

<script>
import Firebase from "../firebase";
import Product from "../data/Product.js";
import utils from "../utils.js";
import Tipology from "../data/Tipology.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../firebase.js"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { addDoc,  doc, setDoc } from "firebase/firestore"; 

export default {
  name: "ProductForm",
  props: ["data", "documentId", "categories"],
  data() {
    return {
      product: new Product(),
      color: "",
      value: 0,
      wine_types: Tipology,
      wine_sizes: ['0.375l', '0.75l', '1.5l'],
      imgUrl: ''
    };
  },
  components: {},
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      const storage = getStorage();
      const storageRef = ref(storage, 'wines/' + files[0].name);

      uploadBytes(storageRef, files[0]).then((snapshot) => {
        console.log('file uploaded', snapshot);
        this.product.imgUrls[0] = 'wines/' + files[0].name;
      });
      this.createImage(files[0]);
    },
    createImage(file) {
      //var image = new Image();
      var reader = new FileReader();

      reader.onload = (e) => {
        this.imgUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      console.log(e);
      this.imgUrl = '';
      this.product.imgUrls[0] = ''
    },
    getImgUrl: function(img) {
      return require('../assets/' + img)
    },
    onSubmit: function() {
      console.log("onSubmit", this.product);
      console.log("onSubmit", this.documentId);
      if (this.documentId == "") {
        this.insertNewProduct();
      } else {
        this.updateProduct();
      }
    },
    async updateProduct() {
      const db = getFirestore(firebaseApp);
      var d = doc(db, 'wines', this.product.id);
      await setDoc(
        d,
        Object.assign({}, this.product)
      );
      console.log('updateProduct', d);
    },
    async insertNewProduct() {
      const db = getFirestore(firebaseApp);
      const docRef = await addDoc(
        collection(db, "wines"),
        Object.assign({}, this.product)
      );
      console.log('insertNewProduct', docRef)
    },
    onCancel: function() {
      this.$emit("productCanceled", this.product);
    },
    newCategory: function() {
      var self = this;
      this.$prompt(this.$t("product.new_category"), this.$t("product.name"), {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
      })
        .then(({ value }) => {
          self.insertNewCategory(value);
        })
        .catch(() => {
        });
    },
    colorPicked: function(color) {
      this.product.color = color;
    },
    insertNewCategory: function(value) {
      Firebase.db
        .collection("categories")
        .add({
          id: utils.uuidv4(),
          name: value,
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    },
    loadImage: function() {
      if(this.product.imgUrls[0].length == 0) return;

      const storage = getStorage();
      const pathReference = ref(storage, this.product.imgUrls[0]);
      getDownloadURL(pathReference)
          .then((url) => {
              console.log("URL", url)
              this.imgUrl = url;
          })
          .catch((error) => {
              console.log(error)
          });
    },
    async getMaxCode() {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "wines"), where("status", "==", 1));

      const querySnapshot = await getDocs(q);
      var max = 0;
      querySnapshot.forEach((doc) => {
        if(max < doc.data().code) max = doc.data().code;
      });
      this.product.code = Number(max) + 1;
    }
  },
  mounted() {
    this.product = this.data;
    if(this.product.code == 0) {
      this.getMaxCode();
    }
    this.color = this.product.color;
    if(this.product.code > 0) {
      this.loadImage();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-form {
  text-align: left;
}
.thumbnail {
  max-height: 100px;
}
</style>
