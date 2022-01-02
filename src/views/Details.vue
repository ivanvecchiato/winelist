<template>
  <div>
    <div class="card">
      <div class="card-head">
        <b-button variant="light" @click="closeDetails()">indietro</b-button>
        <span class="back-text">wines</span>
        <div class="product-detail">
          <h1>{{ wine.name }}</h1>
        </div>
      </div>
      <div class="card-body">
        <img :src="imgUrl" alt="Shoe" class="product-img" />
        <div class="product-desc">
          <div class="product-title">
            {{wine.designation}}
          </div>
          <span class="product-caption"> {{wine.grapes}} </span>
          <div class="product-winery">
            {{$t('product.winery')}}&nbsp;<span class="name">{{wine.winery.name}}</span>
            <span class="badge">{{$t('product.winery')}}</span>
          </div>
        </div>
        <div class="product-properties">
          <span class="product-size">
            <ul class="ul-size">
              <li>
                <div class="detail-card">
                  <div class="detail-card-title">
                    {{ $t("product.region") }}
                  </div>
                  <div class="detail-card-body">{{ wine.region }}</div>
                </div>
              </li>
              <li>
                <div class="detail-card">
                  <div class="detail-card-title">
                    {{ $t("product.alcohol") }}
                  </div>
                  <div class="detail-card-body">{{ wine.alcohol }}</div>
                </div>
              </li>
              <li>
                <div class="detail-card">
                  <div class="detail-card-title">
                    {{ $t("product.vintage") }}
                  </div>
                  <div class="detail-card-body">{{ wine.vintage }}</div>
                </div>
              </li>
            </ul>
          </span>
          <b-button variant="light" @click="closeDetails()">indietro</b-button>
          <span class="product-price">
            <b>23,453</b>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default {
  name: "Details",
  props: ["wine"],
  data() {
    return {
      imgUrl: "",
    };
  },
  methods: {
    closeDetails: function() {
      console.log('closeDetails')
      this.$router.back();
    },
    getImage() {
      if (this.wine.imgUrls.length == 0 || this.wine.imgUrls[0].length == 0) {
        this.imgUrl = require("../assets/bottle.png");
      } else {
        this.getStorageImgUrl(this.wine.imgUrls[0]);
      }
    },
    async getStorageImgUrl(img) {
      const storage = getStorage();
      const pathReference = ref(storage, img);
      getDownloadURL(pathReference)
        .then((url) => {
          console.log("URL", url);
          this.imgUrl = url;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  activated() {
    this.imgUrl = '';
    console.log("Details", this.wine);
    this.getImage();    
  },
//  mounted() {
//    console.log("Details", this.wine);
//    this.getImage();
//  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-head {
  color: var(--color-primary);
  position: relative;
  height: 252px;
  background: linear-gradient(135deg, #ffebee 8%, #ef9a9a 83%);
  clip-path: polygon(100% 0, 100% 100%, 0% 80%, 0 0%);
}

.product-img {
  position: absolute;
  left: 0;
  height: 650px;
  margin-top: -150px;
  margin-left: 30px;
}

.product-detail {
  float: right;
  margin: 30px;
  text-align: right;
  max-width: 70%;
}
.product-detail h1 {
  font-family: Montserrat-Black, Helvetica, Arial, sans-serif;
  letter-spacing: -0.5px;
}
.detail-card {
  border: solid 1px lightgray;
  border-radius: 8px;
  padding: 5px;
}
.detail-card-title {
  font-weight: bold;
  color: var(--color-highlight);
  font-size: 14px;
  margin-bottom: 5px;
}
.detail-card-body {
  font-weight: normal;
  color: var(--color-secondary);
  font-size: 15px;
}
.back-text {
  font-family: Montserrat-Black, Helvetica, Arial, sans-serif;
  font-size: 125px;
  position: fixed;
  left: 4px;
  top: -10px;
  text-transform: uppercase;
  opacity: 0.05;
}
.card-body {
  background: #fff;
}
.product-title {
  font-family: Montserrat-Bold, Helvetica, Arial, sans-serif;
  display: block;
  font-size: 24px;
  letter-spacing: 0px;
}
.product-winery {
  padding: 20px 20px 5px 20px;
  display: block;
  font-size: 18px;
  letter-spacing: 0px;
}
.product-winery .name {
	font-weight: bold;
}
.badge {
  position: relative;
  font-size: 10px;
  font-weight: 300;
  color: #fff;
  background: #11e95b;
  padding: 2px 5px;
  border-radius: 4px;
  top: -2px;
  margin-left: 5px;
}

.product-caption {
  display: block;
  font-size: 18px;
  font-weight: 400;
}

.product-rating {
  padding: 0 20px;
  font-size: 11px;
}

.product-rating i.grey {
  color: #acacab;
}

.product-size h4 {
  font-size: 11px;
  padding: 0 21px;
  margin-top: 15px;
  padding-bottom: 10px;
  text-transform: uppercase;
}

.ul-size li {
  list-style: none;
  float: left;
  margin-right: 20px;
}

.product-size:before,
.product-size:after {
  content: "";
  display: block;
  clear: both;
}

.product-color h4 {
  font-size: 11px;
  padding: 0 21px;
  margin-top: 20px;
  padding-bottom: 20px;
  text-transform: uppercase;
}

.ul-color {
  margin-left: 27px;
}

.ul-color li {
  list-style: none;
  float: left;
  margin-right: 20px;
}

.ul-color li a {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 100%;
}

.ul-color li a.orange {
  background: #f35e3d;
}

.ul-color li a.green {
  background: #11e95b;
}

.ul-color li a.yellow {
  background: #ffd414;
}

.product-price {
  position: absolute;
  background: #11e95b;
  padding: 7px 20px;
  text-align: center;
  display: inline-block;
  font-size: 24px;
  font-weight: 200;
  color: #fff;
  border-radius: 7px;
  margin-top: -13px;
  margin-left: -5px;
  box-shadow: -10px 20px 15px -10px rgba(17, 233, 91, 0.3);
}
.product-desc {
  float: right;
	text-align: right;
  max-width: 60%;
}
.product-properties {
  float: right;
}
.close-button {
  width: 50px;
  height: 50px;
  color: #757575;
  position: absolute;
  top: 15px;
  left: 15px;
}
</style>
