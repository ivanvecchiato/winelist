<template>
  <div>
    <div class="card">
      <div class="card-head">
        <!--<span class="back-text">wines</span>-->
        <span class="back-button" @click="closeDetails()">
          <b-icon icon="arrow-left-square" style="width: 40px; height: 40px;"/>
        </span>
        <div style="float:right">
          <div class="product-detail">
            <h1>{{ wine.name }}</h1>
          </div>
          <div class="product-winery">
            {{$t('product.winery')}}&nbsp;<span class="name">{{wine.winery.name}}</span>
            <!--<span class="badge">{{$t('product.winery')}}</span>-->
          </div>
        </div>
      </div>
      <div class="card-body">
        <img :src="imgUrl" class="product-img" />
        <div class="product-desc">
          <span class="product-price">
            <b>{{wine.price}}</b>
          </span>
          <div class="product-title">
            {{wine.designation}}
          </div>
          <span class="product-caption"> {{wine.grapes}} </span>
        </div>
        <div class="product-properties">
          <div class="product-size">
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
          </div>

          <div class="description">
            {{wine.description}}
          </div>
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
.back-button {
  position: absolute;
  left: 10px;
  top: 10px;
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
  margin: 25px;
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
  color: var(--color-highlight);
}
.product-winery {
  float: right;
  margin-right: 25px;;
  font-size: 18px;
  letter-spacing: 0px;
}
.product-winery .name {
  float: right;
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
  color: var(--color-secondary);
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

.product-price {
  position: relative;
  top: -30px;
  right: 0px;
  background: var(--color-secondary);
  padding: 7px 20px;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  border-radius: 8px;
  box-shadow: 5px 5px 10px var(--color-secondary);
}
.product-desc {
  float: right;
	text-align: right;
  max-width: 60%;
}
.product-properties {
  float: right;
}
.description {
  float: right;
	text-align: justify;
  max-width: 60%;
  color: var(--color-primary);
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
